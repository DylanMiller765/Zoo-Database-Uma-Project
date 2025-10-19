import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold">ZooVerse 12</Link>

        <nav className="hidden gap-6 text-sm text-gray-700 md:flex">
          <Link href="/exhibits">Exhibits</Link>
          <Link href="/attractions">Attractions</Link>
          <Link href="/donate">Donate</Link>
          <Link href="/Visit">Visit</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden md:inline-flex">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/tickets">Get Tickets</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
