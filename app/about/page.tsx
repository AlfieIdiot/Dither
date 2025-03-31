"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Maximize2 } from "lucide-react"
import Footer from "@/components/footer"
import ImageLightbox from "@/components/image-lightbox"
import { useRouter } from "next/navigation"

// Define the gallery images
const ditherExamples = [
  {
    src: "/examples/dithered-bayer.png",
    alt: "Bayer Dithering Example",
    title: "Ordered Dithering (Bayer)",
    description:
      "Uses a predetermined matrix pattern to determine thresholds for each pixel. Creates a structured, cross-hatch like pattern that's computationally efficient but can appear more regular and grid-like.",
  },
  {
    src: "/examples/dithered-floyd-steinberg.png",
    alt: "Floyd-Steinberg Example",
    title: "Floyd-Steinberg",
    description:
      'A popular error-diffusion algorithm that propagates quantization errors to neighboring pixels. Creates a more natural-looking result with fewer patterns, but can introduce "serpentine" artifacts.',
  },
  {
    src: "/examples/dithered-atkinson.png",
    alt: "Atkinson Example",
    title: "Atkinson",
    description:
      "Developed for early Apple Macintosh computers, this algorithm diffuses only a fraction of the error to neighboring pixels, resulting in cleaner output with better contrast but less accurate color representation.",
  },
  {
    src: "/examples/dithered-stucki.png",
    alt: "Stucki Example",
    title: "Stucki",
    description:
      "An enhanced error diffusion algorithm that spreads error to a wider range of pixels (12 neighbors). Often produces sharper results than Floyd-Steinberg but can be noisier in some areas.",
  },
  {
    src: "/examples/dithered-burkes.png",
    alt: "Burkes Example",
    title: "Burkes",
    description:
      "A simplified version of Stucki that uses fewer neighboring pixels, making it faster while still producing good quality results. A good balance between speed and quality.",
  },
  {
    src: "/examples/dithered-random.png",
    alt: "Random Dithering Example",
    title: "Random Dithering",
    description:
      "Adds random noise to pixel values before quantization. Simple but typically looks noisy and unstructured. Can be useful for creating texture or grain effects.",
  },
  {
    src: "/examples/dithered-halftone.png",
    alt: "Halftone Example",
    title: "Halftone",
    description:
      "Simulates traditional printing techniques by using dots of varying sizes. Creates a distinctive look reminiscent of newspapers and magazines. Can be configured for CMYK color separation.",
  },
  {
    src: "/examples/dithered-blue-noise.png",
    alt: "Blue Noise Example",
    title: "Blue Noise",
    description:
      "Uses noise with minimized low-frequency components for visually pleasing, less structured results. Often considered the highest quality dithering method but can be more complex to implement.",
  },
]

