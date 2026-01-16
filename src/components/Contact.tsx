import { Button } from '@/components/ui/button'
import { Mail, MapPin, Phone } from 'lucide-react'

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-muted/20">
      <div className="container px-4 mx-auto max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Get In Touch
        </h2>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          I'm always open to new opportunities and interesting projects. Let's connect!
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold mb-1">Email</p>
                <a href="mailto:alex@example.com" className="text-muted-foreground hover:text-primary transition-colors">
                  alex@example.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold mb-1">Phone</p>
                <a href="tel:+15551234567" className="text-muted-foreground hover:text-primary transition-colors">
                  +1 (555) 123-4567
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold mb-1">Location</p>
                <p className="text-muted-foreground">
                  San Francisco, CA
                </p>
              </div>
            </div>
          </div>

          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
