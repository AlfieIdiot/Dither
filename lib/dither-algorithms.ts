// Helper functions
const getIdx = (x: number, y: number, width: number) => (y * width + x) * 4
const grayscale = (r: number, g: number, b: number) => 0.299 * r + 0.587 * g + 0.114 * b

// Bayer matrices (normalized 0-1 range)
const bayerMatrices = {
  2: [
    [0, 2],
    [3, 1],
  ].map((row) => row.map((v) => v / 4)),
  4: [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ].map((row) => row.map((v) => v / 16)),
  8: [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21],
  ].map((row) => row.map((v) => v / 64)),
  16: [
    // Approximated structure for brevity
    [0, 192, 48, 240, 12, 204, 60, 252, 3, 195, 51, 243, 15, 207, 63, 255],
    [128, 64, 176, 112, 140, 76, 188, 124, 131, 67, 179, 115, 143, 79, 191, 127],
    [32, 224, 16, 208, 44, 236, 28, 220, 35, 227, 19, 211, 47, 239, 31, 223],
    [160, 96, 144, 80, 172, 108, 156, 92, 163, 99, 147, 83, 175, 111, 159, 95],
    [8, 200, 56, 248, 4, 196, 52, 244, 11, 203, 59, 251, 7, 199, 55, 247],
    [136, 72, 184, 120, 132, 68, 180, 116, 139, 75, 187, 123, 135, 71, 183, 119],
    [40, 232, 24, 216, 40, 232, 24, 216, 43, 235, 27, 219, 43, 235, 27, 219],
    [168, 104, 152, 88, 164, 100, 148, 84, 171, 107, 155, 91, 167, 103, 151, 87],
    [2, 194, 50, 242, 14, 206, 62, 254, 1, 193, 49, 241, 13, 205, 61, 253],
    [130, 66, 178, 114, 142, 78, 190, 126, 129, 65, 177, 113, 141, 77, 189, 125],
    [34, 226, 18, 210, 46, 238, 30, 222, 33, 225, 17, 209, 45, 237, 29, 221],
    [162, 98, 146, 82, 174, 110, 158, 94, 161, 97, 145, 81, 173, 109, 157, 93],
    [10, 202, 58, 250, 6, 198, 54, 246, 9, 201, 57, 249, 5, 197, 53, 245],
    [138, 74, 186, 122, 134, 70, 182, 118, 137, 73, 185, 121, 133, 69, 181, 117],
    [42, 234, 26, 218, 42, 234, 26, 218, 41, 233, 25, 217, 41, 233, 25, 217],
    [170, 106, 154, 90, 166, 102, 150, 86, 169, 105, 153, 89, 165, 101, 149, 85],
  ].map((row) => row.map((v) => v / 256)),
}

// Simple PRNG for Seeded Randomness
class SimplePRNG {
  seed: number

  constructor(seed: number) {
    this.seed = seed % 2147483647
    if (this.seed <= 0) this.seed += 2147483646
  }

  next() {
    this.seed = (this.seed * 16807) % 2147483647
    return (this.seed - 1) / 2147483646 // Return float between 0 and 1
  }
}

// Create a simple palette based on color depth
function createSimplePalette(colorDepth: number) {
  if (colorDepth <= 2)
    return [
      [0, 0, 0],
      [255, 255, 255],
    ]

  const palette: number[][] = []
  // Calculate levels per channel (approximate cubic root)
  const levelsPerChannel = Math.max(2, Math.round(Math.cbrt(colorDepth)))
  const step = 255 / (levelsPerChannel - 1)

  for (let r = 0; r < levelsPerChannel; r++) {
    for (let g = 0; g < levelsPerChannel; g++) {
      for (let b = 0; b < levelsPerChannel; b++) {
        palette.push([Math.round(r * step), Math.round(g * step), Math.round(b * step)])
        if (palette.length >= colorDepth) return palette.slice(0, colorDepth) // Stop early if enough
      }
    }
  }

  // Ensure palette has exactly colorDepth entries if calculation was imprecise
  while (palette.length < colorDepth && palette.length > 0) {
    palette.push(palette[palette.length - 1]) // Duplicate last color
  }

  return palette.slice(0, colorDepth)
}

