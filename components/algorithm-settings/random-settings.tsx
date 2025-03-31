"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { useDitherStore } from "@/lib/store"
import SettingsCard from "@/components/algorithm-settings/settings-card"
import PreviewCanvas from "@/components/preview-canvas"

export default function RandomSettings() {
  const { settings, updateSettings, applyPreset } = useDitherStore()
  const randomSettings = settings.random

  const handleRandomizeSeed = () => {
    const newSeed = Math.floor(Math.random() * 99999) + 1
    updateSettings("random", "seed", newSeed)
  }

  return (
    <SettingsCard
      title="Random Noise Dithering"
      description="Adds random noise to pixel values before quantization. Simple but typically looks noisy and unstructured."
      algorithm="random"
    >
      <PreviewCanvas algorithm="random" />

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="random-intensity">Noise Intensity:</Label>
            <span className="text-sm text-muted-foreground w-12 text-right">{randomSettings.intensity}%</span>
          </div>
          <Slider
            id="random-intensity"
            min={0}
            max={100}
            step={1}
            value={[randomSettings.intensity]}
            onValueChange={(value) => updateSettings("random", "intensity", value[0])}
          />
        </div>

        <div className="space-y-2">
          <Label>Noise Type:</Label>
          <RadioGroup
            value={randomSettings.type}
            onValueChange={(value) => updateSettings("random", "type", value)}
            className="flex flex-wrap gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="random" id="random-type-random" />
              <Label htmlFor="random-type-random">White Noise</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="blocky" id="random-type-blocky" />
              <Label htmlFor="random-type-blocky">Blocky Noise</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="random-seed">Seed Value:</Label>
          <div className="flex gap-2">
            <Input
              id="random-seed"
              type="number"
              min={1}
              max={99999}
              value={randomSettings.seed}
              onChange={(e) => updateSettings("random", "seed", Number.parseInt(e.target.value) || 1)}
              className="w-32"
            />
            <Button variant="outline" onClick={handleRandomizeSeed}>
              Randomize
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="random-grain">Grain/Block Size:</Label>
            <span className="text-sm text-muted-foreground w-12 text-right">{randomSettings.grain}</span>
          </div>
          <Slider
            id="random-grain"
            min={1}
            max={16}
            step={1}
            value={[randomSettings.grain]}
            onValueChange={(value) => updateSettings("random", "grain", value[0])}
          />
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <Label>Presets:</Label>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => applyPreset("random", "defaultNoise")}>
            Default Noise
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyPreset("random", "coarseBlocks")}>
            Coarse Blocks
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyPreset("random", "highIntensity")}>
            High Intensity
          </Button>
        </div>
      </div>
    </SettingsCard>
  )
}

