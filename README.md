# Udemy Turbo 🚀

A cross-browser extension that removes Udemy's speed limits, allowing video playback up to 8x speed. Works seamlessly on both Chrome (Manifest V3) and Firefox (Manifest V2).

## Features

- Control video playback speed from 0.5x to 8x
- Persistent speed settings across page navigation
- Works with Udemy's single-page application
- Cross-browser compatibility (Chrome & Firefox)
- Uses PNG icons for optimal compatibility

## Installation

### Quick Start

The extension comes pre-configured for **Chrome (Manifest V3)** by default. For Firefox users, use the build script to switch to the Firefox-compatible version.

### For Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **"Developer mode"** toggle in the top right corner
3. Click **"Load unpacked"** button
4. Select the `udemy-speed-controller` folder
5. The extension icon should appear in your Chrome toolbar
6. Navigate to any Udemy course video to test

### For Firefox

Firefox requires Manifest V2 for optimal compatibility. Use the build script to switch:

1. **Switch to Firefox version:**
   ```bash
   node build.js firefox
   ```

2. **Load in Firefox:**
   - Open Firefox and go to `about:debugging`
   - Click **"This Firefox"** in the left sidebar
   - Click **"Load Temporary Add-on"**
   - Select the `manifest.json` file from the project folder
   - The extension icon should appear in Firefox toolbar

3. **To switch back to Chrome later:**
   ```bash
   node build.js restore
   ```

### Alternative Manual Method (Firefox)

If you prefer not to use the build script:

1. Backup the current manifest: `cp manifest.json manifest-chrome.json`
2. Copy Firefox manifest: `cp manifest-firefox.json manifest.json`
3. Load the extension in Firefox as described above
4. To restore Chrome: `cp manifest-chrome.json manifest.json`

## Usage

1. **Install the extension** using the instructions above
2. **Navigate to a Udemy course video** (must be on a video page, not just course overview)
3. **Click the extension icon** in your browser toolbar
4. **Adjust speed** using the slider (0.5x to 8x)
5. **Reset to normal** by clicking "Reset to 1x" button
6. **Speed persists** across all Udemy videos and page navigation

## Technical Details

### Cross-Browser Compatibility

This extension uses modern web extension standards with cross-browser compatibility:

- **Chrome (Manifest V3)**: 
  - Uses `action` API instead of deprecated `browser_action`
  - Implements `host_permissions` for secure URL access
  - Uses PNG icons (16px, 24px, 32px for toolbar; 16px, 32px, 48px, 128px for system)

- **Firefox (Manifest V2)**:
  - Uses traditional `browser_action` API
  - Includes URL permissions in main `permissions` array
  - Same PNG icon set for consistency

### Browser Polyfill

The extension includes `browser-polyfill.min.js` which provides:
- **Unified API** across Chrome and Firefox
- **Promise-based API** instead of callbacks
- **Consistent behavior** for storage, messaging, and tabs APIs
- **Automatic fallbacks** for browser-specific differences

### How It Works

1. **Content Script Injection**: Automatically runs on Udemy course pages
2. **Video Detection**: Uses MutationObserver to detect video elements
3. **Speed Persistence**: Saves settings using browser storage API
4. **Real-time Updates**: Applies speed changes immediately via messaging
5. **SPA Compatibility**: Handles Udemy's single-page application navigation

## Build Commands

```bash
# Check current configuration
node build.js

# Switch to Chrome (Manifest V3)
node build.js chrome

# Switch to Firefox (Manifest V2)  
node build.js firefox

# Restore Chrome configuration
node build.js restore
```

## File Structure

```
udemy-speed-controller/
├── manifest.json              # Main manifest (Chrome V3 by default)
├── manifest-firefox.json      # Firefox-specific manifest (V2)
├── content_script.js          # Injected into Udemy pages
├── popup.html                 # Extension popup interface
├── popup.js                   # Popup functionality
├── browser-polyfill.min.js    # Cross-browser compatibility
├── build.js                   # Build script for switching browsers
├── icons/                     # PNG icons for all sizes
│   ├── icon16.png            # 16x16 (favicon, context menu)
│   ├── icon24.png            # 24x24 (toolbar)
│   ├── icon32.png            # 32x32 (Windows, toolbar)
│   ├── icon48.png            # 48x48 (extension management)
│   └── icon128.png           # 128x128 (Chrome Web Store)
└── README.md                  # This file
```

## Troubleshooting

### Chrome Issues
- **Icon not showing**: Reload the extension after switching from Firefox version
- **Extension not working**: Ensure you're on a Udemy course video page (URL contains `/course/`)
- **Permission errors**: Check that the extension has access to `udemy.com`
- **Developer mode**: Must be enabled to load unpacked extensions

### Firefox Issues
- **Use Firefox manifest**: Run `node build.js firefox` before loading
- **Temporary add-on**: Extensions loaded via `about:debugging` are temporary
- **Console errors**: Check browser console (F12) for detailed error messages
- **Permissions**: Firefox may prompt for additional permissions

### General Issues
- **Page refresh**: Refresh Udemy page after installing/updating extension
- **Video detection**: Extension only works on actual video pages, not course overviews
- **Speed limits**: Some videos may have server-side restrictions
- **Cache issues**: Clear browser cache if experiencing persistent problems

### Testing the Extension

1. **Install** using instructions above
2. **Navigate** to any Udemy course with video content
3. **Open extension popup** by clicking the toolbar icon
4. **Test speed changes** - you should see immediate effect on video
5. **Check persistence** - reload page and verify speed is maintained
6. **Test navigation** - go to different videos in the same course

## Browser Support

- **Chrome**: Version 88+ (Manifest V3 support)
- **Firefox**: Version 109+ (recommended), older versions may work
- **Edge**: Should work with Chrome instructions (Chromium-based)
- **Safari**: Not supported (different extension system)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/udemy_turbo.git`
3. Make your changes
4. Test in both Chrome and Firefox
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This extension is for educational purposes and personal use. Please respect Udemy's terms of service and use responsibly. 