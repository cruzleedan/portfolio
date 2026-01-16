import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Github } from 'lucide-react'

const projects = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory management, payment processing, and admin dashboard.",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    github: "https://github.com/alexjohnson/ecommerce",
    demo: "https://ecommerce-demo.example.com",
    image: "🛒"
  },
  {
    title: "Task Management App",
    description: "Collaborative task management tool with real-time updates, team workspaces, and advanced filtering capabilities.",
    tags: ["TypeScript", "Next.js", "Prisma", "WebSocket"],
    github: "https://github.com/alexjohnson/taskmanager",
    demo: "https://tasks-demo.example.com",
    image: "✅"
  },
  {
    title: "Weather Dashboard",
    description: "Beautiful weather visualization dashboard with forecasts, historical data, and location-based alerts.",
    tags: ["React", "D3.js", "OpenWeather API", "Tailwind"],
    github: "https://github.com/alexjohnson/weather",
    demo: "https://weather-demo.example.com",
    image: "🌤️"
  },
  {
    title: "Social Media Analytics",
    description: "Analytics platform for tracking social media metrics, engagement rates, and audience insights across multiple platforms.",
    tags: ["Vue.js", "Express", "MongoDB", "Chart.js"],
    github: "https://github.com/alexjohnson/analytics",
    demo: "https://analytics-demo.example.com",
    image: "📊"
  }
]

export default function Projects() {
  return (
    <section id="projects" className="py-20 bg-muted/20">
      <div className="container px-4 mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Featured Projects
        </h2>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          Here are some of my recent projects that showcase my skills and experience.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <Card key={index} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-6xl mb-4">{project.image}</div>
                <CardTitle className="text-2xl">{project.title}</CardTitle>
                <CardDescription className="text-base">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </Button>
                  </a>
                  <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button size="sm" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Demo
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
