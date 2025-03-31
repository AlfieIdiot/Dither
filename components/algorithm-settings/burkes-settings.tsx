"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useDitherStore } from "@/lib/store"
import SettingsCard from "@/components/algorithm-settings/settings-card"
import PreviewCanvas from "@/components/preview-canvas"

export default function BurkesSettings() {
  const { settings, updateSettings, applyPreset } = useDitherStore()
  const burkesSettings = settings.burkes

  return (
    <SettingsCard
      title="Burkes Dithering"
      description="Simplified error diffusion (5 neighbors). Faster than Floyd-Steinberg, produces slightly different texture."
      algorithm="burkes"
    >
      <PreviewCanvas algorithm="burkes" />

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="burkes-intensity">Diffusion Intensity:</Label>
            <span className="text-sm text-muted-foreground w-12 text-right">{burkesSettings.intensity}%</span>
          </div>
          <Slider
            id="burkes-intensity"
            min={0}
            max={100}
            step={1}
            value={[burkesSettings.intensity]}
            onValueChange={(value) => updateSettings("burkes", "intensity", value[0])}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="burkes-serpentine">Serpentine:</Label>
          <Switch
            id="burkes-serpentine"
            checked={burkesSettings.serpentine}
            onCheckedChange={(checked) => updateSettings("burkes", "serpentine", checked)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="burkes-bias">Direction Bias:</Label>
            <span className="text-sm text-muted-foreground w-12 text-right">{burkesSettings.bias}%</span>
          </div>
          <Slider
            id="burkes-bias"
            min={-50}
            max={50}
            step={5}
            value={[burkesSettings.bias]}
            onValueChange={(value) => updateSettings("burkes", "bias", value[0])}
          />
          <p className="text-xs text-muted-foreground">(-50% = Horizontal, 50% = Diagonal)</p>
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <Label>Presets:</Label>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => applyPreset("burkes", "default")}>
            Default
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyPreset("burkes", "diagonalEmphasis")}>
            Diagonal Emphasis
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyPreset("burkes", "softerHorizontal")}>
            Softer Horizontal
          </Button>
        </div>
      </div>
    </SettingsCard>
  )
}

