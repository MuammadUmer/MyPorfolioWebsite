import LinkButton from '@/components/atoms/LinkButton';

export default function NotFound() {
  return (
    <div className="page-top flex min-h-[70vh] items-center justify-center pb-[var(--space-section)]">
      <div className="animate-fade-in-up text-center">
        <h1 className="t-hero mb-4">404</h1>
        <p className="t-lead mb-8 text-muted-foreground">Oops! Page not found</p>
        <LinkButton href="/" size="lg">
          Return to Home
        </LinkButton>
      </div>
    </div>
  );
}
