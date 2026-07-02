// Affine matrix helpers for the PDF editor overlay.
// All matrices are [a, b, c, d, e, f] matching the CSS / PDF convention.

export type Matrix6 = [number, number, number, number, number, number];

// Return a CSS matrix() string that positions an element exactly.
// transform-origin must be set to "left bottom" (the PDF glyph origin is baseline-left).
export function matrixToCss(m: Matrix6): string {
  return `matrix(${m[0]},${m[1]},${m[2]},${m[3]},${m[4]},${m[5]})`;
}

// Scale a viewport-space matrix by a zoom factor.
// Multiplies the translation components (e, f) and the scale components (a, b, c, d)
// so the rendered position tracks the canvas exactly.
export function scaleMatrix(m: Matrix6, zoom: number): Matrix6 {
  return [
    m[0] * zoom,
    m[1] * zoom,
    m[2] * zoom,
    m[3] * zoom,
    m[4] * zoom,
    m[5] * zoom,
  ];
}

// Extract the clockwise rotation angle (in degrees) from a matrix.
// PDF uses counter-clockwise positive, CSS uses clockwise positive — we return CSS degrees.
export function extractRotationDeg(m: Matrix6): number {
  // atan2 gives the angle of the x-basis vector [a, b]
  const rad = Math.atan2(m[1], m[0]);
  return (rad * 180) / Math.PI;
}

// Extract the uniform scale (font size proxy) from a matrix.
export function extractScale(m: Matrix6): number {
  return Math.sqrt(m[0] * m[0] + m[1] * m[1]);
}

// Multiply two 2D affine matrices: result = a · b
export function multiplyMatrices(a: Matrix6, b: Matrix6): Matrix6 {
  return [
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3],
    a[0] * b[4] + a[2] * b[5] + a[4],
    a[1] * b[4] + a[3] * b[5] + a[5],
  ];
}
