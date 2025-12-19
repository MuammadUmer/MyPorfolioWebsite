'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import AppLink from '@/components/atoms/Link';
import { trackEvent } from '@/lib/analytics';
import type { Project } from '@/lib/types/content';
import { useI18n } from '@/lib/i18n/use-i18n';

export interface HeroSectionProps {
  featuredProjects: Project[];
  yearsExperience: number;
  totalProjects: number;
  domains: string[];
}

const HeroSection: React.FC<HeroSectionProps> = ({
  featuredProjects,
  yearsExperience,
  totalProjects,
  domains,
}) => {
  const { t } = useI18n();
  const router = useRouter();

  const handlePrimaryCta = () => {
    router.push('/projects');
  };

  return (
    <section
      id="mu-home__hero__section--primary"
      className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12 md:px-6 md:py-16"
    >
      <div className="grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] md:items-center">
        <div className="flex flex-col gap-6">
          <Heading as="h1" className="text-3xl md:text-4xl font-semibold tracking-tight">
            {t('home.hero.title')}
          </Heading>
          <Text muted className="max-w-xl text-base md:text-lg">
            {t('home.hero.subtitle')}
          </Text>
          <div className="flex flex-wrap gap-3" aria-label="Hero primary actions">
            <Button
              id="mu-home__hero__btn--primary-cta"
              actionId="act-home__hero__click-primary-cta"
              variant="primary"
              size="lg"
              onClick={handlePrimaryCta}
            >
              {t('home.hero.cta.viewProjects')}
            </Button>
            <Button
              id="mu-home__hero__btn--secondary-contact"
              actionId="act-home__hero__click-contact"
              variant="secondary"
              size="lg"
              onClick={() => {
                trackEvent('hero_contact_cta_click', {
                  actionId: 'act-home__hero__click-contact',
                });
                router.push('/contact');
              }}
            >
              {t('home.hero.cta.contact')}
            </Button>
            <AppLink
              href="/CV.pdf"
              variant="muted"
              id="mu-home__hero__link--download-cv"
            >
              {t('home.hero.cta.downloadCv')}
            </AppLink>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm md:grid-cols-3" aria-label="Key stats">
            <div>
              <dt className="text-foreground/70">Years of experience</dt>
              <dd className="text-xl font-semibold">{yearsExperience}+</dd>
            </div>
            <div>
              <dt className="text-foreground/70">Projects delivered</dt>
              <dd className="text-xl font-semibold">{totalProjects}+</dd>
            </div>
            <div className="col-span-2 md:col-span-1">
              <dt className="text-foreground/70">Domains</dt>
              <dd className="text-sm font-medium text-foreground">
                {domains.join(' · ')}
              </dd>
            </div>
          </dl>
        </div>

        <div
          id="mu-home__featured-projects__section--primary"
          className="rounded-xl border border-border bg-background/60 p-4 shadow-sm"
        >
          <Heading as="h2" className="mb-3 text-lg font-semibold">
            Featured work
          </Heading>
          <div className="flex flex-col gap-3">
            {featuredProjects.map((project) => (
              <article
                key={project.slug}
                id={`mu-home__featured-projects__card--${project.slug}`}
                className="rounded-lg border border-border bg-background/80 p-3 hover:border-accent/70"
              >
                <Heading as="h3" className="text-base font-semibold">
                  {project.title}
                </Heading>
                <Text muted className="mt-1 text-xs">
                  {project.role}
                  {project.company ? ` · ${project.company}` : ''}
                  {project.domain ? ` · ${project.domain}` : ''}
                </Text>
                <Text muted className="mt-1 text-xs">
                  {project.summary}
                </Text>
                <div className="mt-2 flex flex-wrap gap-1">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-foreground/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
