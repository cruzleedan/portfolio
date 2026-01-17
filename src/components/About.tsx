import { Smartphone, Code2, Zap } from 'lucide-react'

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
              I'm a Principal Software Engineer with 9+ years of experience building enterprise
              mobile and web applications. Currently leading Flutter development for an ERP SaaS
              platform at Deltek, where I architect scalable, high-performance solutions with
              emphasis on clean architecture principles.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              My journey spans from modernizing legacy systems to building cutting-edge mobile
              applications. I specialize in Flutter, full-stack development, and leveraging AI-assisted
              coding practices to enhance development velocity and code quality.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I'm passionate about performance optimization, clean architecture, and creating
              exceptional user experiences. I believe in continuous learning and staying at the
              forefront of technology to deliver robust, maintainable solutions.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="flex gap-4 p-6 rounded-lg border bg-card">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Mobile Development</h3>
                <p className="text-muted-foreground">
                  Leading Flutter development with clean architecture, building scalable enterprise mobile apps.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-lg border bg-card">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Full-Stack Development</h3>
                <p className="text-muted-foreground">
                  Building end-to-end solutions from frontend to backend, specializing in enterprise ERP systems.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-lg border bg-card">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">AI-Assisted Development</h3>
                <p className="text-muted-foreground">
                  Leveraging AI coding assistants to enhance development velocity and code quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
