import PendingProjectsTable from '@/components/admin/PendingProjectsTable';

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <PendingProjectsTable />
    </div>
  );
}