export const mockBidders = [
  {
    id: 1,
    name: 'Raj Infrastructure Pvt. Ltd.',
    submittedAt: '2025-04-20',
    criteria: {
      turnover: { status: 'pass', value: '₹7.2 Cr', required: '≥ ₹5 Cr', doc: 'Financial Statement 2024.pdf', page: 3, confidence: 96 },
      projects: { status: 'pass', value: '4 projects', required: '≥ 3 similar projects', doc: 'Experience Certificate.pdf', page: 1, confidence: 91 },
      gst: { status: 'pass', value: 'Valid (27AABCR1234F1Z5)', required: 'Active GST Registration', doc: 'GST Certificate.pdf', page: 1, confidence: 99 },
      iso: { status: 'pass', value: 'ISO 9001:2015', required: 'Valid ISO 9001', doc: 'ISO Certificate.pdf', page: 1, confidence: 97 },
    },
    verdict: 'eligible',
    overallConfidence: 96,
  },
  {
    id: 2,
    name: 'BuildTech Solutions',
    submittedAt: '2025-04-19',
    criteria: {
      turnover: { status: 'pass', value: '₹5.8 Cr', required: '≥ ₹5 Cr', doc: 'Audited Report.pdf', page: 4, confidence: 88 },
      projects: { status: 'pass', value: '3 projects', required: '≥ 3 similar projects', doc: 'Work Orders.pdf', page: 2, confidence: 85 },
      gst: { status: 'pass', value: 'Valid (27AABBT5678G1Z3)', required: 'Active GST Registration', doc: 'GST Cert.pdf', page: 1, confidence: 99 },
      iso: { status: 'fail', value: 'Expired (Mar 2024)', required: 'Valid ISO 9001', doc: 'ISO Certificate.pdf', page: 1, confidence: 95 },
    },
    verdict: 'rejected',
    overallConfidence: 92,
  },
  {
    id: 3,
    name: 'Apex Constructions Ltd.',
    submittedAt: '2025-04-21',
    criteria: {
      turnover: { status: 'review', value: 'Unclear — scanned doc', required: '≥ ₹5 Cr', doc: 'Balance Sheet Scan.jpg', page: 1, confidence: 41 },
      projects: { status: 'pass', value: '3 projects', required: '≥ 3 similar projects', doc: 'Experience Letters.pdf', page: 1, confidence: 87 },
      gst: { status: 'pass', value: 'Valid (27AABAX9012H1Z1)', required: 'Active GST Registration', doc: 'GST.pdf', page: 1, confidence: 99 },
      iso: { status: 'pass', value: 'ISO 9001:2015', required: 'Valid ISO 9001', doc: 'ISO Cert.pdf', page: 1, confidence: 93 },
    },
    verdict: 'review',
    overallConfidence: 41,
  },
  {
    id: 4,
    name: 'Metro Build Corp',
    submittedAt: '2025-04-18',
    criteria: {
      turnover: { status: 'pass', value: '₹6.1 Cr', required: '≥ ₹5 Cr', doc: 'Annual Report.pdf', page: 5, confidence: 94 },
      projects: { status: 'pass', value: '5 projects', required: '≥ 3 similar projects', doc: 'Portfolio.pdf', page: 2, confidence: 92 },
      gst: { status: 'pass', value: 'Valid (27AABMB3456I1Z7)', required: 'Active GST Registration', doc: 'GST Reg.pdf', page: 1, confidence: 99 },
      iso: { status: 'pass', value: 'ISO 9001:2015', required: 'Valid ISO 9001', doc: 'Certification.pdf', page: 1, confidence: 98 },
    },
    verdict: 'eligible',
    overallConfidence: 96,
  },
  {
    id: 5,
    name: 'Sagar Engineering Works',
    submittedAt: '2025-04-20',
    criteria: {
      turnover: { status: 'fail', value: '₹3.1 Cr', required: '≥ ₹5 Cr', doc: 'Financial Report.pdf', page: 2, confidence: 91 },
      projects: { status: 'pass', value: '4 projects', required: '≥ 3 similar projects', doc: 'Completion Certs.pdf', page: 1, confidence: 89 },
      gst: { status: 'pass', value: 'Valid (27AABSE7890J1Z9)', required: 'Active GST Registration', doc: 'GST.pdf', page: 1, confidence: 99 },
      iso: { status: 'fail', value: 'Not Submitted', required: 'Valid ISO 9001', doc: '—', page: null, confidence: 99 },
    },
    verdict: 'rejected',
    overallConfidence: 95,
  },
  {
    id: 6,
    name: 'Greenfield Developers',
    submittedAt: '2025-04-22',
    criteria: {
      turnover: { status: 'pass', value: '₹8.4 Cr', required: '≥ ₹5 Cr', doc: 'Audited FS.pdf', page: 4, confidence: 97 },
      projects: { status: 'pass', value: '6 projects', required: '≥ 3 similar projects', doc: 'Project Portfolio.pdf', page: 3, confidence: 94 },
      gst: { status: 'pass', value: 'Valid (27AABGD2345K1Z2)', required: 'Active GST Registration', doc: 'GST Cert.pdf', page: 1, confidence: 99 },
      iso: { status: 'pass', value: 'ISO 9001:2015', required: 'Valid ISO 9001', doc: 'ISO 9001 Cert.pdf', page: 1, confidence: 98 },
    },
    verdict: 'eligible',
    overallConfidence: 97,
  },
]

export const mockTender = {
  title: 'Construction of Administrative Block — CRPF Camp Bengaluru',
  issueDate: '2025-04-10',
  deadline: '2025-04-22',
  department: 'Central Reserve Police Force (CRPF)',
  criteria: [
    { id: 'turnover', label: 'Annual Turnover', type: 'Financial', requirement: 'Minimum ₹5 Crore in last FY', mandatory: true },
    { id: 'projects', label: 'Similar Projects', type: 'Technical', requirement: 'At least 3 similar projects completed in last 5 years', mandatory: true },
    { id: 'gst', label: 'GST Registration', type: 'Compliance', requirement: 'Active GST Registration Certificate', mandatory: true },
    { id: 'iso', label: 'ISO 9001 Certification', type: 'Compliance', requirement: 'Valid ISO 9001:2015 Certification', mandatory: true },
  ],
}
