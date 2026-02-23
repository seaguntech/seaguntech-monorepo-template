import { Input } from './input';
import { Label } from '@/components/label/label';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'UI/Input',
  component: Input,
  args: {
    placeholder: 'Type something...',
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid max-w-sm gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" {...args} />
    </div>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <div className="grid max-w-sm gap-2">
      <Label htmlFor="email-error">Email</Label>
      <Input
        aria-describedby="email-error-message"
        aria-invalid
        id="email-error"
        {...args}
      />
      <p
        className="text-sm text-destructive"
        id="email-error-message"
        role="alert"
      >
        Please provide a valid email address
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'disabled@example.com',
  },
  render: (args) => (
    <div className="grid max-w-sm gap-2">
      <Label htmlFor="email-disabled">Email</Label>
      <Input id="email-disabled" {...args} />
    </div>
  ),
};
