import * as React from 'react';
import type { Certification, Education } from '@/lib/types/content';

export interface CredentialsSectionProps {
  certifications: Certification[];
  education: Education[];
}

const CredentialsSection: React.FC<CredentialsSectionProps> = ({ certifications, education }) => {
  return (
    <div
      id="mu-about__credentials__section--primary"
      className="mt-16 grid gap-10 md:grid-cols-2"
    >
      <div>
        <h2 className="text-xl font-semibold mb-4">Certifications</h2>
        <ul className="space-y-3">
          {certifications.map((cert) => (
            <li
              key={cert.name}
              id={`mu-about__credentials__item--${cert.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="rounded-lg border border-border bg-card/80 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-sm">{cert.name}</p>
                {cert.status === 'in-progress' && (
                  <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide border border-accent/50 text-accent bg-accent/10">
                    In Progress
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{cert.issuer}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Education</h2>
        <ul className="space-y-3">
          {education.map((edu) => (
            <li
              key={`${edu.degree}-${edu.institution}`}
              id={`mu-about__education__item--${edu.institution.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="rounded-lg border border-border bg-card/80 p-4"
            >
              <p className="font-medium text-sm">{edu.degree}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {edu.institution} · {edu.period}
              </p>
              {edu.details?.length ? (
                <ul className="mt-2 space-y-1">
                  {edu.details.map((detail) => (
                    <li key={detail} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary/50 mt-1.5 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CredentialsSection;
