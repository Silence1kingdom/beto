import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '@/components/SectionLabel';
import NeonButton from '@/components/NeonButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { firestoreService } from '@/lib/firebase-firestore';

gsap.registerPlugin(ScrollTrigger);

const inputClassName =
  'w-full h-12 px-4 rounded-md bg-void-black/60 border border-electric-cyan/15 text-white font-inter text-[0.9rem] placeholder:text-white/25 outline-none transition-all duration-250 focus:border-electric-cyan focus:shadow-[0_0_12px_rgba(0,240,255,0.15)]';

export default function ContactSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [submitState, setSubmitState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        [labelRef.current, headingRef.current, subtextRef.current],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: section, start: 'top 80%' } }
      );

      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: formRef.current, start: 'top 85%' } }
        );

        const fields = formRef.current.querySelectorAll('.form-field');
        gsap.fromTo(
          fields,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: formRef.current, start: 'top 80%' } }
        );
      }
    }, section);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value?.trim();
    const email = emailRef.current?.value?.trim();
    const message = messageRef.current?.value?.trim();
    if (!name || !email || !message) return;

    setSubmitState('sending');

    const msg = {
      name,
      email,
      subject: `Message from ${name}`,
      message,
      date: new Date().toISOString().split('T')[0],
      read: false,
    };

    try {
      await firestoreService.addMessage(msg);
    } catch {
      setSubmitState('error');
      setTimeout(() => setSubmitState('idle'), 3000);
      return;
    }

    const existing = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    existing.unshift({ id: Date.now(), ...msg });
    localStorage.setItem('contact_messages', JSON.stringify(existing));

    setSubmitState('sent');

    if (nameRef.current) nameRef.current.value = '';
    if (emailRef.current) emailRef.current.value = '';
    if (messageRef.current) messageRef.current.value = '';

    setTimeout(() => setSubmitState('idle'), 2000);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative z-20"
      style={{ background: 'radial-gradient(ellipse at 50% 70%, rgba(0, 240, 255, 0.06) 0%, transparent 60%)' }}
    >
      <div className="max-w-[640px] mx-auto section-padding text-center">
        <div ref={labelRef} className="opacity-0 flex justify-center">
          <SectionLabel text={t('contact.label')} centered />
        </div>

        <h2
          ref={headingRef}
          className="font-space font-bold text-white leading-[1.0] tracking-[-0.03em] mb-4 opacity-0"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
        >
          {t('contact.heading')}
        </h2>

        <p
          ref={subtextRef}
          className="font-inter text-white/55 mb-12 opacity-0"
          style={{ fontSize: 'clamp(0.875rem, 1vw, 1rem)', lineHeight: 1.7 }}
        >
          {t('contact.subtext')}
        </p>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="max-w-[560px] mx-auto rounded-xl p-10 text-left opacity-0"
          style={{
            background: 'rgba(10, 14, 26, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 240, 255, 0.15)',
          }}
        >
          <div className="form-field mb-6">
            <label className="block text-white/50 text-[0.7rem] font-inter font-medium tracking-[0.15em] uppercase mb-2">
              {t('contact.name')}
            </label>
            <input
              ref={nameRef}
              type="text"
              placeholder={t('contact.name_placeholder')}
              className={inputClassName}
              required
            />
          </div>

          <div className="form-field mb-6">
            <label className="block text-white/50 text-[0.7rem] font-inter font-medium tracking-[0.15em] uppercase mb-2">
              {t('contact.email')}
            </label>
            <input
              ref={emailRef}
              type="email"
              placeholder={t('contact.email_placeholder')}
              className={inputClassName}
              required
            />
          </div>

          <div className="form-field mb-8">
            <label className="block text-white/50 text-[0.7rem] font-inter font-medium tracking-[0.15em] uppercase mb-2">
              {t('contact.message')}
            </label>
            <textarea
              ref={messageRef}
              placeholder={t('contact.message_placeholder')}
              rows={5}
              className={`${inputClassName} h-auto py-4 resize-y`}
              required
            />
          </div>

          <div className="form-field">
            <NeonButton type="submit" className="w-full" disabled={submitState !== 'idle'}>
              {submitState === 'idle' && t('contact.send')}
              {submitState === 'sending' && t('contact.sending')}
              {submitState === 'sent' && (
                <span className="text-green-400">{t('contact.sent')}</span>
              )}
              {submitState === 'error' && (
                <span className="text-red-400">{t('contact.error')}</span>
              )}
            </NeonButton>
          </div>
        </form>
      </div>
    </section>
  );
}
