import { connectToDatabase } from "../../backend/cloud/database/cloudDatabase";

interface CloudConnectionResult {
  success:boolean,
  message: string,
}


export default function cloudConnection(cloudId: string): Promise<CloudConnectionResult>{
  return new Promise((resolve, reject) => {
    if (!cloudId) {
      resolve({ success: false, message: "no cloud Id provided" });
    } else {
      console.log("WORKING");
      connectToDatabase()
        .then((connection) => {
          console.log(connection);
          if (connection.success) {
            resolve({ success: true, message: "cloud database connected" });
          } else {
            resolve({ success: false, message: "cloud database connection failed" });
          }
        })
        .catch(() => {
          reject({ success: false, message: "cloud database connection failed" });
        });
    }
  });
}


// interface CloudConnectionResult {
//   success: boolean;
//   message: string;
// }

// export default async function cloudConnection(
//   cloudId: string | null | undefined
// ): Promise<CloudConnectionResult> {
//   if (!cloudId) {
//     return { success: false, message: "no cloud Id provided" };
//   }

//   try {
//     const connection = await connectToDatabase();

//     console.log(connection);

//     if (connection.success) {
//       return { success: true, message: "cloud database connected" };
//     } else {
//       return { success: false, message: "cloud database connection failed" };
//     }
//   } catch (error) {
//     console.log("Error connecting to MongoDB Atlas", error);
//     return { success: false, message: "cloud database connection failed" };
//   }
// }
