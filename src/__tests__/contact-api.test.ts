import { POST } from '@/app/api/contact/route';

async function readJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

describe('POST /api/contact', () => {
  it('returns validation error when fields are missing or invalid', async () => {
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: '',
        email: 'not-an-email',
        message: 'short',
        actionId: 'act-contact__form__submit-contact',
      }),
    });

    const response = await POST(request);
    const body = await readJson(response);

    expect(response.status).toBe(400);
    expect(body.code).toBe('VALIDATION_ERROR');
    expect(Array.isArray(body.errors)).toBe(true);
  });

  it('returns ok for valid payload', async () => {
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Acme',
        message: 'This is a valid message with enough length.',
        actionId: 'act-contact__form__submit-contact',
      }),
    });

    const response = await POST(request);
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body.status).toBe('ok');
  });

  it('reports a failure (instead of pretending success) when production has no mail key', async () => {
    const env = process.env as Record<string, string | undefined>;
    const previous = { node: env.NODE_ENV, key: env.RESEND_API_KEY };
    env.NODE_ENV = 'production';
    delete env.RESEND_API_KEY;
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      const response = await POST(
        new Request('http://localhost/api/contact', {
          method: 'POST',
          headers: { 'x-forwarded-for': '9.9.9.9' },
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            message: 'This is a valid message with enough length.',
            actionId: 'act-contact__form__submit-contact',
          }),
        })
      );
      const body = await readJson(response);
      expect(response.status).toBe(500);
      expect(body.code).toBe('INTERNAL_ERROR');
      expect(String(body.message)).toMatch(/@/);
    } finally {
      env.NODE_ENV = previous.node;
      if (previous.key !== undefined) env.RESEND_API_KEY = previous.key;
      spy.mockRestore();
    }
  });

  it('rejects over-long messages', async () => {
    const response = await POST(
      new Request('http://localhost/api/contact', {
        method: 'POST',
        body: JSON.stringify({ name: 'John', email: 'john@example.com', message: 'x'.repeat(5001) }),
      })
    );
    expect(response.status).toBe(400);
  });

  it('can return RATE_LIMITED in test mode', async () => {
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a valid message with enough length.',
        actionId: 'act-contact__form__submit-contact',
        __testRateLimited: true,
      }),
    });

    const response = await POST(request);
    const body = await readJson(response);

    expect(response.status).toBe(429);
    expect(body.code).toBe('RATE_LIMITED');
  });
});
