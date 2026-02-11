'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Download, Mail } from 'lucide-react';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import AppLink from '@/components/atoms/Link';
import { trackEvent } from '@/lib/analytics';
import type { Project } from '@/lib/types/content';
import { useI18n } from '@/lib/i18n/use-i18n';

function getFeaturedTitle(title: string): string {
  return title.split(' – ')[0] ?? title;
}

function formatFeaturedTechLabel(label: string): string {
  const normalized = label.trim().toLowerCase();
  if (normalized === 'google cloud functions') return 'Cloud Functions';
  if (normalized === 'firebase firestore') return 'Firestore';
  if (normalized === 'at/llm apis') return 'AI/LLM APIs';
  return label;
}

export interface HeroSectionProps {
  featuredProjects: Project[];
  yearsExperience: number;
  totalProjects: number;
  domains: string[];
}

function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2;
          const increment = end / (duration * 60);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 1000 / 60);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, hasAnimated]);

  return (
    <span ref={ref} className="font-bold text-3xl sm:text-4xl text-foreground">
      {count}{suffix}
    </span>
  );
}

function Typewriter({ text, delay = 80 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

  return (
    <span>
      {displayedText}
      <span className="inline-block w-0.5 h-[1em] bg-primary ml-1 align-middle animate-pulse" />
    </span>
  );
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
      className="relative min-h-[90vh] flex items-center overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 animated-gradient" />
      <div className="absolute inset-0 dot-pattern" />

      {/* Floating orbs */}
      <div className="absolute top-20 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-20 left-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: '2s', animationDirection: 'reverse' }}
      />

      <div className="mx-auto w-full max-w-5xl relative z-10 px-4 py-20 md:px-6">
        <div className="grid gap-12 lg:grid-cols-5 items-start">
          {/* Left column - 60% */}
          <div className="lg:col-span-3 space-y-8">
            {/* Terminal-style element */}
            <div
              className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 font-mono text-xs text-muted-foreground"
              style={{ animationDelay: '0.1s' }}
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>&gt; muhammad-umer --status &quot;Open to opportunities&quot;</span>
            </div>

            {/* Name */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                <Typewriter text="Muhammad Umer" delay={80} />
              </h1>
              <p className="text-xl sm:text-2xl text-primary font-medium">
                Senior Software Engineer
              </p>
            </div>

            {/* Description */}
            <p
              className="animate-fade-in-up text-lg text-muted-foreground max-w-xl"
              style={{ animationDelay: '0.4s' }}
            >
              {t('home.hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div
              className="animate-fade-in-up flex flex-wrap gap-4"
              style={{ animationDelay: '0.5s' }}
              aria-label="Hero primary actions"
            >
              <Button
                id="mu-home__hero__btn--primary-cta"
                actionId="act-home__hero__click-primary-cta"
                variant="primary"
                size="lg"
                onClick={handlePrimaryCta}
                className="shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {t('home.hero.cta.viewProjects')}
                <ArrowRight className="ml-2 h-4 w-4" />
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
                className="border-2 border-primary/50 hover:bg-primary/10 hover:border-primary"
              >
                <Mail className="mr-2 h-4 w-4" />
                {t('home.hero.cta.contact')}
              </Button>
              <AppLink
                href="/CV.pdf"
                variant="muted"
                id="mu-home__hero__link--download-cv"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <Download className="mr-2 h-4 w-4" />
                {t('home.hero.cta.downloadCv')}
              </AppLink>
            </div>

            {/* Stats */}
            <div
              className="animate-fade-in-up flex flex-wrap gap-8 pt-8"
              style={{ animationDelay: '0.6s' }}
              aria-label="Key stats"
            >
              <div className="text-center">
                <AnimatedCounter end={yearsExperience} suffix="+" />
                <p className="text-sm text-muted-foreground mt-1">Years Experience</p>
              </div>
              <div className="text-center">
                <AnimatedCounter end={totalProjects} suffix="+" />
                <p className="text-sm text-muted-foreground mt-1">Projects Delivered</p>
              </div>
              <div className="text-center">
                <AnimatedCounter end={domains.length} />
                <p className="text-sm text-muted-foreground mt-1">Domains</p>
              </div>
            </div>
          </div>

          {/* Right column - Featured Work */}
          <div
            id="mu-home__featured-projects__section--primary"
            className="lg:col-span-2 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Featured Work
              </h3>
              <div className="space-y-4">
                {featuredProjects.map((project, index) => (
                  <AppLink
                    key={project.slug}
                    href={`/projects/${project.slug}`}
                    className="block group"
                  >
                    <article
                      id={`mu-home__featured-projects__card--${project.slug}`}
                      className="animate-fade-in-up p-4 rounded-lg border border-border bg-background/50 transition-all duration-300 hover:border-primary/50 hover:bg-background/80"
                      style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                    >
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {getFeaturedTitle(project.title)}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {project.role}
                        {project.company ? ` · ${project.company}` : ''}
                      </p>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {project.summary}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono border border-border bg-muted/50 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                          >
                            {formatFeaturedTechLabel(tech)}
                          </span>
                        ))}
                      </div>
                    </article>
                  </AppLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
