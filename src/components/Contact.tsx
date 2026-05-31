import { useState } from 'react'
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, Github, Linkedin, Loader2 } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (submitStatus !== 'idle') setSubmitStatus('idle')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    const subject = encodeURIComponent(`Portfolio Contact: ${formData.name}`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )

    try {
      window.location.href = `mailto:cruzleedan@gmail.com?subject=${subject}&body=${body}`
      setSubmitStatus('success')
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' })
        setSubmitStatus('idle')
      }, 3000)
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="relative py-28 bg-background overflow-hidden">
      {/* Background */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container px-6 mx-auto max-w-5xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Available for opportunities
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground font-heading mb-4">
            Let's build something{' '}
            <span className="gradient-text">great</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            I'm always open to new opportunities and interesting projects. Drop me a message!
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-foreground font-heading mb-5">Contact Details</h3>
              <div className="space-y-4">
                <a
                  href="mailto:cruzleedan@gmail.com"
                  className="group flex items-center gap-4 p-4 rounded-xl border border-white/8 bg-card/40 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">Email</div>
                    <div className="text-sm font-semibold text-foreground group-hover:text-emerald-400 transition-colors duration-200">
                      cruzleedan@gmail.com
                    </div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-xl border border-white/8 bg-card/40 cursor-default">
                  <div className="w-10 h-10 rounded-lg bg-slate-500/15 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">Location</div>
                    <div className="text-sm font-semibold text-foreground">Remote</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Find me on</h3>
              <div className="flex gap-3">
                <a
                  href="https://github.com/cruzleedan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-xl border border-white/8 bg-card/40 text-slate-400 hover:text-white hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all duration-200 cursor-pointer"
                  aria-label="GitHub"
                >
                  <Github size={18} />
                </a>
                <a
                  href="https://www.linkedin.com/in/dan-lee-de-la-cruz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-xl border border-white/8 bg-card/40 text-slate-400 hover:text-white hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all duration-200 cursor-pointer"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="p-6 rounded-2xl border border-white/8 bg-card/40 backdrop-blur-sm space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-white/8 bg-background/60 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                    placeholder="Dan Lee"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-white/8 bg-background/60 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-white/8 bg-background/60 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              {submitStatus === 'success' && (
                <div className="flex items-center gap-3 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm">Your email client will open with the message pre-filled!</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="flex items-center gap-3 text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm">Something went wrong. Please email me directly at cruzleedan@gmail.com</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-emerald-500/25"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Opening email client...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
