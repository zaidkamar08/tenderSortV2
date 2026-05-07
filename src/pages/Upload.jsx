import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload as UploadIcon, X, FileText, Image, File, Loader2, CheckCircle2, ChevronRight } from 'lucide-react'

const FileIcon = ({ name }) => {
  if (name.match(/\.(jpg|jpeg|png|webp)$/i)) return <Image size={16} className="text-blue-500" />
  if (name.match(/\.(pdf)$/i)) return <FileText size={16} className="text-red-500" />
  return <File size={16} className="text-slate-500" />
}

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function Upload() {
  const navigate = useNavigate()
  const [tenderFile, setTenderFile] = useState(null)
  const [bidderFiles, setBidderFiles] = useState([])
  const [tenderDrag, setTenderDrag] = useState(false)
  const [bidderDrag, setBidderDrag] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const tenderRef = useRef()
  const bidderRef = useRef()

  const handleTenderDrop = (e) => {
    e.preventDefault(); setTenderDrag(false)
    const file = e.dataTransfer.files[0]
    if (file) setTenderFile(file)
  }
  const handleBidderDrop = (e) => {
    e.preventDefault(); setBidderDrag(false)
    const files = Array.from(e.dataTransfer.files)
    setBidderFiles(prev => [...prev, ...files])
  }

  const removeBidder = (i) => setBidderFiles(prev => prev.filter((_, idx) => idx !== i))

  const handleProcess = async () => {
  if (!tenderFile || bidderFiles.length === 0) return
  setProcessing(true)
  const steps = [
    [15, 'Reading tender document...'],
    [30, 'Extracting eligibility criteria...'],
    [50, 'Running OCR on bidder documents...'],
    [65, 'Parsing bidder submissions...'],
    [80, 'Matching evidence to criteria...'],
    [92, 'Calculating confidence scores...'],
    [100, 'Generating evaluation report...'],
  ]
  let stepIndex = 0
  const interval = setInterval(() => {
    if (stepIndex < steps.length) {
      setProgress(steps[stepIndex][0])
      setProgressLabel(steps[stepIndex][1])
      stepIndex++
    }
  }, 800)
  try {
    const formData = new FormData()
    formData.append('tender_file', tenderFile)
    bidderFiles.forEach(f => formData.append('bidder_files', f))
    const response = await fetch('https://tendersortv2.onrender.com/full-evaluation', {
      method: 'POST',
      body: formData,
    })
    const result = await response.json()
    clearInterval(interval)
    setProgress(100)
    setProgressLabel('Done!')
    localStorage.setItem('evaluationResult', JSON.stringify(result))
    setTimeout(() => navigate('/dashboard'), 800)
  } catch (error) {
    clearInterval(interval)
    alert('Server error. Please try again!')
    setProcessing(false)
    setProgress(0)
  }
}

  const canProcess = tenderFile && bidderFiles.length > 0

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 size={28} className="text-[#0D9488] animate-spin-slow" />
          </div>
          <h2 className="font-display text-xl font-600 text-navy mb-1">Processing Documents</h2>
          <p className="text-slate-500 text-sm mb-8">{progressLabel}</p>
          <div className="progress-bar mb-2">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-slate-400 text-right">{progress}%</p>
          <div className="mt-8 grid grid-cols-3 gap-3 text-xs text-slate-400">
            {[['OCR', progress >= 50], ['NLP/NER', progress >= 65], ['Matching', progress >= 80]].map(([label, done]) => (
              <div key={label} className={`flex items-center gap-1.5 justify-center py-2 rounded-lg ${done ? 'bg-teal-50 text-[#0D9488]' : 'bg-slate-50'}`}>
                {done ? <CheckCircle2 size={12} /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <p className="text-[#0D9488] text-sm font-medium tracking-widest uppercase mb-1">New Evaluation</p>
        <h1 className="font-display text-3xl font-700 text-navy">Upload Documents</h1>
        <p className="text-slate-500 mt-2">Upload the tender document and all bidder submissions to begin AI evaluation.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Tender Upload */}
        <div className="animate-fade-up delay-100">
          <label className="block text-sm font-medium text-navy mb-3">
            Tender Document <span className="text-red-500">*</span>
          </label>
          {tenderFile ? (
            <div className="border border-teal-DEFAULT/40 bg-teal-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <FileIcon name={tenderFile.name} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy truncate">{tenderFile.name}</p>
                <p className="text-xs text-slate-500">{formatSize(tenderFile.size)}</p>
              </div>
              <button onClick={() => setTenderFile(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                <X size={16} />
              </button>
            </div>
          ) : (
            <div
              className={`drop-zone p-8 text-center cursor-pointer ${tenderDrag ? 'active' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setTenderDrag(true) }}
              onDragLeave={() => setTenderDrag(false)}
              onDrop={handleTenderDrop}
              onClick={() => tenderRef.current.click()}
            >
              <input ref={tenderRef} type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={e => setTenderFile(e.target.files[0])} />
              <UploadIcon size={28} className="text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-navy">Drop tender PDF here</p>
              <p className="text-xs text-slate-400 mt-1">or click to browse — PDF, DOC</p>
            </div>
          )}
        </div>

        {/* Bidder Upload */}
        <div className="animate-fade-up delay-200">
          <label className="block text-sm font-medium text-navy mb-3">
            Bidder Submissions <span className="text-red-500">*</span>
            <span className="text-slate-400 font-normal ml-2">({bidderFiles.length} files)</span>
          </label>
          <div
            className={`drop-zone p-6 text-center cursor-pointer mb-3 ${bidderDrag ? 'active' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setBidderDrag(true) }}
            onDragLeave={() => setBidderDrag(false)}
            onDrop={handleBidderDrop}
            onClick={() => bidderRef.current.click()}
          >
            <input ref={bidderRef} type="file" className="hidden" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={e => setBidderFiles(prev => [...prev, ...Array.from(e.target.files)])} />
            <UploadIcon size={24} className="text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-navy">Drop bidder files here</p>
            <p className="text-xs text-slate-400 mt-1">PDF, DOC, JPG, PNG — multiple files OK</p>
          </div>
          {bidderFiles.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {bidderFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-2 bg-white border border-slate-100 rounded-lg px-3 py-2">
                  <FileIcon name={f.name} />
                  <span className="text-xs text-navy flex-1 truncate">{f.name}</span>
                  <span className="text-xs text-slate-400">{formatSize(f.size)}</span>
                  <button onClick={() => removeBidder(i)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Supported formats */}
      <div className="bg-slate-100 rounded-xl p-4 mb-8 animate-fade-up delay-300">
        <p className="text-xs font-medium text-slate-600 mb-2">Supported document types</p>
        <div className="flex flex-wrap gap-2">
          {['PDF (typed)', 'PDF (scanned)', 'Word .docx', 'JPG / PNG photos', 'Multi-page docs'].map(f => (
            <span key={f} className="text-xs bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full">{f}</span>
          ))}
        </div>
      </div>

      {/* Demo notice */}
      <div className="border-l-4 border-amber-DEFAULT bg-amber-50 rounded-r-xl px-4 py-3 mb-8 animate-fade-up delay-400">
        <p className="text-xs text-amber-700">
          <strong>Demo Mode:</strong> For this hackathon demo, clicking "Process" will simulate AI processing and show sample evaluation results with mock data.
        </p>
      </div>

      {/* Process button */}
      <div className="flex justify-end animate-fade-up delay-500">
        <button
          onClick={handleProcess}
          disabled={!canProcess}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium text-sm transition-all ${canProcess ? 'btn-primary' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
        >
          Process Documents
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
