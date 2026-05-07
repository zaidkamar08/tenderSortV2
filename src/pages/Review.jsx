import { useState } from 'react'
import { AlertTriangle, CheckCircle2, XCircle, ChevronLeft, ChevronRight, FileText, MessageSquare } from 'lucide-react'

export default function Review() {
  const [current, setCurrent] = useState(0)
  const [decisions, setDecisions] = useState({})
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Read real evaluation data from localStorage
  const raw = localStorage.getItem('evaluationResult')
  const evalResult = raw ? JSON.parse(raw) : null
  const reviewBidders = evalResult
    ? evalResult.bidders.filter(b => b.overall_verdict === 'review')
    : []
  const criteria = evalResult ? evalResult.criteria : []

  // No data or no review bidders
  if (!evalResult || reviewBidders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} className="text-amber-500" />
          </div>
          <h2 className="font-display text-xl font-700 text-navy mb-2">No Cases to Review</h2>
          <p className="text-slate-500 text-sm mb-6">
            {!evalResult
              ? 'Run an evaluation first to see manual review cases here.'
              : 'All bidders were automatically classified. No manual review needed!'}
          </p>
          <a href="/upload" className="btn-primary w-full py-2.5 rounded-xl text-sm font-medium block text-center">
            Start New Evaluation
          </a>
        </div>
      </div>
    )
  }

  const bidder = reviewBidders[current]

  const decide = (verdict) => {
    setDecisions(prev => ({ ...prev, [bidder.bidder_name]: verdict }))
  }
  const currentDecision = decisions[bidder.bidder_name]

  const handleSubmit = () => setSubmitted(true)

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h2 className="font-display text-xl font-700 text-navy mb-2">Review Submitted</h2>
          <p className="text-slate-500 text-sm mb-6">Your decisions have been recorded in the audit log.</p>
          <button
            onClick={() => { setSubmitted(false); setDecisions({}) }}
            className="btn-primary w-full py-2.5 rounded-xl text-sm font-medium"
          >
            Back to Review
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-2 text-amber-600 mb-1">
          <AlertTriangle size={15} />
          <span className="text-xs font-medium uppercase tracking-wider">Manual Review Queue</span>
        </div>
        <h1 className="font-display text-2xl font-700 text-navy">Human Review Panel</h1>
        <p className="text-slate-500 text-sm mt-1">
          These cases have low AI confidence. Review the highlighted evidence and make a decision.
        </p>
      </div>

      {/* Bidder tabs */}
      <div className="flex items-center gap-3 mb-6 animate-fade-up delay-100">
        {reviewBidders.map((b, i) => (
          <button
            key={b.bidder_name}
            onClick={() => setCurrent(i)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
              i === current
                ? 'bg-[#0D1B2A] text-white border-[#0D1B2A]'
                : decisions[b.bidder_name]
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {decisions[b.bidder_name]
              ? <CheckCircle2 size={12} />
              : <span className="w-3 h-3 rounded-full bg-amber-400" />}
            {b.bidder_name.split(' ')[0]}
          </button>
        ))}
        <div className="ml-auto text-xs text-slate-400">
          {Object.keys(decisions).length}/{reviewBidders.length} reviewed
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — bidder info + criteria */}
        <div className="lg:col-span-2 space-y-4">

          {/* Bidder header card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-fade-up delay-200">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-lg font-600 text-navy">{bidder.bidder_name}</h2>
                <p className="text-slate-500 text-sm">Tender: {evalResult.tender_title}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-medium">
                <AlertTriangle size={12} />
                AI Confidence: {bidder.overall_confidence}%
              </span>
            </div>
            {bidder.note && (
              <p className="mt-3 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                ⚠️ {bidder.note}
              </p>
            )}
          </div>

          {/* Criteria cards */}
          <div className="space-y-3">
            {bidder.criteria_results && bidder.criteria_results.length > 0 ? (
              bidder.criteria_results.map((c, i) => {
                const isLow = c.confidence < 70
                return (
                  <div
                    key={c.id || i}
                    className={`bg-white rounded-2xl border p-5 animate-fade-up ${isLow ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-100'}`}
                    style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          {isLow && <AlertTriangle size={13} className="text-amber-500" />}
                          <span className="font-medium text-navy text-sm">{c.label}</span>
                          {isLow && (
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                              Low confidence
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          {criteria.find(x => x.id === c.id)?.requirement || 'See tender document'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        {c.status === 'pass' && <><CheckCircle2 size={13} className="text-green-500" /><span className="text-green-600">Pass</span></>}
                        {c.status === 'fail' && <><XCircle size={13} className="text-red-500" /><span className="text-red-600">Fail</span></>}
                        {c.status === 'review' && <><AlertTriangle size={13} className="text-amber-500" /><span className="text-amber-600">Unclear</span></>}
                      </div>
                    </div>

                    <div className={`rounded-xl p-3 text-sm ${isLow ? 'bg-amber-50 border border-amber-100' : 'bg-slate-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <FileText size={13} className="text-slate-400" />
                        <span className="text-xs text-slate-500">{c.source_document}</span>
                      </div>
                      <p className="text-navy font-medium">
                        Found: <span className={isLow ? 'text-amber-700' : ''}>{c.value_found || 'Not found'}</span>
                      </p>
                      {c.reason && (
                        <p className="text-xs text-slate-500 mt-1">{c.reason}</p>
                      )}
                      {isLow && (
                        <p className="text-xs text-amber-600 mt-1">
                          ⚠️ Low confidence — manual verification required.
                        </p>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${c.confidence}%`,
                            background: c.confidence >= 80 ? '#10b981' : c.confidence >= 50 ? '#f59e0b' : '#ef4444'
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{c.confidence}% confidence</span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="bg-white rounded-2xl border border-amber-200 p-5 text-center">
                <AlertTriangle size={24} className="text-amber-500 mx-auto mb-2" />
                <p className="text-sm text-slate-600">No detailed criteria data available.</p>
                <p className="text-xs text-slate-400 mt-1">Manual review of original documents recommended.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right — decision panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 sticky top-20 animate-fade-up delay-300">
            <h3 className="font-display text-base font-600 text-navy mb-1">Your Decision</h3>
            <p className="text-xs text-slate-500 mb-5">This will be recorded in the audit log with your timestamp.</p>

            <div className="space-y-3 mb-5">
              <button
                onClick={() => decide('eligible')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${currentDecision === 'eligible' ? 'bg-green-500 text-white border-green-500' : 'bg-white border-slate-200 text-slate-700 hover:border-green-400 hover:text-green-700'}`}
              >
                <CheckCircle2 size={16} />
                Mark as Eligible
              </button>
              <button
                onClick={() => decide('rejected')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${currentDecision === 'rejected' ? 'bg-red-500 text-white border-red-500' : 'bg-white border-slate-200 text-slate-700 hover:border-red-400 hover:text-red-700'}`}
              >
                <XCircle size={16} />
                Mark as Not Eligible
              </button>
              <button
                onClick={() => decide('escalate')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${currentDecision === 'escalate' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white border-slate-200 text-slate-700 hover:border-amber-400 hover:text-amber-700'}`}
              >
                <AlertTriangle size={16} />
                Escalate Further
              </button>
            </div>

            <div className="mb-5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-2">
                <MessageSquare size={12} />
                Add a note (optional)
              </label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. Turnover figure unclear — document quality too low to read"
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-[#0D9488] h-24 text-navy placeholder-slate-400"
              />
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setCurrent(Math.max(0, current - 1))}
                disabled={current === 0}
                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-slate-200 text-xs text-slate-500 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                onClick={() => setCurrent(Math.min(reviewBidders.length - 1, current + 1))}
                disabled={current === reviewBidders.length - 1}
                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-slate-200 text-xs text-slate-500 disabled:opacity-40 hover:bg-slate-50"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={Object.keys(decisions).length === 0}
              className={`w-full py-3 rounded-xl text-sm font-medium transition-all ${Object.keys(decisions).length > 0 ? 'btn-primary' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
            >
              Submit Decisions ({Object.keys(decisions).length}/{reviewBidders.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
