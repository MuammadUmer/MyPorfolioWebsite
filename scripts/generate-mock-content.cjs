// Simple Node script to regenerate mock JSON fixtures for local development.
// It overwrites src/data/projects.json, experience.json, and skills.json
// with generic but valid content structures.

const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.join(__dirname, '..');
const dataDir = path.join(rootDir, 'src', 'data');

function writeJson(fileName, data) {
  const filePath = path.join(dataDir, fileName);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function generateProjects() {
  return [
    {
      slug: 'sample-project',
      title: 'Sample Project',
      role: 'Backend Engineer',
      company: 'Sample Company',
      period: '2024',
      domain: 'Sample Domain',
      summary: 'This is a sample project generated for local development.',
      techStack: ['Node.js', 'React'],
      highlights: ['Demonstrates mock data generation', 'Safe to overwrite in local dev only'],
    },
  ];
}

function generateExperience() {
  return [
    {
      company: 'Sample Org',
      role: 'Software Engineer',
      location: 'Remote',
      period: '2023–Present',
      responsibilities: ['Built and maintained sample systems for testing the portfolio.'],
    },
  ];
}

function generateSkills() {
  return [
    {
      category: 'Backend & APIs',
      items: ['Node.js', 'Express'],
    },
    {
      category: 'Frontend',
      items: ['React', 'Next.js'],
    },
  ];
}

function main() {
  writeJson('projects.json', generateProjects());
  writeJson('experience.json', generateExperience());
  writeJson('skills.json', generateSkills());
  console.log('Mock content generated in src/data/*.json');
}

main();
