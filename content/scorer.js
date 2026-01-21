/**
 * Job scoring engine
 * Calculates 0-100 score based on weighted factors
 */

const Scorer = {
  /**
   * Calculate job score
   * @param {Object} job - Job data object
   * @param {Object} config - Configuration with scoring weights
   * @returns {Object} { score: number, breakdown: Object }
   */
  calculateScore: function(job, config) {
    const weights = config.scoring;
    const breakdown = {};
    let totalScore = 0;
    
    // Hire rate score (0-100 normalized to weight)
    if (job.client.hireRate !== null) {
      const hireRateScore = Math.min(100, job.client.hireRate);
      const weightedScore = (hireRateScore / 100) * weights.hireRate;
      breakdown.hireRate = {
        raw: hireRateScore,
        weighted: weightedScore
      };
      totalScore += weightedScore;
    }
    
    // Payment verification score
    if (job.client.paymentVerified) {
      breakdown.paymentVerified = {
        raw: 100,
        weighted: weights.paymentVerified
      };
      totalScore += weights.paymentVerified;
    } else {
      breakdown.paymentVerified = {
        raw: 0,
        weighted: 0
      };
    }
    
    // Client spend score (logarithmic scale)
    if (job.client.totalSpent !== null) {
      const spendScore = this.calculateSpendScore(job.client.totalSpent);
      const weightedScore = (spendScore / 100) * weights.clientSpend;
      breakdown.clientSpend = {
        raw: spendScore,
        weighted: weightedScore
      };
      totalScore += weightedScore;
    }
    
    // Proposal count score (inverse - fewer is better)
    if (job.proposals !== null) {
      const proposalScore = this.calculateProposalScore(job.proposals);
      const weightedScore = (proposalScore / 100) * weights.proposalCount;
      breakdown.proposalCount = {
        raw: proposalScore,
        weighted: weightedScore
      };
      totalScore += weightedScore;
    }
    
    // Budget score
    const budget = Rules.getJobBudget(job);
    if (budget !== null) {
      const budgetScore = this.calculateBudgetScore(budget);
      const weightedScore = (budgetScore / 100) * weights.budget;
      breakdown.budget = {
        raw: budgetScore,
        weighted: weightedScore
      };
      totalScore += weightedScore;
    }
    
    // Keyword match score
    const keywordMatches = Rules.countKeywordMatches(job, config.keywords.preferred);
    if (keywordMatches > 0) {
      const keywordScore = Math.min(100, keywordMatches * 20); // 20 points per match, max 100
      const weightedScore = (keywordScore / 100) * weights.keywordMatch;
      breakdown.keywordMatch = {
        raw: keywordScore,
        weighted: weightedScore,
        matches: keywordMatches
      };
      totalScore += weightedScore;
    }
    
    // Normalize to 0-100
    const finalScore = Math.round(Math.min(100, Math.max(0, totalScore)));
    
    return {
      score: finalScore,
      breakdown: breakdown
    };
  },
  
  /**
   * Calculate spend score on logarithmic scale
   * @param {number} spent - Total amount spent
   * @returns {number} Score 0-100
   */
  calculateSpendScore: function(spent) {
    if (spent <= 0) return 0;
    
    // Logarithmic scale: $0 = 0, $1K = 50, $10K = 75, $100K+ = 100
    if (spent < 1000) return Math.min(50, (spent / 1000) * 50);
    if (spent < 10000) return 50 + ((spent - 1000) / 9000) * 25;
    if (spent < 100000) return 75 + ((spent - 10000) / 90000) * 20;
    return Math.min(100, 95 + ((spent - 100000) / 100000) * 5);
  },
  
  /**
   * Calculate proposal score (fewer proposals = higher score)
   * @param {number} proposals - Number of proposals
   * @returns {number} Score 0-100
   */
  calculateProposalScore: function(proposals) {
    // 0-5 proposals = 100 points
    // 5-10 proposals = 80 points
    // 10-20 proposals = 60 points
    // 20-50 proposals = 30 points
    // 50+ proposals = 10 points
    if (proposals <= 5) return 100;
    if (proposals <= 10) return 80;
    if (proposals <= 20) return 60;
    if (proposals <= 50) return 30;
    return 10;
  },
  
  /**
   * Calculate budget score
   * @param {number} budget - Budget amount
   * @returns {number} Score 0-100
   */
  calculateBudgetScore: function(budget) {
    // $0-100 = 20
    // $100-500 = 40
    // $500-1000 = 60
    // $1000-5000 = 80
    // $5000+ = 100
    if (budget < 100) return 20;
    if (budget < 500) return 40;
    if (budget < 1000) return 60;
    if (budget < 5000) return 80;
    return 100;
  },
  
  /**
   * Get color for score
   * @param {number} score - Job score
   * @param {Object} colorScheme - Color configuration
   * @returns {string} Color hex code
   */
  getScoreColor: function(score, colorScheme) {
    if (score >= 80) return colorScheme.high;
    if (score >= 60) return colorScheme.medium;
    return colorScheme.low;
  },
  
  /**
   * Get score label
   * @param {number} score - Job score
   * @returns {string} Label text
   */
  getScoreLabel: function(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  }
};

// Make Scorer available globally for content scripts
if (typeof window !== 'undefined') {
  window.Scorer = Scorer;
}
