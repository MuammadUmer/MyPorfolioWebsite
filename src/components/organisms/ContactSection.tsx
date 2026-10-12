import * as React from 'react';
import { ArrowUpRight, Download, Mail } from 'lucide-react';
import Eyebrow from '@/components/atoms/Eyebrow';
import LinkButton from '@/components/atoms/LinkButton';
import Reveal from '@/components/atoms/Reveal';
import SectionHeading from '@/components/atoms/SectionHeading';
import ContactForm from '@/components/organisms/ContactForm';
import { translate } from '@/lib/i18n/translate';
import type { Profile } from '@/lib/types/content';

export interface ContactSectionProps {
  profile: Pick<Profile, 'contactIntro' | 'links'>;
  page?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({ profile, page = 'home' }) => {
  const isHome = page === 'home';
  const idPrefix = `mu-${page}__contact`;
  const headingId = `${idPrefix}__heading--title`;

  return (
    <section
      id={isHome ? 'mu-home__contact__section--primary' : 'mu-contact__form__section--primary'}
      aria-labelledby={headingId}
      className={`notch-source ${
        isHome ? 'pt-[var(--space-section)]' : 'page-top'
      } pb-[var(--space-section-lg)]`}
    >
      <div className="container-page grid grid-cols-12 gap-x-[var(--space-gutter)] gap-y-[var(--space-stack)]">
        {isHome ? <span id="contact" className="col-span-12 block h-0" /> : null}
        <div className="col-span-12 flex flex-col gap-6 lg:col-span-6">
          <Eyebrow index="06">{translate('nav.contact')}</Eyebrow>
          <SectionHeading
            id={headingId}
            as={isHome ? 'h2' : 'h1'}
            bold={translate('section.contact.bold')}
            italic={translate('section.contact.italic')}
          />
          <Reveal as="p" className="t-lead max-w-[var(--measure)] text-muted-foreground">
            {profile.contactIntro}
          </Reveal>
          <Reveal delay={100} className="flex flex-wrap gap-3 pt-2">
            <LinkButton
              href={profile.links.email}
              variant="secondary"
              id={`${idPrefix}__link--email`}
            >
              <Mail aria-hidden="true" />
              Email
            </LinkButton>
            <LinkButton
              href={profile.links.linkedin}
              external
              variant="secondary"
              id={`${idPrefix}__link--linkedin`}
            >
              LinkedIn
              <ArrowUpRight aria-hidden="true" />
            </LinkButton>
            <LinkButton
              href={profile.links.github}
              external
              variant="secondary"
              id={`${idPrefix}__link--github`}
            >
              GitHub
              <ArrowUpRight aria-hidden="true" />
            </LinkButton>
            <LinkButton
              href={profile.links.cv}
              download={profile.links.cvDownloadName}
              variant="ghost"
              id={`${idPrefix}__link--cv`}
            >
              <Download aria-hidden="true" />
              {translate('home.hero.cta.downloadCv')}
            </LinkButton>
          </Reveal>
        </div>

        <Reveal delay={150} className="col-span-12 lg:col-span-6">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
};

export default ContactSection;
