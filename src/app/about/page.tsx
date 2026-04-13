const paragraphs = [
  "I'm Muhammad Umer, a Senior Full Stack Engineer based in Riyadh, Saudi Arabia, with 7+ years of experience designing and delivering scalable, high-performance web and mobile applications. I specialise in Node.js backend APIs, cloud-native architectures on GCP, and cross-platform frontends with React.js and React Native.",
  "My background spans healthcare, real estate, logistics, AI, and blockchain — giving me the ability to quickly understand domain requirements and translate them into reliable, maintainable systems. Notable projects include Innova Care (offline-first home care on GCP), MyIndici (New Zealand's top-20 patient portal), Bio Scan (AI-powered vital sign monitoring), Ask Cyphen (Kibana + ChatGPT threat analytics), and Eizhar (property management platform).",
  "I have hands-on experience architecting event-driven systems with Pub/Sub, designing offline-first experiences with SQL↔Firestore synchronisation, and deploying containerised workloads on GCP, AWS, and Azure with Docker and Kubernetes. I also enjoy integrating AI — from facial recognition APIs to configuring local LLM inference stacks for multi-agent systems.",
  "As a lead engineer, I value clear system boundaries, strong code-review culture, and automated CI/CD. I prefer shipping small, well-tested increments, working closely with product and design, and keeping architecture decisions grounded in actual business requirements rather than speculation.",
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
