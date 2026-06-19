
var PITCH = 0, YAW = 1, ROLL = 2;

var PI = Math.PI;

var sin = Math.sin;
var cos = Math.cos;
var tan = Math.tan;

var sqrt = Math.sqrt;

var min = Math.min;
var max = Math.max;

var floor = Math.floor;

var DEG2RAD = function (d) { return d * PI / 180; }
var L22D = function (x, y) { return sqrt(x ** 2 + y ** 2); }
var L23D = function (x, y, z) { return sqrt(x ** 2 + y ** 2 + z ** 2); }
var L2Dist2D = function (x1, y1, x2, y2) { return sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2); }
var L2Dist3D = function (x1, y1, z1, x2, y2, z2) { return sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2); }

var IntDiv = function (a, b) { return (a / b) | 0; }

var IntDiv2 = function (a) { return a >> 1; }
var IntDiv4 = function (a) { return a >> 2; }

var IntMul2 = function (a) { return a << 1; }
var IntMul4 = function (a) { return a << 2; }

var DotProduct = function (a, b, idxa, idxb) { return a[idxa] * b[idxb] + a[idxa + 1] * b[idxb + 1] + a[idxa + 2] * b[idxb + 2]; }
var CrossProduct = function (a, b, c, idxa, idxb, idxc) { c[idxc] = a[idxa + 1] * b[idxb + 2] - a[idxa + 2] * b[idxb + 1], c[idxc + 1] = a[idxa + 2] * b[idxb] - a[idxa] * b[idxb + 2], c[idxc + 2] = a[idxa] * b[idxb + 1] - a[idxa + 1] * b[idxb]; };
var VectorMA = function (a, scale, b, c, idxa, idxb, idxc) { c[idxc] = a[idxa] + scale * b[idxb], c[idxc + 1] = a[idxa + 1] + scale * b[idxb + 1], c[idxc + 2] = a[idxa + 2] + scale * b[idxb + 2]; }
var VectorCopy = function (a, b, idxa, idxb) { b[idxb] = a[idxa], b[idxb + 1] = a[idxa + 1], b[idxb + 2] = a[idxa + 2]; }
var Vector2Copy = function (a, b, idxa, idxb) { b[idxb] = a[idxa], b[idxb + 1] = a[idxa + 1]; }
var VectorNegate = function (a, b, idxa, idxb) { b[idxb] = -a[idxa], b[idxb + 1] = -a[idxa + 1], b[idxb + 2] = -a[idxa + 2]; }
var VectorNormalize = function (a, idxa) { let il = sqrt(DotProduct(a, a, idxa, idxa)); if (il != 0) il = 1 / il; a[idxa] *= il; a[idxa + 1] *= il; a[idxa + 2] *= il; }
var VectorDivide = function (a, div, b, idxa, idxb) { b[idxb] = a[idxa] / div, b[idxb + 1] = a[idxa + 1] / div, b[idxb + 2] = a[idxa + 2] / div; }

var Matrix4x4Concat = function (a, b, c) {
  c[0] = a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * b[3];
  c[1] = a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * b[3];
  c[2] = a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * b[3];
  c[3] = a[3] * b[0] + a[7] * b[1] + a[11] * b[2] + a[15] * b[3];

  c[4] = a[0] * b[4] + a[4] * b[5] + a[8] * b[6] + a[12] * b[7];
  c[5] = a[1] * b[4] + a[5] * b[5] + a[9] * b[6] + a[13] * b[7];
  c[6] = a[2] * b[4] + a[6] * b[5] + a[10] * b[6] + a[14] * b[7];
  c[7] = a[3] * b[4] + a[7] * b[5] + a[11] * b[6] + a[15] * b[7];

  c[8] = a[0] * b[8] + a[4] * b[9] + a[8] * b[10] + a[12] * b[11];
  c[9] = a[1] * b[8] + a[5] * b[9] + a[9] * b[10] + a[13] * b[11];
  c[10] = a[2] * b[8] + a[6] * b[9] + a[10] * b[10] + a[14] * b[11];
  c[11] = a[3] * b[8] + a[7] * b[9] + a[11] * b[10] + a[15] * b[11];

  c[12] = a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12] * b[15];
  c[13] = a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13] * b[15];
  c[14] = a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15];
  c[15] = a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15];
}

var CalcCenter = function (vertices, vertexCount) {
  let center = new Float32Array(3).fill(0);
  for (let i = 0; i < vertexCount; i++) { const idx = i * 3; center[0] += vertices[idx]; center[1] += vertices[idx + 1]; center[2] += vertices[idx + 2]; }
  VectorDivide(center, vertexCount, center);
  return center;
}

var CalcRadius = function (center, vertices, vertexCount) {
  let radius = 0;
  for (let i = 0; i < vertexCount; i++) { const vIdx = i * 3; let d = L2Dist3D(center[0], center[1], center[2], vertices[vIdx], vertices[vIdx + 1], vertices[vIdx + 2]); if (d > radius) radius = d; }
  return radius;
}

var AngleVectors = function (angles, viewVectors) {
  const yawRad = DEG2RAD(angles[YAW]);
  const pitchRad = DEG2RAD(angles[PITCH]);
  const rollRad = DEG2RAD(angles[ROLL]);

  const sinYaw = sin(yawRad);
  const cosYaw = cos(yawRad);

  const sinPitch = sin(pitchRad);
  const cosPitch = cos(pitchRad);

  const sinRoll = sin(rollRad);
  const cosRoll = cos(rollRad);

  viewVectors[VIEW_FORWARD_IDX] = cosPitch * cosYaw;
  viewVectors[VIEW_FORWARD_IDX + 1] = cosPitch * sinYaw;
  viewVectors[VIEW_FORWARD_IDX + 2] = -sinPitch;

  viewVectors[VIEW_RIGHT_IDX] = -sinRoll * sinPitch * cosYaw + cosRoll * sinYaw;
  viewVectors[VIEW_RIGHT_IDX + 1] = -sinRoll * sinPitch * sinYaw - cosRoll * cosYaw;
  viewVectors[VIEW_RIGHT_IDX + 2] = -sinRoll * cosPitch;

  viewVectors[VIEW_UP_IDX] = cosRoll * sinPitch * cosYaw + sinRoll * sinYaw;
  viewVectors[VIEW_UP_IDX + 1] = cosRoll * sinPitch * sinYaw - sinRoll * cosYaw;
  viewVectors[VIEW_UP_IDX + 2] = cosRoll * cosPitch;
}

