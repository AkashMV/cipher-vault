const crypto = require('crypto')


function generatePassword(length = 12){
    let passwordLength = length
    if(passwordLength <= 4){
        passwordLength = 4
    }
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?'
    let password = ''
    const randomBytes = crypto.randomBytes(passwordLength)

    for(let i=0;i<passwordLength;i++){
        const randomIndex = randomBytes[i] % charset.length
        password += charset[randomIndex]
    }

    const hasLowerCase = /[a-z]/.test(password)
    const hasUpperCase = /[A-Z]/.test(password)
    const hasDigit = /[0-9]/.test(password)
    const hasSpecial = /[!@#$%^&*()\-_=+[\]{}|;:,.<>?]/.test(password)
    if(!hasLowerCase || !hasDigit || !hasUpperCase || !hasSpecial){
        return generatePassword(length)
    }
    return password
}

export default generatePassword