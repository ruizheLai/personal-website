import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const [ffmpeg, source] = process.argv.slice(2);
if (!ffmpeg || !source) throw new Error('Usage: node scripts/encode-phase5j.mjs <ffmpeg> <original clips directory>');
const output = 'public/images/phase5j';
const jobs = [];
for (let clip = 1; clip <= 5; clip++) {
  const frames = path.join(output, String(clip));
  await mkdir(frames, { recursive: true });
  const input = ['-y', '-hide_banner', '-loglevel', 'error', '-i', path.join(source, clip + '.mp4'), '-an', '-filter_threads', '2'];
  const scale = 'scale=640:640:flags=lanczos';
  jobs.push([...input, '-vf', scale + ':in_color_matrix=bt709,format=rgb24', '-c:v', 'libwebp', '-quality', '82', '-threads', '2',
    '-start_number', '0', path.join(frames, '%03d.webp')]);
  for (const gop of [1, 2, 6]) {
    jobs.push([...input, '-vf', scale, '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-threads', '2', '-pix_fmt', 'yuv420p',
      '-g', String(gop), '-keyint_min', String(gop), '-sc_threshold', '0', '-bf', '0',
      '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
      '-movflags', '+faststart', path.join(output, 'g' + gop + '-' + clip + '.mp4')]);
  }
}
await Promise.all(Array.from({ length: 3 }, async () => {
  while (jobs.length) {
    const args = jobs.shift();
    await new Promise((resolve, reject) => {
      const child = spawn(ffmpeg, args, { stdio: 'inherit', windowsHide: true });
      child.on('error', reject);
      child.on('exit', code => code === 0 ? resolve() : reject(new Error('FFmpeg failed for ' + args.at(-1))));
    });
  }
}));
