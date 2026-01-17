import { Github, Linkedin, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 py-16 mx-auto max-w-6xl">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Hi, I'm <span className="text-primary">Dan Lee De la Cruz</span>
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground">
              Principal Software Engineer
            </p>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            9+ years building enterprise mobile and web applications. Leading Flutter development
            for ERP systems. Specialized in clean architecture and AI-assisted development.
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
              href="https://github.com/cruzleedan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/dan-lee-de-la-cruz"
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
