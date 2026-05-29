import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, unlinkSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';

const __dirname = dirname(fileURLToPath(import.meta.url));

const VIDEO_PATH = join(__dirname, '..', '..', 'video', 'Generated video 1.mp4');
const OUT_DIR = join(__dirname, '..', 'public', 'frames');
const TARGET_FRAMES = 180;
const TARGET_WIDTH = 1920;
const QV = 2;

function parseDurationSeconds(stderr) {
  const match = stderr.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const [, h, m, s] = match;
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
}

function probe(videoPath) {
  const res = spawnSync(ffmpegPath, ['-i', videoPath], { encoding: 'utf8' });
  const duration = parseDurationSeconds(res.stderr);
  if (duration == null) {
    throw new Error(`Could not parse duration from ffmpeg output:\n${res.stderr}`);
  }
  return duration;
}

function cleanOutDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    return;
  }
  let removedFiles = 0;
  let removedDirs = 0;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      rmSync(full, { recursive: true, force: true });
      removedDirs++;
    } else if (/^frame-\d{3}\.jpg$/.test(entry)) {
      unlinkSync(full);
      removedFiles++;
    }
  }
  if (removedFiles > 0) console.log(`Cleaned ${removedFiles} existing frame(s)`);
  if (removedDirs > 0) console.log(`Removed ${removedDirs} legacy tier subdir(s)`);
}

function main() {
  if (!existsSync(VIDEO_PATH)) {
    console.error(`ERROR: video not found at ${VIDEO_PATH}`);
    process.exit(1);
  }
  if (!ffmpegPath) {
    console.error('ERROR: ffmpeg-static did not resolve a binary path');
    process.exit(1);
  }

  console.log(`Video:  ${VIDEO_PATH}`);
  console.log(`Output: ${OUT_DIR}`);

  cleanOutDir(OUT_DIR);

  const duration = probe(VIDEO_PATH);
  const fps = TARGET_FRAMES / duration;
  console.log(
    `Duration: ${duration.toFixed(3)}s  ->  fps ${fps.toFixed(4)}  ` +
      `(width ${TARGET_WIDTH}, q:v ${QV}, ${TARGET_FRAMES} frames)`,
  );

  const args = [
    '-i', VIDEO_PATH,
    '-vf', `fps=${fps.toFixed(6)},scale=${TARGET_WIDTH}:-2:flags=lanczos`,
    '-frames:v', String(TARGET_FRAMES),
    '-q:v', String(QV),
    '-y',
    join(OUT_DIR, 'frame-%03d.jpg'),
  ];

  const run = spawnSync(ffmpegPath, args, { stdio: 'inherit' });
  if (run.status !== 0) {
    console.error(`ffmpeg exited with code ${run.status}`);
    process.exit(run.status ?? 1);
  }

  const produced = readdirSync(OUT_DIR).filter((f) => /^frame-\d{3}\.jpg$/.test(f));
  console.log(`\nDone. Extracted ${produced.length} frame(s).`);
  if (produced.length !== TARGET_FRAMES) {
    console.warn(`WARNING: expected ${TARGET_FRAMES}, got ${produced.length}`);
  }
}

main();
