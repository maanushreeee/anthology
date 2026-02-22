/**
 * Create a debounced function that delays execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay = 500) {
  let timeoutId;

  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * Create a debounced async function that delays execution
 * @param {Function} asyncFunc - Async function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced async function
 */
export function debounceAsync(asyncFunc, delay = 500) {
  let timeoutId;

  return async function debounced(...args) {
    clearTimeout(timeoutId);
    return new Promise((resolve) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await asyncFunc.apply(this, args);
          resolve(result);
        } catch (error) {
          console.error("Debounced async function error:", error);
          resolve(null);
        }
      }, delay);
    });
  };
}
