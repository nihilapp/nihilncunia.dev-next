import { SessionProvider } from './_components';

interface Props {
  children: React.ReactNode;
}

export default function CommonLayout({ children, }: Props) {
  return (
    <div className='min-h-screen bg-background'>
      <SessionProvider>
        {children}
      </SessionProvider>
    </div>
  );
}
