// JavaScript/TypeScript Sample
import { useState, useEffect } from 'react';

const API_URL = 'https://api.example.com';
const MAX_RETRIES = 3;

/**
 * Custom hook for fetching data
 * @param {string} endpoint - API endpoint
 * @returns {Object} - { data, loading, error }
 */
export function useFetch(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${API_URL}/${endpoint}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}

// Class example
class DataProcessor {
  #privateField = 42;

  constructor(options = {}) {
    this.options = options;
    this.cache = new Map();
  }

  static createDefault() {
    return new DataProcessor({ debug: true });
  }

  async process(items) {
    const results = [];
    for (const item of items) {
      if (item.type === 'skip') continue;
      results.push(await this.#transform(item));
    }
    return results;
  }

  #transform(item) {
    return {
      ...item,
      processed: true,
      timestamp: Date.now(),
    };
  }
}

// Template literals and regex
const greeting = `Hello, ${name}!`;
const pattern = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-z]{2,}$/gi;

export default DataProcessor;
