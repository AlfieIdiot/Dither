"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { useDitherStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export default function ImageUploader() {
  const { loadImage } = useDitherStore()
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return

      const file = files[0]
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file (PNG, JPG, GIF, WebP, etc.).")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          const img = new Image()
          img.onload = () => {
            loadImage(img)
          }
          img.onerror = () => {
            alert("Could not load image file. It might be corrupted.")
          }
          img.src = e.target.result as string
        }
      }
      reader.onerror = () => {
        alert("Error reading file.")
      }
      reader.readAsDataURL(file)
    },
    [loadImage],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect],
  )

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 border-3 border-dashed border-border rounded-lg cursor-pointer bg-card/50 transition-colors",
        isDragging && "border-primary/70 bg-primary/5",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-input")?.click()}
      role="button"
      tabIndex={0}
      aria-label="Upload image area"
    >
      <p className="mb-4 text-muted-foreground text-lg">Drag & drop an image here</p>
      <Button variant="outline">Click to Upload</Button>
      <input
        type="file"
        id="file-input"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFileSelect(e.target.files)}
      />
    </div>
  )
}

