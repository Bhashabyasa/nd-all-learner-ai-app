// const key = parseInt(
//   process.env.REACT_APP_DATA_ENCRYPTION_PRIVATE_KEY || 4,
//   10
// );

// export const dataEncrypt = (plainText) => {
//   let encryptedText = "";

//   for (let i = 0; i < plainText.length; i++) {
//     const char = plainText[i];

//     if (char >= "A" && char <= "Z") {
//       encryptedText += String.fromCharCode(
//         ((char.charCodeAt(0) - 65 + key) % 26) + 65
//       );
//     } else if (char >= "a" && char <= "z") {
//       encryptedText += String.fromCharCode(
//         ((char.charCodeAt(0) - 97 + key) % 26) + 97
//       );
//     } else if (char >= "0" && char <= "9") {
//       encryptedText += String.fromCharCode(
//         ((char.charCodeAt(0) - 48 + key) % 10) + 48
//       );
//     } else {
//       encryptedText += char;
//     }
//   }
//   return encryptedText;
// };

// export const dataDecrypt = (encryptedText) => {
//   let decryptedText = "";

//   for (let i = 0; i < encryptedText.length; i++) {
//     const char = encryptedText[i];

//     if (char >= "A" && char <= "Z") {
//       decryptedText += String.fromCharCode(
//         ((char.charCodeAt(0) - 65 - key + 26) % 26) + 65
//       );
//     } else if (char >= "a" && char <= "z") {
//       decryptedText += String.fromCharCode(
//         ((char.charCodeAt(0) - 97 - key + 26) % 26) + 97
//       );
//     } else if (char >= "0" && char <= "9") {
//       decryptedText += String.fromCharCode(
//         ((char.charCodeAt(0) - 48 - key + 10) % 10) + 48
//       );
//     } else {
//       decryptedText += char;
//     }
//   }
//   return decryptedText;
// };
