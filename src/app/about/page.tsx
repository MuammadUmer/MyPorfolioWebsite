import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';

export default function AboutPage() {
  return (
    <section
      id="mu-about__about__section--primary"
      className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6 md:py-12"
    >
      <Heading as="h1" className="mb-6 text-3xl font-semibold">
        About
      </Heading>
      <div className="space-y-4 text-sm text-foreground/90 md:text-base">
        <Text>
          I&apos;m Muhammad Umer, a senior software engineer focused on backend APIs, cloud and
          serverless architectures, React/Next.js, and React Native, with experience across
          healthcare, real estate, AI, and logistics.
        </Text>
        <Text>
          I enjoy designing reliable, observable systems with clear boundaries and well-documented
          contracts. Much of my recent work has been around event-driven architectures, offline-first
          experiences, and integrating third-party APIs.
        </Text>
        <Text>
          As a lead engineer, I value pragmatic architecture, strong code review culture, and
          mentoring teammates. I prefer small, well-tested increments, automated CI/CD, and clear
          communication with stakeholders.
        </Text>
        <Text>
          Day to day, I like working closely with product and design, writing clear tickets and
          documentation, and keeping a healthy balance between shipping quickly and planning for the
          next iteration.
        </Text>
      </div>
    </section>
  );
}
