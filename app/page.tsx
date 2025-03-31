"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import LeftPanel from "@/components/left-panel"
import RightPanel from "@/components/right-panel"

export default function Home() {
  const [pageLoaded, setPageLoaded] = useState(false)

  useEffect(() => {
    setPageLoaded(true)
  }, [])

  return (
    <div
      className={`flex flex-col min-h-screen bg-background text-foreground transition-opacity duration-500 ease-in-out ${pageLoaded ? "opacity-100" : "opacity-0"}`}
    >
      <Header />
      <main className="flex flex-col md:flex-row flex-grow p-4 md:p-6 gap-4 md:gap-6">
        <LeftPanel />
        <RightPanel />
      </main>
    </div>
  )
}

