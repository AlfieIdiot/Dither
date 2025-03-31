"use client"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useDitherStore } from "@/lib/store"
import BayerSettings from "@/components/algorithm-settings/bayer-settings"
import FloydSteinbergSettings from "@/components/algorithm-settings/floyd-steinberg-settings"
import AtkinsonSettings from "@/components/algorithm-settings/atkinson-settings"
import StuckiSettings from "@/components/algorithm-settings/stucki-settings"
import BurkesSettings from "@/components/algorithm-settings/burkes-settings"
import RandomSettings from "@/components/algorithm-settings/random-settings"
import HalftoneSettings from "@/components/algorithm-settings/halftone-settings"
import BlueNoiseSettings from "@/components/algorithm-settings/blue-noise-settings"

export default function RightPanel() {
  const { currentAlgorithm, setCurrentAlgorithm } = useDitherStore()

  return (
    <Card className="flex-1 min-w-[300px] p-4 md:p-6 flex flex-col gap-4 md:gap-6 overflow-auto">
      <Tabs value={currentAlgorithm} onValueChange={setCurrentAlgorithm} className="w-full">
        <TabsList className="flex flex-wrap gap-1 mb-4 h-auto">
          <TabsTrigger value="bayer">Bayer</TabsTrigger>
          <TabsTrigger value="floyd-steinberg">Floyd-Steinberg</TabsTrigger>
          <TabsTrigger value="atkinson">Atkinson</TabsTrigger>
          <TabsTrigger value="stucki">Stucki</TabsTrigger>
          <TabsTrigger value="burkes">Burkes</TabsTrigger>
          <TabsTrigger value="random">Random</TabsTrigger>
          <TabsTrigger value="halftone">Halftone</TabsTrigger>
          <TabsTrigger value="blue-noise">Blue Noise</TabsTrigger>
        </TabsList>

        <TabsContent value="bayer">
          <BayerSettings />
        </TabsContent>

        <TabsContent value="floyd-steinberg">
          <FloydSteinbergSettings />
        </TabsContent>

        <TabsContent value="atkinson">
          <AtkinsonSettings />
        </TabsContent>

        <TabsContent value="stucki">
          <StuckiSettings />
        </TabsContent>

        <TabsContent value="burkes">
          <BurkesSettings />
        </TabsContent>

        <TabsContent value="random">
          <RandomSettings />
        </TabsContent>

        <TabsContent value="halftone">
          <HalftoneSettings />
        </TabsContent>

        <TabsContent value="blue-noise">
          <BlueNoiseSettings />
        </TabsContent>
      </Tabs>
    </Card>
  )
}

