interface Props {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="title">{title}</h1>
      {description && (
        <p className="max-w-2xl text-pretty text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
