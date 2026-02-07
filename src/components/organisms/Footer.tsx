import * as React from 'react';
import { Mail, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      id="mu-global__footer__section--primary"
      className="border-t border-border/50 py-8 mt-20"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <p className="text-sm text-muted-foreground">
          © {year} Muhammad Umer. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="mailto:muhammadumerswati@hotmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </a>
          <a
            href="https://linkedin.com/in/muhammad-umer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Linkedin className="h-4 w-4" />
            <span className="hidden sm:inline">LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