export default function AboutPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [pageLoaded, setPageLoaded] = useState(false)
  const router = useRouter()

  // Page load animation
  useEffect(() => {
    setPageLoaded(true)
  }, [])

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const handleBackToEditor = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    // Start exit animation
    setPageLoaded(false)

    // Navigate after animation completes
    setTimeout(() => {
      router.push("/")
    }, 500)
  }

  return (
    <div
      className={`flex flex-col min-h-screen bg-background text-foreground transition-opacity duration-500 ease-in-out ${pageLoaded ? "opacity-100" : "opacity-0"}`}
    >
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 lg:py-16 max-w-4xl">
        <div className="mb-6 md:mb-8">
          <Link
            href="/"
            onClick={handleBackToEditor}
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Editor
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 font-heading animate-gradient bg-gradient-to-r from-primary via-purple-400 to-primary/70 bg-clip-text text-transparent">
          About Dither
        </h1>

        <section className="mb-10 space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold font-heading">What is Dithering?</h2>
          <p className="text-base md:text-lg">
            Dithering is a technique used in computer graphics to create the illusion of color depth in images with a
            limited color palette. By applying a pattern of different colored pixels, dithering approximates the colors
            that cannot be directly displayed, creating a visual blend that appears closer to the original image when
            viewed from a distance.
          </p>
          <p className="text-base md:text-lg">
            This technique is particularly important when working with limited color palettes, such as in retro
            computing, pixel art, or when optimizing images for file size reduction while maintaining visual quality.
          </p>
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold font-heading">The Mathematics Behind Dithering</h2>
          <p className="text-base md:text-lg">
            At its core, dithering is a mathematical solution to a quantization problem. When reducing an image from
            millions of colors to a limited palette (e.g., 256 colors or less), a direct mapping would cause significant
            information loss and visible banding artifacts. Dithering algorithms solve this by:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-base md:text-lg">
            <li>
              <strong>Quantization Error Calculation</strong>: For each pixel, the algorithm calculates the difference
              between the original color value and the closest available color in the limited palette.
            </li>
            <li>
              <strong>Error Distribution</strong>: This quantization error is then distributed to neighboring pixels
              according to specific mathematical patterns or formulas.
            </li>
            <li>
              <strong>Spatial Integration</strong>: The human eye naturally blends closely positioned pixels, performing
              an unconscious spatial integration that perceives the dithered pattern as a mixture of the available
              colors.
            </li>
          </ol>
          <p className="text-base md:text-lg">
            For example, in Floyd-Steinberg dithering, the quantization error is distributed to neighboring pixels with
            the following fractional weights:
          </p>
          <div className="bg-muted p-4 rounded-md font-mono text-sm md:text-base my-4">
            <pre className="whitespace-pre-wrap">{"    X   7/16\n3/16 5/16 1/16"}</pre>
          </div>
          <p className="text-base md:text-lg">
            Where X is the current pixel, and the fractions show how the error is distributed to unprocessed neighboring
            pixels.
          </p>
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold font-heading">Origins and History</h2>
          <p className="text-base md:text-lg">
            The concept of dithering dates back to the early days of computing in the 1960s and 1970s when display
            hardware had severe color limitations. The term "dither" actually comes from audio processing, where it was
            used to reduce quantization error in analog-to-digital conversion.
          </p>
          <p className="text-base md:text-lg">
            In 1973, researchers at Bell Labs developed one of the first digital dithering techniques. Later, in the
            1980s, as personal computers became more widespread but still had limited color capabilities (often just 16
            or 256 colors), dithering became essential for displaying photographic images.
          </p>
          <p className="text-base md:text-lg">
            Early computer systems like the Apple Macintosh, Commodore Amiga, and early Windows PCs all relied heavily
            on dithering to display images with apparent color depth beyond their hardware capabilities.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 font-heading">Dithering Algorithms</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ditherExamples.map((example, index) => (
              <div
                key={index}
                className="bg-card rounded-lg p-6 shadow-sm transition-all duration-500 hover:shadow-lg hover:-translate-y-1 hover:bg-card/80"
                style={{
                  animationDelay: `${index * 100}ms`,
                  opacity: 0,
                  animation: pageLoaded ? "cardEntrance 0.5s ease forwards" : "none",
                }}
              >
                <h3 className="text-xl font-semibold mb-3">{example.title}</h3>
                <p className="mb-4">{example.description}</p>
                <div
                  className="aspect-video bg-black rounded-md flex items-center justify-center overflow-hidden relative group cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={example.src || "/placeholder.svg"}
                    alt={example.alt}
                    width={400}
                    height={300}
                    className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Maximize2 className="text-white h-8 w-8 transform scale-0 group-hover:scale-100 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold font-heading">Color Quantization and Efficiency</h2>
          <p className="text-base md:text-lg">
            Dithering is intimately connected with color quantization—the process of reducing the number of colors in an
            image. This combination addresses two fundamental challenges in digital imaging:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-base md:text-lg">
            <li>
              <strong>Representational Efficiency</strong>: By using a limited palette (e.g., 8-bit color instead of
              24-bit), images can require significantly less storage space and memory.
            </li>
            <li>
              <strong>Perceptual Quality</strong>: Through the strategic distribution of quantization errors, dithering
              creates an illusion of depth that exploits the human visual system's tendency to blend adjacent colors.
            </li>
          </ol>
          <p className="text-base md:text-lg">
            The efficiency of dithering comes from this perceptual hack: rather than storing exact color information for
            each pixel (requiring more bits), it uses carefully calculated patterns of limited colors that our eyes
            blend into a perceived match of the original image.
          </p>
          <p className="text-base md:text-lg">
            For instance, an 8-bit (256 color) dithered image might appear nearly indistinguishable from a 24-bit (16.7
            million color) original when viewed at normal distances, despite requiring only 1/3 of the storage space.
          </p>
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold font-heading">Modern Applications</h2>
          <p className="text-base md:text-lg">
            While modern displays can show millions of colors, dithering remains relevant for several reasons:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-base md:text-lg">
            <li>
              <strong>File size optimization</strong> - Reducing color depth with dithering can significantly decrease
              image file sizes while maintaining visual quality.
            </li>
            <li>
              <strong>Pixel art and retro aesthetics</strong> - Artists deliberately use dithering to create stylized
              graphics reminiscent of vintage computing.
            </li>
            <li>
              <strong>Print media</strong> - Halftone dithering remains essential in printing, where CMYK inks must
              create the illusion of continuous tones.
            </li>
            <li>
              <strong>Low-power displays</strong> - E-ink screens and other low-power displays often use dithering to
              simulate grayscales or colors.
            </li>
            <li>
              <strong>Texture generation</strong> - Game developers use dithering patterns to create texture and detail
              in 3D models and environments.
            </li>
          </ul>
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold font-heading">About This Tool</h2>
          <p className="text-base md:text-lg">
            Dither is a modern web-based image dithering tool designed to make these classic algorithms accessible to
            everyone. Whether you're a digital artist looking to create retro-styled graphics, a developer optimizing
            images, or just curious about image processing techniques, Dither provides an intuitive interface to
            experiment with various dithering methods.
          </p>
          <p className="text-base md:text-lg">
            All processing happens directly in your browser - no images are uploaded to any server, ensuring your
            privacy and providing instant results. The tool is built with modern web technologies and is completely open
            source.
          </p>
        </section>
      </main>

      <Footer />

      {/* Lightbox component */}
      <ImageLightbox
        images={ditherExamples.map((ex) => ({
          src: ex.src,
          alt: ex.alt,
          title: ex.title,
        }))}
        initialIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  )
}

