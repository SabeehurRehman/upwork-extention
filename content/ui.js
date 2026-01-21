/**
 * UI manipulation for job cards
 * Adds badges, borders, and tooltips
 */

const UI = {
  // Track processed cards to avoid duplicate annotations
  processedCards: new Set(),
  
  /**
   * Annotate a job card with score and visual indicators
   * @param {Element} card - Job card DOM element
   * @param {Object} result - Scoring result
   * @param {Object} config - UI configuration
   */
  annotateCard: function(card, result, config) {
    // Prevent duplicate processing
    const cardId = card.getAttribute('data-shortlister-id');
    if (cardId && this.processedCards.has(cardId)) {
      return;
    }
    
    // Mark as processed
    const newId = 'card-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    card.setAttribute('data-shortlister-id', newId);
    this.processedCards.add(newId);
    
    // Clean any existing annotations
    this.cleanCard(card);
    
    const score = result.score;
    const color = Scorer.getScoreColor(score, config.ui.colorScheme);
    
    // Add border highlight
    if (config.ui.showBorderHighlight) {
      this.addBorderHighlight(card, color);
    }
    
    // Add score badge
    if (config.ui.showScoreBadge) {
      this.addScoreBadge(card, score, color);
    }
    
    // Add tooltip
    if (config.ui.showTooltip) {
      this.addTooltip(card, result);
    }
  },
  
  /**
   * Mark a rejected job card
   * @param {Element} card - Job card DOM element
   * @param {string} reason - Rejection reason
   * @param {Object} config - UI configuration
   */
  markRejected: function(card, reason, config) {
    // Prevent duplicate processing
    const cardId = card.getAttribute('data-shortlister-id');
    if (cardId && this.processedCards.has(cardId)) {
      return;
    }
    
    const newId = 'card-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    card.setAttribute('data-shortlister-id', newId);
    this.processedCards.add(newId);
    
    // Clean any existing annotations
    this.cleanCard(card);
    
    // Dim the card
    card.style.opacity = '0.5';
    card.style.filter = 'grayscale(50%)';
    
    // Add rejection badge
    this.addRejectionBadge(card, reason);
  },
  
  /**
   * Clean existing annotations from a card
   * @param {Element} card - Job card DOM element
   */
  cleanCard: function(card) {
    // Remove existing badges
    const existingBadge = card.querySelector('.upwork-shortlister-badge');
    if (existingBadge) {
      existingBadge.remove();
    }
    
    // Reset styles
    card.style.border = '';
    card.style.boxShadow = '';
    card.style.opacity = '';
    card.style.filter = '';
  },
  
  /**
   * Add border highlight to card
   * @param {Element} card - Job card DOM element
   * @param {string} color - Border color
   */
  addBorderHighlight: function(card, color) {
    card.style.border = `3px solid ${color}`;
    card.style.boxShadow = `0 0 10px ${color}40`;
  },
  
  /**
   * Add score badge to card
   * @param {Element} card - Job card DOM element
   * @param {number} score - Job score
   * @param {string} color - Badge color
   */
  addScoreBadge: function(card, score, color) {
    const badge = document.createElement('div');
    badge.className = 'upwork-shortlister-badge';
    badge.textContent = score;
    badge.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: ${color};
      color: white;
      font-weight: bold;
      font-size: 18px;
      padding: 8px 12px;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 1000;
      min-width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: help;
    `;
    
    // Make card position relative if not already
    if (getComputedStyle(card).position === 'static') {
      card.style.position = 'relative';
    }
    
    card.appendChild(badge);
  },
  
  /**
   * Add rejection badge to card
   * @param {Element} card - Job card DOM element
   * @param {string} reason - Rejection reason
   */
  addRejectionBadge: function(card, reason) {
    const badge = document.createElement('div');
    badge.className = 'upwork-shortlister-badge';
    badge.textContent = '✕';
    badge.title = `Rejected: ${reason}`;
    badge.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: #6b7280;
      color: white;
      font-weight: bold;
      font-size: 20px;
      padding: 8px 12px;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 1000;
      min-width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: help;
    `;
    
    if (getComputedStyle(card).position === 'static') {
      card.style.position = 'relative';
    }
    
    card.appendChild(badge);
  },
  
  /**
   * Add tooltip with score breakdown
   * @param {Element} card - Job card DOM element
   * @param {Object} result - Scoring result with breakdown
   */
  addTooltip: function(card, result) {
    const badge = card.querySelector('.upwork-shortlister-badge');
    if (!badge) return;
    
    // Build tooltip content
    let tooltipHTML = `<strong>Score: ${result.score}/100</strong><br><br>`;
    tooltipHTML += '<strong>Breakdown:</strong><br>';
    
    for (const [key, value] of Object.entries(result.breakdown)) {
      const label = this.formatBreakdownLabel(key);
      const weighted = value.weighted.toFixed(1);
      tooltipHTML += `${label}: ${weighted}<br>`;
    }
    
    badge.setAttribute('data-tooltip', tooltipHTML);
    
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'upwork-shortlister-tooltip';
    tooltip.innerHTML = tooltipHTML;
    tooltip.style.cssText = `
      position: absolute;
      top: 60px;
      right: 10px;
      background: #1f2937;
      color: white;
      padding: 12px;
      border-radius: 8px;
      font-size: 12px;
      line-height: 1.5;
      min-width: 200px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      display: none;
      pointer-events: none;
    `;
    
    card.appendChild(tooltip);
    
    // Show/hide tooltip on hover
    badge.addEventListener('mouseenter', () => {
      tooltip.style.display = 'block';
    });
    
    badge.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
  },
  
  /**
   * Format breakdown label for display
   * @param {string} key - Breakdown key
   * @returns {string} Formatted label
   */
  formatBreakdownLabel: function(key) {
    const labels = {
      hireRate: 'Hire Rate',
      paymentVerified: 'Payment Verified',
      clientSpend: 'Client Spend',
      proposalCount: 'Proposals',
      budget: 'Budget',
      keywordMatch: 'Keywords'
    };
    return labels[key] || key;
  },
  
  /**
   * Clear all processed card tracking
   */
  reset: function() {
    this.processedCards.clear();
  }
};

// Make UI available globally for content scripts
if (typeof window !== 'undefined') {
  window.UI = UI;
}
