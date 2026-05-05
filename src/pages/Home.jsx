import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, CheckCircle2, XCircle, AlertTriangle, FileSearch, Zap, Shield, Users, BarChart3, ChevronRight } from 'lucide-react'

// Animated counter hook
function useCountUp(target, duration = 1500, start = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setVal(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return val
}

const stats = [
  { value: 10, suffix: 'x', label: 'Faster than manual review' },
  { value: 99, suffix: '%', label: 'Extraction accuracy' },
  { value: 0, suffix: '', label: 'Silent disqualifications' },
  { value: 100, suffix: '%', label: 'Audit traceable' },
]

const steps = [
  { icon: '📄', step: '01', title: 'Upload Tender', desc: 'Drop your tender document and all bidder submissions — PDF, Word, scanned images, everything.' },
  { icon: '🤖', step: '02', title: 'AI Extracts', desc: 'OCR + LLM reads every document, pulls out eligibility criteria and bidder evidence automatically.' },
  { icon: '⚖️', step: '03', title: 'Auto Match', desc: 'Each bidder is matched against every criterion with a confidence score and source reference.' },
  { icon: '✅', step: '04', title: 'Review & Export', desc: 'Approve, reject or flag for manual review. Export a fully audit-ready evaluation report.' },
]

const features = [
  { icon: <Zap size={20} className="text-teal-DEFAULT" />, title: 'LLM-Powered Extraction', desc: 'Claude API understands context, not just keywords. Pulls structured data from messy legal language.' },
  { icon: <Shield size={20} className="text-teal-DEFAULT" />, title: 'Never Silent Disqualification', desc: 'Ambiguous cases always go to human review. No bidder is auto-rejected without explanation.' },
  { icon: <BarChart3 size={20} className="text-teal-DEFAULT" />, title: 'Confidence Scoring', desc: 'Every verdict carries a confidence score. Low confidence = routed to reviewer, not auto-decided.' },
  { icon: <Users size={20} className="text-teal-DEFAULT" />, title: 'Human-in-the-Loop', desc: 'Review panel shows highlighted evidence from source documents. Click to approve or edit.' },
  { icon: <FileSearch size={20} className="text-teal-DEFAULT" />, title: 'Multi-format OCR', desc: 'Handles typed PDFs, scanned documents, Word files, and even photographs of certificates.' },
  { icon: <CheckCircle2 size={20} className="text-teal-DEFAULT" />, title: 'Full Audit Trail', desc: 'Every decision recorded with timestamp, model version, and source. Export for government use.' },
]

// Mini donut for hero mockup
function MiniDonut({ eligible, rejected, review }) {
  const total = eligible + rejected + review
  const r = 28, cx = 36, cy = 36, stroke = 9
  const circ = 2 * Math.PI * r
  const ePct = eligible / total, rPct = rejected / total, vPct = review / total
  const eDash = circ * ePct, rDash = circ * rPct, vDash = circ * vPct
  const eOffset = 0, rOffset = -eDash, vOffset = -(eDash + rDash)
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e2d3d" strokeWidth={stroke} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#10b981" strokeWidth={stroke}
        strokeDasharray={`${eDash} ${circ - eDash}`} strokeDashoffset={circ / 4} strokeLinecap="butt" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ef4444" strokeWidth={stroke}
        strokeDasharray={`${rDash} ${circ - rDash}`} strokeDashoffset={circ / 4 - eDash} strokeLinecap="butt" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f59e0b" strokeWidth={stroke}
        strokeDasharray={`${vDash} ${circ - vDash}`} strokeDashoffset={circ / 4 - eDash - rDash} strokeLinecap="butt" />
      <text x={cx} y={cy + 5} textAnchor="middle" fill="white" fontSize="13" fontWeight="700">{total}</text>
    </svg>
  )
}

