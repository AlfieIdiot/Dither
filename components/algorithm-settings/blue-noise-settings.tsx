"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDitherStore } from "@/lib/store"
import SettingsCard from "@/components/algorithm-settings/settings-card"
import PreviewCanvas from "@/components/preview-canvas"

export default function BlueNoiseSettings() {
  const { settings, updateSettings, applyPreset } = useDitherStore()
  const blueNoiseSettings = settings["blue-noise"]

  return (
    <SettingsCard
      title="Blue Noise Dithering"
      description="Uses noise with minimized low-frequency components for visually pleasing, less structured results. (Simplified JS version using basic patterns)."
      algorithm="blue-noise"
    >
      <PreviewCanvas algorithm="blue-noise" />

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="blue-noise-intensity">Noise Influence:</Label>
            <span className="text-sm text-muted-foreground w-12 text-right">{blueNoiseSettings.intensity}%</span>
          </div>
          <Slider
            id="blue-noise-intensity"
            min={0}
            max={100}
            step={1}
            value={[blueNoiseSettings.intensity]}
            onValueChange={(value) => updateSettings("blue-noise", "intensity", value[0])}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="blue-noise-pattern">Pattern Type:</Label>
          <Select
            value={blueNoiseSettings.pattern}
            onValueChange={(value) => updateSettings("blue-noise", "pattern", value)}
          >
            <SelectTrigger id="blue-noise-pattern">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="interleaved">Interleaved Gradient</SelectItem>
              <SelectItem value="checkerboard">Checkerboard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="blue-noise-frequency">Frequency Emphasis:</Label>
            <span className="text-sm text-muted-foreground w-12 text-right">{blueNoiseSettings.frequency}%</span>
          </div>
          <Slider
            id="blue-noise-frequency"
            min={-50}
            max={50}
            step={5}
            value={[blueNoiseSettings.frequency]}
            onValueChange={(value) => updateSettings("blue-noise", "frequency", value[0])}
          />
          <p className="text-xs text-muted-foreground">(Adjusts threshold curve)</p>
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <Label>Presets:</Label>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => applyPreset("blue-noise", "default")}>
            Default
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyPreset("blue-noise", "highFreq")}>
            High Freq Emphasis
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyPreset("blue-noise", "checkerboardLow")}>
            Checkerboard Low
          </Button>
        </div>
      </div>
    </SettingsCard>
  )
}

