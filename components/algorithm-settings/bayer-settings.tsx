"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useDitherStore } from "@/lib/store"
import SettingsCard from "@/components/algorithm-settings/settings-card"
import PreviewCanvas from "@/components/preview-canvas"

export default function BayerSettings() {
  const { settings, updateSettings, applyPreset } = useDitherStore()
  const bayerSettings = settings.bayer

  return (
    <SettingsCard
      title="Ordered Dithering (Bayer)"
      description="Uses a predefined matrix grid (Bayer pattern) to determine thresholds, creating structured, cross-hatch like patterns."
      algorithm="bayer"
    >
      <PreviewCanvas algorithm="bayer" />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Matrix Size:</Label>
          <RadioGroup
            value={bayerSettings.matrix.toString()}
            onValueChange={(value) => updateSettings("bayer", "matrix", Number.parseInt(value))}
            className="flex flex-wrap gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="bayer-2" />
              <Label htmlFor="bayer-2">2×2</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id="bayer-4" />
              <Label htmlFor="bayer-4">4×4</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="8" id="bayer-8" />
              <Label htmlFor="bayer-8">8×8</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="16" id="bayer-16" />
              <Label htmlFor="bayer-16">16×16</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="bayer-threshold">Threshold Bias:</Label>
            <span className="text-sm text-muted-foreground w-12 text-right">{bayerSettings.threshold}%</span>
          </div>
          <Slider
            id="bayer-threshold"
            min={0}
            max={100}
            step={1}
            value={[bayerSettings.threshold]}
            onValueChange={(value) => updateSettings("bayer", "threshold", value[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="bayer-scaling">Pattern Influence:</Label>
            <span className="text-sm text-muted-foreground w-12 text-right">{bayerSettings.scaling}</span>
          </div>
          <Slider
            id="bayer-scaling"
            min={1}
            max={5}
            step={1}
            value={[bayerSettings.scaling]}
            onValueChange={(value) => updateSettings("bayer", "scaling", value[0])}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="bayer-display-pattern">Show Pattern (Debug):</Label>
          <Switch
            id="bayer-display-pattern"
            checked={bayerSettings.displayPattern}
            onCheckedChange={(checked) => updateSettings("bayer", "displayPattern", checked)}
          />
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <Label>Presets:</Label>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => applyPreset("bayer", "default")}>
            Default
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyPreset("bayer", "subtle")}>
            Subtle
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyPreset("bayer", "strongGrid")}>
            Strong Grid
          </Button>
        </div>
      </div>
    </SettingsCard>
  )
}

