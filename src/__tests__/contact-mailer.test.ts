import { getRecipient, sendContactEmail } from '@/lib/contact/mailer';
import { isRateLimited, resetRateLimit } from '@/lib/contact/rate-limit';

const contact = {
  name: 'Jane\r\nBcc: spy@example.com',
  email: 'jane@example.com',
  company: 'Acme',
  message: 'Hello, I would like to talk about a project.',
};

// jsdom's Response mock has no `ok`/`text`, so fake the parts of fetch's result the mailer reads.
const reply = (status: number, body = '{}') => ({ ok: status < 400, status, text: async () => body });
const okFetch = () => jest.fn().mockResolvedValue(reply(200));

describe('sendContactEmail', () => {
  it('reports "not-configured" when there is no API key', async () => {
    const fetchImpl = okFetch();
    await expect(sendContactEmail(contact, {}, fetchImpl)).resolves.toEqual({ ok: false, reason: 'not-configured' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('posts a plain-text email to Resend with a reply-to and a single-line subject', async () => {
    const fetchImpl = okFetch();
    const result = await sendContactEmail(
      contact,
      { RESEND_API_KEY: 're_test', CONTACT_TO_EMAIL: 'me@example.com', CONTACT_FROM_EMAIL: 'Site <hi@example.com>' },
      fetchImpl
    );

    expect(result).toEqual({ ok: true });
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.headers.Authorization).toBe('Bearer re_test');
    const payload = JSON.parse(init.body);
    expect(payload).toMatchObject({ from: 'Site <hi@example.com>', to: ['me@example.com'], reply_to: 'jane@example.com' });
    expect(payload.subject).not.toMatch(/[\r\n]/);
    expect(payload.text).toContain('Hello, I would like to talk about a project.');
    expect(payload.html).toBeUndefined();
  });

  it('falls back to the profile email and the Resend test sender', async () => {
    const fetchImpl = okFetch();
    await sendContactEmail(contact, { RESEND_API_KEY: 're_test' }, fetchImpl);
    const payload = JSON.parse(fetchImpl.mock.calls[0][1].body);
    expect(payload.to).toEqual([getRecipient({})]);
    expect(payload.to[0]).toMatch(/@/);
    expect(payload.from).toContain('onboarding@resend.dev');
  });

  it('reports a provider error when Resend rejects or is unreachable', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const rejected = jest.fn().mockResolvedValue(reply(403, '{"message":"bad"}'));
    await expect(sendContactEmail(contact, { RESEND_API_KEY: 're_test' }, rejected)).resolves.toEqual({
      ok: false,
      reason: 'provider-error',
    });
    const offline = jest.fn().mockRejectedValue(new Error('offline'));
    await expect(sendContactEmail(contact, { RESEND_API_KEY: 're_test' }, offline)).resolves.toEqual({
      ok: false,
      reason: 'provider-error',
    });
    spy.mockRestore();
  });
});

describe('isRateLimited', () => {
  beforeEach(() => resetRateLimit());

  it('allows 5 requests per window per key, then blocks until the window passes', () => {
    const t0 = 1_000_000;
    for (let i = 0; i < 5; i += 1) expect(isRateLimited('1.2.3.4', t0 + i)).toBe(false);
    expect(isRateLimited('1.2.3.4', t0 + 10)).toBe(true);
    expect(isRateLimited('5.6.7.8', t0 + 10)).toBe(false);
    expect(isRateLimited('1.2.3.4', t0 + 10 * 60 * 1000 + 100)).toBe(false);
  });
});
