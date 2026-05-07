TenderSort
AI-Powered Government Tender Evaluation System
by Byte Verdict

Live Links
ServiceURLFrontend (Netlify)https://tendersorttv2.netlify.app/Backend API (Render)https://tendersortv2.onrender.comAPI Health Checkhttps://tendersortv2.onrender.com/health
Note: The backend is hosted on Render's free tier. If the health check takes 30-60 seconds to respond on first visit, that is normal — it is waking up from inactivity. Once awake, it runs at full speed.

What is TenderSort?
TenderSort is an AI-powered web application that automates the evaluation of government tender bid submissions.
In the traditional process, government officials manually read through hundreds of pages of bidder documents to check eligibility criteria — a process that takes days and is prone to human error and bias.
TenderSort solves this by:

Automatically extracting eligibility criteria from tender documents using AI
Evaluating each bidder's submission against those criteria
Giving instant verdicts: Eligible, Not Eligible, or Manual Review
Providing confidence scores and evidence for every decision
Generating downloadable evaluation reports


Features

PDF Upload — Upload tender document and multiple bidder submissions at once
AI Criteria Extraction — Automatically identifies eligibility criteria from tender PDF
Automated Evaluation — Each bidder checked against all criteria with evidence
Live Dashboard — Visual breakdown with donut chart and detailed table
Manual Review Panel — Human review interface for low-confidence cases
PDF Report Export — Download complete evaluation report as PDF
Confidence Scoring — AI confidence percentage for every decision
Filter and Search — Filter bidders by Eligible / Not Eligible / Needs Review


Tech Stack
Frontend
TechnologyPurposeReact.jsUI frameworkViteBuild toolTailwind CSSStylingReact RouterPage navigationRechartsDonut chart visualizationlocalStorageTemporary result storageNetlifyDeployment
Backend
TechnologyPurposePythonProgramming languageFastAPIWeb framework / API endpointsUvicornASGI serverPyMuPDF (fitz)PDF text extractionpython-multipartFile upload handlingpython-dotenvEnvironment variable managementrequestsHTTP calls to AI APIProcfileRender deployment configRenderCloud deployment
AI / API
TechnologyPurposeGroq APIAI inference platformLLaMA 3.3 70BLanguage model for evaluationMeta LLaMAOpen source AI model by Meta

System Architecture
User uploads PDFs (Frontend - Netlify)
           |
FastAPI receives files (Backend - Render)
           |
PyMuPDF extracts text from PDFs
           |
Groq API (LLaMA 3.3 70B) analyzes text
   Step 1: Extract eligibility criteria from tender
   Step 2: Evaluate each bidder against criteria
           |
Returns verdict for each bidder:
   Eligible | Not Eligible | Manual Review
           |
Frontend displays results on Dashboard

Getting Started Locally
Prerequisites

Node.js v18+
Python 3.10+
Groq API key (free at console.groq.com)

1. Clone the repository
git clone https://github.com/zaidkamar08/tenderSortV2.git
cd tenderSortV2
2. Setup Backend
cd backend
pip install -r requirements.txt
Create a .env file inside backend/:
GROQ_API_KEY=your_groq_api_key_here
Start the backend:
uvicorn main:app --reload
Backend runs at: http://localhost:8000
3. Setup Frontend
cd ..
npm install
Update the API URL in src/pages/Upload.jsx:
fetch('http://localhost:8000/full-evaluation'
Start the frontend:
npm run dev
Frontend runs at: http://localhost:5173

Project Structure
tenderSortV2/
├── backend/
│   ├── main.py              
│   ├── requirements.txt     
│   ├── Procfile             
│   └── .env                 
├── src/
│   ├── pages/
│   │   ├── Home.jsx         
│   │   ├── Upload.jsx       
│   │   ├── Dashboard.jsx    
│   │   ├── Review.jsx       
│   │   └── Report.jsx       
│   ├── components/
│   │   └── Navbar.jsx       
│   └── data/
│       └── mockData.js      
├── public/
├── package.json
├── index.html
└── README.md

How Evaluation Works

Upload Phase — User uploads 1 tender PDF and 1 or more bidder PDFs
Criteria Extraction — AI reads the tender and identifies all eligibility criteria
Bidder Evaluation — For each bidder, AI checks every criterion and returns pass/fail/review status, value found, confidence score, and reason
Overall Verdict — If any mandatory criterion fails the bidder is Rejected. If all pass the bidder is Eligible. If confidence is low the case goes to Manual Review


Demo Test Files
FileExpected ResultCRPF_Tender_Construction.pdfTender documentBharatInfrastructure_BidSubmission.pdfEligibleGreenfield_Builders_BidSubmission.pdfEligibleMetroWorks_BidSubmission.pdfNot EligibleHorizon_Contractors_BidSubmission.pdfNot EligibleAllied_Construction_BidSubmission.pdfManual Review
For best demo: Upload CRPF tender + BharatInfrastructure + MetroWorks + Allied to get 1 Eligible, 1 Not Eligible, 1 Manual Review result.

Known Limitations

Free tier Groq API has rate limits — upload max 3 bidders at a time
Render free tier backend sleeps after 15 minutes of inactivity with 30-60 second cold start
Results stored in browser localStorage — cleared on browser data wipe
No persistent database in current version (Supabase integration planned)


Future Improvements

Supabase database for persistent storage
User authentication and multi-user support
Support for scanned PDFs via OCR
Email notifications for evaluation completion
Audit trail and decision history


Team
Byte Verdict
Built for hackathon submission
Full stack: React + FastAPI + LLaMA AI

License
This project is built for educational and hackathon purposes.
Built by Byte Verdict | Powered by LLaMA 3.3 70B via GroqSonnet 4.6Adaptive
