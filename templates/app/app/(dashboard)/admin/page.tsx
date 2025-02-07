import { auth } from '@/auth';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Not authenticated
      </div>
    );
  }

  if (session?.user?.role !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Not authorized
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      This is Admin Section
    </div>
  );
}
