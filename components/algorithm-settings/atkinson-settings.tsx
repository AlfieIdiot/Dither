"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useDitherStore } from "@/lib/store"
import SettingsCard from "@/components/algorithm-settings/settings-card"
import PreviewCanvas from "@/components/preview-canvas"

export default function AtkinsonSettings() {
  const { settings, updateSettings, applyPreset } = useDitherStore()
  const atkinsonSettings = settings.atkinson

  return (
    <SettingsCard
      title="Atkinson Dithering"
      description="Error-diffusion from early Macs. Spreads less error (1/8th to 6 neighbors), preserving detail but can lower contrast."
      algorithm="atkinson"
    >
      <PreviewCanvas algorithm="atkinson" />

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="atkinson-weight">Distribution Weight:</Label>
            <span className="text-sm text-muted-foreground w-12 text-right">{atkinsonSettings.weight}%</span>
          </div>
          <Slider
            id="atkinson-weight"
            min={0}
            max={100}
            step={1}
            value={[atkinsonSettings.weight]}
            onValueChange={(value) => updateSettings("atkinson", "weight", value[0])}
          />
        </div>

        <div className="space-y-2">
          <Label>Distribution Pattern (1/8 each):</Label>
          <div className="font-mono text-sm text-muted-foreground leading-tight bg-muted p-2 rounded inline-block">
            &nbsp;&nbsp;* 1 1 <br />1 1 1 <br />
            &nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="atkinson-edge">Edge Handling:</Label>
          <Switch
            id="atkinson-edge"
            checked={atkinsonSettings.edge}
            onCheckedChange={(checked) => updateSettings("atkinson", "edge", checked)}
          />
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <Label>Presets:</Label>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => applyPreset("atkinson", "default")}>
            Default
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyPreset("atkinson", "stronger")}>
            Stronger
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyPreset("atkinson", "lighter")}>
            Lighter
          </Button>
        </div>
      </div>
    </SettingsCard>
  )
}

