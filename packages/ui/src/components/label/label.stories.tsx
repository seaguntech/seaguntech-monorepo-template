import { Label } from './label';
import { Input } from '@/components/input/input';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'UI/Label',
  component: Label,
  args: {
    children: 'Email',
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {
  render: (args) => <Label {...args} htmlFor="label-default" />,
};

export const Required: Story = {
  render: (args) => (
    <Label {...args} htmlFor="label-required">
      Email <span className="text-destructive">*</span>
    </Label>
  ),
};

export const WithInput: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm gap-2">
      <Label {...args} htmlFor="label-input" />
      <Input id="label-input" placeholder="name@example.com" type="email" />
    </div>
  ),
};

export const DisabledField: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm gap-2">
      <Input
        className="peer"
        disabled
        id="label-disabled"
        placeholder="disabled@example.com"
        type="email"
      />
      <Label {...args} htmlFor="label-disabled" />
    </div>
  ),
};

export const ErrorField: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm gap-2">
      <Label {...args} className="text-destructive" htmlFor="label-error" />
      <Input
        aria-describedby="label-error-message"
        aria-invalid
        id="label-error"
        placeholder="name@example.com"
        type="email"
      />
      <p
        className="text-sm text-destructive"
        id="label-error-message"
        role="alert"
      >
        Please provide a valid email address
      </p>
    </div>
  ),
};
