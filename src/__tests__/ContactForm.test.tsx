import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactForm from '@/components/organisms/ContactForm';

const trackEventMock = jest.fn();

jest.mock('@/lib/analytics', () => ({
  trackEvent: (...args: unknown[]) => trackEventMock(...args),
}));

describe('ContactForm', () => {
  beforeEach(() => {
    trackEventMock.mockClear();
    (global as any).fetch = jest.fn();
  });

  it('shows validation errors when required fields are missing', async () => {
    render(<ContactForm />);

    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/message is required/i)).toBeInTheDocument();

    expect((global as any).fetch).not.toHaveBeenCalled();
    expect(trackEventMock).toHaveBeenCalledWith('contact_submit_failure',
      expect.objectContaining({ actionId: 'act-contact__form__submit-contact', reason: 'client_validation_error' })
    );
  });

  it('submits successfully when form is valid', async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        status: 'ok',
        message: 'Thank you for reaching out. I will get back to you soon.',
      }),
    });

    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'This is a message with enough length.' },
    });

    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/thank you for reaching out/i)).toBeInTheDocument();
    });

    expect((global as any).fetch).toHaveBeenCalledTimes(1);
    expect(trackEventMock).toHaveBeenCalledWith(
      'contact_submit_success',
      expect.objectContaining({ actionId: 'act-contact__form__submit-contact' })
    );
  });
});
