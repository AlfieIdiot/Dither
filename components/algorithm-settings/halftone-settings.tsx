"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useDitherStore } from "@/lib/store"
import SettingsCard from "@/components/algorithm-settings/settings-card"
import PreviewCanvas from "@/components/preview-canvas"

export default function HalftoneSettings() {
  const { settings, updateSettings, applyPreset } = useDitherStore()
  const halftoneSettings = settings.halftone

  return (
    <SettingsCard
      title="Halftone Dithering"
      description="Simulates traditional printing halftones using dots of varying size based on intensity. (Simplified JS version)."
      algorithm="halftone"
    >
      <PreviewCanvas algorithm="halftone" />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Dot Shape:</Label>
          <RadioGroup
            value={halftoneSettings.shape}
            onValueChange={(value) => updateSettings("halftone", "shape", value)}
            className="flex flex-wrap gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="circle" id="halftone-shape-circle" />
              <Label htmlFor="halftone-shape-circle">Circle</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="square" id="halftone-shape-square" />
              <Label htmlFor="halftone-shape-square">Square</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="diamond" id="halftone-shape-diamond" />
              <Label htmlFor="halftone-shape-diamond">Diamond</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="halftone-cell-size">Cell Size:</Label>
            <span className="text-sm text-muted-foreground w-12 text-right">{halftoneSettings.cellSize}px</span>
          </div>
          <Slider
            id="halftone-cell-size"
            min={3}
            max={32}
            step={1}
            value={[halftoneSettings.cellSize]}
            onValueChange={(value) => updateSettings("halftone", "cellSize", value[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="halftone-angle">Grid Angle:</Label>
            <span className="text-sm text-muted-foreground w-12 text-right">{halftoneSettings.angle}°</span>
          </div>
          <Slider
            id="halftone-angle"
            min={0}
            max={90}
            step={5}
            value={[halftoneSettings.angle]}
            onValueChange={(value) => updateSettings("halftone", "angle", value[0])}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="halftone-scaling">Dot Scaling:</Label>
          <div className="flex items-center gap-2">
            <Switch
              id="halftone-scaling"
              checked={halftoneSettings.scaling}
              onCheckedChange={(checked) => updateSettings("halftone", "scaling", checked)}
            />
            <span className="text-xs text-muted-foreground">(ON = Non-Linear)</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="halftone-cmyk">CMYK Simulation:</Label>
          <div className="flex items-center gap-2">
            <Switch
              id="halftone-cmyk"
              checked={halftoneSettings.cmyk}
              onCheckedChange={(checked) => updateSettings("halftone", "cmyk", checked)}
            />
            <span className="text-xs text-muted-foreground">{halftoneSettings.cmyk ? "On" : "Off"}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <Label>Presets:</Label>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => applyPreset("halftone", "newspaper")}>
            Newspaper
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyPreset("halftone", "grid")}>
            Grid (Linear)
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyPreset("halftone", "fineDiamond")}>
            Fine Diamond
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyPreset("halftone", "cmykPrint")}>
            CMYK Print
          </Button>
        </div>
      </div>
    </SettingsCard>
  )
}

