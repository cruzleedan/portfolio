import { Github, Linkedin, Mail, ArrowDown, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'

const differentiators = [
  { label: 'Flutter', detail: 'iOS · Android · Cross-platform' },
  { label: 'Full-stack', detail: 'React · Node · Python · .NET' },
  { label: 'Agentic AI', detail: 'Part of the daily workflow' },
]

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-[#0a0f1e]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,197,94,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-1/4 -right-32 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl animate-float"
        style={{ animationDelay: '3s' }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container px-6 py-24 mx-auto max-w-5xl">
        <div className="max-w-3xl mx-auto text-center space-y-8">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium animate-fade-in-up">
            <Terminal size={14} />
            Flutter Mobile App Developer
          </div>

          {/* Heading */}
          <div
            className="space-y-2 animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none font-heading">
              Dan Lee
              <br />
              <span className="gradient-text">De la Cruz</span>
            </h1>
          </div>

          {/* Value prop — what you bring, not where you've been */}
          <p
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            Flutter developer focused on building mobile applications for the enterprise.
            I like writing code that's easy to maintain and working on teams that care about doing it well.
          </p>

          {/* CTA buttons */}
          <div
            className="flex flex-wrap gap-4 justify-center items-center animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            <a href="#projects">
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                See My Work
              </Button>
            </a>
            <a href="#contact">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:border-emerald-500/50 hover:text-white hover:bg-emerald-500/10 px-8 cursor-pointer transition-all duration-200"
              >
                Get In Touch
              </Button>
            </a>
          </div>

          {/* Social links */}
          <div
            className="flex gap-4 justify-center items-center animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <a
              href="https://github.com/cruzleedan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-11 h-11 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200 cursor-pointer"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/dan-lee-de-la-cruz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-11 h-11 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200 cursor-pointer"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:cruzleedan@gmail.com"
              className="flex items-center justify-center w-11 h-11 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200 cursor-pointer"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>

          {/* Differentiators — replaces empty stats */}
          <div
            className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-2 animate-fade-in-up"
            style={{ animationDelay: '0.5s' }}
          >
            {differentiators.map((d) => (
              <div
                key={d.label}
                className="text-center px-3 py-3 rounded-xl border border-white/6 bg-white/3"
              >
                <div className="text-sm font-bold text-white font-heading">{d.label}</div>
                <div className="text-xs text-slate-500 mt-0.5 leading-tight">{d.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 hover:text-emerald-400 transition-colors duration-200 cursor-pointer"
        aria-label="Scroll down"
      >
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <ArrowDown size={16} className="animate-bounce" />
      </a>
    </section>
  )
}