// Find nearest color in palette
function findNearestColor(r: number, g: number, b: number, palette: number[][], method = "nearest") {
  let minDist = Number.POSITIVE_INFINITY
  let nearestColor = palette[0]

  for (const pColor of palette) {
    let dist
    const pr = pColor[0]
    const pg = pColor[1]
    const pb = pColor[2]

    if (method === "weighted") {
      // Weighted Euclidean distance (approximation)
      const dr = r - pr
      const dg = g - pg
      const db = b - pb
      dist = Math.sqrt(2 * dr * dr + 4 * dg * dg + 3 * db * db)
    } else if (method === "euclidean") {
      dist = Math.sqrt((r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2)
    } else {
      // 'nearest' (often means Euclidean, keep consistent)
      dist = Math.sqrt((r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2)
    }

    if (dist < minDist) {
      minDist = dist
      nearestColor = pColor
    }
  }

  return nearestColor
}

// Main dithering function
export function applyDitherAlgorithm(
  originalImageData: ImageData,
  algorithm: string,
  settings: any,
  options: { monochrome: boolean; colorDepth: number },
) {
  const width = originalImageData.width
  const height = originalImageData.height
  const inData = originalImageData.data

  // Create output ImageData
  const outImageData = new ImageData(width, height)
  const outData = outImageData.data

  // Determine target palette
  const palette = options.monochrome
    ? [
        [0, 0, 0],
        [255, 255, 255],
      ]
    : createSimplePalette(options.colorDepth)

  // Choose the correct algorithm function
  switch (algorithm) {
    case "bayer":
      applyBayerDithering(inData, outData, palette, width, height, settings, options)
      break
    case "floyd-steinberg":
      applyFloydSteinbergDithering(inData, outData, palette, width, height, settings, options)
      break
    case "atkinson":
      applyAtkinsonDithering(inData, outData, palette, width, height, settings, options)
      break
    case "stucki":
      applyStuckiDithering(inData, outData, palette, width, height, settings, options)
      break
    case "burkes":
      applyBurkesDithering(inData, outData, palette, width, height, settings, options)
      break
    case "random":
      applyRandomDithering(inData, outData, palette, width, height, settings, options)
      break
    case "halftone":
      applyHalftoneDithering(inData, outData, palette, width, height, settings, options)
      break
    case "blue-noise":
      applyBlueNoiseDithering(inData, outData, palette, width, height, settings, options)
      break
    default:
      // Fallback: Copy original to output
      outData.set(inData)
  }

  return outImageData
}

// Bayer (Ordered Dithering)
function applyBayerDithering(
  inData: Uint8ClampedArray,
  outData: Uint8ClampedArray,
  palette: number[][],
  width: number,
  height: number,
  settings: any,
  options: { monochrome: boolean },
) {
  const { threshold, scaling, matrix: matrixSizeStr, displayPattern } = settings
  const matrixSize = Number.parseInt(matrixSizeStr, 10)
  const matrix = bayerMatrices[matrixSize]

  if (!matrix) {
    outData.set(inData)
    return
  }

  const thresholdBias = threshold / 100 - 0.5 // Center threshold around 0
  const patternInfluence = (scaling - 1) / 4 // Scale influence 0 to 1

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = getIdx(x, y, width)
      const r = inData[idx]
      const g = inData[idx + 1]
      const b = inData[idx + 2]
      const a = inData[idx + 3]

      const originalValue = options.monochrome ? grayscale(r, g, b) / 255 : (r + g + b) / (3 * 255)

      const matrixValue = matrix[y % matrixSize][x % matrixSize] // 0-1 range
      const ditherThreshold = 0.5 + thresholdBias + (matrixValue - 0.5) * patternInfluence
      const clampedThreshold = Math.max(0, Math.min(1, ditherThreshold))

      let targetColor
      if (displayPattern) {
        // Debug view
        const patternGray = Math.floor(matrixValue * 255)
        targetColor = [patternGray, patternGray, patternGray]
      } else if (options.monochrome) {
        targetColor = originalValue >= clampedThreshold ? palette[1] : palette[0]
      } else {
        targetColor =
          originalValue >= clampedThreshold
            ? findNearestColor(255, 255, 255, palette) // Find brightest palette color
            : findNearestColor(0, 0, 0, palette) // Find darkest palette color
      }

      outData[idx] = targetColor[0]
      outData[idx + 1] = targetColor[1]
      outData[idx + 2] = targetColor[2]
      outData[idx + 3] = a
    }
  }
}

