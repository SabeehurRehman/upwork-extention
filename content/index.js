/**
 * Main orchestrator for the Upwork Job Shortlister extension
 * Coordinates scraping, filtering, scoring, and UI updates
 */

(async function() {
  'use strict';
  
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
      
      Logger.info('Configuration loaded:', config);
      
      if (!isEnabled) {
        Logger.info('Extension is disabled');
        return;
      }
      
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
      Logger.error('Initialization failed:', error);
    }
  }
  
  /**
   * Start processing job cards
   */
  function startProcessing() {
    // Start observing for new cards
    Observer.start((card) => {
      processJobCard(card);
    });
    
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
  
  Logger.info('Upwork Smart Job Shortlister loaded successfully');
  
})();
