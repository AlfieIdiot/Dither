"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageItem {
  src: string
  alt: string
  title: string
}

interface ImageLightboxProps {
  images: ImageItem[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
}

export default function ImageLightbox({ images, initialIndex, isOpen, onClose }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isClosing, setIsClosing] = useState(false)
  const [slideDirection, setSlideDirection] = useState<"none" | "left" | "right">("none")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const imageContainerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
      } else if (e.key === "ArrowRight") {
        goToNext()
      } else if (e.key === "ArrowLeft") {
        goToPrevious()
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn()
      } else if (e.key === "-") {
        handleZoomOut()
      } else if (e.key === "0") {
        resetZoom()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentIndex, zoomLevel])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Reset to initial index and zoom when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      setIsClosing(false)
      setSlideDirection("none")
      resetZoom()
    }
  }, [isOpen, initialIndex])

  const resetZoom = () => {
    setZoomLevel(1)
    setPanPosition({ x: 0, y: 0 })
  }

  const goToNext = () => {
    if (zoomLevel > 1) {
      resetZoom()
      return
    }

    setSlideDirection("left")
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
      setSlideDirection("none")
    }, 300)
  }

  const goToPrevious = () => {
    if (zoomLevel > 1) {
      resetZoom()
      return
    }

    setSlideDirection("right")
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
      setSlideDirection("none")
    }, 300)
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 4))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const newZoom = Math.max(prev - 0.5, 1)
      if (newZoom === 1) {
        setPanPosition({ x: 0, y: 0 })
      }
      return newZoom
    })
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      handleZoomIn()
    } else {
      handleZoomOut()
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      e.preventDefault()
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      const dx = e.clientX - dragStart.x
      const dy = e.clientY - dragStart.y

      setDragStart({ x: e.clientX, y: e.clientY })

      // Calculate boundaries to keep image within container
      const containerRect = imageContainerRef.current?.getBoundingClientRect()
      const imageRect = imageRef.current?.getBoundingClientRect()

      if (containerRect && imageRect) {
        const maxX = (imageRect.width * zoomLevel - containerRect.width) / 2
        const maxY = (imageRect.height * zoomLevel - containerRect.height) / 2

        setPanPosition({
          x: Math.max(-maxX, Math.min(maxX, panPosition.x + dx)),
          y: Math.max(-maxY, Math.min(maxY, panPosition.y + dy)),
        })
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  if (!isOpen) return null

  const currentImage = images[currentIndex]

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-300",
        isClosing && "bg-black/0 backdrop-blur-none",
      )}
      onClick={handleClose}
    >
      <div
        className={cn(
          "relative w-full max-w-4xl max-h-[90vh] flex flex-col transition-all duration-300",
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image container */}
        <div
          ref={imageContainerRef}
          className="relative flex-1 bg-black rounded-t-lg overflow-hidden"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={cn(
              "w-full h-[60vh] relative",
              slideDirection === "left" && "animate-slide-left",
              slideDirection === "right" && "animate-slide-right",
              zoomLevel > 1 && "cursor-grab",
              isDragging && "cursor-grabbing",
            )}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${zoomLevel})`,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  transform: `translate(${panPosition.x}px, ${panPosition.y}px)`,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  ref={imageRef}
                  src={currentImage.src || "/placeholder.svg"}
                  alt={currentImage.alt}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* Zoom controls */}
          <div className="absolute top-4 left-4 flex gap-2">
            <button
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation()
                handleZoomIn()
              }}
              aria-label="Zoom in"
              disabled={zoomLevel >= 4}
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation()
                handleZoomOut()
              }}
              aria-label="Zoom out"
              disabled={zoomLevel <= 1}
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            {zoomLevel > 1 && (
              <button
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation()
                  resetZoom()
                }}
                aria-label="Reset zoom"
              >
                <span className="text-xs font-medium">Reset</span>
              </button>
            )}
          </div>

          {/* Navigation buttons - only show when not zoomed */}
          {zoomLevel === 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300 hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevious()
                }}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300 hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Close button */}
          <button
            className="absolute right-4 top-4 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300 hover:scale-110 hover:rotate-90"
            onClick={(e) => {
              e.stopPropagation()
              handleClose()
            }}
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Caption */}
        <div className="bg-card p-4 rounded-b-lg">
          <h3 className="text-xl font-semibold text-center">{currentImage.title}</h3>
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-muted-foreground">
              Image {currentIndex + 1} of {images.length}
            </p>
            {zoomLevel > 1 && <p className="text-sm text-muted-foreground">Zoom: {zoomLevel.toFixed(1)}x</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

