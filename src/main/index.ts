import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import {
  addUser,
  verifyUser,
  getPasswordsByUser,
  updateCloudStatus,
  updatePasswordById,
  createPasswordByUserId,
  updateCloudId,
  deletePasswordById,
  deleteUserById
} from '../backend/local/database'

import {
  createUser,
  getCloudPasswords,
  createCloudPasswordByUserId,
  editCloudPasswordById,
  deleteCloudPasswordById,
  connectToDatabase
} from '../backend/cloud/index'

import generatePassword from '../backend/utils/passwordGenerator'
import mongoose from 'mongoose'

// src/main/index.ts

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    transparent: true,
    titleBarStyle: 'hidden',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
      // enableRemoteModule: false, // good security practice i think
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('window-close', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  window?.close()
})

ipcMain.on('window-maximize', (event) => {
  console.log('Gafd')
  const window = BrowserWindow.fromWebContents(event.sender)
  if (window?.isMaximized()) {
    window.unmaximize()
  } else {
    window?.maximize()
  }
})

ipcMain.on('window-minimize', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  window?.minimize()
})

// IPC handlers

ipcMain.handle('register-account', (event, args) => {
  return new Promise((resolve) => {
    const { userName, masterKey } = args
    console.log(userName, masterKey)
    addUser(userName, masterKey)
      .then((response) => {
        if (response.success) {
          resolve({ success: true, message: 'Account registration success' })
        } else {
          resolve({ success: false, message: response.message })
        }
      })
      .catch((error) => {
        console.error('Registration error:', error)
        resolve({ success: false, message: 'Internal Server Error.' })
      })
  })
})

ipcMain.handle('generate-password', () => {
  return new Promise((resolve, reject) => {
    const generatedPassword = generatePassword()
    if (generatePassword) {
      resolve(generatedPassword)
    } else {
      reject('Password generation error')
    }
  })
})

ipcMain.handle('verify-user', (event, args) => {
  return new Promise((resolve) => {
    const { userName, masterKey } = args
    if (!userName || userName.length < 1) {
      resolve({ success: false, message: 'no username provided' })
    }
    if (!masterKey || masterKey.length < 1) {
      resolve({ success: false, message: 'no master key provided' })
    }
    verifyUser(userName, masterKey)
      .then((response) => {
        if (response.success) {
          resolve({
            success: true,
            message: 'user authentication success',
            user: {
              id: response.user.id,
              username: response.user.username,
              cloudId: response.user.cloud_id,
              cloud_enabled: response.user.cloud_enabled
            }
          })
        } else {
          resolve({ success: false, message: response.message })
        }
      })
      .catch((err) => {
        console.log('Login error: ', err)
        resolve({ success: false, message: 'Internal server error' })
      })
  })
})

ipcMain.handle('fetch-passwords', (event, args) => {
  const { userId } = args
  return new Promise((resolve) => {
    getPasswordsByUser(userId)
      .then((passwords) => {
        console.log(passwords)
        resolve({
          success: true,
          message: 'Passwords fetched successfully',
          passwords: passwords.passwords
        })
      })
      .catch((err) => {
        console.log('Password fetch error', err)
        resolve({ success: false, message: 'Internal Server Error' })
      })
  })
})

ipcMain.handle('create-password', (event, args) => {
  const { passwordObject } = args
  const password = passwordObject
  console.log(password)
  return new Promise((resolve) => {
    if (!password) {
      resolve({ success: false, message: 'Password details not provided' })
    } else {
      createPasswordByUserId(password)
        .then((message) => {
          resolve({ success: true, message: message })
        })
        .catch((error) => {
          console.log('Password Update Error', error)
          resolve({ success: false, message: 'Internal Server Error' })
        })
    }
  })
})

ipcMain.handle('update-password', (event, args) => {
  const { passwordObject } = args
  const password = passwordObject
  return new Promise((resolve) => {
    if (!password) {
      resolve({ success: false, message: 'Password details not provided' })
    } else {
      updatePasswordById(password)
        .then((message) => {
          resolve({ success: true, message: message })
        })
        .catch((error) => {
          console.log('Password Update Error', error)
          resolve({ success: false, message: 'Internal Server Error' })
        })
    }
  })
})

