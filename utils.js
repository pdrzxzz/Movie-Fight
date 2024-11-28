const debounce = (func, delay = 1000) => { //debounce receives event on args and passes to func, exists to set timeout logic.
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};
