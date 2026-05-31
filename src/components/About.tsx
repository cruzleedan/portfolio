import { Smartphone, Code2, Zap, ArrowRight } from 'lucide-react'

const highlights = [
  {
    icon: Smartphone,
    title: 'Mobile Development',
    description:
      'Flutter is where I spend most of my time. Building cross-platform mobile apps with clean architecture, solid state management, and a focus on long-term maintainability.',
    color: 'from-emerald-500/20 to-emerald-500/5',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Code2,
    title: 'Full-Stack',
    description:
      'Comfortable moving between frontend and backend. React, Angular, Node, Python, .NET — I try to work where the problem is rather than stay in one lane.',
    color: 'from-cyan-500/20 to-cyan-500/5',
    border: 'border-cyan-500/20',
    iconColor: 'text-cyan-400',
  },
  {
    icon: Zap,
    title: 'Agentic AI Development',
    description:
      'I use AI tooling as part of my regular workflow — it helps me move faster and catch things I might otherwise miss. Still very much about judgment, not automation.',
    color: 'from-violet-500/20 to-violet-500/5',
    border: 'border-violet-500/20',
    iconColor: 'text-violet-400',
  },
]

export default function About() {
  return (
    <section id="about" className="relative py-28 bg-background overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container px-6 mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            About
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground font-heading mb-6">
            Engineering that{' '}
            <span className="gradient-text">ships</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Bio — value-focused, not resume-focused */}
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              I'm a software engineer who's spent most of my career working on
              mobile and web applications in enterprise environments. I tend to
              gravitate toward problems that involve some complexity — systems
              that need to stay maintainable as they grow.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I try to write code that's straightforward to reason about and easy
              for other people on the team to pick up. I've worked across the full stack, but Flutter mobile development is where I'm most focused and where I'm looking to grow.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Happy to talk through what I've worked on — just reach out.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="https://www.linkedin.com/in/dan-lee-de-la-cruz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-slate-400 hover:text-white hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all duration-200 cursor-pointer"
              >
                Full profile on LinkedIn
                <ArrowRight size={14} />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors duration-200 cursor-pointer group py-2"
              >
                Let's talk
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </div>
          </div>

          {/* What I bring */}
          <div className="grid gap-4">
            {highlights.map((item) => (
              <div
                key={item.title}
                className={`relative flex gap-5 p-5 rounded-2xl border ${item.border} bg-gradient-to-br ${item.color} backdrop-blur-sm cursor-default transition-all duration-300`}
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-black/20 flex items-center justify-center">
                  <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1.5 font-heading">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
