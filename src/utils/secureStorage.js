import CryptoJS from "crypto-js";

export const StorageServiceSet = (key, value) => {
  const secretKey = localStorage.getItem("discovery_id");

  if (!secretKey) {
    console.error("Encryption failed: Secret key is missing.");
    return;
  }

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
  if (!secretKey) {
    console.error("Decryption failed: Secret key is missing.");
    return null;
  }

  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    return decryptedData ? JSON.parse(decryptedData) : null;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};
