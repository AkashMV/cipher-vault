
const crypto = require('crypto')

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;
const KDF_SALT_LENGTH = 16;
const KDF_ITERATIONS = 100000;
const KDF_KEY_LENGTH = 32;
const KDF_DIGEST = 'sha512';

// for converting the masterkey which can be of any size to 32bit for encryption
function deriveKey(master_key){
    const salt = crypto.randomBytes(16).toString('hex')
    const hashedMasterKey = crypto.pbkdf2Sync(master_key, salt, ITERATIONS, KEY_LENGTH, 'sha512').toString('hex')
    return {hashedMasterKey, salt}
}

function verifyMasterKey(masterKey, salt, storedKey){
    const hashedMasterKey = crypto.pbkdf2Sync(masterKey, salt, ITERATIONS, KEY_LENGTH, 'sha512').toString('hex')
    const verificationResult = hashedMasterKey == storedKey
    return verificationResult
}


// function for encrypting the passwords using the derived encryption key
function encrypt(text, masterKey) {
    const salt = crypto.randomBytes(KDF_SALT_LENGTH);
    const key = crypto.pbkdf2Sync(masterKey, salt, KDF_ITERATIONS, KDF_KEY_LENGTH, KDF_DIGEST);
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return salt.toString('hex') + ':' + iv.toString('hex') + ':' + encrypted.toString('hex');
  }
  
  // function to decrypt the passwords using the derived encryption key
  const decrypt = (text, masterKey) => {
    const textParts = text.split(':');
    const salt = Buffer.from(textParts[0], 'hex');
    const iv = Buffer.from(textParts[1], 'hex');
    const encryptedText = Buffer.from(textParts[2], 'hex');
    const key = crypto.pbkdf2Sync(masterKey, salt, KDF_ITERATIONS, KDF_KEY_LENGTH, KDF_DIGEST);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  };
  
  
  


export {encrypt, decrypt, deriveKey, verifyMasterKey}