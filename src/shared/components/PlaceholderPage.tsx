interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="space-y-4 py-8">
      <h1 className="text-2xl font-extrabold text-text-primary">{title}</h1>
      <p className="text-lg text-text-muted">{description}</p>
    </section>
  );
}
