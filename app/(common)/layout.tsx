import { SessionProvider } from './_components';

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-background'>
      <SessionProvider>
        {children}
      </SessionProvider>
    </div>
  );
}
