export const StorageServiceSet = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
  }
};

export const StorageServiceGet = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? value : null;
  } catch (error) {
    console.error(`Error retrieving from localStorage: ${error}`);
    return null;
  }
};
