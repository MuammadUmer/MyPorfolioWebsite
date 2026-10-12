import * as React from 'react';
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { getProfile } from '@/lib/services/content';
import { translate } from '@/lib/i18n/translate';

const linkClasses =
  'inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm text-deep-muted transition-colors duration-200 hover:text-deep-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

const Footer: React.FC = () => {
  const { links } = getProfile();

  return (
    <footer
      id="mu-global__footer__section--primary"
      className="site-footer relative z-0 bg-deep text-deep-muted"
    >
      <div className="container-page flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm">{translate('footer.copyright')}</p>
        <div className="flex flex-wrap items-center gap-1">
          <a
            href={links.email}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClasses}
            id="mu-global__footer__link--email"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Email</span>
          </a>
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClasses}
            id="mu-global__footer__link--linkedin"
          >
            <Linkedin className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">LinkedIn</span>
          </a>
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClasses}
            id="mu-global__footer__link--github"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">GitHub</span>
          </a>
          <a
            href="#mu-global__layout__section--main"
            className={`${linkClasses} font-mono text-xs uppercase tracking-widest`}
            id="mu-global__footer__link--back-to-top"
          >
            {translate('footer.backToTop')}
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
