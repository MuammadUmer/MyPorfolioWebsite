import { POST } from '@/app/api/contact/route';

async function readJson(response: Response) {
  return response.json() as Promise<any>;
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
