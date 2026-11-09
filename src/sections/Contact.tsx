import { AnimatePresence, m } from 'framer-motion';
import { ArrowUpRight, Check, Copy, LoaderCircle, Mail, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { SocialIcon } from '../components/BrandIcons';
import { Reveal, SectionHeading } from '../components/Reveal';
import { emailjsConfig } from '../config/site';
import { profile, socials } from '../data/profile';
import { useApp } from '../lib/app-context';
import { cn, copyText } from '../lib/utils';

type Status = 'idle' | 'sending' | 'sent' | 'error';
type Form = { from_name: string; from_email: string; subject: string; message: string };
const empty: Form = { from_name: '', from_email: '', subject: '', message: '' };

const fieldCls =
  'w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-fg placeholder:text-subtle transition-colors outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 focus-visible:outline-none';

export function Contact() {
  const { toast } = useApp();
  const [form, setForm] = useState<Form>(empty);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(form.subject || 'Hello from your portfolio')}&body=${encodeURIComponent(
    form.message ? `${form.message}\n\n${form.from_name}` : '',
  )}`;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.from_name.trim() || !form.from_email.trim() || !form.message.trim()) {
      setStatus('error');
      setError('Please fill in your name, email and message.');
      return;
    }
    setStatus('sending');
    setError('');
    try {
      // Loaded on demand so the EmailJS SDK is not part of the initial bundle.
      const emailjs = (await import('@emailjs/browser')).default;
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        {
          from_name: form.from_name.trim(),
          from_email: form.from_email.trim(),
          subject: form.subject.trim() || 'No Subject',
          message: form.message.trim(),
        },
        { publicKey: emailjsConfig.publicKey },
      );
      setStatus('sent');
      setForm(empty);
    } catch {
      setStatus('error');
      setError('The message could not be sent right now. Please use the email link instead.');
    }
  };

  const onCopy = async () => {
    const ok = await copyText(profile.email);
    if (ok) {
      setCopied(true);
      toast('Email copied to clipboard');
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <SectionHeading id="contact" eyebrow="Contact" title={<>Let’s build something <span className="text-gradient">great</span>.</>}>
        Opportunities, collaborations, or just to say hello. My inbox is open.
      </SectionHeading>

      <div className="grid gap-5 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <div className="card flex h-full flex-col gap-6 overflow-hidden p-6 sm:p-7">
            <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative">
              <p className="font-mono text-xs tracking-widest text-subtle uppercase">Email</p>
              <a href={`mailto:${profile.email}`} className="mt-2 block font-display text-lg font-semibold break-all hover:text-accent sm:text-xl">
                {profile.email}
              </a>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onCopy}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface-2 px-4 text-sm font-medium transition-colors hover:border-accent/50"
                >
                  {copied ? <Check size={16} className="text-emerald-400" aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                  {copied ? 'Copied' : 'Copy email'}
                </button>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface-2 px-4 text-sm font-medium transition-colors hover:border-accent/50"
                >
                  <Mail size={16} aria-hidden="true" /> Open mail app
                </a>
              </div>
            </div>
            <div className="relative">
              <p className="font-mono text-xs tracking-widest text-subtle uppercase">Elsewhere</p>
              <ul className="mt-3 space-y-2">
                {socials
                  .filter((s) => s.key !== 'email')
                  .map((s) => (
                    <li key={s.key}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 transition-colors hover:border-accent/50"
                      >
                        <SocialIcon k={s.key} size={18} />
                        <span className="flex-1">
                          <span className="block text-sm font-medium">{s.label}</span>
                          <span className="block text-xs text-subtle">{s.handle}</span>
                        </span>
                        <ArrowUpRight size={16} className="text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
            <p className="relative mt-auto text-sm text-subtle">Based in {profile.location}. Usually replies within a day or two.</p>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-3" delay={0.08}>
          <form onSubmit={onSubmit} noValidate className="card flex h-full flex-col gap-4 p-6 sm:p-7" aria-describedby="contact-status">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="c-name" className="mb-1.5 block text-sm font-medium">
                  Name <span className="text-accent-3" aria-hidden="true">*</span>
                </label>
                <input id="c-name" name="from_name" autoComplete="name" required value={form.from_name} onChange={set('from_name')} className={fieldCls} placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="c-email" className="mb-1.5 block text-sm font-medium">
                  Email <span className="text-accent-3" aria-hidden="true">*</span>
                </label>
                <input
                  id="c-email"
                  name="from_email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.from_email}
                  onChange={set('from_email')}
                  className={fieldCls}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="c-subject" className="mb-1.5 block text-sm font-medium">
                Subject
              </label>
              <input id="c-subject" name="subject" value={form.subject} onChange={set('subject')} className={fieldCls} placeholder="What’s it about?" />
            </div>
            <div className="flex flex-1 flex-col">
              <label htmlFor="c-message" className="mb-1.5 block text-sm font-medium">
                Message <span className="text-accent-3" aria-hidden="true">*</span>
              </label>
              <textarea
                id="c-message"
                name="message"
                required
                rows={6}
                value={form.message}
                onChange={set('message')}
                className={cn(fieldCls, 'min-h-36 flex-1 resize-y')}
                placeholder="Hi Vamsi, …"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-fg px-6 text-sm font-semibold text-bg shadow-[0_10px_40px_-12px] shadow-accent/70 transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {status === 'sending' ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
              <a href={mailto} className="text-sm text-muted underline-offset-4 hover:text-fg hover:underline">
                or email me directly
              </a>
            </div>

            <div id="contact-status" role="status" aria-live="polite" className="min-h-6">
              <AnimatePresence mode="wait">
                {status === 'sent' && (
                  <m.p key="ok" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-sm text-emerald-500">
                    <Check size={16} aria-hidden="true" /> Thanks! Your message is on its way. I’ll get back to you soon.
                  </m.p>
                )}
                {status === 'error' && (
                  <m.p key="err" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-rose-500">
                    {error}{' '}
                    <a href={mailto} className="font-medium underline">
                      Email {profile.email}
                    </a>
                  </m.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
