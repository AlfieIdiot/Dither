export const defaultSettings = {
  bayer: {
    matrix: 8,
    threshold: 50,
    scaling: 2,
    displayPattern: false,
  },
  "floyd-steinberg": {
    strength: 100,
    serpentine: true,
    reduction: "nearest",
  },
  atkinson: {
    weight: 75,
    edge: false,
  },
  stucki: {
    strength: 100,
    distance: "stucki",
  },
  burkes: {
    intensity: 100,
    serpentine: true,
    bias: 0,
  },
  random: {
    intensity: 50,
    type: "random",
    seed: 12345,
    grain: 1,
  },
  halftone: {
    shape: "circle",
    cellSize: 8,
    angle: 45,
    scaling: true,
    cmyk: false,
  },
  "blue-noise": {
    intensity: 65,
    pattern: "interleaved",
    frequency: 0,
  },
}

