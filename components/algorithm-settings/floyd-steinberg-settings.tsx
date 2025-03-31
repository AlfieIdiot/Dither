"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDitherStore } from "@/lib/store"
import SettingsCard from "@/components/algorithm-settings/settings-card"
import PreviewCanvas from "@/components/preview-canvas"

export default function FloydSteinbergSettings() {
  const { settings, updateSettings, applyPreset } = useDitherStore()
  const fsSettings = settings["floyd-steinberg"]

  return (
    <SettingsCard
      title="Floyd-Steinberg Dithering"
      description="Classic error-diffusion algorithm distributing quantization error smoothly to 4 neighboring pixels. Good general-purpose choice."
      algorithm="floyd-steinberg"
    >
      <PreviewCanvas algorithm="floyd-steinberg" />

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="fs-strength">Diffusion Strength:</Label>
            <span className="text-sm text-muted-foreground w-12 text-right">{fsSettings.strength}%</span>
          </div>
          <Slider
            id="fs-strength"
            min={0}
            max={100}
            step={1}
            value={[fsSettings.strength]}
            onValueChange={(value) => updateSettings("floyd-steinberg", "strength", value[0])}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="fs-serpentine">Serpentine:</Label>
          <Switch
            id="fs-serpentine"
            checked={fsSettings.serpentine}
            onCheckedChange={(checked) => updateSettings("floyd-steinberg", "serpentine", checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fs-reduction">Color Matching:</Label>
          <Select
            value={fsSettings.reduction}
            onValueChange={(value) => updateSettings("floyd-steinberg", "reduction", value)}
          >
            <SelectTrigger id="fs-reduction">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nearest">Nearest (Fast)</SelectItem>
              <SelectItem value="euclidean">Euclidean</SelectItem>
              <SelectItem value="weighted">Weighted RGB</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <Label>Presets:</Label>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => applyPreset("floyd-steinberg", "default")}>
            Default
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyPreset("floyd-steinberg", "softer")}>
            Softer
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyPreset("floyd-steinberg", "harsh")}>
            Harsh
          </Button>
        </div>
      </div>
    </SettingsCard>
  )
}

