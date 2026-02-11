'use client';

import * as React from 'react';
import { Send } from 'lucide-react';
import Button from '@/components/atoms/Button';
import VisuallyHidden from '@/components/atoms/VisuallyHidden';
import { trackEvent } from '@/lib/analytics';

interface ContactFormState {
  name: string;
  email: string;
  company: string;
  message: string;
}

interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface SubmitResult {
  status: 'ok' | 'error';
  message: string;
}

const initialState: ContactFormState = {
  name: '',
  email: '',
  company: '',
  message: '',
};

const MIN_MESSAGE_LENGTH = 20;

const ContactForm: React.FC = () => {
  const [values, setValues] = React.useState<ContactFormState>(initialState);
  const [errors, setErrors] = React.useState<ContactFormErrors>({});
  const [submitResult, setSubmitResult] = React.useState<SubmitResult | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const validate = React.useCallback((state: ContactFormState): ContactFormErrors => {
    const nextErrors: ContactFormErrors = {};
    const trimmedName = state.name.trim();
    const trimmedEmail = state.email.trim();
    const trimmedMessage = state.message.trim();

    if (!trimmedName) {
      nextErrors.name = 'Name is required.';
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!trimmedMessage) {
      nextErrors.message = 'Message is required.';
    } else if (trimmedMessage.length < MIN_MESSAGE_LENGTH) {
      nextErrors.message = `Message must be at least ${MIN_MESSAGE_LENGTH} characters.`;
    }

    return nextErrors;
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const company = (form.elements.namedItem('company') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      trackEvent('contact_submit_failure', {
        actionId: 'act-contact__form__submit-contact',
        reason: 'client_validation_error',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          message,
          actionId: 'act-contact__form__submit-contact',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitResult({ status: 'ok', message: data.message ?? 'Thank you for reaching out. I will get back to you soon.' });
        trackEvent('contact_submit_success', {
          actionId: 'act-contact__form__submit-contact',
        });
        setIsSubmitted(true);
        form.reset();
      } else {
        setSubmitResult({ status: 'error', message: data.message ?? 'Something went wrong. Please try again.' });
        trackEvent('contact_submit_failure', {
          actionId: 'act-contact__form__submit-contact',
          reason: data.code ?? 'server_error',
        });
      }
    } catch {
      setSubmitResult({ status: 'error', message: 'Network error. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted && submitResult?.status === 'ok') {
    return (
      <section
        id="mu-contact__form__section--primary"
        className="py-20"
      >
        <div className="mx-auto w-full max-w-xl px-4 md:px-6">
          <div className="animate-fade-in-up text-center py-12 px-6 rounded-xl border border-border bg-card">
            <svg className="w-16 h-16 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
            <p className="text-muted-foreground mb-6">
              {submitResult.message}
            </p>
            <Button
              variant="primary"
              onClick={() => { setIsSubmitted(false); setSubmitResult(null); }}
            >
              Send Another Message
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="mu-contact__form__section--primary"
      className="py-20"
    >
      <div className="mx-auto w-full max-w-xl px-4 md:px-6">
        <div className="animate-fade-in-up mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Contact</h1>
          <p className="text-muted-foreground text-lg">
            Share a bit about what you are hiring for, timelines, and how I can help. I will reply as soon as I can.
          </p>
        </div>

        {submitResult && submitResult.status === 'error' && (
          <div
            role="alert"
            className="mb-4 rounded-md p-3 text-sm bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          >
            {submitResult.message}
          </div>
        )}

        <div className="animate-fade-in-up rounded-xl border border-border bg-card p-6 sm:p-8" style={{ animationDelay: '0.2s' }}>
          <form
            id="mu-contact__form__form--primary"
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6"
          >
            <div className="space-y-2">
              <label htmlFor="contact-name" className="text-sm font-medium text-foreground">
                Name <span aria-hidden="true">*</span>
                <VisuallyHidden>(required)</VisuallyHidden>
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder="Your name"
                required
                value={values.name}
                onChange={handleChange}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                className={`h-10 w-full rounded-md border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                  errors.name ? 'border-destructive' : 'border-border'
                }`}
              />
              {errors.name && (
                <p id="contact-name-error" className="text-sm text-destructive">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-email" className="text-sm font-medium text-foreground">
                Email <span aria-hidden="true">*</span>
                <VisuallyHidden>(required)</VisuallyHidden>
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                value={values.email}
                onChange={handleChange}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                className={`h-10 w-full rounded-md border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                  errors.email ? 'border-destructive' : 'border-border'
                }`}
              />
              {errors.email && (
                <p id="contact-email-error" className="text-sm text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-company" className="text-sm font-medium text-foreground">
                Company
              </label>
              <input
                id="contact-company"
                name="company"
                type="text"
                placeholder="Your company (optional)"
                value={values.company}
                onChange={handleChange}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
                Message <span aria-hidden="true">*</span>
                <VisuallyHidden>(required)</VisuallyHidden>
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                placeholder="Tell me about your project or opportunity..."
                required
                value={values.message}
                onChange={handleChange}
                aria-describedby={errors.message ? 'contact-message-error' : 'contact-message-hint'}
                className={`w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                  errors.message ? 'border-destructive' : 'border-border'
                }`}
              />
              {errors.message ? (
                <p id="contact-message-error" className="text-sm text-destructive">
                  {errors.message}
                </p>
              ) : (
                <p id="contact-message-hint" className="text-xs text-muted-foreground">
                  Please include enough context so I can respond with something useful.
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              id="mu-contact__form__btn--submit"
              actionId="act-contact__form__submit-contact"
              className="w-full shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {isSubmitting ? (
                <span>Sending...</span>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
