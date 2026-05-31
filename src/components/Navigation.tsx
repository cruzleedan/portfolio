import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const navItems = [
  { name: 'Home', href: '/', type: 'route' },
  { name: 'About', href: '#about', type: 'anchor' },
  { name: 'Projects', href: '#projects', type: 'anchor' },
  { name: 'Skills', href: '#skills', type: 'anchor' },
  { name: 'Blog', href: '/blog', type: 'route' },
  { name: 'Contact', href: '#contact', type: 'anchor' },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname !== '/') {
      e.preventDefault()
      navigate(`/${href}`)
      setTimeout(() => {
        const element = document.getElementById(href.substring(1))
        if (element) element.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-2 px-4 md:px-8'
          : 'py-4 px-4 md:px-8'
      }`}
    >
      <div
        className={`mx-auto max-w-6xl transition-all duration-300 ${
          isScrolled
            ? 'backdrop-blur-xl bg-slate-900/80 border border-white/10 shadow-xl shadow-black/20 rounded-2xl px-6'
            : 'bg-transparent px-0'
        }`}
      >
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <a
            href="#home"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-sm text-white font-heading group-hover:bg-emerald-400 transition-colors duration-200">
              DL
            </div>
            <span className="hidden sm:block text-sm font-semibold text-white/70 group-hover:text-white transition-colors duration-200">
              Dan Lee
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) =>
              item.type === 'route' ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
                >
                  {item.name}
                </a>
              )
            )}
            <div className="w-px h-5 bg-white/10 mx-2" />
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-2 pb-4 border-t border-white/10 mt-2">
            <div className="flex flex-col gap-1">
              {navItems.map((item) =>
                item.type === 'route' ? (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className="px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
                    onClick={(e) => {
                      handleAnchorClick(e, item.href)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    {item.name}
                  </a>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
