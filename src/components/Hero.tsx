import { Github, Linkedin, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 py-16 mx-auto max-w-6xl">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Hi, I'm <span className="text-primary">Alex Johnson</span>
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground">
              Full Stack Software Engineer
            </p>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            I build scalable web applications and love solving complex problems with elegant code.
            Passionate about creating exceptional user experiences and clean architecture.
          </p>

          <div className="flex flex-wrap gap-4 justify-center items-center">
            <a href="#projects">
              <Button size="lg">View My Work</Button>
            </a>
            <a href="#contact">
              <Button size="lg" variant="outline">Get In Touch</Button>
            </a>
          </div>

          <div className="flex gap-4 justify-center items-center pt-4">
            <a
              href="https://github.com/alexjohnson"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github size={24} />
            </a>
            <a
              href="https://linkedin.com/in/alexjohnson"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="mailto:alex@example.com"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
