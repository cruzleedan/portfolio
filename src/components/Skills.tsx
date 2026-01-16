const skillCategories = [
  {
    title: "Frontend",
    skills: [
      "React", "TypeScript", "Next.js", "Vue.js",
      "Tailwind CSS", "HTML5", "CSS3", "JavaScript"
    ]
  },
  {
    title: "Backend",
    skills: [
      "Node.js", "Express", "Python", "PostgreSQL",
      "MongoDB", "REST APIs", "GraphQL", "Redis"
    ]
  },
  {
    title: "Tools & DevOps",
    skills: [
      "Git", "Docker", "AWS", "CI/CD",
      "Webpack", "Vite", "Jest", "Linux"
    ]
  },
  {
    title: "Soft Skills",
    skills: [
      "Problem Solving", "Team Collaboration", "Agile/Scrum",
      "Code Review", "Technical Writing", "Mentoring"
    ]
  }
]

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-background">
      <div className="container px-4 mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Skills & Technologies
        </h2>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          Technologies and tools I work with regularly.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-2xl font-semibold border-l-4 border-primary pl-4">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-3 pl-4">
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-4 py-2 rounded-lg bg-card border text-card-foreground font-medium hover:border-primary transition-colors"
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
