'use client';

import * as React from 'react';
import { ArrowRight, Download, Mail } from 'lucide-react';
import LinkButton from '@/components/atoms/LinkButton';
import Reveal from '@/components/atoms/Reveal';
import ScrambleText from '@/components/atoms/ScrambleText';
import Avatar3D from '@/components/objects/Avatar3D';
import { trackEvent } from '@/lib/analytics';
import { observeReveal } from '@/lib/hooks/reveal';
import { slugify } from '@/lib/services/slug';
import { useI18n } from '@/lib/i18n/use-i18n';
import type { Profile } from '@/lib/types/content';

export interface HeroSectionProps {
  profile: Pick<Profile, 'name' | 'role' | 'status' | 'links' | 'avatar'>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  const { t } = useI18n();
  const headlineRef = React.useRef<HTMLHeadingElement | null>(null);

  React.useEffect(() => {
    if (!headlineRef.current) return;
    return observeReveal(headlineRef.current);
  }, []);

  const [firstName, ...restName] = profile.name.split(' ');
  const roleWords = profile.role.split(' ');
  const lastIndex = roleWords.length - 1;

  const hasAvatar = Boolean(profile.avatar);

  const actions = (
    <Reveal
      delay={300}
      role="group"
      aria-label="Hero primary actions"
      className={
    hasAvatar
      ? 'flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:flex-wrap'
      : 'col-span-12 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap lg:col-span-4 lg:flex-col lg:items-end lg:self-center'
      }
    >
      <LinkButton
        href="/projects"
        size="lg"
        id="mu-home__hero__btn--primary-cta"
        actionId="act-home__hero__click-primary-cta"
      >
        <ScrambleText text={t('home.hero.cta.viewProjects')} />
        <ArrowRight aria-hidden="true" />
      </LinkButton>
      <LinkButton
        href="/contact"
        variant="secondary"
        size="lg"
        id="mu-home__hero__btn--secondary-contact"
        actionId="act-home__hero__click-contact"
        onClick={() =>
          trackEvent('hero_contact_cta_click', { actionId: 'act-home__hero__click-contact' })
        }
      >
        <Mail aria-hidden="true" />
        <ScrambleText text={t('home.hero.cta.contact')} />
      </LinkButton>
      <LinkButton
        href={profile.links.cv}
        variant="ghost"
        size="lg"
        id="mu-home__hero__link--download-cv"
        download={profile.links.cvDownloadName}
      >
        <Download aria-hidden="true" />
        {t('home.hero.cta.downloadCv')}
      </LinkButton>
    </Reveal>
  );

  return (
    <section
      id="mu-home__hero__section--primary"
      className="hero-wash relative isolate flex min-h-[100svh] overflow-clip pt-[var(--header-h)]"
    >
      <div aria-hidden="true" className="dot-field absolute inset-0 -z-20" />

      <div
        aria-hidden="true"
        className="ghost-name absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 text-center"
      >
        <span className="hidden text-[min(9.8vw,15rem)] md:block">{profile.name}</span>
        <span className="block text-[15vw] md:hidden">
          {firstName}
          <br />
          {restName.join(' ')}
        </span>
      </div>

      <div className="container-page relative grid flex-1 grid-cols-12 items-end gap-x-[var(--space-gutter)] gap-y-10 pb-[var(--space-block)] pt-10">
        {profile.avatar ? (
          /* lg+: the figure stands at the content column's right edge (not the screen edge). The canvas is 1.16x as
             wide as it is tall and shifted so the figure keeps its place: the idle animation swings an arm out to
             ~0.57 of the height, and a narrower canvas cuts it off. */
          <Avatar3D
            model={profile.avatar.model}
            poster={profile.avatar.poster}
            alt={profile.avatar.alt}
            sizes="45vh"
            framing={profile.avatar.framing}
            fieldOfView="43deg"
            animated
            className="pointer-events-none absolute bottom-0 right-0 z-0 hidden aspect-[116/100] h-full translate-x-[21%] lg:block"
          />
        ) : null}

        {profile.avatar ? (
          <Avatar3D
            model={profile.avatar.model}
            poster={profile.avatar.poster}
            alt={profile.avatar.alt}
            sizes="160px"
            framing={profile.avatar.framing}
            animated
            className="pointer-events-none relative col-span-12 mx-auto h-80 w-40 lg:hidden"
          />
        ) : null}

        <div className="col-span-12 flex flex-col gap-6 [container-type:inline-size] lg:col-span-8">
          <Reveal delay={0}>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 font-mono text-xs text-muted-foreground">
              <span className="animate-pulse-dot h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
              <span>
                &gt; {slugify(profile.name)} --status &quot;{profile.status}&quot;
              </span>
            </p>
          </Reveal>

          <h1 ref={headlineRef} className="reveal-words">
            <span className="eyebrow mb-4 block">{profile.name}</span>
            {/* lg+: one line, sized to the column (the line is ~11.1em wide); smaller screens wrap as before. */}
            <span className="t-hero block max-w-[14ch] lg:max-w-none lg:whitespace-nowrap lg:[font-size:min(var(--fs-hero),calc(100cqw/11.3))]">
              {roleWords.map((word, index) => (
                <React.Fragment key={`${word}-${index}`}>
                  {index > 0 ? ' ' : null}
                  <span className="word" style={{ '--i': index } as React.CSSProperties}>
                    {word}
                    {index === lastIndex ? <span className="t-serif">.</span> : null}
                  </span>
                </React.Fragment>
              ))}
            </span>
          </h1>

          <Reveal delay={200}>
            <p className="t-lead max-w-[46ch] text-balance text-muted-foreground">{t('home.hero.subtitle')}</p>
          </Reveal>
          {hasAvatar ? actions : null}
        </div>

        {hasAvatar ? null : actions}

      </div>
    </section>
  );
};

export default HeroSection;
