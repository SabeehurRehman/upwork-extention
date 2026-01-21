/**
 * Popup UI controller
 * Handles user interactions and configuration management
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Load defaults module
  const Defaults = {
    version: 1,
    enabled: true,
    hardFilters: {
      requirePaymentVerified: true,
      minHireRate: 30,
      minBudget: 0
    },
    scoring: {
      hireRate: 25,
      paymentVerified: 20,
      clientSpend: 15,
      proposalCount: 15,
      budget: 15,
      keywordMatch: 10
    },
    keywords: {
      required: [],
      preferred: [],
      excluded: []
    },
    ui: {
      showScoreBadge: true,
      showBorderHighlight: true,
      showTooltip: true,
      colorScheme: {
        high: '#22c55e',
        medium: '#eab308',
        low: '#ef4444'
      }
    },
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
    }
  };
  
  // Get DOM elements
  const enableToggle = document.getElementById('enableToggle');
  const statusText = document.getElementById('statusText');
  const requirePaymentVerified = document.getElementById('requirePaymentVerified');
  const minHireRate = document.getElementById('minHireRate');
  const minBudget = document.getElementById('minBudget');
  const preferredKeywords = document.getElementById('preferredKeywords');
  const excludedKeywords = document.getElementById('excludedKeywords');
  const showScoreBadge = document.getElementById('showScoreBadge');
  const showBorderHighlight = document.getElementById('showBorderHighlight');
  const showTooltip = document.getElementById('showTooltip');
  const saveBtn = document.getElementById('saveBtn');
  const resetBtn = document.getElementById('resetBtn');
  const freelancerPreset = document.getElementById('freelancerPreset');
  const agencyPreset = document.getElementById('agencyPreset');
  const notification = document.getElementById('notification');
  
  /**
   * Load configuration from storage
   */
  async function loadConfig() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['config'], (result) => {
        if (result.config && result.config.version === Defaults.version) {
          resolve(result.config);
        } else {
          resolve(getDefaults());
        }
      });
    });
  }
  
  /**
   * Get default configuration
   */
  function getDefaults() {
    return {
      version: Defaults.version,
      enabled: Defaults.enabled,
      hardFilters: { ...Defaults.hardFilters },
      scoring: { ...Defaults.scoring },
      keywords: {
        required: [...Defaults.keywords.required],
        preferred: [...Defaults.keywords.preferred],
        excluded: [...Defaults.keywords.excluded]
      },
      ui: {
        showScoreBadge: Defaults.ui.showScoreBadge,
        showBorderHighlight: Defaults.ui.showBorderHighlight,
        showTooltip: Defaults.ui.showTooltip,
        colorScheme: { ...Defaults.ui.colorScheme }
      },
      presets: JSON.parse(JSON.stringify(Defaults.presets))
    };
  }
  
  /**
   * Populate form with configuration
   */
  async function populateForm() {
    const config = await loadConfig();
    
    enableToggle.checked = config.enabled;
    statusText.textContent = config.enabled ? 'Enabled' : 'Disabled';
    requirePaymentVerified.checked = config.hardFilters.requirePaymentVerified;
    minHireRate.value = config.hardFilters.minHireRate;
    minBudget.value = config.hardFilters.minBudget;
    preferredKeywords.value = config.keywords.preferred.join(', ');
    excludedKeywords.value = config.keywords.excluded.join(', ');
    showScoreBadge.checked = config.ui.showScoreBadge;
    showBorderHighlight.checked = config.ui.showBorderHighlight;
    showTooltip.checked = config.ui.showTooltip;
  }
  
  /**
   * Get configuration from form
   */
  function getFormConfig() {
    return {
      version: Defaults.version,
      enabled: enableToggle.checked,
      hardFilters: {
        requirePaymentVerified: requirePaymentVerified.checked,
        minHireRate: parseInt(minHireRate.value) || 0,
        minBudget: parseInt(minBudget.value) || 0
      },
      scoring: Defaults.scoring,
      keywords: {
        required: [],
        preferred: preferredKeywords.value
          .split(',')
          .map(k => k.trim())
          .filter(k => k.length > 0),
        excluded: excludedKeywords.value
          .split(',')
          .map(k => k.trim())
          .filter(k => k.length > 0)
      },
      ui: {
        showScoreBadge: showScoreBadge.checked,
        showBorderHighlight: showBorderHighlight.checked,
        showTooltip: showTooltip.checked,
        colorScheme: Defaults.ui.colorScheme
      },
      presets: Defaults.presets
    };
  }
  
  /**
   * Save configuration
   */
  async function saveConfig() {
    const config = getFormConfig();
    
    return new Promise((resolve) => {
      chrome.storage.local.set({ config }, () => {
        showNotification('Settings saved successfully!', 'success');
        resolve();
      });
    });
  }
  
  /**
   * Reset to defaults
   */
  async function resetConfig() {
    const config = getDefaults();
    
    return new Promise((resolve) => {
      chrome.storage.local.set({ config }, () => {
        populateForm();
        showNotification('Settings reset to defaults', 'success');
        resolve();
      });
    });
  }
  
  /**
   * Apply preset
   */
  function applyPreset(presetName) {
    const preset = Defaults.presets[presetName];
    if (!preset) return;
    
    requirePaymentVerified.checked = preset.requirePaymentVerified;
    minHireRate.value = preset.minHireRate;
    minBudget.value = preset.minBudget;
    
    showNotification(`${presetName.charAt(0).toUpperCase() + presetName.slice(1)} preset applied`, 'success');
  }
  
  /**
   * Show notification
   */
  function showNotification(message, type = 'info') {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
      notification.classList.add('hidden');
    }, 3000);
  }
  
  // Event listeners
  enableToggle.addEventListener('change', () => {
    statusText.textContent = enableToggle.checked ? 'Enabled' : 'Disabled';
  });
  
  saveBtn.addEventListener('click', saveConfig);
  resetBtn.addEventListener('click', resetConfig);
  freelancerPreset.addEventListener('click', () => applyPreset('freelancer'));
  agencyPreset.addEventListener('click', () => applyPreset('agency'));
  
  // Initialize form
  await populateForm();
});
