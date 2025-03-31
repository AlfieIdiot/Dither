import { Github, Info } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-3 md:p-4 border-b bg-card shadow-sm">
      <div className="flex items-center gap-2">
        <Image src="/favicon.svg" alt="Dither Logo" width={24} height={24} className="h-6 w-6" />
        <h1 className="text-xl md:text-2xl font-bold font-heading animate-gradient bg-gradient-to-r from-primary via-purple-400 to-primary/70 bg-clip-text text-transparent">
          Dither
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/about"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Info className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">About</span>
        </Link>
        <Link
          href="https://github.com/Saganaki22/Dither"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Github className="h-5 w-5" />
          <span className="hidden sm:inline text-sm">GitHub</span>
        </Link>
      </div>
    </header>
  )
}

