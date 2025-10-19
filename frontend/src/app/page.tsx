import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-dark_spring_green-50 to-sea_green-50 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl">
        <h1 className="text-6xl font-bold text-dark_spring_green-600">
          Welcome to the Zoo
        </h1>
        <p className="text-2xl text-sea_green-700">
          Management System
        </p>

        <div className="flex gap-6 justify-center mt-12">
          <Link
            href="/login"
            className="px-8 py-4 bg-dark_spring_green-500 text-white rounded-lg text-lg font-semibold hover:bg-dark_spring_green-600 transition-colors"
          >
            Employee Login
          </Link>
        </div>
      </div>
    </main>
  );
}
