import Link from "next/link"
import ModeToggle from "@/components/ui/theme-switcher"

export function Header() {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex h-14 items-center justify-between">
            <Link href="/" className="font-bold">
              Lt. Toolkit
            </Link>
            <span className="flex gap-4 justify-center items-center">
              <Link href="/chatvoice" className="text-sm hover:underline text-neutral-500">
                Chatvoice
              </Link>
              <Link href="/word-tracker" className="text-sm hover:underline text-neutral-500">
                Word Tracker
              </Link>
              <ModeToggle />
            </span>
          </div>
        </div>
      </header>
    )
  }