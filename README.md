# cipherVault

![image](https://github.com/AkashMV/cipher-vault/assets/74900986/a5ecb54f-8b94-443c-b764-dfc334047523)


cipherVault is a password manager created using Electron JS, React, TailwindCSS, SQLite and MongoDB. 
It uses SHA-512 and AES-256 encryption methods to securely encrypt user passwords for storage.
cipherVault emphasize the importance of a non-retrievable master key which is created by the user at the time of registration. A section of this master key is used to encrypt all the passwords stored under the user.
It also has cloud integration where you can store your data on the cloud.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
