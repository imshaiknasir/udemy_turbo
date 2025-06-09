#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

const updateVersion = (newVersion) => {
  console.log(`Updating version to ${newVersion}...`);
  
  // Update manifest.json
  const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
  manifest.version = newVersion;
  fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));
  
  // Update manifest-firefox.json
  const firefoxManifest = JSON.parse(fs.readFileSync('manifest-firefox.json', 'utf8'));
  firefoxManifest.version = newVersion;
  fs.writeFileSync('manifest-firefox.json', JSON.stringify(firefoxManifest, null, 2));
  
  console.log('✓ Version updated in both manifest files');
};

const createRelease = (version) => {
  console.log(`Creating release for version ${version}...`);
  
  try {
    // Add and commit changes
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "Release v${version}"`, { stdio: 'inherit' });
    
    // Create and push tag
    execSync(`git tag v${version}`, { stdio: 'inherit' });
    execSync(`git push origin main`, { stdio: 'inherit' });
    execSync(`git push origin v${version}`, { stdio: 'inherit' });
    
    console.log('✓ Release created and pushed to GitHub');
    console.log('✓ GitHub Actions will automatically create the release packages');
    
  } catch (error) {
    console.error('❌ Error creating release:', error.message);
    console.log('Please ensure you have committed all changes and have push access to the repository');
  }
};

const showCurrentVersion = () => {
  const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
  console.log(`Current version: ${manifest.version}`);
};

const command = process.argv[2];
const version = process.argv[3];

switch (command) {
  case 'version':
    if (!version) {
      showCurrentVersion();
    } else {
      updateVersion(version);
    }
    break;
    
  case 'release':
    if (!version) {
      console.log('Please specify a version: node release.js release 1.1');
      process.exit(1);
    }
    updateVersion(version);
    createRelease(version);
    break;
    
  case 'tag':
    if (!version) {
      const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
      createRelease(manifest.version);
    } else {
      createRelease(version);
    }
    break;
    
  default:
    console.log('Usage:');
    console.log('  node release.js version           - Show current version');
    console.log('  node release.js version 1.1      - Update version to 1.1');
    console.log('  node release.js release 1.1      - Update version and create release');
    console.log('  node release.js tag               - Create release with current version');
    console.log('');
    console.log('Examples:');
    console.log('  node release.js release 1.1      - Complete release process');
    console.log('  node release.js version 1.2      - Just update version numbers');
    console.log('');
    showCurrentVersion();
} 