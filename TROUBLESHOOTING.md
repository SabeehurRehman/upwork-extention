# Troubleshooting Guide

If the extension isn't highlighting jobs on Upwork, follow these steps:

## Step 1: Verify Extension is Loaded

1. Open Chrome DevTools (F12 or Right-click → Inspect)
2. Go to the **Console** tab
3. Look for these messages:

```
🎯 Extension Loading...
⚙️ Configuration loaded
✅ Starting job processing...
👀 Watching for job cards...
🚀 Extension loaded successfully!
```

If you don't see these messages, the extension isn't loading. Check:
- Extension is enabled in `chrome://extensions/`
- You're on an Upwork page (`https://www.upwork.com/*`)
- No JavaScript errors preventing load

## Step 2: Check for Job Cards

After the extension loads, you should see:

```
🔍 Searching for job cards...
✓ Found X cards with: [selector]
📊 Total unique cards: X
✨ Processed X new job cards
```

**If you see "No job cards found!":**
- You may not be on a job listing page
- Navigate to: https://www.upwork.com/nx/search/jobs/
- The DOM structure may have changed (report this as an issue)

## Step 3: Check Extension Status

Click the extension icon in your toolbar. Verify:
- Toggle shows **"Enabled"** (not "Disabled")
- Settings are configured correctly
- "Show Score Badge" is checked ✓
- "Show Border Highlight" is checked ✓

If disabled, toggle it on and refresh the page.

## Step 4: Check Console for Processing

Look for these messages when jobs are found:

```
🎯 Annotating card with score: 75
🎨 Added score badge: 75
🖼️ Added border: #eab308
```

This confirms the extension is working.

## Step 5: Visual Inspection

On job cards, you should see:
- **Colored borders**: Green (80+), Yellow (60-79), or Red (<60)
- **Score badges**: Circular badge in top-right corner with number
- **Tooltips**: Hover over badge to see score breakdown

## Step 6: Enable Debug Mode

For detailed logs, run this in the console:

```javascript
localStorage.setItem('upwork-shortlister-debug', 'true')
```

Then refresh the page. You'll see much more detailed output.

## Step 7: Check for Conflicts

The extension might conflict with:
- Other Upwork extensions
- Ad blockers affecting DOM structure
- Browser privacy settings blocking storage

Try:
1. Disable other extensions temporarily
2. Test in Incognito mode (allow extension in incognito)
3. Clear browser cache and reload

## Step 8: Verify DOM Structure

Run this in console to check if job cards exist:

```javascript
// Test selectors
const selectors = [
  'article[data-test="job-tile"]',
  'section[data-test="JobTile"]',
  'article[data-ev-label="search_result_impression"]'
];

selectors.forEach(sel => {
  const found = document.querySelectorAll(sel);
  console.log(`${sel}: ${found.length} found`);
});
```

If all return 0, Upwork's DOM has changed significantly.

## Step 9: Manual Test

Try manually adding a badge to test visibility:

```javascript
// Add a test badge to first article element
const card = document.querySelector('article');
if (card) {
  card.style.position = 'relative';
  card.style.border = '3px solid #22c55e';
  
  const badge = document.createElement('div');
  badge.textContent = '99';
  badge.style.cssText = `
    position: absolute !important;
    top: 10px !important;
    right: 10px !important;
    background: #22c55e !important;
    color: white !important;
    font-size: 20px !important;
    padding: 10px !important;
    border-radius: 50% !important;
    z-index: 10000 !important;
    width: 50px !important;
    height: 50px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  `;
  card.appendChild(badge);
  console.log('Test badge added!');
}
```

If this badge is visible, the extension should work.

## Step 10: Report the Issue

If none of the above works, please report with:

1. **Console output**: Copy all `[Upwork Shortlister]` messages
2. **Browser version**: Help → About Chrome
3. **Extension version**: From `chrome://extensions/`
4. **Upwork URL**: The exact page you're on
5. **Screenshots**: DevTools console and the page
6. **DOM sample**: Right-click a job card → Inspect → Copy outerHTML

Post this information in a GitHub issue.

## Common Solutions

### "Extension is disabled"
- Click extension icon → Toggle to "Enabled" → Refresh page

### "No job cards found"
- Navigate to: https://www.upwork.com/nx/search/jobs/
- Try "Browse Jobs" or "Best Matches" tabs
- Wait for page to fully load

### Visual elements not showing
- Check if filters are rejecting all jobs
- Lower "Minimum Hire Rate" to 0% temporarily
- Uncheck "Require Payment Verified" temporarily
- Check if scores are being calculated (look in console)

### Extension works on one page but not another
- Some Upwork pages use different layouts
- The extension targets job listing/search pages
- Individual job pages are not supported

## Success Indicators

When working correctly, you should see:
1. ✅ Colored borders around job cards
2. ✅ Score badges in top-right corners
3. ✅ Console shows cards found and processed
4. ✅ Hovering badges shows tooltips

## Quick Reset

To completely reset the extension:

1. Go to `chrome://extensions/`
2. Click "Remove" on Upwork Smart Job Shortlister
3. Reload the extension from source
4. Navigate to Upwork job listings
5. Press Ctrl+Shift+R (hard refresh)

## Still Not Working?

The extension is actively maintained. If Upwork has changed their DOM structure, please report it so selectors can be updated.

Create an issue at: https://github.com/SabeehurRehman/upwork-extention/issues

Include the console output and any error messages you see.
