import * as React from 'react';
import AppLink from '@/components/atoms/Link';
import Text from '@/components/atoms/Text';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      id="mu-global__footer__section--primary"
      className="border-t border-border bg-background"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-6 text-sm text-foreground/70 md:flex-row md:items-center md:justify-between md:px-6">
        <Text muted>
          © {year} Muhammad Umer. All rights reserved.
        </Text>
        <div className="flex flex-wrap items-center gap-4">
          <AppLink href="mailto:muhammadumerswati@hotmail.com" variant="muted">
            Email
          </AppLink>
          <AppLink
            href="https://linkedin.com/in/muhammad-umer"
            variant="muted"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </AppLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
