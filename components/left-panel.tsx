"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Minus, Plus, ChevronDown, ChevronUp } from "lucide-react"
import { useDitherStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import CanvasDisplay from "@/components/canvas-display"
import ImageUploader from "@/components/image-uploader"

export default function LeftPanel() {
  const {
    originalImage,
    showOriginal,
    setShowOriginal,
    monochrome,
    setMonochrome,
    colorDepth,
    setColorDepth,
    zoomLevel,
    setZoomLevel,
    resetView,
    processingStatus,
    downloadFormat,
    setDownloadFormat,
    downloadImage,
    resetImage,
    isDefaultImageLoaded,
  } = useDitherStore()

  const [imageInfo, setImageInfo] = useState("")
  const [controlsOpen, setControlsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Removed the default image loading functionality

  useEffect(() => {
    if (originalImage) {
      setImageInfo(`${originalImage.width}×${originalImage.height} pixels`)
    } else {
      setImageInfo("")
    }
  }, [originalImage])

  return (
    <Card className="flex-1 min-w-[300px] p-4 md:p-6 flex flex-col gap-4 md:gap-6 overflow-auto">
      {!originalImage ? (
        <ImageUploader />
      ) : (
        <div className="flex flex-col gap-4 md:gap-6 flex-grow">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{imageInfo}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetImage}
              className="text-muted-foreground hover:text-destructive"
            >
              Remove Image
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 p-2 md:p-3 bg-card/50 rounded-md">
            <Button variant="outline" size="sm" onClick={resetView}>
              Reset View
            </Button>
            <div className="flex items-center gap-2 flex-1">
              <Button variant="outline" size="icon" onClick={() => setZoomLevel(zoomLevel / 1.25)}>
                <Minus className="h-4 w-4" />
              </Button>

              {/* Show slider only on desktop */}
              {!isMobile && (
                <Slider
                  value={[zoomLevel * 100]}
                  min={25}
                  max={400}
                  step={1}
                  onValueChange={(value) => setZoomLevel(value[0] / 100)}
                  className="flex-1"
                />
              )}

              <span className="text-xs bg-muted px-2 py-1 rounded min-w-[3.5em] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <Button variant="outline" size="icon" onClick={() => setZoomLevel(zoomLevel * 1.25)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Canvas display with dynamic height based on controls state */}
          <div
            className={cn(
              "transition-all duration-300 ease-in-out",
              controlsOpen ? "h-[300px] md:h-[400px]" : "h-[400px] md:h-[500px]",
            )}
          >
            <CanvasDisplay />
          </div>

          {/* Accordion header */}
          <Button
            variant="ghost"
            className="flex items-center justify-between w-full border-t pt-2"
            onClick={() => setControlsOpen(!controlsOpen)}
          >
            <span className="font-medium">Image Settings</span>
            {controlsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {/* Accordion content */}
          <div
            className={cn(
              "grid gap-4 transition-all duration-300 overflow-hidden",
              controlsOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 h-0",
            )}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-card/50 rounded-md">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-original" className="cursor-pointer flex-1 font-medium">
                  Show Original
                </Label>
                <Switch id="show-original" checked={showOriginal} onCheckedChange={setShowOriginal} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="monochrome" className="cursor-pointer flex-1 font-medium">
                  Monochrome
                </Label>
                <Switch id="monochrome" checked={monochrome} onCheckedChange={setMonochrome} />
              </div>
              <div className={cn("flex items-center justify-between", monochrome && "hidden")}>
                <Label htmlFor="color-depth" className="flex-1 font-medium">
                  Colors
                </Label>
                <Select value={colorDepth.toString()} onValueChange={(value) => setColorDepth(Number.parseInt(value))}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="16">16</SelectItem>
                    <SelectItem value="32">32</SelectItem>
                    <SelectItem value="64">64</SelectItem>
                    <SelectItem value="128">128</SelectItem>
                    <SelectItem value="256">256</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto pt-4 border-t">
            <Select value={downloadFormat} onValueChange={setDownloadFormat}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpeg">JPEG</SelectItem>
                <SelectItem value="webp">WebP</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={downloadImage}
              className="animate-gradient-button bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              Download
            </Button>
          </div>

          <p className="text-center text-sm text-primary/80 min-h-[1.2em]">{processingStatus}</p>
        </div>
      )}
    </Card>
  )
}

