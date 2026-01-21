/**
 * DOM scraper for extracting job data from Upwork job cards
 * Handles missing fields gracefully with defensive programming
 */

const Scraper = {
  /**
   * Extract job data from a job card element
   * @param {Element} jobCard - Job card DOM element
   * @returns {Object|null} Job data object or null if extraction fails
   */
  extractJob: function(jobCard) {
    try {
      // Extract job ID from data attributes or generate from title
      const id = this.extractJobId(jobCard);
      if (!id) {
        Logger.warn('Failed to extract job ID', jobCard);
        return null;
      }
      
      const job = {
        id: id,
        title: this.extractTitle(jobCard),
        description: this.extractDescription(jobCard),
        budget: this.extractBudget(jobCard),
        hourlyRange: this.extractHourlyRange(jobCard),
        proposals: this.extractProposals(jobCard),
        postedAtMinutes: this.extractPostedTime(jobCard),
        client: {
          paymentVerified: this.extractPaymentVerified(jobCard),
          hireRate: this.extractHireRate(jobCard),
          totalSpent: this.extractClientSpent(jobCard),
          rating: this.extractClientRating(jobCard),
          location: this.extractClientLocation(jobCard)
        }
      };
      
      Logger.debug('Extracted job:', job);
      return job;
    } catch (error) {
      Logger.error('Error extracting job data:', error);
      return null;
    }
  },
  
  /**
   * Extract job ID from card
   * @param {Element} card - Job card element
   * @returns {string|null} Job ID
   */
  extractJobId: function(card) {
    // Try data attributes first
    const dataId = card.getAttribute('data-test-job-tile-id') || 
                   card.getAttribute('data-job-id') ||
                   card.getAttribute('data-ev-job-uid');
    
    if (dataId) return dataId;
    
    // Fallback: extract from link href
    const link = Selectors.findElement(card, Selectors.jobTitle);
    if (link && link.href) {
      const match = link.href.match(/\/jobs\/~([a-f0-9]+)/);
      if (match) return match[1];
    }
    
    // Last resort: generate from title
    const title = this.extractTitle(card);
    if (title) {
      return 'job-' + title.substring(0, 50).replace(/[^a-z0-9]/gi, '-');
    }
    
    return null;
  },
  
  /**
   * Extract job title
   * @param {Element} card - Job card element
   * @returns {string} Job title
   */
  extractTitle: function(card) {
    const title = Selectors.findText(card, Selectors.jobTitle);
    return title || 'Untitled Job';
  },
  
  /**
   * Extract job description
   * @param {Element} card - Job card element
   * @returns {string} Job description
   */
  extractDescription: function(card) {
    const desc = Selectors.findText(card, Selectors.jobDescription);
    return desc || '';
  },
  
  /**
   * Extract budget for fixed-price jobs
   * @param {Element} card - Job card element
   * @returns {number|null} Budget in USD
   */
  extractBudget: function(card) {
    const budgetText = Selectors.findText(card, Selectors.budget);
    if (!budgetText) return null;
    
    // Look for fixed price pattern: $500, $1,000, etc.
    const match = budgetText.match(/\$?([\d,]+)/);
    if (match) {
      const value = parseFloat(match[1].replace(/,/g, ''));
      return isNaN(value) ? null : value;
    }
    
    return null;
  },
  
  /**
   * Extract hourly rate range
   * @param {Element} card - Job card element
   * @returns {Array<number>|null} [min, max] hourly rates
   */
  extractHourlyRange: function(card) {
    const budgetText = Selectors.findText(card, Selectors.budget);
    if (!budgetText) return null;
    
    // Look for hourly pattern: $20-$50/hr, $30.00 - $75.00
    const match = budgetText.match(/\$?([\d.]+)\s*-\s*\$?([\d.]+)/);
    if (match) {
      const min = parseFloat(match[1]);
      const max = parseFloat(match[2]);
      if (!isNaN(min) && !isNaN(max)) {
        return [min, max];
      }
    }
    
    return null;
  },
  
  /**
   * Extract number of proposals
   * @param {Element} card - Job card element
   * @returns {number|null} Proposal count
   */
  extractProposals: function(card) {
    const proposalText = Selectors.findText(card, Selectors.proposals);
    if (!proposalText) return null;
    
    // Look for patterns: "5 to 10", "Less than 5", "10 proposals"
    const lessMatch = proposalText.match(/Less than (\d+)/i);
    if (lessMatch) {
      return parseInt(lessMatch[1]) - 1;
    }
    
    const rangeMatch = proposalText.match(/(\d+)\s+to\s+(\d+)/i);
    if (rangeMatch) {
      // Use middle of range
      return Math.floor((parseInt(rangeMatch[1]) + parseInt(rangeMatch[2])) / 2);
    }
    
    const directMatch = proposalText.match(/(\d+)/);
    if (directMatch) {
      return parseInt(directMatch[1]);
    }
    
    return null;
  },
  
  /**
   * Extract posted time in minutes ago
   * @param {Element} card - Job card element
   * @returns {number|null} Minutes since posting
   */
  extractPostedTime: function(card) {
    const timeText = Selectors.findText(card, Selectors.postedTime);
    if (!timeText) return null;
    
    const minutes = timeText.match(/(\d+)\s*minute/i);
    if (minutes) return parseInt(minutes[1]);
    
    const hours = timeText.match(/(\d+)\s*hour/i);
    if (hours) return parseInt(hours[1]) * 60;
    
    const days = timeText.match(/(\d+)\s*day/i);
    if (days) return parseInt(days[1]) * 24 * 60;
    
    return null;
  },
  
  /**
   * Check if payment is verified
   * @param {Element} card - Job card element
   * @returns {boolean} Payment verified status
   */
  extractPaymentVerified: function(card) {
    const verificationElement = Selectors.findElement(card, Selectors.paymentVerified);
    if (!verificationElement) return false;
    
    const text = verificationElement.textContent.toLowerCase();
    return text.includes('payment verified') || 
           text.includes('verified') ||
           verificationElement.querySelector('[data-test="payment-verified-icon"]') !== null;
  },
  
  /**
   * Extract client hire rate
   * @param {Element} card - Job card element
   * @returns {number|null} Hire rate percentage
   */
  extractHireRate: function(card) {
    // Look for hire rate in client info section
    const clientInfo = card.textContent;
    const match = clientInfo.match(/(\d+)%\s*hire\s*rate/i);
    if (match) {
      return parseInt(match[1]);
    }
    return null;
  },
  
  /**
   * Extract total amount client has spent
   * @param {Element} card - Job card element
   * @returns {number|null} Total spent in USD
   */
  extractClientSpent: function(card) {
    const spentText = Selectors.findText(card, Selectors.clientSpent);
    if (!spentText) return null;
    
    // Look for patterns: $5K, $10K+, $500, $1M+
    const match = spentText.match(/\$?([\d.]+)\s*([KM])/i);
    if (match) {
      let value = parseFloat(match[1]);
      const multiplier = match[2].toUpperCase();
      if (multiplier === 'K') value *= 1000;
      if (multiplier === 'M') value *= 1000000;
      return value;
    }
    
    // Direct dollar amount
    const directMatch = spentText.match(/\$?([\d,]+)/);
    if (directMatch) {
      const value = parseFloat(directMatch[1].replace(/,/g, ''));
      return isNaN(value) ? null : value;
    }
    
    return null;
  },
  
  /**
   * Extract client rating
   * @param {Element} card - Job card element
   * @returns {number|null} Rating out of 5
   */
  extractClientRating: function(card) {
    const ratingElement = Selectors.findElement(card, Selectors.clientRating);
    if (!ratingElement) return null;
    
    // Check aria-label for rating
    const ariaLabel = ratingElement.getAttribute('aria-label');
    if (ariaLabel) {
      const match = ariaLabel.match(/([\d.]+)\s*out of\s*5/i);
      if (match) {
        return parseFloat(match[1]);
      }
    }
    
    // Check text content
    const text = ratingElement.textContent;
    const match = text.match(/([\d.]+)/);
    if (match) {
      return parseFloat(match[1]);
    }
    
    return null;
  },
  
  /**
   * Extract client location
   * @param {Element} card - Job card element
   * @returns {string|null} Client location
   */
  extractClientLocation: function(card) {
    return Selectors.findText(card, Selectors.clientLocation);
  }
};

// Make Scraper available globally for content scripts
if (typeof window !== 'undefined') {
  window.Scraper = Scraper;
}
