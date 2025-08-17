import * as React from "react";
import DataTable from "../components/DataTable";
import type { Column } from "../props/DataTable.props";

type User = {
  id: string;
  name: string;
  email: string;
  age: number;
  joinedAt: string; // ISO date
};

const columns: Column<User>[] = [
  { key: "name", header: "Name", sortable: true },
  { key: "email", header: "Email" },
  {
    key: "age",
    header: "Age",
    sortable: true,
  },
  {
    header: "Member Since",
    sortable: true,
    render: (u) => new Date(u.joinedAt).toLocaleDateString(),
    sortAccessor: (u) => new Date(u.joinedAt), // correct date sorting
  },
];

const data: User[] = [
  { id: "u1", name: "Aditya", email: "aditya@example.com", age: 22, joinedAt: "2024-02-12" },
  { id: "u2", name: "Sara", email: "sara@example.com", age: 28, joinedAt: "2023-11-07" },
  { id: "u3", name: "Vikram", email: "vikram@example.com", age: 25, joinedAt: "2025-04-30" },
];

export default function UsersDemo() {
  const [loading] = React.useState(false);

  return (
    <div className="p-6">
      <DataTable<User>
        data={data}
        columns={columns}
        loading={loading}
        selectable
        selectionMode="multiple"
        getRowId={(r) => r.id}
        onRowSelect={(rows) => console.log("Selected:", rows)}
      />
    </div>
  );
}
