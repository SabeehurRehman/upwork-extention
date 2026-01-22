/**
 * Centralized logging utility for the extension
 * Provides consistent logging format and error handling
 */

const Logger = {
  prefix: '[Upwork Shortlister]',
  
  info: function(message, ...args) {
    console.log(`${this.prefix} ℹ️`, message, ...args);
  },
  
  warn: function(message, ...args) {
    console.warn(`${this.prefix} ⚠️`, message, ...args);
  },
  
  error: function(message, ...args) {
    console.error(`${this.prefix} ❌`, message, ...args);
  },
  
  debug: function(message, ...args) {
    if (this.isDebugMode()) {
      console.log(`${this.prefix} 🐛`, message, ...args);
    }
  },
  
  isDebugMode: function() {
    return localStorage.getItem('upwork-shortlister-debug') === 'true';
  }
};

// Make Logger available globally for content scripts
if (typeof window !== 'undefined') {
  window.Logger = Logger;
}
