import type { Meta, StoryObj } from "@storybook/react";
import { InputField } from "./InputField";

const meta: Meta<typeof InputField> = {
  title: "Components/InputField",
  component: InputField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**InputField Features**
- Text input with label, placeholder, helper text, error message
- States: disabled, invalid, loading
- Variants: filled, outlined, ghost
- Sizes: small, medium, large
- Optional: clear button
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InputField>;

export const Default: Story = {
  args: {
    label: "Username",
    placeholder: "Enter your username",
    variant: "outlined",
    type: "text",
    size: "lg",
    clearable: true,
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email",
    value: "invalid-email",
    invalid: true,
    errorMessage: "Invalid email address",
    variant: "filled",
    size: "md",
    clearable: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled field",
    placeholder: "Can't type here",
    value: "Not editable",
    disabled: true,
    variant: "outlined",
    size: "md",
  },
};

export const Loading: Story = {
  args: {
    label: "Loading state",
    placeholder: "Fetching data...",
    loading: true,
    variant: "outlined",
    size: "md",
  },
};

export const GhostVariant: Story = {
  args: {
    label: "Search",
    placeholder: "Type to search...",
    variant: "ghost",
    size: "md",
    clearable: true,
  },
};

export const SizeVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <InputField label="Small" placeholder="Small input" size="sm" clearable />
      <InputField label="Medium" placeholder="Medium input" size="md" clearable />
      <InputField label="Large" placeholder="Large input" size="lg" clearable />
    </div>
  ),
};

export const StyleVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <InputField label="Outlined" placeholder="Outlined variant" variant="outlined" clearable />
      <InputField label="Filled" placeholder="Filled variant" variant="filled" clearable />
      <InputField label="Ghost" placeholder="Ghost variant" variant="ghost" clearable />
    </div>
  ),
};
