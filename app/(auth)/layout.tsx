import { AuthCard, AuthHeader, AuthLayoutProvider } from './_components';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col text-black-base'>
      <AuthHeader />

      <div className='flex-1 flex items-center justify-center p-6'>
        <AuthLayoutProvider>
          <AuthCard>
            {children}
          </AuthCard>
        </AuthLayoutProvider>
      </div>
    </div>
  );
}
