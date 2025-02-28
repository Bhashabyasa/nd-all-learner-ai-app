import CryptoJS from "crypto-js";
import { dataDecrypt } from "./cripto";

const StorageService = {
  setItem: (key, value, secretKeyProp) => {
    const secretKey = secretKeyProp || localStorage.getItem("discovery_id");
    if (!secretKey) {
      localStorage.setItem(key, value);
      return "No valid secret key found for encryption";
    }
    try {
      const ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify(value),
        secretKey
      ).toString();
      localStorage.setItem(key, ciphertext);
    } catch (error) {
      return error;
    }
  },
  getItem: (key) => {
    const secretKey = localStorage.getItem("discovery_id")
      ? dataDecrypt(localStorage.getItem("discovery_id"))
      : null;
    if (!secretKey) {
      return localStorage.getItem(key);
    }
    try {
      const ciphertext = localStorage.getItem(key);
      if (!ciphertext) return null;
      const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    } catch (error) {
      return error;
    }
  },

  removeItem: (key) => {
    localStorage.removeItem(key);
  },

  clear: () => {
    localStorage.clear();
  },
};

export default StorageService;

export const StorageServiceSet = (key, value) => {
  const secretKey =
    localStorage.getItem("discovery_id") ||
    process.env.REACT_APP_SECRET_KEY_STORAGE;
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(value),
    secretKey
  ).toString();
  localStorage.setItem(key, ciphertext);
};

export const StorageServiceGet = (key) => {
  const secretKey =
    localStorage.getItem("discovery_id") ||
    process.env.REACT_APP_SECRET_KEY_STORAGE;
  const ciphertext = localStorage.getItem(key);
  if (!ciphertext) return null;
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData) || localStorage.getItem(key);
};
