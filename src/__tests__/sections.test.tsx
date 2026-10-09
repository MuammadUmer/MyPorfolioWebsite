import { render, screen, fireEvent, within } from '@testing-library/react';
import AboutSection from '@/components/organisms/AboutSection';
import CertificationsSection from '@/components/organisms/CertificationsSection';
import ContactSection from '@/components/organisms/ContactSection';
import EducationList from '@/components/organisms/EducationList';
import Footer from '@/components/organisms/Footer';
import ProjectsShowcase from '@/components/organisms/ProjectsShowcase';
import {
  getAboutCopy,
  getCertifications,
  getEducation,
  getProfile,
  getProjects,
} from '@/lib/services/content';

describe('AboutSection', () => {
  const profile = getProfile();

  it('renders every existing About paragraph and the quick facts', () => {
    const { container } = render(
      <AboutSection
        profile={profile}
        copy={getAboutCopy()}
        education={getEducation()}
        projectCount={getProjects().length}
      />
    );

    expect(screen.getByRole('heading', { level: 2, name: /about me/i })).toBeInTheDocument();
    const text = container.textContent ?? '';
    profile.about.forEach((paragraph) => {
      const firstWords = paragraph.split(' ').slice(0, 8).join(' ');
      expect(text).toContain(firstWords);
    });

    const facts = screen.getByText('Quick facts').parentElement as HTMLElement;
    expect(within(facts).getByText('Riyadh, Saudi Arabia')).toBeInTheDocument();
    expect(within(facts).getByText('7+ years')).toBeInTheDocument();
    expect(within(facts).getByText('Healthcare, Real Estate, AI, Blockchain, Logistics')).toBeInTheDocument();
  });

  it('shows the existing stats with the derived project count', () => {
    render(
      <AboutSection profile={profile} copy={getAboutCopy()} education={getEducation()} projectCount={19} />
    );
    const stats = screen.getByLabelText('Key stats');
    expect(within(stats).getByText('7+')).toBeInTheDocument();
    expect(within(stats).getByText('19+')).toBeInTheDocument();
    expect(within(stats).getByText('Years Experience')).toBeInTheDocument();
    expect(within(stats).getByText('Projects Delivered')).toBeInTheDocument();
  });

  it('keeps the existing links', () => {
    render(
      <AboutSection profile={profile} copy={getAboutCopy()} education={getEducation()} projectCount={19} />
    );
    expect(screen.getByRole('link', { name: /download cv/i })).toHaveAttribute('href', '/CV.pdf');
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/MuammadUmer'
    );
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/muhammad-umer-07180911b'
    );
  });

  it('flips the ID badge with an accessible button and no fabricated identity data', () => {
    const { container } = render(
      <AboutSection profile={profile} copy={getAboutCopy()} education={getEducation()} projectCount={19} />
    );
    const flip = screen.getByRole('button', { name: /flip card/i });
    expect(flip).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(flip);
    expect(flip).toHaveAttribute('aria-pressed', 'true');

    const badgeText = container.querySelector('.badge-scene')?.textContent ?? '';
    expect(badgeText).not.toMatch(/ID\s*[A-Z]{2}-\d+/);
    expect(badgeText).not.toMatch(/valid/i);
  });

  it('uses an h1 on the standalone page', () => {
    render(
      <AboutSection
        page="about"
        profile={profile}
        copy={getAboutCopy()}
        education={getEducation()}
        projectCount={19}
      />
    );
    expect(screen.getByRole('heading', { level: 1, name: /about me/i })).toBeInTheDocument();
  });
});

