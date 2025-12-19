import type { Metadata } from 'next';
import ContactForm from '@/components/organisms/ContactForm';

export const metadata: Metadata = {
  title: 'Contact – Muhammad Umer',
  description: 'Get in touch with Muhammad Umer about backend, cloud, React, or blockchain roles and projects.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <ContactForm />
    </div>
  );
}