// Error Diffusion Base Logic
function applyErrorDiffusion(
  inData: Uint8ClampedArray,
  outData: Uint8ClampedArray,
  palette: number[][],
  width: number,
  height: number,
  kernel: [number, number, number][],
  divisor: number,
  settings: any,
  options: { monochrome: boolean; colorReduction?: string },
) {
  const { strength = 100, serpentine = true } = settings
  const colorReduction = options.colorReduction || "nearest"
  const diffusionStrength = strength / 100

  // Create a float copy for accurate error accumulation
  const floatData = new Float32Array(inData.length)
  for (let i = 0; i < inData.length; i++) floatData[i] = inData[i]

  for (let y = 0; y < height; y++) {
    const dir = serpentine && y % 2 !== 0 ? -1 : 1
    const startX = dir === 1 ? 0 : width - 1
    const endX = dir === 1 ? width : -1

    for (let x = startX; x !== endX; x += dir) {
      const idx = getIdx(x, y, width)

      // Get current pixel value + accumulated error
      const oldR = floatData[idx]
      const oldG = floatData[idx + 1]
      const oldB = floatData[idx + 2]
      const alpha = inData[idx + 3] // Keep original alpha

      // Find the nearest color in the palette
      let nearestColor
      if (options.monochrome) {
        const gray = grayscale(oldR, oldG, oldB)
        nearestColor = gray > 127.5 ? palette[1] : palette[0]
      } else {
        nearestColor = findNearestColor(oldR, oldG, oldB, palette, colorReduction)
      }

      // Set the output pixel
      outData[idx] = nearestColor[0]
      outData[idx + 1] = nearestColor[1]
      outData[idx + 2] = nearestColor[2]
      outData[idx + 3] = alpha

      // Calculate quantization error
      const errR = oldR - nearestColor[0]
      const errG = oldG - nearestColor[1]
      const errB = oldB - nearestColor[2]

      // Distribute error according to the kernel
      for (const [dx, dy, weight] of kernel) {
        const neighborX = x + dx * dir // Adjust dx based on direction
        const neighborY = y + dy

        if (neighborX >= 0 && neighborX < width && neighborY >= 0 && neighborY < height) {
          const neighborIdx = getIdx(neighborX, neighborY, width)
          const errorFactor = (weight / divisor) * diffusionStrength
          floatData[neighborIdx] = floatData[neighborIdx] + errR * errorFactor
          floatData[neighborIdx + 1] = floatData[neighborIdx + 1] + errG * errorFactor
          floatData[neighborIdx + 2] = floatData[neighborIdx + 2] + errB * errorFactor
        }
      }
    }
  }
}

// Floyd-Steinberg
function applyFloydSteinbergDithering(
  inData: Uint8ClampedArray,
  outData: Uint8ClampedArray,
  palette: number[][],
  width: number,
  height: number,
  settings: any,
  options: { monochrome: boolean },
) {
  const kernel = [
    [1, 0, 7],
    [-1, 1, 3],
    [0, 1, 5],
    [1, 1, 1],
  ]
  const divisor = 16

  applyErrorDiffusion(inData, outData, palette, width, height, kernel, divisor, settings, {
    ...options,
    colorReduction: settings.reduction,
  })
}

// Atkinson
function applyAtkinsonDithering(
  inData: Uint8ClampedArray,
  outData: Uint8ClampedArray,
  palette: number[][],
  width: number,
  height: number,
  settings: any,
  options: { monochrome: boolean },
) {
  // Note: Atkinson only diffuses 1/8th total error
  const kernel = [
    [1, 0, 1],
    [2, 0, 1],
    [-1, 1, 1],
    [0, 1, 1],
    [1, 1, 1],
    [0, 2, 1],
  ]
  const divisor = 8

  // Atkinson strength is often interpreted differently; here 'weight' scales the standard 1/8th
  const atkinsonOptions = { ...settings, strength: settings.weight ?? 75 } // Use 'weight' as strength

  applyErrorDiffusion(inData, outData, palette, width, height, kernel, divisor, atkinsonOptions, options)
}

