import CryptoJS from "crypto-js";
import { dataDecrypt } from "./cripto";

const StorageService = {
  setItem: (key, value, secretKeyProp) => {
    const secretKey = dataDecrypt(
      secretKeyProp || localStorage.getItem("secretKey")
    );
    if (!secretKey) {
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
    const secretKey = localStorage.getItem("secretKey")
      ? dataDecrypt(localStorage.getItem("secretKey"))
      : null;
    if (!secretKey) {
      return "No valid secret key found for decryption";
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
