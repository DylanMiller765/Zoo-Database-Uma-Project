// Server component (no "use client" needed)
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Simple shell — replace with your sidebar/topbar later */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </header>
      {children}
    </div>
  );
}
