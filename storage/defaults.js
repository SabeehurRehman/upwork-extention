/**
 * Default configuration for the extension
 * Schema versioning for future compatibility
 */

const Defaults = {
  // Schema version for migration support
  version: 1,
  
  // Extension enabled state
  enabled: true,
  
  // Hard filter thresholds (jobs failing these are rejected)
  hardFilters: {
    requirePaymentVerified: true,
    minHireRate: 30, // percentage
    minBudget: 0 // USD
  },
  
  // Soft scoring weights (must sum to 100)
  scoring: {
    hireRate: 25,
    paymentVerified: 20,
    clientSpend: 15,
    proposalCount: 15,
    budget: 15,
    keywordMatch: 10
  },
  
  // Keyword filters for scoring bonus
  keywords: {
    required: [], // Must have at least one
    preferred: [], // Bonus points for each
    excluded: [] // Reject if found
  },
  
  // UI preferences
  ui: {
    showScoreBadge: true,
    showBorderHighlight: true,
    showTooltip: true,
    colorScheme: {
      high: '#22c55e', // Green (80-100)
      medium: '#eab308', // Yellow (60-79)
      low: '#ef4444' // Red (0-59)
    }
  },
  
  // Presets
  presets: {
    freelancer: {
      minHireRate: 50,
      minBudget: 100,
      requirePaymentVerified: true
    },
    agency: {
      minHireRate: 30,
      minBudget: 500,
      requirePaymentVerified: true
    }
  },
  
  /**
   * Get stored config or return defaults
   * @returns {Promise<Object>} Configuration object
   */
  getConfig: async function() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['config'], (result) => {
          if (result.config && result.config.version === this.version) {
            resolve(result.config);
          } else {
            // Return defaults if no config or version mismatch
            resolve(this.getDefaults());
          }
        });
      } else {
        // Fallback for testing
        resolve(this.getDefaults());
      }
    });
  },
  
  /**
   * Save configuration
   * @param {Object} config - Configuration to save
   * @returns {Promise<void>}
   */
  saveConfig: async function(config) {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ config }, () => {
          Logger.info('Configuration saved');
          resolve();
        });
      } else {
        resolve();
      }
    });
  },
  
  /**
   * Reset to defaults
   * @returns {Promise<void>}
   */
  reset: async function() {
    return this.saveConfig(this.getDefaults());
  },
  
  /**
   * Get default configuration object
   * @returns {Object} Default configuration
   */
  getDefaults: function() {
    return {
      version: this.version,
      enabled: this.enabled,
      hardFilters: { ...this.hardFilters },
      scoring: { ...this.scoring },
      keywords: {
        required: [...this.keywords.required],
        preferred: [...this.keywords.preferred],
        excluded: [...this.keywords.excluded]
      },
      ui: {
        showScoreBadge: this.ui.showScoreBadge,
        showBorderHighlight: this.ui.showBorderHighlight,
        showTooltip: this.ui.showTooltip,
        colorScheme: { ...this.ui.colorScheme }
      },
      presets: JSON.parse(JSON.stringify(this.presets))
    };
  }
};

// Make Defaults available globally for content scripts
if (typeof window !== 'undefined') {
  window.Defaults = Defaults;
}
