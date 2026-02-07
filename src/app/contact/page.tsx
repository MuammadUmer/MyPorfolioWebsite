import type { Metadata } from 'next';
import ContactForm from '@/components/organisms/ContactForm';

export const metadata: Metadata = {
  title: 'Contact – Muhammad Umer',
  description: 'Get in touch with Muhammad Umer about backend, cloud, React, or blockchain roles and projects.',
};

export default function ContactPage() {
  return <ContactForm />;
}
