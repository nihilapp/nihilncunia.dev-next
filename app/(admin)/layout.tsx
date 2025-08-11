import { AdminLayoutProvider } from './_components';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-background'>
      <AdminLayoutProvider>
        {children}
      </AdminLayoutProvider>
    </div>
  );
}
