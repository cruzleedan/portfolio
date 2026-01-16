import { Code2, Server, Palette } from 'lucide-react'

export default function About() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container px-4 mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          About Me
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              I'm a passionate software engineer with over 5 years of experience building
              web applications. I specialize in React, TypeScript, and Node.js, creating
              solutions that are both performant and maintainable.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              My approach combines technical excellence with a deep understanding of user needs.
              I believe great software is not just about clean code, but about solving real
              problems and delivering value.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              When I'm not coding, you'll find me contributing to open-source projects,
              writing technical blog posts, or exploring new technologies.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="flex gap-4 p-6 rounded-lg border bg-card">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Frontend Development</h3>
                <p className="text-muted-foreground">
                  Building responsive, accessible, and performant user interfaces with modern frameworks.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-lg border bg-card">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Server className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Backend Development</h3>
                <p className="text-muted-foreground">
                  Designing scalable APIs and microservices with clean architecture patterns.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-lg border bg-card">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Palette className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">UI/UX Design</h3>
                <p className="text-muted-foreground">
                  Creating intuitive and beautiful interfaces that users love to interact with.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
