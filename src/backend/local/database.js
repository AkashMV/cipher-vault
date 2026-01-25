import { encrypt, decrypt, deriveKey, verifyMasterKey } from '../utils/encryption'
import * as dotenv from 'dotenv';
dotenv.config();
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

//initalize the database
const dbPath = path.resolve(__dirname, 'localPasswords.db')
const db = new sqlite3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE + sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error('error connecting to the database', err.message)
    } else {
      console.log('Database connection established')
      initializeDatabase()
    }
  }
)

// Table Creation
function initializeDatabase() {
  console.log(process.env.LOCALDB_PATH)
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        master_key TEXT NOT NULL,
        salt TEXT NOT NULL,
        cloud_id TEXT,
        cloud_enabled BOOLEAN,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`
    )

    db.run(
      `CREATE TABLE IF NOT EXISTS passwords(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        service TEXT NOT NULL,
        user_name TEXT,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`
    )
  })
}




// USER RELATED OPERATIONS


//add a user to the database
async function addUser(userName, masterKey) {
  console.log('default master key: ', masterKey)
  const {hashedMasterKey, salt} = await deriveKey(masterKey)
  console.log("This is the hashed key: ", hashedMasterKey)
  let timestamp = new Date()
  timestamp = timestamp.toISOString()
  console.log([userName, hashedMasterKey, timestamp, timestamp, salt])


  return new Promise((resolve, reject) => {
    const validationQuery =  `SELECT COUNT(*) AS count FROM users WHERE username = ?`
    db.get(validationQuery, [userName], function(err, row){
      if(err){
        reject(err)
      }else{
        if(row.count > 0){
          resolve({success:false, message:"username already exists"})
        }else{
          const query = `
          INSERT INTO users (username, master_key, salt, cloud_id, cloud_enabled, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          `
          db.run(
            query,
            [userName, hashedMasterKey, salt, null, false, timestamp, timestamp],
            function (err) {
              if (err) {
                reject(err)
              } else {
                resolve({success:true, message:"user registration success"})
                console.log(this)
              }
            }
          )
        }
      }
    })
  })
}

// delete user from the database

// update user information from the database(username, firstname, lastname)


// get all users from the database

function getAllUsers(){
  return new Promise((resolve, reject)=>{
    const query = ` SELECT * FROM users;`
    db.all(query, (err, rows)=>{
      if(err){
        reject(err)
      }else{
        resolve(rows)
      }
    })
  })
}

// verify the user with associated masterkey
function verifyUser(user, masterKey){
  const userName = user
  const userMasterKey = masterKey



  return new Promise((resolve, reject) =>{
    const validationQuery =  `SELECT * FROM users WHERE username = ?`
    db.get(validationQuery, userName, (err, row)=>{
      if(err){
        reject(err)
      }else{
        if(row){
          const storedKey = row.master_key
          const storedSalt = row.salt

          const userVerified = verifyMasterKey(userMasterKey, storedSalt, storedKey)
          if(userVerified){
            resolve({success:true, message: "user login success", user:row})
          }else{
            resolve({success:false, message: "Incorrect username or password"})
          }
        }else{
          resolve({success:false, message:"incorrect username or password"})
        }
      }
    })
  })
  
}



function updateCloudStatus(userId, cloudStatus){
  const user = userId
  const newCloudStatus = cloudStatus
  let timestamp = new Date()
  timestamp = timestamp.toISOString
  return new Promise((resolve, reject)=>{
    if(!user){
      reject(new Error("No User Id provided"))
    }else{
      const query = `
        UPDATE users
        SET cloud_enabled = ?,
            updated_at = ?
          WHERE id = ?
        `
        db.run(query, [newCloudStatus,  timestamp, user],
        function(err){
          if(err){
            reject(err)
          }else{
            resolve({success:true, message:"Cloud Status updated successfully"})
          }
        })
    }
  })
}


function updateCloudId(userId, cloudId){
  let timestamp = new Date()
  timestamp = timestamp.toISOString
  return new Promise((resolve, reject)=>{
    if(!cloudId){
      reject(new Error("No cloud id provided"))
    }else if(!userId){
      reject(new Error("No user id provided"))
    }else{
      const query = `
      UPDATE users
      SET cloud_ID = ?,
          updated_at = ?
        WHERE id = ?
      `
      db.run(query, [cloudId.toString(),  timestamp, userId],
      function(err){
        if(err){
          reject(err)
        }else{
          resolve({success:true, message:"cloud id updated successfully", cloudId: cloudId})
        }
      })
    }
  })
}

// PASSWORD RELATED OPERATIONS


function getPasswordsByUser(userId) {
  const user = userId;
  return new Promise((resolve, reject) => {
    const fetchQuery = `SELECT * FROM users WHERE id = ?`;
    db.get(fetchQuery, user, (err, row) => {
      if (err) {
        reject(err);
      } else {
        if (row) {
          const hashedMasterKey = row.master_key;
          const passwordQuery = `SELECT * FROM passwords WHERE user_id = ?`;
          db.all(passwordQuery, user, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              if (rows) {
                const decryptedPasswords = rows.map((password) => ({
                  ...password,
                  password: decrypt(password.password, hashedMasterKey),
                }));
                resolve({ success: true, passwords: decryptedPasswords });
              } else {
                reject(new Error('Fetch Error'));
              }
            }
          });
        } else {
          reject(new Error('User not found'));
        }
      }
    });
  });
}


function updatePasswordById(password) {
  const pId = password.id;
  const userId = password.user_id;
  const userName = password.username;
  const service = password.service;
  let timestamp = new Date();
  timestamp = timestamp.toISOString;
  console.log(password)
  return new Promise((resolve, reject) => {
    const fetchQuery = `SELECT * FROM users WHERE id = ?`;
    db.get(fetchQuery, userId, (err, row) => {
      if (err) {
        reject(err);
      } else {
        if (row) {
          const hashedMasterKey = row.master_key;
          const passwordData = encrypt(password.password, hashedMasterKey);
          const updateQuery = `
            UPDATE passwords
            SET service = ?,
                user_name = ?,
                password = ?,
                updated_at = ?
            WHERE id = ?
          `;
          db.run(updateQuery, [service, userName, passwordData, timestamp, pId], function (err) {
            if (err) {
              reject(err);
            } else {
              resolve({ success: true, message: 'Password updated successfully' });
            }
          });
        } else {
          reject(new Error('User not found'));
        }
      }
    });
  });
}

function deletePasswordById(passwordId) {
  return new Promise((resolve, reject) => {
    const deleteQuery = `
      DELETE FROM passwords
      WHERE id = ?
    `;
    db.run(deleteQuery, [passwordId], function (err) {
      if (err) {
        reject(err);
      } else {
        if (this.changes > 0) {
          resolve({ success: true, message: 'Password deleted successfully' });
        } else {
          resolve({ success: false, message: 'Password not found' });
        }
      }
    });
  });
}


function createPasswordByUserId(password) {
  const userId = password.id;
  const service = password.service;
  const userName = password.username;
  let timestamp = new Date();
  timestamp = timestamp.toISOString();
  return new Promise((resolve, reject) => {
    const fetchQuery = `SELECT * FROM users WHERE id = ?`;
    db.get(fetchQuery, userId, (err, row) => {
      
      if (err) {
        reject(err);
      } else {
        if (row) {
          const hashedMasterKey = row.master_key;
          console.log(hashedMasterKey)
          const passwordData = encrypt(password.password, hashedMasterKey);
          const createQuery = `
            INSERT INTO passwords (user_id, service, user_name, password, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
          `;
          db.run(createQuery, [userId, service, userName, passwordData, timestamp, timestamp], function (err) {
            if (err) {
              reject(err);
            } else {
              resolve({ success: true, message: 'Password created successfully' });
            }
          });
        } else {
          reject(new Error('User not found'));
        }
      }
    });
  });
}


function deleteUserById(userId){
  const user = userId

  return new Promise((resolve, reject)=>{
    const query = `
      DELETE FROM passwords WHERE user_id = ?
    `
    db.run(query, user, (err)=>{
      if(err){
        reject({success:false, message: "user deletion failed"})
      }else{
        const userDeletionQuery = `
          DELETE FROM users WHERE id = ?
        `
        db.run(userDeletionQuery, user, (err)=>{
          if(err){
            reject({success:false, message:"user deletion failed"})
          }else{
            resolve({success:true, message:"user deletion success"})
          }
        })
      }
    })
  })
}


export { 
  addUser, 
  getAllUsers, 
  verifyUser,
  updateCloudStatus,
  getPasswordsByUser, 
  updatePasswordById,
  createPasswordByUserId,
  updateCloudId,
  deletePasswordById,
  deleteUserById
}
