import { ExternalLink, Github, ShoppingCart, CheckSquare, Cloud, BarChart2 } from 'lucide-react'

const projects = [
  {
    title: 'E-Commerce Platform',
    description:
      'A full-stack e-commerce solution with real-time inventory management, payment processing, and admin dashboard.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    github: 'https://github.com/cruzleedan/ecommerce',
    demo: 'https://ecommerce-demo.example.com',
    Icon: ShoppingCart,
    accent: 'from-emerald-500/20 to-emerald-600/5',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15',
  },
  {
    title: 'Task Management App',
    description:
      'Collaborative task management tool with real-time updates, team workspaces, and advanced filtering capabilities.',
    tags: ['TypeScript', 'Next.js', 'Prisma', 'WebSocket'],
    github: 'https://github.com/cruzleedan/taskmanager',
    demo: 'https://tasks-demo.example.com',
    Icon: CheckSquare,
    accent: 'from-cyan-500/20 to-cyan-600/5',
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/15',
  },
  {
    title: 'Weather Dashboard',
    description:
      'Beautiful weather visualization dashboard with forecasts, historical data, and location-based alerts.',
    tags: ['React', 'D3.js', 'OpenWeather API', 'Tailwind'],
    github: 'https://github.com/cruzleedan/weather',
    demo: 'https://weather-demo.example.com',
    Icon: Cloud,
    accent: 'from-sky-500/20 to-sky-600/5',
    iconColor: 'text-sky-400',
    iconBg: 'bg-sky-500/15',
  },
  {
    title: 'Social Media Analytics',
    description:
      'Analytics platform for tracking social media metrics, engagement rates, and audience insights across platforms.',
    tags: ['Vue.js', 'Express', 'MongoDB', 'Chart.js'],
    github: 'https://github.com/cruzleedan/analytics',
    demo: 'https://analytics-demo.example.com',
    Icon: BarChart2,
    accent: 'from-violet-500/20 to-violet-600/5',
    iconColor: 'text-violet-400',
    iconBg: 'bg-violet-500/15',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="relative py-28 bg-background overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container px-6 mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Selected Work
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground font-heading mb-4">
            Things I've{' '}
            <span className="gradient-text">built</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            A handful of public-facing projects. Most of my work lives behind enterprise firewalls — reach out for a deeper conversation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.title}
              className={`group relative flex flex-col p-6 rounded-2xl border border-white/8 bg-gradient-to-br ${project.accent} backdrop-blur-sm hover:border-white/15 transition-all duration-300 cursor-default overflow-hidden`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${project.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <project.Icon className={`w-6 h-6 ${project.iconColor}`} />
                </div>
                {/* Hover links */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-black/20 text-slate-400 hover:text-white hover:border-white/20 transition-all duration-150 cursor-pointer"
                    aria-label={`${project.title} GitHub`}
                  >
                    <Github size={15} />
                  </a>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-black/20 text-slate-400 hover:text-white hover:border-white/20 transition-all duration-150 cursor-pointer"
                    aria-label={`${project.title} Demo`}
                  >
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground font-heading mb-2">{project.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-black/20 border border-white/8 text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA pointing to GitHub + LinkedIn for full history */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <a
            href="https://github.com/cruzleedan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-slate-400 hover:text-white hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all duration-200 cursor-pointer"
          >
            <Github size={16} />
            GitHub
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-sm font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/15 transition-all duration-200 cursor-pointer"
          >
            Want to see more? Let's talk
          </a>
        </div>
      </div>
    </section>
  )
}
