"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDitherStore } from "@/lib/store"
import SettingsCard from "@/components/algorithm-settings/settings-card"
import PreviewCanvas from "@/components/preview-canvas"

export default function StuckiSettings() {
  const { settings, updateSettings, applyPreset } = useDitherStore()
  const stuckiSettings = settings.stucki

  return (
    <SettingsCard
      title="Stucki Dithering"
      description="Error diffusion spreading error further (12 neighbors). Often produces sharper results than Floyd-Steinberg but can be noisier."
      algorithm="stucki"
    >
      <PreviewCanvas algorithm="stucki" />

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="stucki-strength">Propagation Strength:</Label>
            <span className="text-sm text-muted-foreground w-12 text-right">{stuckiSettings.strength}%</span>
          </div>
          <Slider
            id="stucki-strength"
            min={0}
            max={100}
            step={1}
            value={[stuckiSettings.strength]}
            onValueChange={(value) => updateSettings("stucki", "strength", value[0])}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stucki-distance">Propagation Matrix:</Label>
          <Select
            value={stuckiSettings.distance}
            onValueChange={(value) => updateSettings("stucki", "distance", value)}
          >
            <SelectTrigger id="stucki-distance">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stucki">Stucki (12 Neighbors)</SelectItem>
              <SelectItem value="stucki-reduced">Reduced (8 Neighbors)</SelectItem>
              <SelectItem value="stucki-minimal">Minimal (Like FS)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <Label>Presets:</Label>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => applyPreset("stucki", "default")}>
            Default
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyPreset("stucki", "sharper")}>
            Sharper
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyPreset("stucki", "softer")}>
            Softer
          </Button>
        </div>
      </div>
    </SettingsCard>
  )
}

