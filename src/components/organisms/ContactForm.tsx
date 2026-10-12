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

const labelClasses = 'text-sm font-medium text-foreground';
const errorClasses = 'text-sm text-destructive';

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
      <div className="surface-card px-6 py-12 text-center">
        <svg
          className="mx-auto mb-4 h-16 w-16 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="t-h3 mb-2">Message Sent!</h2>
        <p className="mb-6 text-muted-foreground" role="status">
          {submitResult.message}
        </p>
        <Button
          variant="primary"
          onClick={() => {
            setIsSubmitted(false);
            setSubmitResult(null);
          }}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <div>
      {submitResult && submitResult.status === 'error' && (
        <div
          role="alert"
          className="mb-4 rounded-tile border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {submitResult.message}
        </div>
      )}

      <div className="surface-card p-6 sm:p-8">
        <form
          id="mu-contact__form__form--primary"
          onSubmit={handleSubmit}
          noValidate
          className="space-y-6"
        >
          <div className="space-y-2">
            <label htmlFor="contact-name" className={labelClasses}>
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
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
              className={`field ${errors.name ? 'border-destructive' : ''}`}
            />
            {errors.name && (
              <p id="contact-name-error" className={errorClasses}>
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="contact-email" className={labelClasses}>
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
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
              className={`field ${errors.email ? 'border-destructive' : ''}`}
            />
            {errors.email && (
              <p id="contact-email-error" className={errorClasses}>
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="contact-company" className={labelClasses}>
              Company
            </label>
            <input
              id="contact-company"
              name="company"
              type="text"
              placeholder="Your company (optional)"
              value={values.company}
              onChange={handleChange}
              className="field"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contact-message" className={labelClasses}>
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
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? 'contact-message-error' : 'contact-message-hint'}
              className={`field ${errors.message ? 'border-destructive' : ''}`}
            />
            {errors.message ? (
              <p id="contact-message-error" className={errorClasses}>
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
            className="w-full"
          >
            {isSubmitting ? (
              <span>Sending...</span>
            ) : (
              <>
                <Send aria-hidden="true" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
