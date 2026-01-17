const skillCategories = [
  {
    title: "Mobile Development",
    skills: [
      "Flutter", "Dart", "Cordova", "iOS", "Android",
      "Mobile Architecture", "State Management", "Riverpod"
    ]
  },
  {
    title: "Frontend",
    skills: [
      "JavaScript", "TypeScript", "React", "Angular",
      "ExtJS", "HTML5", "CSS3", "Tailwind CSS"
    ]
  },
  {
    title: "Backend & Databases",
    skills: [
      "Node.js", "Express", "Python", "Flask", ".NET",
      "PHP", "MySQL", "MSSQL", "REST APIs"
    ]
  },
  {
    title: "Tools & DevOps",
    skills: [
      "Git", "GitHub Copilot", "CI/CD", "Figma",
      "Docker", "VS Code", "Bash", "Linux"
    ]
  },
  {
    title: "ERP & Enterprise",
    skills: [
      "ERP Systems", "CRM", "Time & Expense", "Business Intelligence",
      "Data Warehousing", "ETL", "Legacy Modernization"
    ]
  },
  {
    title: "Practices & Methodologies",
    skills: [
      "Clean Architecture", "AI-Assisted Development", "Agile/Scrum",
      "Performance Optimization", "Code Review", "Technical Leadership"
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
          9+ years of experience with enterprise mobile and full-stack development.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
