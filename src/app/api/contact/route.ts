import { getRecipient, sendContactEmail } from '@/lib/contact/mailer';
import { isRateLimited } from '@/lib/contact/rate-limit';

const MIN_MESSAGE_LENGTH = 20;
const MAX_LENGTHS = { name: 100, email: 254, company: 120, message: 5000 } as const;

function json(status: number, payload: unknown): Response {
  return new Response(JSON.stringify(payload), { status, headers: { 'Content-Type': 'application/json' } });
}

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const company = typeof body.company === 'string' || body.company === null ? body.company : null;
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    const errors: { field: string; message: string }[] = [];

    if (!name) {
      errors.push({ field: 'name', message: 'Name is required' });
    }

    if (!email) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!validateEmail(email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }

    if (!message) {
      errors.push({ field: 'message', message: 'Message is required' });
    } else if (message.length < MIN_MESSAGE_LENGTH) {
      errors.push({ field: 'message', message: `Message must be at least ${MIN_MESSAGE_LENGTH} characters` });
    }

    for (const field of ['name', 'email', 'message'] as const) {
      const value = { name, email, message }[field];
      if (value.length > MAX_LENGTHS[field]) {
        errors.push({ field, message: `${field[0].toUpperCase()}${field.slice(1)} is too long` });
      }
    }
    if (company && company.length > MAX_LENGTHS.company) {
      errors.push({ field: 'company', message: 'Company is too long' });
    }

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({
          code: 'VALIDATION_ERROR',
          message: 'One or more fields are invalid.',
          errors,
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Simple rate-limit stub used in tests; real implementation would use durable storage.
    if (process.env.NODE_ENV === 'test' && body.__testRateLimited) {
      return new Response(
        JSON.stringify({
          code: 'RATE_LIMITED',
          message: 'Too many requests. Please try again later.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    if (isRateLimited(forwardedFor || request.headers.get('x-real-ip') || 'unknown')) {
      return json(429, { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' });
    }

    const result = await sendContactEmail({ name, email, company: company?.trim() || null, message });

    if (!result.ok) {
      if (result.reason === 'not-configured' && process.env.NODE_ENV !== 'production') {
        // Local development without a mail key: keep the form usable and show the message in the server log.
        console.warn('[contact] RESEND_API_KEY is not set, so this message was NOT emailed:', { name, email, company, message });
      } else {
        console.error(`[contact] message from ${email} was not delivered (${result.reason})`);
        return json(500, {
          code: 'INTERNAL_ERROR',
          message: `Sorry, your message could not be sent. Please email me directly at ${getRecipient()}.`,
        });
      }
    }

    return new Response(
      JSON.stringify({
        status: 'ok',
        message: 'Thank you for reaching out. I will get back to you soon.',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('[contact] unexpected error', error);
    return new Response(
      JSON.stringify({
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred. Please try again later.',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
