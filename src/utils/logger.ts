const isProd = import.meta.env.PROD;

export const logger = {
  log: (...args: any[]) => {
    if (!isProd) {
      console.log('[STADIUM_LOG]', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (!isProd) {
      console.warn('[STADIUM_WARN]', ...args);
    }
  },
  error: (...args: any[]) => {
    // We can always log errors or only dev-mode log. The directive says:
    // "replace all leftover console.log/warn/error calls with a tiny logger that no-ops in production builds"
    if (!isProd) {
      console.error('[STADIUM_ERR]', ...args);
    }
  }
};
