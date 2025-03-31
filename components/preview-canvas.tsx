"use client"

import { useEffect, useRef } from "react"
import { useDitherStore } from "@/lib/store"

interface PreviewCanvasProps {
  algorithm: string
}

export default function PreviewCanvas({ algorithm }: PreviewCanvasProps) {
  const {
    updatePreviewThumbnail,
    zoomLevel,
    panX,
    panY,
    originalCanvas,
    ditheredCanvas,
    monochrome,
    colorDepth,
    currentAlgorithm,
  } = useDitherStore()

  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (previewCanvasRef.current) {
      updatePreviewThumbnail(algorithm, previewCanvasRef.current)
    }
  }, [updatePreviewThumbnail, algorithm, ditheredCanvas, monochrome, colorDepth, currentAlgorithm])

  // Calculate the viewport box dimensions and position
  const getViewportBox = () => {
    if (!originalCanvas || !ditheredCanvas) return null

    // Get the preview canvas dimensions
    const previewWidth = 180
    const previewHeight = 180

    // Calculate the scale of the preview relative to the original image
    const previewScale = Math.min(previewWidth / ditheredCanvas.width, previewHeight / ditheredCanvas.height)

    // Calculate the scaled dimensions of the original image in the preview
    const scaledOrigWidth = ditheredCanvas.width * previewScale
    const scaledOrigHeight = ditheredCanvas.height * previewScale

    // Calculate the offset to center the scaled image in the preview
    const offsetX = (previewWidth - scaledOrigWidth) / 2
    const offsetY = (previewHeight - scaledOrigHeight) / 2

    // Calculate the viewport dimensions in the preview
    // The viewport size is determined by the visible area in the main canvas
    const viewportWidth = Math.min(scaledOrigWidth, scaledOrigWidth / zoomLevel)
    const viewportHeight = Math.min(scaledOrigHeight, scaledOrigHeight / zoomLevel)

    // Calculate the viewport position in the preview
    // This needs to match the pan position in the main canvas
    const mainCanvasCenterX = ditheredCanvas.width / 2
    const mainCanvasCenterY = ditheredCanvas.height / 2

    // Calculate how far from center we've panned (in original image coordinates)
    const panOffsetX = -panX / zoomLevel
    const panOffsetY = -panY / zoomLevel

    // Calculate the center point of the viewport in original image coordinates
    const viewportCenterX = mainCanvasCenterX + panOffsetX
    const viewportCenterY = mainCanvasCenterY + panOffsetY

    // Convert to preview coordinates
    const previewCenterX = viewportCenterX * previewScale
    const previewCenterY = viewportCenterY * previewScale

    // Calculate the top-left corner of the viewport in preview coordinates
    const viewportX = offsetX + previewCenterX - viewportWidth / 2
    const viewportY = offsetY + previewCenterY - viewportHeight / 2

    // Ensure the box stays within the preview bounds
    const clampedX = Math.max(offsetX, Math.min(offsetX + scaledOrigWidth - viewportWidth, viewportX))
    const clampedY = Math.max(offsetY, Math.min(offsetY + scaledOrigHeight - viewportHeight, viewportY))

    return {
      width: viewportWidth,
      height: viewportHeight,
      left: clampedX,
      top: clampedY,
    }
  }

  const viewportBox = getViewportBox()

  return (
    <div className="relative w-[180px] h-[180px] border border-border bg-black rounded self-center mb-4">
      <canvas ref={previewCanvasRef} width={180} height={180} className="w-full h-full image-rendering-pixelated" />
      {viewportBox && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: viewportBox.top,
            left: viewportBox.left,
            width: viewportBox.width,
            height: viewportBox.height,
            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.8), 0 0 0 6px rgba(59, 130, 246, 0.3)",
            border: "2px solid #3b82f6",
            zIndex: 10,
          }}
        />
      )}
    </div>
  )
}

