import { Smartphone, Globe, Server, Wrench, Building2, Lightbulb } from 'lucide-react'

const skillCategories = [
  {
    title: 'Mobile Development',
    Icon: Smartphone,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    skills: ['Flutter', 'Dart', 'Cordova', 'iOS', 'Android', 'Mobile Architecture', 'State Management', 'Riverpod'],
  },
  {
    title: 'Frontend',
    Icon: Globe,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    skills: ['JavaScript', 'TypeScript', 'React', 'Angular', 'ExtJS', 'HTML5', 'CSS3', 'Tailwind CSS'],
  },
  {
    title: 'Backend & Databases',
    Icon: Server,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    skills: ['Node.js', 'Express', 'Python', 'Flask', '.NET', 'PHP', 'MySQL', 'MSSQL', 'REST APIs'],
  },
  {
    title: 'Tools & DevOps',
    Icon: Wrench,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    skills: ['Git', 'GitHub Copilot', 'CI/CD', 'Figma', 'Docker', 'VS Code', 'Bash', 'Linux'],
  },
  {
    title: 'Enterprise Systems',
    Icon: Building2,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    skills: ['ERP', 'Business Intelligence', 'Data Warehousing', 'ETL Pipelines', 'Legacy Modernization', 'System Integration'],
  },
  {
    title: 'Practices',
    Icon: Lightbulb,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    skills: ['Clean Architecture', 'AI-Assisted Dev', 'Agile/Scrum', 'Performance Optimization', 'Code Review', 'Tech Leadership'],
  },
]

export default function Skills() {
  return (
    <section id="skills" className="relative py-28 bg-background overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/3 rounded-full blur-3xl pointer-events-none" />

      <div className="container px-6 mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            Skills & Technologies
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground font-heading mb-4">
            The full{' '}
            <span className="gradient-text">stack</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            Mobile-first, but comfortable across the stack. Here's what I've worked with.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className={`group p-6 rounded-2xl border ${category.border} bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-all duration-300 cursor-default`}
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-9 h-9 rounded-lg ${category.bg} flex items-center justify-center`}>
                  <category.Icon className={`w-4 h-4 ${category.color}`} />
                </div>
                <h3 className="font-bold text-foreground font-heading text-sm">{category.title}</h3>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${category.border} ${category.bg} ${category.color} hover:brightness-110 transition-all duration-150 cursor-default`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
