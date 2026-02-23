import { Container } from './container';
import { Grid } from './grid';
import { Stack } from './stack';
import { Button } from '@/components/button/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/card/card';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'UI/Layout',
  component: Container,
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof Container>;

const DemoCard = ({ title }: { title: string }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">Reusable layout primitive demo.</p>
    </CardContent>
  </Card>
);

export const ContainerSizes: Story = {
  render: () => (
    <Stack gap="lg">
      <Container
        className="rounded-md border border-dashed border-border p-4"
        size="sm"
      >
        <p className="text-sm text-muted-foreground">Container size: sm</p>
      </Container>
      <Container
        className="rounded-md border border-dashed border-border p-4"
        size="xl"
      >
        <p className="text-sm text-muted-foreground">Container size: xl</p>
      </Container>
    </Stack>
  ),
};

export const ResponsiveGrid: Story = {
  render: () => (
    <Container>
      <Grid className="grid-cols-1" gap="lg" responsive="lg">
        <DemoCard title="Card A" />
        <DemoCard title="Card B" />
        <DemoCard title="Card C" />
        <DemoCard title="Card D" />
      </Grid>
    </Container>
  ),
};

export const StackComposition: Story = {
  render: () => (
    <Container size="md">
      <Stack className="rounded-lg border border-border p-6" gap="lg">
        <Stack gap="sm">
          <h3 className="text-2xl font-semibold tracking-tight">
            Stack layout
          </h3>
          <p className="text-sm text-muted-foreground">
            Use Stack for vertical flow with predictable spacing.
          </p>
        </Stack>
        <Stack className="sm:flex-row" gap="sm">
          <Button>Primary Action</Button>
          <Button variant="outline">Secondary</Button>
        </Stack>
      </Stack>
    </Container>
  ),
};
