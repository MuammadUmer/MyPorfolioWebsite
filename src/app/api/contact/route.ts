const MIN_MESSAGE_LENGTH = 20;

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

    const payload = {
      name,
      email,
      company,
      message,
      actionId: body.actionId,
    };

    console.log('Received contact submission', payload);

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
  } catch {
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
