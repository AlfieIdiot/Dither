"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useDitherStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CanvasDisplay() {
  const {
    originalImage,
    originalCanvas,
    ditheredCanvas,
    showOriginal,
    zoomLevel,
    panX,
    panY,
    setPanX,
    setPanY,
    setOriginalCanvas,
    setDitheredCanvas,
    applyDither,
    resetImage,
  } = useDitherStore()

  const containerRef = useRef<HTMLDivElement>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 })
  const [showRemoveButton, setShowRemoveButton] = useState(false)

  // Initialize canvases when component mounts
  useEffect(() => {
    const origCanvas = document.createElement("canvas")
    const dithCanvas = document.createElement("canvas")

    setOriginalCanvas(origCanvas)
    setDitheredCanvas(dithCanvas)

    return () => {
      setOriginalCanvas(null)
      setDitheredCanvas(null)
    }
  }, [setOriginalCanvas, setDitheredCanvas])

  // Draw original image to canvas when it changes
  useEffect(() => {
    if (originalImage && originalCanvas) {
      originalCanvas.width = originalImage.width
      originalCanvas.height = originalImage.height

      const ctx = originalCanvas.getContext("2d", { willReadFrequently: true })
      if (ctx) {
        ctx.drawImage(originalImage, 0, 0)

        // Also set up dithered canvas
        if (ditheredCanvas) {
          ditheredCanvas.width = originalImage.width
          ditheredCanvas.height = originalImage.height

          // Trigger initial dithering
          applyDither()
        }
      }
    }
  }, [originalImage, originalCanvas, ditheredCanvas, applyDither])

  // Add keyboard shortcut for removing image
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "x" || e.key === "X") {
        if (originalImage) {
          resetImage()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [originalImage, resetImage])

  // Handle mouse events for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!originalImage || e.button !== 0) return
    setIsPanning(true)
    setLastPanPosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || !originalImage) return

    const dx = e.clientX - lastPanPosition.x
    const dy = e.clientY - lastPanPosition.y

    setPanX(panX + dx)
    setPanY(panY + dy)
    setLastPanPosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  // Handle wheel events for zooming
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()

    if (!containerRef.current || !originalImage) return

    const rect = containerRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calculate zoom factor based on wheel delta
    const delta = Math.sign(e.deltaY)
    const zoomFactor = 1.15
    const newZoomLevel = delta < 0 ? Math.min(zoomLevel * zoomFactor, 4) : Math.max(zoomLevel / zoomFactor, 0.1)

    // Calculate new pan position to zoom toward mouse position
    const scaleChange = newZoomLevel / zoomLevel
    const imgCoordX = (mouseX - panX) / zoomLevel
    const imgCoordY = (mouseY - panY) / zoomLevel

    const newPanX = mouseX - imgCoordX * newZoomLevel
    const newPanY = mouseY - imgCoordY * newZoomLevel

    useDitherStore.setState({
      zoomLevel: newZoomLevel,
      panX: newPanX,
      panY: newPanY,
    })
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full border border-border rounded-lg overflow-hidden bg-black",
        isPanning ? "cursor-grabbing" : "cursor-grab",
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onMouseEnter={() => setShowRemoveButton(true)}
      onMouseLeave={() => setShowRemoveButton(false)}
      style={{
        backgroundImage: `
          linear-gradient(45deg, #2a2a2d 25%, transparent 25%),
          linear-gradient(-45deg, #2a2a2d 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #2a2a2d 75%),
          linear-gradient(-45deg, transparent 75%, #2a2a2d 75%)
        `,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
      }}
    >
      {originalImage ? (
        <>
          {originalCanvas && (
            <canvas
              className={cn(
                "absolute top-1/2 left-1/2 max-w-none max-h-none image-rendering-pixelated",
                !showOriginal && "hidden",
              )}
              style={{
                transform: `translate(-50%, -50%) translate(${panX}px, ${panY}px) scale(${zoomLevel})`,
              }}
              width={originalCanvas.width}
              height={originalCanvas.height}
              ref={(el) => {
                if (el && originalCanvas) {
                  const ctx = el.getContext("2d")
                  if (ctx) {
                    ctx.drawImage(originalCanvas, 0, 0)
                  }
                }
              }}
            />
          )}

          {ditheredCanvas && (
            <canvas
              className={cn(
                "absolute top-1/2 left-1/2 max-w-none max-h-none image-rendering-pixelated",
                showOriginal && "hidden",
              )}
              style={{
                transform: `translate(-50%, -50%) translate(${panX}px, ${panY}px) scale(${zoomLevel})`,
              }}
              width={ditheredCanvas.width}
              height={ditheredCanvas.height}
              ref={(el) => {
                if (el && ditheredCanvas) {
                  const ctx = el.getContext("2d")
                  if (ctx) {
                    ctx.drawImage(ditheredCanvas, 0, 0)
                  }
                }
              }}
            />
          )}

          {showRemoveButton && (
            <div className="absolute top-2 right-2 z-10 opacity-70 hover:opacity-100 transition-opacity">
              <Button
                variant="destructive"
                size="icon"
                onClick={resetImage}
                title="Remove image (press X)"
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="absolute inset-0 flex items-center justify-center text-muted-foreground font-medium">
          No image loaded
        </p>
      )}
    </div>
  )
}

