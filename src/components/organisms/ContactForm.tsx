'use client';

import * as React from 'react';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
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
  const [formError, setFormError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validate = React.useCallback((state: ContactFormState): ContactFormErrors => {
    const nextErrors: ContactFormErrors = {};
    const trimmedName = state.name.trim();
    const trimmedEmail = state.email.trim();
    const trimmedMessage = state.message.trim();

    if (!trimmedName) {
      nextErrors.name = 'Name is required';
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Please enter a valid email address';
    }

    if (!trimmedMessage) {
      nextErrors.message = 'Message is required';
    } else if (trimmedMessage.length < MIN_MESSAGE_LENGTH) {
      nextErrors.message = `Message must be at least ${MIN_MESSAGE_LENGTH} characters`;
    }

    return nextErrors;
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      trackEvent('contact_submit_failure', {
        actionId: 'act-contact__form__submit-contact',
        reason: 'client_validation_error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          company: values.company.trim() || null,
          message: values.message.trim(),
          actionId: 'act-contact__form__submit-contact',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const code = (data && data.code) || 'INTERNAL_ERROR';
        setFormError(data && data.message ? data.message : 'Something went wrong. Please try again.');
        trackEvent('contact_submit_failure', {
          actionId: 'act-contact__form__submit-contact',
          status: response.status,
          code,
        });
        return;
      }

      setValues(initialState);
      setErrors({});
      setSuccessMessage(data && data.message ? data.message : 'Thank you for your message.');
      trackEvent('contact_submit_success', {
        actionId: 'act-contact__form__submit-contact',
      });
    } catch (error) {
      setFormError('Something went wrong. Please try again.');
      trackEvent('contact_submit_failure', {
        actionId: 'act-contact__form__submit-contact',
        reason: 'network_error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="mu-contact__form__section--primary"
      className="mx-auto w-full max-w-2xl rounded-xl border border-border bg-background/80 px-4 py-8 md:px-6"
      aria-labelledby="mu-contact__form__heading--title"
    >
      <Heading as="h1" id="mu-contact__form__heading--title" className="text-2xl font-semibold md:text-3xl">
        Contact
      </Heading>
      <Text muted className="mt-2 text-sm md:text-base">
        Share a bit about what you are hiring for, timelines, and how I can help. I will reply as soon as I can.
      </Text>

      <form className="mt-6 space-y-5" noValidate onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label
            htmlFor="mu-contact__form__field--name"
            className="text-sm font-medium text-foreground"
          >
            Name
          </label>
          <input
            id="mu-contact__form__field--name"
            name="name"
            type="text"
            autoComplete="name"
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground"
            value={values.name}
            onChange={handleChange}
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? 'mu-contact__form__error--name' : undefined}
          />
          {errors.name && (
            <p
              id="mu-contact__form__error--name"
              className="text-xs text-red-600"
            >
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="mu-contact__form__field--email"
            className="text-sm font-medium text-foreground"
          >
            Email
          </label>
          <input
            id="mu-contact__form__field--email"
            name="email"
            type="email"
            autoComplete="email"
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground"
            value={values.email}
            onChange={handleChange}
            aria-invalid={errors.email ? 'true' : undefined}
            aria-describedby={errors.email ? 'mu-contact__form__error--email' : undefined}
          />
          {errors.email && (
            <p
              id="mu-contact__form__error--email"
              className="text-xs text-red-600"
            >
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="mu-contact__form__field--company"
            className="text-sm font-medium text-foreground"
          >
            Company (optional)
          </label>
          <input
            id="mu-contact__form__field--company"
            name="company"
            type="text"
            autoComplete="organization"
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground"
            value={values.company}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="mu-contact__form__field--message"
            className="text-sm font-medium text-foreground"
          >
            Message
          </label>
          <textarea
            id="mu-contact__form__field--message"
            name="message"
            rows={5}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            value={values.message}
            onChange={handleChange}
            aria-invalid={errors.message ? 'true' : undefined}
            aria-describedby={errors.message ? 'mu-contact__form__error--message' : undefined}
          />
          <Text muted className="text-xs">
            Please include enough context so I can respond with something useful.
          </Text>
          {errors.message && (
            <p
              id="mu-contact__form__error--message"
              className="text-xs text-red-600"
            >
              {errors.message}
            </p>
          )}
        </div>

        {formError && (
          <p className="text-sm text-red-600" role="alert">
            {formError}
          </p>
        )}

        {successMessage && (
          <p className="text-sm text-green-700" role="status">
            {successMessage}
          </p>
        )}

        <div className="mt-4 flex items-center gap-3">
          <Button
            id="mu-contact__form__btn--submit"
            actionId="act-contact__form__submit-contact"
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending…' : 'Send message'}
          </Button>

          <VisuallyHidden>
            <span aria-live="polite">
              {isSubmitting ? 'Sending message' : successMessage || formError || ''}
            </span>
          </VisuallyHidden>
        </div>
      </form>
    </section>
  );
};

export default ContactForm;
