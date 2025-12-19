import { generateStaticParams } from '@/app/projects/[slug]/page';

describe('projects dynamic routes', () => {
  it('generates static params for all project slugs', async () => {
    const params = await generateStaticParams();
    const slugs = params.map((param) => param.slug);

    expect(slugs).toContain('innova-care');
  });
});
