# Installation Guide

## Prerequisites

- Google Chrome or Chromium-based browser (Edge, Brave, Opera, etc.)
- Chrome version 88 or higher (for Manifest V3 support)
- Active Upwork account

## Step-by-Step Installation

### 1. Download the Extension

**Option A: Clone the Repository**
```bash
git clone https://github.com/SabeehurRehman/upwork-extention.git
cd upwork-extention
```

**Option B: Download ZIP**
1. Go to https://github.com/SabeehurRehman/upwork-extention
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file to a folder on your computer

### 2. Open Chrome Extensions Page

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
   - Or click the three-dot menu → More tools → Extensions

### 3. Enable Developer Mode

1. In the top-right corner of the Extensions page
2. Toggle the "Developer mode" switch to ON

### 4. Load the Extension

1. Click the "Load unpacked" button
2. Navigate to the folder containing the extension files
3. Select the folder (the one containing `manifest.json`)
4. Click "Select Folder" or "Open"

### 5. Verify Installation

You should see "Upwork Smart Job Shortlister" appear in your extensions list with:
- ✅ Green checkmark indicating it's loaded
- Extension icon (if provided)
- Version: 1.0.0

### 6. Pin the Extension (Optional but Recommended)

1. Click the puzzle icon in Chrome's toolbar
2. Find "Upwork Smart Job Shortlister"
3. Click the pin icon to keep it visible

## First-Time Setup

### 1. Configure Your Preferences

1. Click the extension icon in your toolbar
2. Review the default settings:
   - **Hard Filters**: Payment verified (required), 30% minimum hire rate
   - **UI Preferences**: All visual features enabled
3. Adjust settings based on your needs
4. Click "Save Settings"

### 2. Test the Extension

1. Go to https://www.upwork.com/
2. Log in to your account
3. Navigate to "Find Work" → "Browse Jobs"
4. You should see job cards being scored and highlighted automatically

## Troubleshooting

### Extension Not Working

**Problem**: Extension loads but doesn't score jobs

**Solutions**:
1. Check that the extension is enabled in `chrome://extensions/`
2. Click the extension icon and verify it's set to "Enabled"
3. Refresh the Upwork page (F5)
4. Clear your browser cache and reload

**Problem**: No visual changes on job cards

**Solutions**:
1. Click the extension icon
2. Verify "Show Score Badge" and "Show Border Highlight" are checked
3. Save settings and refresh the page

### Console Debugging

1. Open DevTools (F12 or Ctrl+Shift+I)
2. Go to the Console tab
3. Look for messages starting with `[Upwork Shortlister]`
4. To enable debug mode, run in console:
   ```javascript
   localStorage.setItem('upwork-shortlister-debug', 'true')
   ```
5. Refresh the page to see detailed debug logs

### Permission Issues

If Chrome warns about permissions:
- The extension only needs:
  - **storage**: To save your settings locally
  - **upwork.com**: To read job listings (no writes, no automation)

These are safe and necessary for the extension to function.

## Updating the Extension

### Manual Update (Developer Mode)

1. Pull the latest code:
   ```bash
   cd upwork-extention
   git pull origin main
   ```
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Verify the version number has updated

### When Available on Chrome Web Store

Once published, the extension will update automatically.

## Uninstalling

### Temporary Disable

1. Go to `chrome://extensions/`
2. Toggle off the switch for "Upwork Smart Job Shortlister"

### Complete Removal

1. Go to `chrome://extensions/`
2. Click "Remove" on the extension card
3. Confirm the removal
4. Your settings will be cleared from Chrome's local storage

## Notes

- **Settings Storage**: All settings are stored locally in Chrome's storage
- **No Account**: The extension doesn't require an account or registration
- **Privacy**: No data is sent to external servers
- **Updates**: Currently manual, automatic updates coming with Web Store release

## Support

For issues or questions:
1. Check the [README.md](README.md) for detailed documentation
2. Review the [Troubleshooting](#troubleshooting) section above
3. Open an issue on GitHub: https://github.com/SabeehurRehman/upwork-extention/issues

## What's Next?

- Customize your filter settings
- Try the Freelancer or Agency presets
- Add preferred keywords to boost relevant jobs
- Enjoy a better Upwork job search experience!