// Stucki
function applyStuckiDithering(
  inData: Uint8ClampedArray,
  outData: Uint8ClampedArray,
  palette: number[][],
  width: number,
  height: number,
  settings: any,
  options: { monochrome: boolean },
) {
  // Select kernel based on distance option
  let kernel, divisor

  switch (settings.distance) {
    case "stucki-reduced": // Example: Maybe Jarvis, Judice, Ninke
      kernel = [
        [1, 0, 7],
        [2, 0, 5],
        [-2, 1, 3],
        [-1, 1, 5],
        [0, 1, 7],
        [1, 1, 5],
        [2, 1, 3],
        [-1, 2, 1],
        [0, 2, 3],
        [1, 2, 1],
      ]
      divisor = 48 // Jarvis divisor
      break
    case "stucki-minimal": // Like Floyd-Steinberg
      kernel = [
        [1, 0, 7],
        [-1, 1, 3],
        [0, 1, 5],
        [1, 1, 1],
      ]
      divisor = 16
      break
    case "stucki": // Standard Stucki
    default:
      kernel = [
        [1, 0, 8],
        [2, 0, 4],
        [-2, 1, 2],
        [-1, 1, 4],
        [0, 1, 8],
        [1, 1, 4],
        [2, 1, 2],
        [-2, 2, 1],
        [-1, 2, 2],
        [0, 2, 4],
        [1, 2, 2],
        [2, 2, 1],
      ]
      divisor = 42
      break
  }

  applyErrorDiffusion(inData, outData, palette, width, height, kernel, divisor, settings, options)
}

// Burkes
function applyBurkesDithering(
  inData: Uint8ClampedArray,
  outData: Uint8ClampedArray,
  palette: number[][],
  width: number,
  height: number,
  settings: any,
  options: { monochrome: boolean },
) {
  let kernel = [
    // Standard Burkes weights
    [1, 0, 8],
    [2, 0, 4],
    [-2, 1, 2],
    [-1, 1, 4],
    [0, 1, 8],
    [1, 1, 4],
    [2, 1, 2],
  ]
  const divisor = 32

  // Apply direction bias - simplistic adjustment
  const bias = settings.bias / 100 // -0.5 to 0.5

  if (bias !== 0) {
    kernel = kernel.map(([dx, dy, weight]) => {
      let adjustedWeight = weight
      if (dx !== 0) {
        // Horizontal component
        adjustedWeight *= 1 - bias // Decrease if bias > 0 (diagonal), increase if bias < 0 (horizontal)
      } else if (dy !== 0) {
        // Vertical/Diagonal implied
        adjustedWeight *= 1 + bias // Increase if bias > 0, decrease if bias < 0
      }
      return [dx, dy, Math.max(0, adjustedWeight)] // Ensure weight doesn't go negative
    })

    // Recalculate divisor (sum of adjusted weights) - IMPORTANT
    const newDivisor = kernel.reduce((sum, k) => sum + k[2], 0)

    applyErrorDiffusion(
      inData,
      outData,
      palette,
      width,
      height,
      kernel,
      newDivisor > 0 ? newDivisor : divisor,
      { ...settings, strength: settings.intensity },
      options,
    )
  } else {
    applyErrorDiffusion(
      inData,
      outData,
      palette,
      width,
      height,
      kernel,
      divisor,
      { ...settings, strength: settings.intensity },
      options,
    )
  }
}

// Random Noise
function applyRandomDithering(
  inData: Uint8ClampedArray,
  outData: Uint8ClampedArray,
  palette: number[][],
  width: number,
  height: number,
  settings: any,
  options: { monochrome: boolean; colorReduction?: string },
) {
  const { intensity, type, grain, seed } = settings
  const noiseStrength = (intensity / 100) * 128 // Scale noise effect (-64 to +64 range approx)
  const colorReduction = options.colorReduction || "nearest"

  // Create PRNG with seed
  const prng = new SimplePRNG(seed)

  let noiseMap = null
  if (type === "blocky" || grain > 1) {
    noiseMap = new Array(Math.ceil(height / grain)).fill(0).map(() => new Array(Math.ceil(width / grain)).fill(0))

    for (let by = 0; by < noiseMap.length; by++) {
      for (let bx = 0; bx < noiseMap[0].length; bx++) {
        noiseMap[by][bx] = (prng.next() - 0.5) * 2 // Noise range -1 to 1
      }
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = getIdx(x, y, width)
      let r = inData[idx]
      let g = inData[idx + 1]
      let b = inData[idx + 2]
      const a = inData[idx + 3]

      let noiseValue
      if (noiseMap) {
        const blockX = Math.floor(x / grain)
        const blockY = Math.floor(y / grain)
        noiseValue = noiseMap[blockY][blockX]
      } else {
        noiseValue = (prng.next() - 0.5) * 2 // Noise range -1 to 1
      }

      const noise = noiseValue * noiseStrength

      // Add noise before quantization
      r = Math.max(0, Math.min(255, r + noise))
      g = Math.max(0, Math.min(255, g + noise))
      b = Math.max(0, Math.min(255, b + noise))

      // Quantize noisy color
      let nearestColor
      if (options.monochrome) {
        const gray = grayscale(r, g, b)
        nearestColor = gray > 127.5 ? palette[1] : palette[0]
      } else {
        nearestColor = findNearestColor(r, g, b, palette, colorReduction)
      }

      outData[idx] = nearestColor[0]
      outData[idx + 1] = nearestColor[1]
      outData[idx + 2] = nearestColor[2]
      outData[idx + 3] = a
    }
  }
}

