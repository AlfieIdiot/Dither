import type { ReactNode } from "react"

interface SettingsCardProps {
  title: string
  description: string
  children: ReactNode
  algorithm: string // Add algorithm prop
}

export default function SettingsCard({ title, description, children, algorithm }: SettingsCardProps) {
  return (
    <div className="space-y-4" data-algorithm={algorithm}>
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold font-heading border-b pb-1.5 animate-gradient bg-gradient-to-r from-primary via-purple-400 to-primary/70 bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  )
}

