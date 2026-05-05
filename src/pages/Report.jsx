import { CheckCircle2, XCircle, AlertTriangle, Download, Printer, Calendar, Building2, FileText } from 'lucide-react'
import { mockBidders, mockTender } from '../data/mockData'

const VerdictIcon = ({ v }) => {
  if (v === 'eligible') return <CheckCircle2 size={16} className="text-green-500" />
  if (v === 'rejected') return <XCircle size={16} className="text-red-500" />
  return <AlertTriangle size={16} className="text-amber-500" />
}

const VerdictText = ({ v }) => {
  if (v === 'eligible') return <span className="text-green-700 font-medium">Eligible</span>
  if (v === 'rejected') return <span className="text-red-700 font-medium">Not Eligible</span>
  return <span className="text-amber-700 font-medium">Needs Review</span>
}

const CriteriaCell = ({ status, value }) => {
  const color = status === 'pass' ? 'text-green-600' : status === 'fail' ? 'text-red-600' : 'text-amber-600'
  const Icon = status === 'pass' ? CheckCircle2 : status === 'fail' ? XCircle : AlertTriangle
  return (
    <div className={`flex items-start gap-1.5 text-xs ${color}`}>
      <Icon size={12} className="mt-0.5 flex-shrink-0" />
      <span>{value}</span>
    </div>
  )
}

export default function Report() {
  const eligible = mockBidders.filter(b => b.verdict === 'eligible')
  const rejected = mockBidders.filter(b => b.verdict === 'rejected')
  const review = mockBidders.filter(b => b.verdict === 'review')

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <p className="text-[#0D9488] text-xs font-medium tracking-widest uppercase mb-1">Evaluation Report</p>
          <h1 className="font-display text-2xl font-700 text-navy">Consolidated Report</h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <Printer size={15} />
            Print
          </button>
          <button className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium">
            <Download size={15} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Report card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-fade-up delay-100">
        {/* Report header */}
        <div className="bg-[#0D1B2A] px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[#5EEAD4] text-xs font-medium tracking-widest uppercase mb-2">TenderSort · Evaluation Report</div>
              <h2 className="font-display text-xl font-600 text-white mb-1">{mockTender.title}</h2>
              <p className="text-slate-400 text-sm">{mockTender.department}</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div className="text-slate-300 font-medium">Generated</div>
              <div>2025-04-22</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { icon: <Calendar size={14} />, label: 'Issue Date', val: mockTender.issueDate },
              { icon: <Calendar size={14} />, label: 'Deadline', val: mockTender.deadline },
              { icon: <Building2 size={14} />, label: 'Department', val: 'CRPF' },
            ].map(({ icon, label, val }) => (
              <div key={label} className="bg-white/5 rounded-xl px-4 py-3">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">{icon}{label}</div>
                <div className="text-white text-sm font-medium">{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="px-8 py-5 border-b border-slate-100 bg-slate-50">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Summary</p>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Evaluated', val: mockBidders.length, color: 'text-navy' },
              { label: 'Eligible', val: eligible.length, color: 'text-green-600' },
              { label: 'Not Eligible', val: rejected.length, color: 'text-red-600' },
              { label: 'Needs Review', val: review.length, color: 'text-amber-600' },
            ].map(s => (
              <div key={s.label} className="text-center bg-white rounded-xl p-3 border border-slate-100">
                <div className={`font-display text-2xl font-700 ${s.color}`}>{s.val}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Criteria used */}
        <div className="px-8 py-5 border-b border-slate-100">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Eligibility Criteria Applied</p>
          <div className="grid md:grid-cols-2 gap-2">
            {mockTender.criteria.map(c => (
              <div key={c.id} className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={14} className="text-[#0D9488] flex-shrink-0" />
                <span className="text-navy font-medium">{c.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${c.type === 'Financial' ? 'bg-blue-50 text-blue-600' : c.type === 'Technical' ? 'bg-teal-50 text-teal-700' : 'bg-purple-50 text-purple-600'}`}>{c.type}</span>
                {c.mandatory && <span className="text-xs text-red-500">Mandatory</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed results table */}
        <div className="px-8 py-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">Detailed Evaluation Results</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left text-xs text-slate-500 font-medium px-3 py-2.5 rounded-l-lg">Bidder</th>
                  {mockTender.criteria.map(c => (
                    <th key={c.id} className="text-left text-xs text-slate-500 font-medium px-3 py-2.5">{c.label}</th>
                  ))}
                  <th className="text-left text-xs text-slate-500 font-medium px-3 py-2.5">Confidence</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-3 py-2.5 rounded-r-lg">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {mockBidders.map((b, i) => (
                  <tr key={b.id} className={`border-b border-slate-50 ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                    <td className="px-3 py-3">
                      <div className="font-medium text-navy text-xs">{b.name}</div>
                    </td>
                    {Object.keys(b.criteria).map(k => (
                      <td key={k} className="px-3 py-3">
                        <CriteriaCell status={b.criteria[k].status} value={b.criteria[k].value} />
                      </td>
                    ))}
                    <td className="px-3 py-3">
                      <span className={`text-xs font-medium ${b.overallConfidence >= 80 ? 'text-green-600' : b.overallConfidence >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                        {b.overallConfidence}%
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <VerdictIcon v={b.verdict} />
                        <VerdictText v={b.verdict} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><FileText size={12} />Generated by TenderSort · SimplifyAI</span>
              <span>All decisions are AI-assisted and subject to human review</span>
            </div>
            <span>Confidential — For Official Use Only</span>
          </div>
        </div>
      </div>

      {/* Audit note */}
      <div className="mt-6 bg-teal-50 border border-teal-DEFAULT/20 rounded-xl px-5 py-4 flex items-start gap-3 animate-fade-up delay-300">
        <CheckCircle2 size={18} className="text-[#0D9488] mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-navy mb-0.5">Audit Trail Recorded</p>
          <p className="text-xs text-slate-500">Every AI decision in this report has been logged with model version, source document, extracted value, and confidence score. This report is suitable for formal government procurement use.</p>
        </div>
      </div>
    </div>
  )
}
