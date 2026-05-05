import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FileSearch, Menu, X, ChevronRight } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/upload', label: 'New Evaluation' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/review', label: 'Review Queue' },
    { to: '/report', label: 'Reports' },
  ]

  return (
    <nav className="bg-[#0D1B2A] sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-teal-DEFAULT rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileSearch size={16} className="text-white" />
          </div>
          <div>
            <span className="font-display font-700 text-white text-lg tracking-tight">Tender</span>
            <span className="font-display font-700 text-[#0D9488] text-lg tracking-tight">Sort</span>
          </div>
          <span className="text-xs text-slate-500 font-body hidden sm:block ml-1 mt-1">by Byte Verdict</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link text-sm font-body font-medium pb-0.5 ${pathname === l.to ? 'text-[#5EEAD4] active' : 'text-slate-400 hover:text-white'}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/upload"
            className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium font-body"
          >
            Start Evaluation
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#1a2d42] px-6 py-4 flex flex-col gap-4 animate-fade-in">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium py-1 ${pathname === l.to ? 'text-[#5EEAD4]' : 'text-slate-300'}`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/upload"
            onClick={() => setOpen(false)}
            className="btn-primary text-center px-4 py-2 rounded-lg text-sm font-medium"
          >
            Start Evaluation
          </Link>
        </div>
      )}
    </nav>
  )
}