// Halftone (Simplified)
function applyHalftoneDithering(
  inData: Uint8ClampedArray,
  outData: Uint8ClampedArray,
  palette: number[][],
  width: number,
  height: number,
  settings: any,
  options: { monochrome: boolean; colorReduction?: string },
) {
  const { shape, cellSize, angle, scaling } = settings
  const cmyk = settings.cmyk || false
  const angleRad = (angle * Math.PI) / 180
  const cosA = Math.cos(angleRad)
  const sinA = Math.sin(angleRad)
  const colorReduction = options.colorReduction || "nearest"

  // Fill background with the "zero" color (usually black or darkest in palette)
  const bgColor = options.monochrome ? palette[0] : findNearestColor(255, 255, 255, palette) // Changed to white background
  for (let i = 0; i < outData.length; i += 4) {
    outData[i] = bgColor[0]
    outData[i + 1] = bgColor[1]
    outData[i + 2] = bgColor[2]
    outData[i + 3] = 255 // Assume opaque for background
  }

  const dotColor = options.monochrome ? palette[1] : findNearestColor(0, 0, 0, palette) // Changed to black dots

  // For CMYK, we'll use different angles for each channel
  const cyanAngle = angleRad + Math.PI / 6 // 30 degrees offset
  const magentaAngle = angleRad - Math.PI / 6 // -30 degrees offset
  const yellowAngle = angleRad + Math.PI / 3 // 60 degrees offset
  const blackAngle = angleRad // Original angle

  if (cmyk && !options.monochrome) {
    // Process each channel separately with different angles
    processCMYKChannel(
      inData,
      outData,
      width,
      height,
      "cyan",
      cyanAngle,
      cellSize,
      shape,
      scaling,
      colorReduction,
      palette,
    )
    processCMYKChannel(
      inData,
      outData,
      width,
      height,
      "magenta",
      magentaAngle,
      cellSize,
      shape,
      scaling,
      colorReduction,
      palette,
    )
    processCMYKChannel(
      inData,
      outData,
      width,
      height,
      "yellow",
      yellowAngle,
      cellSize,
      shape,
      scaling,
      colorReduction,
      palette,
    )
    processCMYKChannel(
      inData,
      outData,
      width,
      height,
      "black",
      blackAngle,
      cellSize,
      shape,
      scaling,
      colorReduction,
      palette,
    )
  } else {
    // Standard halftone processing
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = getIdx(x, y, width)

        // Rotate coordinates relative to grid origin
        const rotX = x * cosA - y * sinA
        const rotY = x * sinA + y * cosA

        // Find cell center
        const cellX = Math.floor(rotX / cellSize)
        const cellY = Math.floor(rotY / cellSize)

        const centerX = (cellX + 0.5) * cellSize
        const centerY = (cellY + 0.5) * cellSize

        // Rotate cell center back to original coordinates
        const origCenterX = centerX * cosA + centerY * sinA
        const origCenterY = -centerX * sinA + centerY * cosA

        // Sample original image near cell center (approximation)
        const sampleX = Math.max(0, Math.min(width - 1, Math.round(origCenterX)))
        const sampleY = Math.max(0, Math.min(height - 1, Math.round(origCenterY)))
        const sampleIdx = getIdx(sampleX, sampleY, width)

        const r = inData[sampleIdx]
        const g = inData[sampleIdx + 1]
        const b = inData[sampleIdx + 2]

        // Fix: Invert the intensity calculation for non-monochrome mode
        const intensity = options.monochrome ? grayscale(r, g, b) / 255 : 1 - (r + g + b) / 3 / 255 // Invert for color mode

        // Calculate dot size based on intensity
        let dotRadiusRatio // Ratio of cell size
        if (scaling) {
          // Non-linear (sqrt is common)
          dotRadiusRatio = Math.sqrt(intensity)
        } else {
          // Linear
          dotRadiusRatio = intensity
        }

        // Max radius is such that corners touch at intensity=1 (approx sqrt(2)/2 for circle/square)
        const maxRadius = (cellSize * 0.707) / 2
        const dotRadius = maxRadius * dotRadiusRatio

        // Check if current pixel (x,y) falls within the dot for its cell
        const distSq = (x - origCenterX) ** 2 + (y - origCenterY) ** 2

        let drawDot = false
        if (shape === "circle") {
          drawDot = distSq <= dotRadius ** 2
        } else if (shape === "square") {
          // Rotate check coordinates back to grid alignment
          const checkRotX = (x - origCenterX) * cosA + (y - origCenterY) * sinA
          const checkRotY = -(x - origCenterX) * sinA + (y - origCenterY) * cosA
          drawDot = Math.abs(checkRotX) <= dotRadius && Math.abs(checkRotY) <= dotRadius
        } else if (shape === "diamond") {
          const checkRotX = (x - origCenterX) * cosA + (y - origCenterY) * sinA
          const checkRotY = -(x - origCenterX) * sinA + (y - origCenterY) * cosA
          // Manhattan distance for diamond rotated 45 deg relative to square
          drawDot = Math.abs(checkRotX) + Math.abs(checkRotY) <= dotRadius * 1.414 // Approximation
        }

        if (drawDot) {
          outData[idx] = dotColor[0]
          outData[idx + 1] = dotColor[1]
          outData[idx + 2] = dotColor[2]
          outData[idx + 3] = inData[idx + 3] // Use original alpha
        }
        // else: already filled with background color
      }
    }
  }
}

