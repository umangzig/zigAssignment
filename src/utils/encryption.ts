import CryptoJS from "crypto-js";

export const encryptPassword = (password: string): string => {
  return CryptoJS.AES.encrypt(password, "secret-key-123").toString();
};

export const decryptPassword = (encryptedPassword: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, "secret-key-123");
  return bytes.toString(CryptoJS.enc.Utf8);
};