// Product screenshot mockup
function DashboardMockup() {
  const bidders = [
    { name: 'Raj Infrastructure', turnover: 'pass', projects: 'pass', gst: 'pass', iso: 'pass', verdict: 'eligible', conf: 96 },
    { name: 'BuildTech Solutions', turnover: 'pass', projects: 'pass', gst: 'pass', iso: 'fail', verdict: 'rejected', conf: 92 },
    { name: 'Apex Constructions', turnover: 'review', projects: 'pass', gst: 'pass', iso: 'pass', verdict: 'review', conf: 41 },
    { name: 'Metro Build Corp', turnover: 'pass', projects: 'pass', gst: 'pass', iso: 'pass', verdict: 'eligible', conf: 96 },
    { name: 'Sagar Engineering', turnover: 'fail', projects: 'pass', gst: 'pass', iso: 'fail', verdict: 'rejected', conf: 95 },
  ]
  const CIcon = ({ s }) => s === 'pass'
    ? <CheckCircle2 size={11} className="text-green-400" />
    : s === 'fail'
    ? <XCircle size={11} className="text-red-400" />
    : <AlertTriangle size={11} className="text-amber-400" />

  const VBadge = ({ v }) => {
    const cfg = { eligible: 'bg-green-500/20 text-green-300', rejected: 'bg-red-500/20 text-red-300', review: 'bg-amber-500/20 text-amber-300' }
    const label = { eligible: 'Eligible', rejected: 'Rejected', review: 'Review' }
    return <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${cfg[v]}`}>{label[v]}</span>
  }

  return (
    <div className="w-full bg-[#0d1520] rounded-2xl overflow-hidden shadow-2xl border border-white/10" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Fake browser bar */}
      <div className="bg-[#1a2332] px-4 py-2.5 flex items-center gap-2 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        </div>
        <div className="flex-1 bg-[#0d1520] rounded-md px-3 py-1 text-[10px] text-slate-500 ml-2">
          localhost:5173/dashboard
        </div>
      </div>

      {/* Fake navbar */}
      <div className="bg-[#0D1B2A] px-5 py-2.5 flex items-center justify-between border-b border-white/5">
        <span className="text-sm font-bold text-white">Tender<span className="text-[#0D9488]">Sort</span></span>
        <div className="flex gap-4">
          {['Home', 'Upload', 'Dashboard', 'Review', 'Reports'].map(l => (
            <span key={l} className={`text-[10px] ${l === 'Dashboard' ? 'text-[#5EEAD4]' : 'text-slate-500'}`}>{l}</span>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Page title */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[9px] text-[#0D9488] uppercase tracking-widest mb-0.5">Evaluation Results</p>
            <p className="text-xs font-bold text-white">Construction of Admin Block — CRPF Bengaluru</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[9px] px-2 py-1 rounded-lg flex items-center gap-1">
              <AlertTriangle size={9} /> Review (1)
            </div>
            <div className="bg-[#0D9488] text-white text-[9px] px-2 py-1 rounded-lg flex items-center gap-1">
              <BarChart3 size={9} /> Export
            </div>
          </div>
        </div>

        {/* Summary + Donut row */}
        <div className="grid grid-cols-5 gap-2 mb-3">
          {/* Donut */}
          <div className="col-span-1 bg-[#1a2332] rounded-xl p-2 flex flex-col items-center justify-center">
            <MiniDonut eligible={3} rejected={2} review={1} />
            <p className="text-[8px] text-slate-400 mt-1">6 Total</p>
          </div>
          {/* Stat cards */}
          {[
            { label: 'Eligible', val: 3, color: 'bg-green-500' },
            { label: 'Rejected', val: 2, color: 'bg-red-500' },
            { label: 'Review', val: 1, color: 'bg-amber-400' },
            { label: 'Avg Conf.', val: '84%', color: 'bg-[#0D9488]' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-xl p-2 flex flex-col justify-center`}>
              <span className="text-white text-lg font-bold leading-none">{s.val}</span>
              <span className="text-white/70 text-[8px] mt-0.5">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-[#1a2332] rounded-xl overflow-hidden">
          <div className="grid grid-cols-7 px-3 py-1.5 border-b border-white/5">
            {['Bidder', 'Turnover', 'Projects', 'GST', 'ISO', 'Conf.', 'Verdict'].map(h => (
              <span key={h} className="text-[8px] text-slate-500 font-medium">{h}</span>
            ))}
          </div>
          {bidders.map((b, i) => (
            <div key={i} className={`grid grid-cols-7 px-3 py-2 items-center ${i < bidders.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/5 transition-colors`}>
              <span className="text-[9px] text-white font-medium truncate pr-2">{b.name.split(' ')[0]}</span>
              <CIcon s={b.turnover} />
              <CIcon s={b.projects} />
              <CIcon s={b.gst} />
              <CIcon s={b.iso} />
              <span className={`text-[9px] font-medium ${b.conf >= 80 ? 'text-green-400' : b.conf >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{b.conf}%</span>
              <VBadge v={b.verdict} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Stats section with count-up
function StatsSection() {
  const ref = useRef()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  const counts = stats.map(s => useCountUp(s.value, 1400, visible))
  return (
    <section ref={ref} className="bg-[#0D9488] py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div key={i} className="text-center">
            <div className="font-display text-3xl md:text-4xl font-800 text-white">
              {counts[i]}{s.suffix}
            </div>
            <div className="text-teal-50 text-sm mt-1 font-body">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#0D1B2A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-teal-DEFAULT rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-teal-DEFAULT rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-teal-dark/30 border border-teal-DEFAULT/30 text-teal-light text-xs font-medium px-3 py-1.5 rounded-full mb-6 animate-fade-up">
                <span className="w-1.5 h-1.5 bg-teal-light rounded-full animate-pulse" />
                Hackathon 2026 · CRPF · Theme 3
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-800 text-white leading-tight mb-6 animate-fade-up delay-100">
                Government Tender Evaluation,{' '}
                <span className="text-[#5EEAD4]">Reimagined with AI</span>
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed mb-8 animate-fade-up delay-200">
                TenderSort extracts eligibility criteria, parses every bidder submission, and delivers explainable verdicts — in minutes, not days.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-300">
                <Link to="/upload" className="btn-primary flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-medium">
                  Start an Evaluation
                  <ArrowRight size={18} />
                </Link>
                <Link to="/dashboard" className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-medium border border-slate-600 text-slate-300 hover:border-teal-DEFAULT hover:text-white transition-all">
                  View Sample Dashboard
                </Link>
              </div>
              {/* Trust badges */}
              <div className="flex flex-wrap gap-3 mt-8 animate-fade-up delay-400">
                {['OCR Powered', 'LLM Extraction', 'Human-in-Loop', 'Audit Ready'].map(b => (
                  <span key={b} className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    <CheckCircle2 size={11} className="text-[#0D9488]" /> {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — product screenshot */}
            <div className="animate-fade-up delay-300 hidden md:block">
              <div className="relative">
                {/* Glow behind mockup */}
                <div className="absolute -inset-4 bg-teal-DEFAULT/10 rounded-3xl blur-2xl" />
                <div className="relative">
                  <DashboardMockup />
                </div>
                {/* Floating verdict badges */}
                <div className="absolute -left-6 top-16 bg-white rounded-xl shadow-xl px-3 py-2 flex items-center gap-2 animate-fade-up delay-500">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <div>
                    <p className="text-[10px] font-bold text-navy">Raj Infrastructure</p>
                    <p className="text-[9px] text-green-600 font-medium">Eligible — 96% confidence</p>
                  </div>
                </div>
                <div className="absolute -right-6 bottom-20 bg-white rounded-xl shadow-xl px-3 py-2 flex items-center gap-2 animate-fade-up delay-500">
                  <AlertTriangle size={16} className="text-amber-500" />
                  <div>
                    <p className="text-[10px] font-bold text-navy">Apex Constructions</p>
                    <p className="text-[9px] text-amber-600 font-medium">Routed to human review</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats */}
      <StatsSection />

      {/* How it works */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-[#0D9488] text-sm font-medium tracking-widest uppercase mb-2">The Process</p>
          <h2 className="font-display text-3xl md:text-4xl font-700 text-navy">How TenderSort Works</h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">From upload to audit-ready report in 4 clear steps.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 card-hover">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-3 w-6 h-0.5 bg-slate-200 z-10" />
              )}
              <div className="text-3xl mb-4">{s.icon}</div>
              <div className="text-xs font-medium text-[#0D9488] mb-1 font-display">{s.step}</div>
              <h3 className="font-display text-lg font-600 text-navy mb-2">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#0D9488] text-sm font-medium tracking-widest uppercase mb-2">Capabilities</p>
            <h2 className="font-display text-3xl md:text-4xl font-700 text-navy">Built for Real Government Use</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 card-hover">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-display text-base font-600 text-navy mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0D1B2A]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-700 text-white mb-4">
            Ready to evaluate your first tender?
          </h2>
          <p className="text-slate-400 mb-8">Upload your documents and get results in minutes.</p>
          <Link to="/upload" className="btn-primary inline-flex items-center gap-2 px-10 py-4 rounded-xl text-base font-medium">
            Get Started Free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1520] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-white font-600">Tender<span className="text-[#0D9488]">Sort</span></span>
            <span className="text-slate-600 text-xs">by Byte Verdict</span>
          </div>
          <p className="text-slate-600 text-xs">Hackathon 2025 · Theme 3 · AI-Based Tender Evaluation for CRPF</p>
        </div>
      </footer>
    </div>
  )
}
