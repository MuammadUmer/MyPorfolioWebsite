// Lowers a T-pose rig's arms by editing joint rotations (bind data untouched, so skinning follows).
// For Avaturn/Mixamo-style exports (arms along +/-X): lowers the arms with axis=x, e.g. 72 deg upper arm, 12 deg forearm.
// usage: node scripts/pose-avatar.cjs in.glb out.glb <upperArmDeg> <foreArmDeg> [axis=z] [sign=1]
// The avatar shipped here used: node scripts/pose-avatar.cjs model.glb posed.glb 72 12 x 1
const fs = require('fs');
const [inFile, outFile, upperDeg = '65', foreDeg = '10', axis = 'z', signArg = '1'] = process.argv.slice(2);
const sign = Number(signArg);
const buf = fs.readFileSync(inFile);
const jsonLen = buf.readUInt32LE(12);
const json = JSON.parse(buf.slice(20, 20 + jsonLen).toString());
const binStart = 20 + jsonLen;
const binLen = buf.readUInt32LE(binStart);
const bin = buf.slice(binStart + 8, binStart + 8 + binLen);

const mul = (a, b) => [
  a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
  a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
  a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
  a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
];
const axisQuat = (deg) => {
  const h = (deg * Math.PI) / 360;
  const s = Math.sin(h);
  return axis === 'x' ? [s, 0, 0, Math.cos(h)] : axis === 'y' ? [0, s, 0, Math.cos(h)] : [0, 0, s, Math.cos(h)];
};
const rotate = (name, deg) => {
  const node = json.nodes.find((n) => n.name === name);
  if (!node) throw new Error(`missing node ${name}`);
  node.rotation = mul(node.rotation || [0, 0, 0, 1], axisQuat(deg));
};

// left side rotates one way, right side the mirrored way
const mirror = axis === 'x' ? 1 : -1; // x-axis bones share a direction, z-axis bones mirror
rotate('LeftArm', sign * Number(upperDeg));
rotate('RightArm', mirror * sign * Number(upperDeg));
rotate('LeftForeArm', sign * Number(foreDeg));
rotate('RightForeArm', mirror * sign * Number(foreDeg));

let jsonBuf = Buffer.from(JSON.stringify(json));
jsonBuf = Buffer.concat([jsonBuf, Buffer.alloc((4 - (jsonBuf.length % 4)) % 4, 0x20)]);
const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(12 + 8 + jsonBuf.length + 8 + bin.length, 8);
const jh = Buffer.alloc(8);
jh.writeUInt32LE(jsonBuf.length, 0);
jh.writeUInt32LE(0x4e4f534a, 4);
const bh = Buffer.alloc(8);
bh.writeUInt32LE(bin.length, 0);
bh.writeUInt32LE(0x004e4942, 4);
fs.writeFileSync(outFile, Buffer.concat([header, jh, jsonBuf, bh, bin]));
console.log('wrote', outFile);