describe('CertificationsSection', () => {
  it('lists every certification with issuer and the in-progress badge', () => {
    const certifications = getCertifications();
    render(<CertificationsSection certifications={certifications} />);

    expect(screen.getByText('6 certifications')).toBeInTheDocument();
    certifications.forEach((certification) => {
      expect(screen.getByText(certification.name)).toBeInTheDocument();
    });
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('moves the highlight bar state on hover and focus', () => {
    const { container } = render(<CertificationsSection certifications={getCertifications()} />);
    const rows = container.querySelectorAll('.highlight-row');
    expect(rows).toHaveLength(6);

    fireEvent.mouseEnter(rows[1]);
    expect(rows[1]).toHaveAttribute('data-active', 'true');
    expect(rows[0]).toHaveAttribute('data-active', 'false');

    fireEvent.focus(rows[2]);
    expect(rows[2]).toHaveAttribute('data-active', 'true');
  });
});

describe('EducationList', () => {
  it('renders the education record with its details', () => {
    render(<EducationList education={getEducation()} />);
    expect(screen.getByText('B.S. Software Engineering')).toBeInTheDocument();
    expect(screen.getByText(/COMSATS University Islamabad · 2015 – 2019/)).toBeInTheDocument();
    expect(screen.getByText('CGPA: 3.2 / 4.0')).toBeInTheDocument();
  });
});

describe('ProjectsShowcase', () => {
  const projects = getProjects();

  it('opens the first featured project and links to its case study', () => {
    render(<ProjectsShowcase projects={projects} />);
    expect(screen.getByRole('heading', { level: 2, name: /selected projects/i })).toBeInTheDocument();

    const firstButton = screen.getByRole('button', { name: /innova care/i });
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: /view case study/i })).toHaveAttribute(
      'href',
      '/projects/innova-care'
    );
  });

  it('switches the open panel on click and keyboard navigation', () => {
    render(<ProjectsShowcase projects={projects} />);
    const buttons = screen.getAllByRole('button', { expanded: false });
    expect(buttons).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: /eizhar/i }));
    expect(screen.getByRole('button', { name: /eizhar/i })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: /innova care/i })).toHaveAttribute('aria-expanded', 'false');

    fireEvent.keyDown(screen.getByRole('button', { name: /eizhar/i }), { key: 'ArrowRight' });
    expect(screen.getByRole('button', { name: /local llm inference stack/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('links to the full project list with the derived count', () => {
    render(<ProjectsShowcase projects={projects} />);
    const link = screen.getByRole('link', { name: `All ${projects.length} projects` });
    expect(link).toHaveAttribute('href', '/projects');
  });
});

describe('ContactSection', () => {
  const profile = getProfile();

  it('keeps the intro copy, form and every contact link', () => {
    render(<ContactSection profile={profile} />);
    expect(screen.getByRole('heading', { level: 2, name: /contact me/i })).toBeInTheDocument();
    expect(screen.getByText(profile.contactIntro)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toHaveAttribute(
      'id',
      'mu-contact__form__btn--submit'
    );
    expect(screen.getByRole('link', { name: /email/i })).toHaveAttribute(
      'href',
      'mailto:muhammadumerswati@gmail.com'
    );
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/muhammad-umer-07180911b'
    );
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/MuammadUmer'
    );
  });

  it('marks the section as the notched source and uses h1 on the standalone page', () => {
    const { container } = render(<ContactSection page="contact" profile={profile} />);
    expect(container.querySelector('#mu-contact__form__section--primary')).toHaveClass('notch-source');
    expect(screen.getByRole('heading', { level: 1, name: /contact me/i })).toBeInTheDocument();
  });
});

describe('Footer', () => {
  it('keeps the copyright text and the three external links byte-identical', () => {
    render(<Footer />);
    expect(screen.getByText(/© \d{4} Muhammad Umer\. All rights reserved\./)).toBeInTheDocument();

    const email = screen.getByRole('link', { name: 'Email' });
    expect(email).toHaveAttribute('href', 'mailto:muhammadumerswati@gmail.com');
    const linkedin = screen.getByRole('link', { name: 'LinkedIn' });
    expect(linkedin).toHaveAttribute('href', 'https://linkedin.com/in/muhammad-umer-07180911b');
    expect(linkedin).toHaveAttribute('target', '_blank');
    expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer');
    const github = screen.getByRole('link', { name: 'GitHub' });
    expect(github).toHaveAttribute('href', 'https://github.com/MuammadUmer');
  });

  it('offers a back-to-top link', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /back to top/i })).toHaveAttribute(
      'href',
      '#mu-global__layout__section--main'
    );
  });
});
