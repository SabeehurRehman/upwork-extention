# Contributing to Upwork Smart Job Shortlister

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a feature branch
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## Development Setup

```bash
git clone https://github.com/YOUR_USERNAME/upwork-extention.git
cd upwork-extention
```

Load the extension in Chrome Developer Mode:
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the project directory

## Project Structure

```
/upwork-extention
├── manifest.json          # Extension manifest (Manifest V3)
├── content/               # Content scripts
│   ├── index.js          # Main orchestrator
│   ├── scraper.js        # DOM extraction
│   ├── rules.js          # Filter rules
│   ├── scorer.js         # Scoring algorithm
│   ├── ui.js             # UI manipulation
│   └── observer.js       # MutationObserver
├── popup/                # Popup interface
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── storage/              # Configuration
│   └── defaults.js
├── utils/                # Utilities
│   ├── logger.js
│   ├── debounce.js
│   └── selectors.js
└── icons/                # Extension icons
```

## Coding Standards

### JavaScript

- Use ES6+ features
- Write pure functions where possible
- Avoid global state
- Use defensive programming
- Comment WHY, not WHAT

### Naming Conventions

- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Classes/Objects: `PascalCase`
- Private methods: prefix with underscore `_methodName`

### Error Handling

- Always handle errors gracefully
- Never throw uncaught errors
- Log errors with Logger utility
- Provide fallback behavior

### Example

```javascript
/**
 * Extract job title from card
 * @param {Element} card - Job card element
 * @returns {string} Job title
 */
extractTitle: function(card) {
  try {
    const title = Selectors.findText(card, Selectors.jobTitle);
    return title || 'Untitled Job';
  } catch (error) {
    Logger.error('Failed to extract title:', error);
    return 'Untitled Job';
  }
}
```

## Testing

### Manual Testing

1. Load the extension in Chrome
2. Navigate to Upwork job feed
3. Verify jobs are scored correctly
4. Test different filter configurations
5. Check console for errors

### Test Checklist

- [ ] Extension loads without errors
- [ ] Jobs are scored and highlighted
- [ ] Popup UI functions correctly
- [ ] Settings persist after reload
- [ ] Works with infinite scroll
- [ ] No memory leaks
- [ ] No console errors

## Pull Request Process

1. **Update Documentation**: If adding features, update README.md
2. **Test Thoroughly**: Ensure all functionality works
3. **Clean Commits**: Use clear, descriptive commit messages
4. **No Breaking Changes**: Maintain backward compatibility
5. **Code Review**: Be open to feedback

### Commit Message Format

```
type: brief description

Detailed explanation of changes (if needed)

- List specific changes
- Explain why, not what
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### Example Commit

```
feat: add keyword exclusion filter

Added ability to exclude jobs containing specific keywords.
This helps users avoid irrelevant job types.

- Updated rules.js with exclusion logic
- Added UI field in popup
- Updated documentation
```

## Feature Requests

Have an idea? Open an issue with:
- Clear description of the feature
- Use case / problem it solves
- Potential implementation approach
- Examples (if applicable)

## Bug Reports

Found a bug? Open an issue with:
- Browser and version
- Extension version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Console errors (if any)

## Areas for Contribution

### High Priority

- Improved DOM selector resilience
- Additional scoring factors
- Better keyword matching
- Performance optimizations
- Accessibility improvements

### Medium Priority

- Internationalization (i18n)
- Dark mode for popup
- Export/import settings
- Job statistics dashboard
- Custom scoring weights

### Low Priority

- Additional presets
- Visual themes
- Keyboard shortcuts
- Notification system

## Chrome Web Store Compliance

All contributions must:
- Follow Chrome Extension policies
- Not introduce automation
- Not access private data
- Not make external network requests
- Maintain read-only operation

## Questions?

Feel free to:
- Open a GitHub issue
- Start a discussion
- Ask in pull request comments

Thank you for contributing! 🎉
