import { getProfile } from '@/lib/services/content';

export interface ContactMessage {
  name: string;
  email: string;
  company: string | null;
  message: string;
}

export type SendResult =
  | { ok: true }
  | { ok: false; reason: 'not-configured' | 'provider-error' };

type Env = Record<string, string | undefined>;

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
/** Resend's shared test sender: works with no domain, but only delivers to the Resend account owner. */
const DEFAULT_FROM = 'Portfolio Contact <onboarding@resend.dev>';

const singleLine = (value: string) => value.replace(/[\r\n]+/g, ' ').trim();

/** Where messages go: `CONTACT_TO_EMAIL`, otherwise the email on the profile. */
export function getRecipient(env: Env = process.env): string {
  const configured = env.CONTACT_TO_EMAIL?.trim();
  if (configured) return configured;
  return getProfile().links.email.replace(/^mailto:/i, '');
}

/**
 * Sends a contact-form message through Resend's REST API (no SDK dependency).
 * Configure with `RESEND_API_KEY`, optionally `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL`.
 * Plain-text body only, so visitor input is never interpreted as HTML.
 */
export async function sendContactEmail(
  contact: ContactMessage,
  env: Env = process.env,
  fetchImpl?: typeof fetch
): Promise<SendResult> {
  const apiKey = env.RESEND_API_KEY?.trim();
  if (!apiKey) return { ok: false, reason: 'not-configured' };

  const lines = [
    `Name: ${singleLine(contact.name)}`,
    `Email: ${singleLine(contact.email)}`,
    `Company: ${contact.company ? singleLine(contact.company) : '-'}`,
    '',
    contact.message,
  ];

  try {
    const response = await (fetchImpl ?? fetch)(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL?.trim() || DEFAULT_FROM,
        to: [getRecipient(env)],
        reply_to: singleLine(contact.email),
        subject: `Portfolio message from ${singleLine(contact.name)}`,
        text: lines.join('\n'),
      }),
    });

    if (!response.ok) {
      console.error('[contact] Resend rejected the message', response.status, await response.text());
      return { ok: false, reason: 'provider-error' };
    }
    // Log Resend's email id and recipient so a "never arrived" report can be traced in Resend -> Emails.
    const id = await response.text().then((text) => (JSON.parse(text) as { id?: string }).id, () => undefined);
    console.info(`[contact] accepted by Resend (id: ${id ?? 'unknown'}) -> ${getRecipient(env)}`);
    return { ok: true };
  } catch (error) {
    console.error('[contact] could not reach Resend', error);
    return { ok: false, reason: 'provider-error' };
  }
}
