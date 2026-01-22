/**
 * Main orchestrator for the Upwork Job Shortlister extension
 * Coordinates scraping, filtering, scoring, and UI updates
 */

(async function() {
  'use strict';
  
  // Inject CSS styles to ensure visibility
  const style = document.createElement('style');
  style.textContent = `
    .upwork-shortlister-badge {
      position: absolute !important;
      z-index: 10000 !important;
      pointer-events: auto !important;
    }
    
    [data-shortlister-id] {
      position: relative !important;
    }
  `;
  document.head.appendChild(style);
  
  // Log extension load with clear marker
  console.log('%c[Upwork Shortlister] 🎯 Extension Loading...', 'background: #667eea; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;');
  Logger.info('Upwork Smart Job Shortlister initializing...');
  
  // Extension state
  let config = null;
  let isEnabled = false;
  let processedJobs = new Set();
  
  /**
   * Initialize the extension
   */
  async function initialize() {
    try {
      // Load configuration
      config = await Defaults.getConfig();
      isEnabled = config.enabled;
      
      console.log('%c[Upwork Shortlister] ⚙️ Configuration loaded', 'color: #22c55e; font-weight: bold;', config);
      Logger.info('Configuration loaded:', config);
      
      if (!isEnabled) {
        console.log('%c[Upwork Shortlister] ⏸️ Extension is disabled', 'color: #f59e0b; font-weight: bold;');
        Logger.info('Extension is disabled');
        return;
      }
      
      console.log('%c[Upwork Shortlister] ✅ Starting job processing...', 'color: #22c55e; font-weight: bold;');
      
      // Start processing jobs
      startProcessing();
      
      // Listen for configuration changes
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.onChanged.addListener((changes, namespace) => {
          if (namespace === 'local' && changes.config) {
            Logger.info('Configuration updated, reloading...');
            handleConfigChange(changes.config.newValue);
          }
        });
      }
      
    } catch (error) {
      console.error('%c[Upwork Shortlister] ❌ Initialization failed', 'color: #ef4444; font-weight: bold;', error);
      Logger.error('Initialization failed:', error);
    }
  }
  
  /**
   * Start processing job cards
   */
  function startProcessing() {
    // Log current page URL to confirm we're on the right page
    console.log('%c[Upwork Shortlister] 📍 Current URL:', 'color: #3b82f6;', window.location.href);
    
    // Start observing for new cards
    Observer.start((card) => {
      processJobCard(card);
    });
    
    console.log('%c[Upwork Shortlister] 👀 Watching for job cards...', 'color: #3b82f6; font-weight: bold;');
    Logger.info('Job processing started');
  }
  
  /**
   * Stop processing job cards
   */
  function stopProcessing() {
    Observer.stop();
    Logger.info('Job processing stopped');
  }
  
  /**
   * Process a single job card
   * @param {Element} card - Job card DOM element
   */
  function processJobCard(card) {
    try {
      // Extract job data
      const job = Scraper.extractJob(card);
      
      if (!job) {
        Logger.warn('Failed to extract job data from card');
        return;
      }
      
      // Check if already processed
      if (processedJobs.has(job.id)) {
        return;
      }
      
      processedJobs.add(job.id);
      Logger.debug('Processing job:', job.id, job.title);
      
      // Apply hard filters
      const filterResult = Rules.applyHardFilters(job, config);
      
      if (!filterResult.passed) {
        Logger.debug(`Job rejected: ${filterResult.reason}`);
        UI.markRejected(card, filterResult.reason, config);
        return;
      }
      
      // Calculate score
      const scoringResult = Scorer.calculateScore(job, config);
      Logger.debug('Job scored:', scoringResult.score, scoringResult);
      
      // Annotate the card
      UI.annotateCard(card, scoringResult, config);
      
    } catch (error) {
      Logger.error('Error processing job card:', error);
      // Don't throw - continue processing other cards
    }
  }
  
  /**
   * Handle configuration changes
   * @param {Object} newConfig - New configuration
   */
  function handleConfigChange(newConfig) {
    config = newConfig;
    isEnabled = config.enabled;
    
    if (isEnabled) {
      // Clear processed jobs and restart
      processedJobs.clear();
      UI.reset();
      Observer.reset();
      
      if (!Observer.isObserving) {
        startProcessing();
      } else {
        // Re-process all visible cards
        Observer.findAndProcessNewCards((card) => {
          processJobCard(card);
        });
      }
    } else {
      stopProcessing();
    }
  }
  
  /**
   * Cleanup on page unload
   */
  function cleanup() {
    stopProcessing();
    processedJobs.clear();
    UI.reset();
    Logger.info('Extension cleanup complete');
  }
  
  // Register cleanup handler
  window.addEventListener('beforeunload', cleanup);
  
  // Initialize the extension
  initialize();
  
  console.log('%c[Upwork Shortlister] 🚀 Extension loaded successfully!', 'background: #22c55e; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;');
  Logger.info('Upwork Smart Job Shortlister loaded successfully');
  
})();
