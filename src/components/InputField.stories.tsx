import type { Meta, StoryObj } from '@storybook/react';
import { Input} from './InputField'; 
import React, { useState } from 'react';
import '../index.css'


const meta: Meta<typeof Input> = {
  title: 'components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['outlined', 'filled', 'ghost'],
      description: 'The visual style of the input.',
    },
    inputSize: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
      description: 'The size of the input.',
    },
    theme: {
      control: 'radio',
      options: ['system', 'light', 'dark'],
      description: 'Force a specific theme.',
    },
    isInvalid: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    showClearButton: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    value: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'search'],
    },
    onChange: { table: { disable: true } },
    onClear: { table: { disable: true } },
  },
  args: {
    id: 'storybook-input',
    label: 'Email Address',
    helperText: 'Enter your primary email address.',
    errorMessage: 'This email is not valid.',
    value: '',
    variant: 'outlined',
    inputSize: 'medium',
    theme: 'system',
    type: 'text',
    isInvalid: false,
    isDisabled: false,
    isLoading: false,
    showClearButton: true,
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const InteractiveDemo: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value ?? '');
    return (
      <Input
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue('')}
      />
    );
  },
};

export const PasswordDemo: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <Input
        {...args}
        type="password"
        label="Password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue('')}
      />
    );
  },
  args: {
    placeholder: 'Enter your password',
    showClearButton: false,
  },
};


export const AllStates: Story = {
  render: (args) => (
    <div className="grid grid-cols-4 gap-x-8 gap-y-12 w-[800px] p-4 bg-white dark:bg-slate-900 rounded-lg">
      {(['outlined', 'filled', 'ghost'] as const).map((variant) => (
        <React.Fragment key={variant}>
          <Input {...args} variant={variant} label={`${variant} Valid`} value="Valid" />
          <Input {...args} variant={variant} label="Invalid" value="Invalid" isInvalid errorMessage="Error message" />
          <Input {...args} variant={variant} label="Loading" value="Loading..." isLoading />
          <Input {...args} variant={variant} label="Disabled" value="Disabled" isDisabled />
        </React.Fragment>
      ))}
    </div>
  ),
  argTypes: {
    variant: { table: { disable: true } },
    isInvalid: { table: { disable: true } },
    isDisabled: { table: { disable: true } },
    isLoading: { table: { disable: true } },
  },
  args: {
    inputSize: 'medium',
    helperText: '',
    errorMessage: 'Error message.',
    placeholder: 'Enter your password',
    showClearButton: false,
  },
};
