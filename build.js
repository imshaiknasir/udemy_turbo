#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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
  default:
    console.log('Usage:');
    console.log('  node build.js chrome   - Prepare for Chrome (Manifest V3)');
    console.log('  node build.js firefox  - Prepare for Firefox (Manifest V2)');
    console.log('  node build.js restore  - Restore Chrome manifest');
    console.log('');
    console.log('Current manifest version:', 
      JSON.parse(fs.readFileSync('manifest.json', 'utf8')).manifest_version);
} 