ipcMain.handle('delete-password', (event, args) => {
  const { passwordId } = args
  return new Promise((resolve) => {
    if (!passwordId) {
      resolve({ success: false, message: 'Password id not provided' })
    } else {
      deletePasswordById(passwordId)
        .then((response) => {
          console.log(response)
          resolve({ success: true, message: 'Password deleted successfully' })
        })
        .catch((error) => {
          console.log(error)
          resolve({ success: false, message: 'Internal Server Error, Password deletion failed' })
        })
    }
  })
})

ipcMain.handle('delete-user', (event, args) => {
  const { userId } = args
  return new Promise((resolve) => {
    if (!userId) {
      resolve({ success: false, message: 'User id not provided' })
    } else {
      deleteUserById(userId)
        .then((response) => {
          console.log(response)
          resolve({ success: true, message: 'User deleted successfully' })
        })
        .catch((error) => {
          console.log(error)
          resolve({ success: false, message: 'Internal Server Error, User deletion failed' })
        })
    }
  })
})

ipcMain.handle('create-cloud-user', async (event, args) => {
  const { userId, userName } = args

  if (!userId) return { success: false, message: 'User Not Logged In' }

  try {
    console.log('Creating cloud user for:', userName)

    await connectToDatabase()

    const response = await createUser(userName)

    if (!response.success) {
      console.error('Cloud creation failed:', response.message)
      return response
    }

    await updateCloudId(userId, response.cloudId)

    return {
      success: true,
      cloudId: response.cloudId,
      message: 'Cloud user created successfully'
    }
  } catch (error) {
    console.error('Create Cloud User Critical Error:', error)
    return { success: false, message: 'Internal Server Error', error }
  }
})

ipcMain.handle('update-cloud-integration', async (event, args) => {
  const { userId, cloudEnabled } = args
  console.log(`Toggling Cloud for User ${userId} to: ${cloudEnabled}`)

  if (!userId) return { success: false, message: 'No User ID provided' }

  try {
    const result = await updateCloudStatus(userId, cloudEnabled)
    return result
  } catch (error) {
    console.error('Update Cloud Status Error:', error)
    return { success: false, message: 'Could not update cloud status' }
  }
})

ipcMain.handle('login-cloud', async (event, args) => {
  const { cloudId } = args
  try {
    const result = await connectToDatabase(cloudId)
    return result
  } catch (error) {
    return { success: false, message: 'Cloud login failed', error }
  }
})

ipcMain.handle('fetch-cloud-passwords', (event, args) => {
  const { userId } = args
  console.log(typeof userId)
  return new Promise((resolve) => {
    getCloudPasswords(userId)
      .then((passwords) => {
        const formattedPasswords = passwords.map((password) => ({
          id: password._id.toString(),
          service: password.service,
          user_name: password.username,
          password: password.password
        }))
        console.log(formattedPasswords)
        resolve({
          success: true,
          message: 'Passwords fetched successfully',
          passwords: formattedPasswords
        })
      })
      .catch((err) => {
        console.log('Password fetch error', err)
        resolve({ success: false, message: 'Internal Server Error' })
      })
  })
})

ipcMain.handle('create-cloud-password', (event, args) => {
  const { passwordData } = args
  console.log(passwordData)
  passwordData.userId = new mongoose.Types.ObjectId(passwordData.userId)
  return new Promise((resolve) => {
    if (!passwordData) {
      resolve({ success: false, message: 'Password details not provided' })
    } else {
      createCloudPasswordByUserId(passwordData)
        .then((message) => {
          resolve({ success: true, message: message })
        })
        .catch((error) => {
          console.log('Password Update Error', error)
          resolve({ success: false, message: 'Internal Server Error' })
        })
    }
  })
})

ipcMain.handle('update-cloud-password', (event, args) => {
  const { passwordObject } = args
  const password = passwordObject
  return new Promise((resolve) => {
    if (!password) {
      resolve({ success: false, message: 'Password details not provided' })
    } else {
      editCloudPasswordById(password)
        .then((message) => {
          resolve({ success: true, message: message })
        })
        .catch((error) => {
          console.log('Password Update Error', error)
          resolve({ success: false, message: 'Internal Server Error' })
        })
    }
  })
})

ipcMain.handle('delete-cloud-password', (event, args) => {
  const { passwordId } = args
  return new Promise((resolve) => {
    if (!passwordId) {
      resolve({ success: false, message: 'Password id not provided' })
    } else {
      deleteCloudPasswordById(passwordId)
        .then((response) => {
          resolve({ success: true, message: 'Password deleted successfully' })
        })
        .catch((error) => {
          resolve({ success: false, message: 'Internal Server Error, Password deletion failed' })
        })
    }
  })
})
