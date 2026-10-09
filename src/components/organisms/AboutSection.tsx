import * as React from 'react';
import { ArrowUpRight, Download } from 'lucide-react';
import Eyebrow from '@/components/atoms/Eyebrow';
import LinkButton from '@/components/atoms/LinkButton';
import Reveal from '@/components/atoms/Reveal';
import SectionHeading from '@/components/atoms/SectionHeading';
import QuickFacts from '@/components/molecules/QuickFacts';
import IdBadge from '@/components/objects/IdBadge';
import { translate } from '@/lib/i18n/translate';
import type { AboutCopy, Education, Profile } from '@/lib/types/content';

export interface AboutSectionProps {
  profile: Profile;
  copy: AboutCopy;
  education: Education[];
  projectCount: number;
  /** `home` renders an anchored section; any other value is a standalone route page. */
  page?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  profile,
  copy,
  education,
  projectCount,
  page = 'home',
}) => {
  const isHome = page === 'home';
  const idPrefix = `mu-${page}__about`;
  const headingId = `${idPrefix}__heading--title`;
  const primaryEducation = education[0];

  const facts = [
    { label: translate('about.fact.basedIn'), value: profile.location },
    { label: translate('about.fact.role'), value: profile.role },
    { label: translate('about.fact.experience'), value: `${profile.yearsExperience}+ years` },
    ...(primaryEducation
      ? [
          {
            label: translate('about.fact.education'),
            value: `${primaryEducation.degree}, ${primaryEducation.institution} (${primaryEducation.period})`,
          },
        ]
      : []),
    { label: translate('about.fact.domains'), value: profile.domains.join(', ') },
    { label: translate('about.fact.projects'), value: String(projectCount) },
  ];

  const stats = [
    { value: `${profile.yearsExperience}+`, label: translate('about.stat.years') },
    { value: `${projectCount}+`, label: translate('about.stat.projects') },
    { value: String(profile.domains.length), label: translate('about.stat.domains') },
  ];

  const glanceItems = [
    profile.role,
    profile.seniority,
    `${profile.yearsExperience}+ years of experience`,
    `Based in ${profile.location}`,
    profile.domains.join(' · '),
  ];

  return (
    <section
      id={`${idPrefix}__section--primary`}
      aria-labelledby={headingId}
      className={`${isHome ? 'section-pad' : 'page-top pb-[var(--space-section)]'} defer-render`}
    >
      <div className="container-page grid grid-cols-12 gap-x-[var(--space-gutter)] gap-y-[var(--space-stack)]">
        {isHome ? <span id="about" className="col-span-12 block h-0" /> : null}

        <div className="order-2 col-span-12 flex flex-col gap-6 lg:order-none lg:col-span-5">
          <Eyebrow index="01">{translate('nav.about')}</Eyebrow>
          <SectionHeading
            id={headingId}
            as={isHome ? 'h2' : 'h1'}
            bold={translate('section.about.bold')}
            italic={translate('section.about.italic')}
          />
          <Reveal as="p" className="t-lead max-w-[var(--measure)]">
            {copy.lead}
          </Reveal>
          {copy.body.map((paragraph, index) => (
            <Reveal
              key={paragraph}
              as="p"
              delay={(index + 1) * 60}
              className="max-w-[var(--measure)] text-muted-foreground"
            >
              {paragraph}
            </Reveal>
          ))}
          <Reveal delay={200} className="flex flex-wrap gap-3 pt-2">
            <LinkButton
              href={profile.links.cv}
              download={profile.links.cvDownloadName}
              id={`${idPrefix}__link--cv`}
            >
              {translate('home.hero.cta.downloadCv')}
              <Download aria-hidden="true" />
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
              href={profile.links.linkedin}
              external
              variant="secondary"
              id={`${idPrefix}__link--linkedin`}
            >
              LinkedIn
              <ArrowUpRight aria-hidden="true" />
            </LinkButton>
          </Reveal>
        </div>

        <div className="order-1 col-span-12 sm:col-span-6 lg:order-none lg:col-span-3">
          <IdBadge
            name={profile.name}
            initials={profile.initials}
            role={profile.role}
            location={profile.location}
            glanceTitle={translate('about.glance')}
            glanceItems={glanceItems}
            flipLabel={translate('about.flipCard')}
            idPrefix={idPrefix}
          />
        </div>

        <div className="order-3 col-span-12 flex flex-col gap-8 sm:col-span-6 lg:order-none lg:col-span-4">
          <Reveal>
            <QuickFacts title={translate('about.quickFacts')} facts={facts} idPrefix={idPrefix} />
          </Reveal>
          <Reveal delay={80}>
            <dl className="grid grid-cols-3 gap-4" aria-label="Key stats">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse justify-end gap-1">
                  <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                  <dd className="t-stat text-foreground">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          {copy.quote ? (
            <Reveal as="p" delay={120} className="t-serif t-h4 text-muted-foreground">
              {copy.quote}
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
