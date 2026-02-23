import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@seaguntech/ui';
import { formatDate } from '@seaguntech/utils';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-16">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Today is {formatDate(new Date())}
          </p>
          <h1 className="text-3xl font-semibold">
            Seaguntech Monorepo Starter
          </h1>
        </div>
        <p className="text-base text-muted-foreground">
          A reusable template with shared UI, logging, and tooling.
        </p>
        <div>
          <Button size="lg">Get started</Button>
        </div>
        <div>
          <ThemeToggle />
        </div>
      </main>
    </div>
  );
}
