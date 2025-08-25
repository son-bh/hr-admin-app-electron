import { writeFileSync } from 'fs';
import { execSync } from 'child_process';

// Get human-readable timestamp
const timestamp = new Date().toISOString();

// Get short Git commit hash (fallback to 'unknown' if no git repo)
let gitCommit = 'unknown';
try {
  gitCommit = execSync('git rev-parse --short HEAD').toString().trim();
} catch {
  console.warn('⚠️ Could not get git commit hash. Is this a git repo?');
}

// Unique build ID (millisecond timestamp)
const buildId = Date.now().toString();

// Create version object
const versionData = {
  buildId,
  timestamp,
  gitCommit,
};

// Save to public/version.json
writeFileSync('public/version.json', JSON.stringify(versionData, null, 2));

console.log(`✅ Version file generated:
  Build ID: ${buildId}
  Commit:   ${gitCommit}
  Time:     ${timestamp}
`);
