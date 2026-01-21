/**
 * Rule engine for filtering and validating jobs
 * Applies hard filters and prepares data for scoring
 */

const Rules = {
  /**
   * Apply hard filters to a job
   * @param {Object} job - Job data object
   * @param {Object} config - Configuration with filter rules
   * @returns {Object} { passed: boolean, reason: string|null }
   */
  applyHardFilters: function(job, config) {
    const filters = config.hardFilters;
    
    // Check payment verification
    if (filters.requirePaymentVerified && !job.client.paymentVerified) {
      return {
        passed: false,
        reason: 'Payment not verified'
      };
    }
    
    // Check hire rate
    if (job.client.hireRate !== null && 
        filters.minHireRate > 0 && 
        job.client.hireRate < filters.minHireRate) {
      return {
        passed: false,
        reason: `Hire rate ${job.client.hireRate}% < ${filters.minHireRate}%`
      };
    }
    
    // Check minimum budget
    if (filters.minBudget > 0) {
      const jobBudget = this.getJobBudget(job);
      if (jobBudget !== null && jobBudget < filters.minBudget) {
        return {
          passed: false,
          reason: `Budget $${jobBudget} < $${filters.minBudget}`
        };
      }
    }
    
    // Check excluded keywords
    if (config.keywords.excluded && config.keywords.excluded.length > 0) {
      const text = (job.title + ' ' + job.description).toLowerCase();
      for (const keyword of config.keywords.excluded) {
        if (text.includes(keyword.toLowerCase())) {
          return {
            passed: false,
            reason: `Contains excluded keyword: ${keyword}`
          };
        }
      }
    }
    
    // Check required keywords
    if (config.keywords.required && config.keywords.required.length > 0) {
      const text = (job.title + ' ' + job.description).toLowerCase();
      let hasRequired = false;
      for (const keyword of config.keywords.required) {
        if (text.includes(keyword.toLowerCase())) {
          hasRequired = true;
          break;
        }
      }
      if (!hasRequired) {
        return {
          passed: false,
          reason: 'Missing required keywords'
        };
      }
    }
    
    return {
      passed: true,
      reason: null
    };
  },
  
  /**
   * Get effective budget for a job (fixed or hourly)
   * @param {Object} job - Job data object
   * @returns {number|null} Budget value or null
   */
  getJobBudget: function(job) {
    if (job.budget !== null) {
      return job.budget;
    }
    
    if (job.hourlyRange !== null) {
      // Use average of range
      return (job.hourlyRange[0] + job.hourlyRange[1]) / 2;
    }
    
    return null;
  },
  
  /**
   * Count keyword matches for scoring
   * @param {Object} job - Job data object
   * @param {Array<string>} keywords - Keywords to match
   * @returns {number} Number of matches
   */
  countKeywordMatches: function(job, keywords) {
    if (!keywords || keywords.length === 0) return 0;
    
    const text = (job.title + ' ' + job.description).toLowerCase();
    let matches = 0;
    
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        matches++;
      }
    }
    
    return matches;
  }
};

// Make Rules available globally for content scripts
if (typeof window !== 'undefined') {
  window.Rules = Rules;
}
