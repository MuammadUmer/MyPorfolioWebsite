import { buildTimeline } from '@/lib/services/timeline';
import { splitAboutCopy } from '@/lib/services/about';
import { getAboutCopy, getEducation, getExperience, getProfile, getTimeline } from '@/lib/services/content';
import { slugify } from '@/lib/services/slug';

describe('buildTimeline', () => {
  it('parses start years from the existing period strings', () => {
    const timeline = buildTimeline(
      [
        { company: 'A Co', role: 'Lead', period: 'Aug 2023 – Feb 2026', responsibilities: ['x'] },
        { company: 'B Co', role: 'Dev', period: 'Jun 2019 – Dec 2019', responsibilities: ['y'] },
      ],
      []
    );
    expect(timeline.map((entry) => entry.year)).toEqual(['2023', '2019']);
    expect(timeline.map((entry) => entry.kind)).toEqual(['experience', 'experience']);
  });

  it('places education after every experience that started in or after its end year', () => {
    const timeline = buildTimeline(
      [
        { company: 'New', role: 'Lead', period: 'Aug 2023 – Feb 2026', responsibilities: [] },
        { company: 'Old', role: 'Dev', period: 'Jun 2019 – Dec 2019', responsibilities: [] },
      ],
      [{ degree: 'B.S.', institution: 'Uni', period: '2015 – 2019', details: ['d1'] }]
    );
    expect(timeline.map((entry) => entry.organisation)).toEqual(['New', 'Old', 'Uni']);
    expect(timeline[2]).toMatchObject({ kind: 'education', year: '2015', bullets: ['d1'] });
  });

  it('inserts education before experience that started before it ended', () => {
    const timeline = buildTimeline(
      [{ company: 'Early', role: 'Intern', period: 'Jan 2017 – Jun 2017', responsibilities: [] }],
      [{ degree: 'B.S.', institution: 'Uni', period: '2015 – 2019' }]
    );
    expect(timeline.map((entry) => entry.organisation)).toEqual(['Uni', 'Early']);
  });

  it('produces stable unique ids', () => {
    const timeline = getTimeline();
    expect(new Set(timeline.map((entry) => entry.id)).size).toBe(timeline.length);
  });
});

describe('getTimeline with the real data', () => {
  it('keeps every experience entry and bullet, plus the education entry', () => {
    const experience = getExperience();
    const education = getEducation();
    const timeline = getTimeline();

    expect(timeline).toHaveLength(experience.length + education.length);
    experience.forEach((item) => {
      const entry = timeline.find((candidate) => candidate.organisation === item.company && candidate.title === item.role);
      expect(entry).toBeDefined();
      expect(entry?.bullets).toEqual(item.responsibilities);
      expect(entry?.description).toBe(item.description);
    });
    expect(timeline.some((entry) => entry.kind === 'education')).toBe(true);
  });
});

describe('splitAboutCopy', () => {
  it('moves only the final sentences of the last paragraph into the quote', () => {
    const copy = splitAboutCopy(['Lead.', 'Middle.', 'First sentence. Second sentence here.']);
    expect(copy.lead).toBe('Lead.');
    expect(copy.body).toEqual(['Middle.', 'First sentence.']);
    expect(copy.quote).toBe('Second sentence here.');
  });

  it('handles short inputs without losing text', () => {
    expect(splitAboutCopy([])).toEqual({ lead: '', body: [], quote: '' });
    expect(splitAboutCopy(['Only'])).toEqual({ lead: 'Only', body: [], quote: '' });
    expect(splitAboutCopy(['Lead', 'No sentence break'])).toEqual({
      lead: 'Lead',
      body: ['No sentence break'],
      quote: '',
    });
  });

  it('preserves every word of the real About copy', () => {
    const profile = getProfile();
    const copy = getAboutCopy();
    const rebuilt = [copy.lead, ...copy.body, copy.quote].join(' ');
    expect(rebuilt).toBe(profile.about.join(' '));
  });
});

describe('slugify', () => {
  it('lowercases, replaces ampersands and trims separators', () => {
    expect(slugify('Backend & APIs')).toBe('backend-and-apis');
    expect(slugify('  Node.js  ')).toBe('node-js');
    expect(slugify('F3 Technologies')).toBe('f3-technologies');
  });
});