// Helper function for CMYK halftone processing
function processCMYKChannel(
  inData: Uint8ClampedArray,
  outData: Uint8ClampedArray,
  width: number,
  height: number,
  channel: string,
  angleRad: number,
  cellSize: number,
  shape: string,
  scaling: boolean,
  colorReduction: string,
  palette: number[][],
) {
  const cosA = Math.cos(angleRad)
  const sinA = Math.sin(angleRad)

  // Define channel properties
  let channelColor: number[]
  let getChannelIntensity: (r: number, g: number, b: number) => number

  switch (channel) {
    case "cyan":
      channelColor = [0, 255, 255]
      // Fix: Use the actual color value instead of inverse
      getChannelIntensity = (r, g, b) => Math.max(0, Math.min(1, (g + b) / (2 * 255)))
      break
    case "magenta":
      channelColor = [255, 0, 255]
      // Fix: Use the actual color value instead of inverse
      getChannelIntensity = (r, g, b) => Math.max(0, Math.min(1, (r + b) / (2 * 255)))
      break
    case "yellow":
      channelColor = [255, 255, 0]
      // Fix: Use the actual color value instead of inverse
      getChannelIntensity = (r, g, b) => Math.max(0, Math.min(1, (r + g) / (2 * 255)))
      break
    case "black":
    default:
      channelColor = [0, 0, 0]
      // Fix: Calculate black based on darkness, not inverse
      getChannelIntensity = (r, g, b) => {
        const brightness = (r + g + b) / 3
        return Math.max(0, Math.min(1, 1 - brightness / 255))
      }
  }

  // Find nearest color in palette for this channel
  const dotColor = findNearestColor(channelColor[0], channelColor[1], channelColor[2], palette, colorReduction)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = getIdx(x, y, width)

      // Rotate coordinates relative to grid origin
      const rotX = x * cosA - y * sinA
      const rotY = x * sinA + y * cosA

      // Find cell center
      const cellX = Math.floor(rotX / cellSize)
      const cellY = Math.floor(rotY / cellSize)

      const centerX = (cellX + 0.5) * cellSize
      const centerY = (cellY + 0.5) * cellSize

      // Rotate cell center back to original coordinates
      const origCenterX = centerX * cosA + centerY * sinA
      const origCenterY = -centerX * sinA + centerY * cosA

      // Sample original image near cell center
      const sampleX = Math.max(0, Math.min(width - 1, Math.round(origCenterX)))
      const sampleY = Math.max(0, Math.min(height - 1, Math.round(origCenterY)))
      const sampleIdx = getIdx(sampleX, sampleY, width)

      const r = inData[sampleIdx]
      const g = inData[sampleIdx + 1]
      const b = inData[sampleIdx + 2]

      // Get intensity for this channel
      const intensity = getChannelIntensity(r, g, b)

      // Calculate dot size based on intensity
      let dotRadiusRatio
      if (scaling) {
        dotRadiusRatio = Math.sqrt(intensity)
      } else {
        dotRadiusRatio = intensity
      }

      // Max radius is such that corners touch at intensity=1
      const maxRadius = (cellSize * 0.707) / 2
      const dotRadius = maxRadius * dotRadiusRatio

      // Check if current pixel falls within the dot for its cell
      const distSq = (x - origCenterX) ** 2 + (y - origCenterY) ** 2

      let drawDot = false
      if (shape === "circle") {
        drawDot = distSq <= dotRadius ** 2
      } else if (shape === "square") {
        const checkRotX = (x - origCenterX) * cosA + (y - origCenterY) * sinA
        const checkRotY = -(x - origCenterX) * sinA + (y - origCenterY) * cosA
        drawDot = Math.abs(checkRotX) <= dotRadius && Math.abs(checkRotY) <= dotRadius
      } else if (shape === "diamond") {
        const checkRotX = (x - origCenterX) * cosA + (y - origCenterY) * sinA
        const checkRotY = -(x - origCenterX) * sinA + (y - origCenterY) * cosA
        drawDot = Math.abs(checkRotX) + Math.abs(checkRotY) <= dotRadius * 1.414
      }

      if (drawDot) {
        // Blend the channel color with existing output using screen blending
        outData[idx] = Math.min(255, outData[idx] + dotColor[0] - (outData[idx] * dotColor[0]) / 255)
        outData[idx + 1] = Math.min(255, outData[idx + 1] + dotColor[1] - (outData[idx + 1] * dotColor[1]) / 255)
        outData[idx + 2] = Math.min(255, outData[idx + 2] + dotColor[2] - (outData[idx + 2] * dotColor[2]) / 255)
      }
    }
  }
}

