import { Github, Linkedin, Mail, Heart } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/8 bg-background">
      <div className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-sm text-white font-heading">
              DL
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Dan Lee De la Cruz</div>
              <div className="text-xs text-muted-foreground">Principal Software Engineer</div>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            © {currentYear} · Built with
            <Heart className="w-3 h-3 text-emerald-400 fill-emerald-400" />
            and React
          </p>

          {/* Social links */}
          <div className="flex gap-3">
            <a
              href="https://github.com/cruzleedan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/8 bg-white/3 text-muted-foreground hover:text-white hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all duration-200 cursor-pointer"
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/dan-lee-de-la-cruz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/8 bg-white/3 text-muted-foreground hover:text-white hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all duration-200 cursor-pointer"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="mailto:cruzleedan@gmail.com"
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/8 bg-white/3 text-muted-foreground hover:text-white hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all duration-200 cursor-pointer"
              aria-label="Email"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
