#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Files to include in the package
const PACKAGE_FILES = [
  'manifest.json',
  'content_script.js',
  'popup.html',
  'popup.js',
  'browser-polyfill.min.js',
  'icons/',
  'LICENSE',
  'README.md'
];

const createPackage = (browser) => {
  const version = JSON.parse(fs.readFileSync('manifest.json', 'utf8')).version;
  const packageName = `udemy-speed-controller-${browser}-v${version}.zip`;
  
  console.log(`Creating ${browser} package: ${packageName}`);
  
  // Create dist directory if it doesn't exist
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }
  
  try {
    // Use zip command if available, otherwise provide instructions
    const filesToZip = PACKAGE_FILES.join(' ');
    execSync(`zip -r dist/${packageName} ${filesToZip}`, { stdio: 'inherit' });
    console.log(`✓ Package created: dist/${packageName}`);
    return `dist/${packageName}`;
  } catch (error) {
    console.log('⚠️  Zip command not available. Please manually create a zip file with these files:');
    PACKAGE_FILES.forEach(file => console.log(`   - ${file}`));
    console.log(`   Save as: dist/${packageName}`);
    return null;
  }
};

const buildForChrome = () => {
  console.log('Building for Chrome (Manifest V3)...');
  // The main manifest.json is already V3 for Chrome
  console.log('✓ Chrome build ready - use manifest.json');
};

const buildForFirefox = () => {
  console.log('Building for Firefox (Manifest V2)...');
  
  // Copy Firefox manifest to main manifest
  const firefoxManifest = fs.readFileSync('manifest-firefox.json', 'utf8');
  fs.writeFileSync('manifest.json', firefoxManifest);
  
  console.log('✓ Firefox build ready - manifest.json updated');
};

const restoreChrome = () => {
  console.log('Restoring Chrome manifest...');
  
  const chromeManifest = {
    "manifest_version": 3,
    "name": "Udemy Speed Controller",
    "version": "1.0",
    "description": "Overrides Udemy's default video speed limit. Allows playback up to 8x.",
    "homepage_url": "https://github.com/example/udemy-speed-controller",
    "permissions": [
      "storage",
      "activeTab"
    ],
    "host_permissions": [
      "*://*.udemy.com/*"
    ],
    "action": {
      "default_icon": {
        "16": "icons/icon16.png",
        "24": "icons/icon24.png",
        "32": "icons/icon32.png"
      },
      "default_title": "Udemy Speed Controller",
      "default_popup": "popup.html"
    },
    "icons": {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    },
    "content_scripts": [
      {
        "matches": ["*://*.udemy.com/course/*"],
        "js": ["browser-polyfill.min.js", "content_script.js"]
      }
    ]
  };
  
  fs.writeFileSync('manifest.json', JSON.stringify(chromeManifest, null, 2));
  console.log('✓ Chrome manifest restored');
};

const packageChrome = () => {
  console.log('Packaging for Chrome...');
  restoreChrome();
  return createPackage('chrome');
};

const packageFirefox = () => {
  console.log('Packaging for Firefox...');
  buildForFirefox();
  return createPackage('firefox');
};

const syncVersions = () => {
  // Ensure both manifests have the same version
  const chromeManifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
  const firefoxManifest = JSON.parse(fs.readFileSync('manifest-firefox.json', 'utf8'));
  
  if (chromeManifest.version !== firefoxManifest.version) {
    console.log(`⚠️  Version mismatch detected: Chrome=${chromeManifest.version}, Firefox=${firefoxManifest.version}`);
    console.log(`   Using Chrome version: ${chromeManifest.version}`);
    
    firefoxManifest.version = chromeManifest.version;
    fs.writeFileSync('manifest-firefox.json', JSON.stringify(firefoxManifest, null, 2));
    console.log('✓ Firefox manifest version synchronized');
  }
};

const packageBoth = () => {
  console.log('Creating packages for both browsers...');
  
  // Sync versions first
  syncVersions();
  
  const chromePackage = packageChrome();
  const firefoxPackage = packageFirefox();
  
  console.log('\n📦 Release packages created:');
  if (chromePackage) console.log(`   Chrome: ${chromePackage}`);
  if (firefoxPackage) console.log(`   Firefox: ${firefoxPackage}`);
  
  console.log('\n🚀 Next steps:');
  console.log('   1. Test both packages in their respective browsers');
  console.log('   2. Create a GitHub release with these packages');
  console.log('   3. Upload to Chrome Web Store / Firefox Add-ons');
};

const command = process.argv[2];

switch (command) {
  case 'chrome':
    buildForChrome();
    break;
  case 'firefox':
    buildForFirefox();
    break;
  case 'restore':
    restoreChrome();
    break;
  case 'package-chrome':
    packageChrome();
    break;
  case 'package-firefox':
    packageFirefox();
    break;
  case 'package':
  case 'package-all':
    packageBoth();
    break;
  default:
    console.log('Usage:');
    console.log('  node build.js chrome          - Prepare for Chrome (Manifest V3)');
    console.log('  node build.js firefox         - Prepare for Firefox (Manifest V2)');
    console.log('  node build.js restore         - Restore Chrome manifest');
    console.log('  node build.js package-chrome  - Create Chrome package');
    console.log('  node build.js package-firefox - Create Firefox package');
    console.log('  node build.js package         - Create packages for both browsers');
    console.log('');
    console.log('Current manifest version:', 
      JSON.parse(fs.readFileSync('manifest.json', 'utf8')).manifest_version);
} 