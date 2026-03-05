import CryptoJS from "crypto-js";

const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    console.error("ENCRYPTION_KEY is not defined in environment variables");
    throw new Error("Encryption key missing");
  }
  return key;
};

export const encrypt = (text: string): string => {
  const key = getEncryptionKey();
  return CryptoJS.AES.encrypt(text, key).toString();
};

export const decrypt = (ciphertext: string): string => {
  const key = getEncryptionKey();
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted && ciphertext) {
      console.warn(
        "Decryption resulted in empty string for non-empty ciphertext",
      );
    }
    return decrypted;
  } catch (e) {
    console.error("Decryption error:", e);
    return "";
  }
};
