/**
 * Centralized DOM selectors with fallback strategies
 * Resilient to Upwork DOM changes
 */

const Selectors = {
  // Job card selectors (multiple fallbacks)
  // Updated for current Upwork DOM structure
  jobCard: [
    'article[data-test="job-tile"]',
    'section[data-test="JobTile"]',
    'article[data-ev-label="search_result_impression"]',
    '[data-test="JobTile"]',
    'article.job-tile',
    'section.job-tile',
    'article.up-card-section',
    '.air3-card',
    'section.air3-card'
  ],
  
  // Job title selectors
  jobTitle: [
    '[data-test="UpCJobTitle"]',
    '[data-test="job-tile-title"]',
    'h2.job-tile-title',
    'h3[itemprop="title"]',
    'h4.job-tile-title',
    '.up-card-section h4',
    'a.job-title-link',
    'a[data-test="job-tile-title-link"]',
    '.job-title a',
    'h4 a'
  ],
  
  // Job description selectors
  jobDescription: [
    '[data-test="UpCLineClamp JobDescription"]',
    '[data-test="job-description-text"]',
    '.job-description',
    '[data-test="Description"]',
    '.break',
    'p[data-test="job-tile-description"]',
    '.air3-line-clamp',
    'span[data-test="job-description"]'
  ],
  
  // Budget/rate selectors
  budget: [
    '[data-test="job-type-label"]',
    '[data-test="budget"]',
    '.job-tile-header strong',
    'strong[data-test="is-fixed-price"]'
  ],
  
  // Proposals count selectors
  proposals: [
    '[data-test="proposals"]',
    'strong:contains("Proposals")',
    'li[data-test="proposals-tier"]'
  ],
  
  // Posted time selectors
  postedTime: [
    '[data-test="job-published-date"]',
    'small[data-test="job-posted-date"]',
    'span.text-muted small'
  ],
  
  // Client info selectors
  paymentVerified: [
    '[data-test="payment-verification-status"]',
    'li[data-test="payment-verified"]',
    '.verification-status'
  ],
  
  clientSpent: [
    '[data-test="client-spend"]',
    'li:contains("spent")',
    '.client-activity strong'
  ],
  
  clientLocation: [
    '[data-test="location"]',
    'li[data-test="client-location"]',
    'span.client-location'
  ],
  
  clientRating: [
    '[data-test="rating"]',
    '.air3-rating',
    '[aria-label*="rating"]'
  ],
  
  /**
   * Try multiple selectors until one matches
   * @param {Element} element - Parent element to search within
   * @param {Array<string>} selectors - Array of CSS selectors
   * @returns {Element|null} Found element or null
   */
  findElement: function(element, selectors) {
    for (const selector of selectors) {
      try {
        const found = element.querySelector(selector);
        if (found) return found;
      } catch (e) {
        Logger.debug(`Selector failed: ${selector}`, e);
      }
    }
    return null;
  },
  
  /**
   * Try multiple selectors and return text content
   * @param {Element} element - Parent element to search within
   * @param {Array<string>} selectors - Array of CSS selectors
   * @returns {string|null} Text content or null
   */
  findText: function(element, selectors) {
    const found = this.findElement(element, selectors);
    return found ? found.textContent.trim() : null;
  }
};

// Make Selectors available globally for content scripts
if (typeof window !== 'undefined') {
  window.Selectors = Selectors;
}
