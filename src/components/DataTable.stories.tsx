import type { Meta, StoryObj } from "@storybook/react";
import DataTable from "./DataTable";
import type { Column } from "../props/DataTable.props";

type User = { id: string; name: string; email: string; age: number; joinedAt: string };

const sample: User[] = [
  { id: "u1", name: "Aditya", email: "aditya@example.com", age: 22, joinedAt: "2024-02-12" },
  { id: "u2", name: "Sara", email: "sara@example.com", age: 28, joinedAt: "2023-11-07" },
  { id: "u3", name: "Vikram", email: "vikram@example.com", age: 25, joinedAt: "2025-04-30" },
];

const columns: Column<User>[] = [
  { header: "Name", key: "name", sortable: true },
  { header: "Email", key: "email" },
  { header: "Age", key: "age", sortable: true },
  {
    header: "Member Since",
    sortable: true,
    render: (u) => new Date(u.joinedAt).toLocaleDateString(),
    sortAccessor: (u) => new Date(u.joinedAt),
  },
];

const meta: Meta<typeof DataTable<User>> = {
  title: "Components/DataTable",
  component: DataTable<User>,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    loading: { control: "boolean" },
    selectable: { control: "boolean" },
    selectionMode: { control: { type: "radio" }, options: ["single", "multiple"] },
    onRowSelect: { action: "onRowSelect" }, // 👈 Storybook Actions binding
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    data: sample,
    columns,
    loading: false,
  },
};

export const Sortable: Story = {
  args: {
    data: sample,
    columns,
  },
};

export const SelectableMultiple: Story = {
  args: {
    data: sample,
    columns,
    selectable: true,
    selectionMode: "multiple",
    getRowId: (r: User) => r.id,
  },
};

export const SelectableSingle: Story = {
  args: {
    data: sample,
    columns,
    selectable: true,
    selectionMode: "single",
    getRowId: (r: User) => r.id,
  },
};

export const Loading: Story = {
  args: {
    data: [],
    columns,
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    columns,
    loading: false,
    emptyState: "Nothing to show here 👀",
  },
};
