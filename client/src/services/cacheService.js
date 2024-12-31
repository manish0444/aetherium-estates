const CACHE_KEY = 'aetherium_estates_cache';
const CACHE_EXPIRY = 1000 * 60 * 15; // 15 minutes

export const cacheService = {
  setCache(key, data) {
    const cacheData = {
      timestamp: Date.now(),
      data
    };
    try {
      const existingCache = this.getAllCache();
      existingCache[key] = cacheData;
      localStorage.setItem(CACHE_KEY, JSON.stringify(existingCache));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  },

  getCache(key) {
    try {
      const cache = this.getAllCache();
      const cacheData = cache[key];
      
      if (!cacheData) return null;

      // Check if cache is expired
      if (Date.now() - cacheData.timestamp > CACHE_EXPIRY) {
        this.removeCache(key);
        return null;
      }

      return cacheData.data;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  },

  getAllCache() {
    try {
      const cache = localStorage.getItem(CACHE_KEY);
      return cache ? JSON.parse(cache) : {};
    } catch (error) {
      console.error('Error getting all cache:', error);
      return {};
    }
  },

  removeCache(key) {
    try {
      const cache = this.getAllCache();
      delete cache[key];
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error('Error removing cache:', error);
    }
  },

  clearCache() {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
};
