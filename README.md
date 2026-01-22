# Upwork Smart Job Shortlister

A Chrome extension that helps freelancers find quality jobs on Upwork by automatically scoring and highlighting job listings based on client quality and job signals.

## ⚠️ Disclaimer

**This extension is not affiliated with, endorsed by, or connected to Upwork in any way.** It is an independent tool created to help freelancers make informed decisions. Use at your own discretion.

## 🎯 Features

- **Automatic Job Scoring**: Scores jobs 0-100 based on multiple factors
- **Visual Annotations**: Color-coded borders and score badges on job cards
- **Smart Filtering**: Reject jobs that don't meet your criteria
- **Client Quality Analysis**: Evaluates payment verification, hire rate, and spending history
- **Keyword Matching**: Prefer or exclude jobs based on keywords
- **Customizable Rules**: Adjust thresholds to match your preferences
- **Presets**: Quick settings for freelancers and agencies
- **Zero Backend**: All processing happens locally in your browser
- **Privacy Focused**: No data collection or external requests

## 📋 Requirements

- Google Chrome or Chromium-based browser (Edge, Brave, etc.)
- Chrome version 88 or higher (Manifest V3 support)
- Active Upwork account with access to job feed

## 🚀 Installation

### From Source (Development)

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/SabeehurRehman/upwork-extention.git
   cd upwork-extention
   ```

2. **Open Chrome Extensions page**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)

3. **Load the extension**
   - Click "Load unpacked"
   - Select the `upwork-extention` directory
   - The extension should now appear in your extensions list

4. **Pin the extension** (optional)
   - Click the puzzle icon in Chrome toolbar
   - Find "Upwork Smart Job Shortlister"
   - Click the pin icon to keep it visible

### Chrome Web Store (Coming Soon)

The extension will be submitted to the Chrome Web Store for easier installation.

## 🎮 Usage

### Basic Usage

1. **Enable the extension**
   - Click the extension icon in your toolbar
   - Ensure the toggle is set to "Enabled"

2. **Navigate to Upwork**
   - Go to https://www.upwork.com/
   - Browse to the job feed (e.g., "Find Work" → "Browse Jobs")

3. **View scored jobs**
   - Job cards will automatically be scored and highlighted
   - Green border (80-100): Excellent opportunities
   - Yellow border (60-79): Good opportunities
   - Red border (0-59): Fair/Poor opportunities

4. **View score details**
   - Hover over the score badge to see breakdown
   - Rejected jobs will be dimmed with an ✕ badge

### Configuration

Click the extension icon to access settings:

#### Hard Filters
Jobs failing these filters are automatically rejected:
- **Payment Verified**: Require client to have verified payment method
- **Minimum Hire Rate**: Set minimum acceptable hire rate (%)
- **Minimum Budget**: Set minimum acceptable budget ($)

#### Keywords
- **Preferred Keywords**: Jobs matching these get bonus points
- **Excluded Keywords**: Jobs containing these are rejected

#### UI Preferences
- **Score Badge**: Show/hide the score number
- **Border Highlight**: Show/hide colored borders
- **Tooltip**: Show/hide score breakdown on hover

#### Presets
- **Freelancer**: Higher standards (50% hire rate, $100 min budget)
- **Agency**: Moderate standards (30% hire rate, $500 min budget)

## 📊 Scoring System

Jobs are scored 0-100 based on weighted factors:

| Factor | Weight | Description |
|--------|--------|-------------|
| Hire Rate | 25% | Client's historical hire rate |
| Payment Verified | 20% | Whether payment method is verified |
| Client Spend | 15% | Total amount client has spent |
| Proposal Count | 15% | Number of proposals (fewer is better) |
| Budget | 15% | Job budget or hourly rate |
| Keyword Match | 10% | Matches with preferred keywords |

### Score Breakdown

- **80-100 (Green)**: Excellent opportunity with strong signals
- **60-79 (Yellow)**: Good opportunity worth considering
- **40-59 (Orange)**: Fair opportunity, evaluate carefully
- **0-39 (Red)**: Poor signals, proceed with caution

## 🔒 Privacy & Permissions

### Required Permissions

- **storage**: Save your configuration and preferences locally
- **host_permissions (upwork.com)**: Read job listings from Upwork pages

### What This Extension Does NOT Do

- ❌ No automated actions (applying, clicking, scrolling)
- ❌ No background polling or requests
- ❌ No external network requests
- ❌ No data collection or analytics
- ❌ No cookie access or manipulation
- ❌ No private API calls
- ❌ Only reads rendered DOM content

All processing happens locally in your browser. Your configuration is stored locally using Chrome's storage API.

## 🛠️ Technical Details

### Architecture

```
/upwork-extention
├── manifest.json           # Extension configuration (Manifest V3)
├── content/                # Content scripts (run on Upwork pages)
│   ├── index.js           # Main orchestrator
│   ├── scraper.js         # DOM extraction logic
│   ├── rules.js           # Filtering rules engine
│   ├── scorer.js          # Scoring algorithm
│   ├── ui.js              # Visual annotations
│   └── observer.js        # MutationObserver for dynamic content
├── popup/                 # Extension popup UI
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── storage/               # Configuration management
│   └── defaults.js
├── utils/                 # Utility functions
│   ├── logger.js
│   ├── debounce.js
│   └── selectors.js
└── icons/                 # Extension icons
```

### Key Features

- **Resilient DOM Scraping**: Multiple selector fallbacks for stability
- **MutationObserver**: Automatically detects new jobs during infinite scroll
- **Debounced Processing**: Efficient batch processing of DOM changes
- **Defensive Programming**: Graceful handling of missing data
- **No Memory Leaks**: Proper cleanup on page unload

## 🐛 Troubleshooting

### Extension not working

1. **Check if enabled**: Click extension icon, verify toggle is "Enabled"
2. **Refresh Upwork page**: Press F5 to reload the page
3. **Clear cache**: Sometimes cached scripts can cause issues
4. **Check console**: Open DevTools (F12) and check for errors

### Jobs not being scored

1. **Verify you're on job feed**: Extension only works on Upwork job listing pages
2. **Check selectors**: Upwork may have changed their DOM structure
3. **Enable debug mode**: In console, run: `localStorage.setItem('upwork-shortlister-debug', 'true')`

### Scores seem incorrect

1. **Review settings**: Check your hard filters and scoring weights
2. **Missing data**: Some jobs have incomplete information
3. **Reset to defaults**: Try resetting settings in popup

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with vanilla JavaScript (no frameworks)
- Uses Chrome Extension Manifest V3
- Follows Chrome Web Store policies

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions

## ⚖️ Legal

This extension:
- Complies with Chrome Web Store policies
- Respects Upwork's Terms of Service (read-only access)
- Does not automate any actions
- Does not scrape private or protected data
- Only processes publicly visible job listings

**Use responsibly and in accordance with Upwork's Terms of Service.**
