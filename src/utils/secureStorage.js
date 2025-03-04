import CryptoJS from "crypto-js";

export const StorageServiceSet = (key, value) => {
  const secretKey = localStorage.getItem("discovery_id");
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(value),
    secretKey
  ).toString();
  localStorage.setItem(key, ciphertext);
};

export const StorageServiceGet = (key) => {
  const secretKey = localStorage.getItem("discovery_id");
  const ciphertext = localStorage.getItem(key);
  if (!ciphertext) return null;
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData) || localStorage.getItem(key);
};
