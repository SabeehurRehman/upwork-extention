/**
 * MutationObserver for detecting new job cards
 * Handles infinite scroll and dynamic content
 */

const Observer = {
  observer: null,
  isObserving: false,
  
  /**
   * Start observing DOM for new job cards
   * @param {Function} callback - Function to call when new cards detected
   */
  start: function(callback) {
    if (this.isObserving) {
      Logger.warn('Observer already running');
      return;
    }
    
    // Debounce the callback to batch mutations
    const debouncedCallback = debounce(() => {
      this.findAndProcessNewCards(callback);
    }, 500);
    
    // Create observer
    this.observer = new MutationObserver((mutations) => {
      // Check if any mutations added job cards
      let hasNewCards = false;
      
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if added node is a job card or contains job cards
              if (this.isJobCard(node) || node.querySelector) {
                hasNewCards = true;
                break;
              }
            }
          }
        }
        if (hasNewCards) break;
      }
      
      if (hasNewCards) {
        Logger.debug('New job cards detected in DOM');
        debouncedCallback();
      }
    });
    
    // Observe the entire document body
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    this.isObserving = true;
    Logger.info('MutationObserver started');
    
    // Process existing cards immediately
    this.findAndProcessNewCards(callback);
  },
  
  /**
   * Stop observing DOM
   */
  stop: function() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
      this.isObserving = false;
      Logger.info('MutationObserver stopped');
    }
  },
  
  /**
   * Check if element is a job card
   * @param {Element} element - Element to check
   * @returns {boolean} True if job card
   */
  isJobCard: function(element) {
    if (!element || !element.tagName) return false;
    
    // Try each selector to identify job cards
    for (const selector of Selectors.jobCard) {
      try {
        if (element.matches(selector)) {
          return true;
        }
      } catch (e) {
        // Invalid selector, continue
      }
    }
    
    return false;
  },
  
  /**
   * Find all job cards in the DOM
   * @returns {Array<Element>} Array of job card elements
   */
  findAllJobCards: function() {
    const cards = [];
    
    // Try each selector
    for (const selector of Selectors.jobCard) {
      try {
        const found = document.querySelectorAll(selector);
        if (found.length > 0) {
          cards.push(...Array.from(found));
          Logger.debug(`Found ${found.length} cards with selector: ${selector}`);
        }
      } catch (e) {
        Logger.debug(`Invalid selector: ${selector}`, e);
      }
    }
    
    // Remove duplicates
    const uniqueCards = Array.from(new Set(cards));
    Logger.debug(`Total unique cards: ${uniqueCards.length}`);
    
    return uniqueCards;
  },
  
  /**
   * Find and process new cards (not yet processed)
   * @param {Function} callback - Function to call for each new card
   */
  findAndProcessNewCards: function(callback) {
    const allCards = this.findAllJobCards();
    let newCount = 0;
    
    for (const card of allCards) {
      // Check if already processed
      if (!card.hasAttribute('data-shortlister-processed')) {
        card.setAttribute('data-shortlister-processed', 'true');
        newCount++;
        
        try {
          callback(card);
        } catch (error) {
          Logger.error('Error processing card:', error);
        }
      }
    }
    
    if (newCount > 0) {
      Logger.info(`Processed ${newCount} new job cards`);
    }
  },
  
  /**
   * Reset all processed markers (for re-processing)
   */
  reset: function() {
    const processedCards = document.querySelectorAll('[data-shortlister-processed]');
    processedCards.forEach(card => {
      card.removeAttribute('data-shortlister-processed');
    });
    Logger.info('Reset all processed card markers');
  }
};

// Make Observer available globally for content scripts
if (typeof window !== 'undefined') {
  window.Observer = Observer;
}
