import { User } from "../model/User";

// Accept the argument!
async function createUser(userName) { 
  try {
    // Pass it to the model constructor
    const newUser = new User({ username: userName }); 
    const savedUser = await newUser.save();
    
    return { 
      success: true, 
      message: "User created successfully", 
      cloudId: savedUser._id.toString() 
    };
  } catch (error) {
    console.error("Mongo Save Error:", error);
    return { 
      success: false, 
      message: "Error creating user", 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

export { createUser };