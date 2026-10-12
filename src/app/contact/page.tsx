import type { Metadata } from 'next';
import ContactSection from '@/components/organisms/ContactSection';
import { getProfile } from '@/lib/services/content';
import { getCanonicalUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Contact – Muhammad Umer',
  description: 'Get in touch with Muhammad Umer about backend, cloud, React, or blockchain roles and projects.',
  alternates: { canonical: getCanonicalUrl('/contact') },
};

export default function ContactPage() {
  return <ContactSection page="contact" profile={getProfile()} />;
}