// Blue Noise Dithering (Placeholder - requires external blue noise texture)
function applyBlueNoiseDithering(
  inData: Uint8ClampedArray,
  outData: Uint8ClampedArray,
  palette: number[][],
  width: number,
  height: number,
  settings: any,
  options: { monochrome: boolean; colorReduction?: string },
) {
  const { intensity, pattern = "interleaved" } = settings
  const noiseStrength = (intensity / 100) * 128 // Scale noise effect
  const colorReduction = options.colorReduction || "nearest"

  // Create a simple blue noise-like pattern
  // In a real implementation, you would use a pre-generated blue noise texture
  const generateNoiseValue = (x: number, y: number) => {
    if (pattern === "checkerboard") {
      return ((x + y) % 2) * 2 - 1 // -1 or 1
    } else {
      // Interleaved gradient noise (Jimenez 2016)
      const magic1 = 0.06711056
      const magic2 = 0.00583715
      return Math.fract(52.9829189 * Math.fract(x * magic1 + y * magic2)) * 2 - 1
    }
  }

  // Add Math.fract if it doesn't exist
  if (!Math.fract) {
    Math.fract = (x: number) => x - Math.floor(x)
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = getIdx(x, y, width)
      const r = inData[idx]
      const g = inData[idx + 1]
      const b = inData[idx + 2]
      const a = inData[idx + 3]

      // Generate noise value between -1 and 1
      const noiseValue = generateNoiseValue(x, y)

      // Scale noise by intensity and apply to pixel values
      const noise = noiseValue * noiseStrength

      // Add noise before quantization
      const newR = Math.max(0, Math.min(255, r + noise))
      const newG = Math.max(0, Math.min(255, g + noise))
      const newB = Math.max(0, Math.min(255, b + noise))

      // Quantize noisy color
      let nearestColor
      if (options.monochrome) {
        const gray = grayscale(newR, newG, newB)
        nearestColor = gray > 127.5 ? palette[1] : palette[0]
      } else {
        nearestColor = findNearestColor(newR, newG, newB, palette, colorReduction)
      }

      outData[idx] = nearestColor[0]
      outData[idx + 1] = nearestColor[1]
      outData[idx + 2] = nearestColor[2]
      outData[idx + 3] = a
    }
  }
}

