from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os
import json
import re
import time
import traceback
import requests

try:
    import fitz
    PYMUPDF_AVAILABLE = True
except ImportError:
    PYMUPDF_AVAILABLE = False

from dotenv import load_dotenv
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

print("=" * 50)
print(f"GROQ API KEY: {'FOUND - ' + GROQ_API_KEY[:12] + '...' if GROQ_API_KEY else 'NOT FOUND'}")
print(f"PyMuPDF: {'Available' if PYMUPDF_AVAILABLE else 'NOT Available'}")
print(f"Using: Groq API (llama-3.3-70b)")
print("=" * 50)

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

def ask_ai(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {
                "role": "system",
                "content": "You are a government tender evaluation expert. Always respond with valid JSON only. No markdown, no explanation, just the JSON object."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.1,
        "max_tokens": 4096,
    }

    for attempt in range(4):
        print(f"Calling Groq API (attempt {attempt + 1})...")
        response = requests.post(GROQ_URL, json=payload, headers=headers, timeout=60)
        print(f"Groq status: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            text = data["choices"][0]["message"]["content"]
            print(f"Groq response length: {len(text)}")
            time.sleep(3)
            return text

        elif response.status_code == 429:
            wait = 20 * (attempt + 1)
            print(f"Rate limited! Waiting {wait} seconds...")
            time.sleep(wait)

        else:
            print(f"Groq error: {response.text[:500]}")
            raise Exception(f"Groq API error {response.status_code}: {response.text[:200]}")

    raise Exception("Groq API rate limit exceeded after 4 retries.")

def extract_text_from_pdf(file_bytes: bytes) -> str:
    if not PYMUPDF_AVAILABLE:
        return "[PyMuPDF not installed]"
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        print(f"Extracted {len(text)} chars from PDF")
        return text.strip()
    except Exception as e:
        print(f"PDF error: {e}")
        return f"[PDF error: {str(e)}]"

def extract_text(file_bytes: bytes, filename: str) -> str:
    if filename.lower().endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)
    try:
        return file_bytes.decode("utf-8", errors="ignore")
    except Exception:
        return ""

def parse_json(text: str) -> dict:
    text = re.sub(r"```(?:json)?|```", "", text).strip()
    try:
        return json.loads(text)
    except Exception:
        pass
    try:
        match = re.search(r"\{[\s\S]*\}", text)
        if match:
            return json.loads(match.group(0))
    except Exception:
        pass
    return {}

app = FastAPI(title="TenderSort API", version="6.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "TenderSort API is running!",
        "version": "6.0.0",
        "groq_key_loaded": bool(GROQ_API_KEY),
        "pymupdf_ready": PYMUPDF_AVAILABLE,
        "ai_provider": "Groq (llama-3.3-70b)"
    }

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/full-evaluation")
async def full_evaluation(
    tender_file: UploadFile = File(...),
    bidder_files: List[UploadFile] = File(...),
):
    print(f"\n{'='*50}")
    print(f"Tender: {tender_file.filename}")
    print(f"Bidders: {[f.filename for f in bidder_files]}")

    try:
        tender_bytes = await tender_file.read()
        tender_text = extract_text(tender_bytes, tender_file.filename)
        print(f"Tender text: {len(tender_text)} chars")

        if len(tender_text) < 10:
            raise HTTPException(status_code=400, detail="Could not extract text from tender PDF.")

        criteria_prompt = f"""Extract eligibility criteria from this government tender document.
Return ONLY valid JSON in exactly this format with no extra text or markdown:
{{"tender_title": "short title", "criteria": [{{"id": "c1", "label": "Criterion Name", "type": "Financial", "requirement": "exact requirement", "mandatory": true}}]}}

Tender document:
{tender_text[:4000]}"""

        try:
            criteria_text = ask_ai(criteria_prompt)
            criteria_data = parse_json(criteria_text)
        except Exception as e:
            print(f"Criteria extraction failed: {e}")
            criteria_data = {}

        if not criteria_data or "criteria" not in criteria_data:
            criteria_data = {
                "tender_title": tender_file.filename.replace(".pdf", ""),
                "criteria": [
                    {"id": "c1", "label": "Annual Turnover", "type": "Financial", "requirement": "Minimum annual turnover as specified", "mandatory": True},
                    {"id": "c2", "label": "Similar Projects", "type": "Technical", "requirement": "Completed similar projects", "mandatory": True},
                    {"id": "c3", "label": "GST Registration", "type": "Compliance", "requirement": "Valid GST registration", "mandatory": True},
                ]
            }

        criteria = criteria_data.get("criteria", [])
        print(f"Criteria count: {len(criteria)}")

        bidder_results = []
        for bidder_file in bidder_files:
            print(f"\nEvaluating: {bidder_file.filename}")
            b_bytes = await bidder_file.read()
            b_text = extract_text(b_bytes, bidder_file.filename)
            print(f"Bidder text: {len(b_text)} chars")
            bidder_name = bidder_file.filename.replace(".pdf", "").replace("_", " ").replace("-", " ")

            if len(b_text) < 10:
                bidder_results.append({
                    "bidder_name": bidder_name,
                    "overall_verdict": "review",
                    "overall_confidence": 0,
                    "criteria_results": [],
                    "note": "Could not extract text from document"
                })
                continue

            eval_prompt = f"""You are evaluating a bidder for a government tender. Check each criterion carefully.

Tender Criteria:
{json.dumps(criteria, indent=2)}

Bidder Document:
{b_text[:3000]}

Return ONLY a JSON object like this (no markdown, no explanation):
{{
  "bidder_name": "{bidder_name}",
  "overall_verdict": "eligible",
  "overall_confidence": 88,
  "criteria_results": [
    {{
      "id": "c1",
      "label": "Annual Turnover",
      "status": "pass",
      "value_found": "Rs. 7.2 Crore",
      "source_document": "{bidder_file.filename}",
      "confidence": 90,
      "reason": "Turnover exceeds requirement"
    }}
  ]
}}

Rules:
- overall_verdict must be exactly: eligible, rejected, or review
- status must be exactly: pass, fail, or review
- If any mandatory criterion fails, overall_verdict must be rejected
- Replace ALL example values with real findings from the document
- Return ONLY the JSON, nothing else"""

            try:
                eval_text = ask_ai(eval_prompt)
                print(f"RAW EVAL RESPONSE: {eval_text[:300]}")
                result = parse_json(eval_text)
                if result and "bidder_name" in result:
                    bidder_results.append(result)
                    print(f"Verdict: {result.get('overall_verdict')} ({result.get('overall_confidence')}%)")
                else:
                    print("Could not parse bidder result")
                    bidder_results.append({
                        "bidder_name": bidder_name,
                        "overall_verdict": "review",
                        "overall_confidence": 50,
                        "criteria_results": [],
                        "note": "AI response could not be parsed"
                    })
            except Exception as e:
                print(f"Bidder eval error: {e}")
                bidder_results.append({
                    "bidder_name": bidder_name,
                    "overall_verdict": "review",
                    "overall_confidence": 0,
                    "criteria_results": [],
                    "note": f"Error: {str(e)}"
                })

        result = {
            "tender_title": criteria_data.get("tender_title", tender_file.filename),
            "criteria": criteria,
            "bidders": bidder_results,
            "summary": {
                "total": len(bidder_results),
                "eligible": len([b for b in bidder_results if b.get("overall_verdict") == "eligible"]),
                "rejected": len([b for b in bidder_results if b.get("overall_verdict") == "rejected"]),
                "review": len([b for b in bidder_results if b.get("overall_verdict") == "review"]),
            }
        }
        print(f"\nSummary: {result['summary']}")
        return result

    except HTTPException:
        raise
    except Exception as e:
        print(f"CRITICAL: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
