import fs from 'fs';
import path from 'path';
import { getProfile } from '@/lib/services/content';

const publicDir = path.join(process.cwd(), 'public');
const resolve = (url: string) => path.join(publicDir, url.replace(/^\//, ''));

describe('avatar assets referenced by profile.json', () => {
  const avatar = getProfile().avatar;

  it('exist on disk', () => {
    expect(avatar).toBeDefined();
    [avatar?.model, avatar?.poster, avatar?.logo, avatar?.portrait].forEach((url) => {
      expect(url).toBeTruthy();
      expect(fs.existsSync(resolve(url as string))).toBe(true);
    });
  });

  it('stay within the size budgets (GLB ≤ 6 MB lazy-loaded on desktop, poster ≤ 80 KB, logo ≤ 16 KB, portrait ≤ 120 KB)', () => {
    const size = (url?: string) => fs.statSync(resolve(url as string)).size;
    expect(size(avatar?.model)).toBeLessThanOrEqual(6 * 1024 * 1024);
    expect(size(avatar?.poster)).toBeLessThanOrEqual(80 * 1024);
    expect(size(avatar?.logo)).toBeLessThanOrEqual(16 * 1024);
    expect(size(avatar?.portrait)).toBeLessThanOrEqual(120 * 1024);
  });

  it('uses content-hashed file names so a new avatar is never served from a stale cache', () => {
    expect(avatar?.model).toMatch(/\.[0-9a-f]{8}\.glb$/);
    expect(avatar?.poster).toMatch(/\.[0-9a-f]{8}\.webp$/);
    expect(avatar?.logo).toMatch(/\.[0-9a-f]{8}\.webp$/);
    expect(avatar?.portrait).toMatch(/\.[0-9a-f]{8}\.webp$/);
  });

  it('has no leftover unreferenced files in public/avatar', () => {
    const referenced = [avatar?.model, avatar?.poster, avatar?.logo, avatar?.portrait].map((url) => path.basename(url as string));
    const files = fs.readdirSync(path.join(publicDir, 'avatar'));
    expect(files.sort()).toEqual(referenced.sort());
  });

  it('is a binary glTF 2.0 file', () => {
    const header = fs.readFileSync(resolve(avatar?.model as string)).subarray(0, 8);
    expect(header.subarray(0, 4).toString()).toBe('glTF');
    expect(header.readUInt32LE(4)).toBe(2);
  });

  it('has descriptive alt text and a framing target/radius', () => {
    expect(avatar?.alt).toMatch(/Muhammad Umer/);
    expect(avatar?.framing?.target).toMatch(/m/);
    expect(avatar?.framing?.radius).toMatch(/m$/);
  });
});
