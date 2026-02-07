const paragraphs = [
  "I'm Muhammad Umer, a senior software engineer focused on backend APIs, cloud and serverless architectures, React/Next.js, and React Native, with experience across healthcare, real estate, AI, and logistics.",
  "I enjoy designing reliable, observable systems with clear boundaries and well-documented contracts. Much of my recent work has been around event-driven architectures, offline-first experiences, and integrating third-party APIs.",
  "As a lead engineer, I value pragmatic architecture, strong code review culture, and mentoring teammates. I prefer small, well-tested increments, automated CI/CD, and clear communication with stakeholders.",
  "Day to day, I like working closely with product and design, writing clear tickets and documentation, and keeping a healthy balance between shipping quickly and planning for the next iteration.",
];

export default function AboutPage() {
  return (
    <section
      id="mu-about__about__section--primary"
      className="py-20"
    >
      <div className="mx-auto w-full max-w-3xl px-4 md:px-6">
        <div className="animate-fade-in-up mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">About</h1>
        </div>
        <div className="space-y-6">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="animate-fade-in-up text-lg text-muted-foreground leading-relaxed"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
