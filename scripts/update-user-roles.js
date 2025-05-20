const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

// Firebase configuration - same as in src/firebase/config.ts
const firebaseConfig = {
  apiKey: "AIzaSyB998t1YmgrihPARTuJURvZk7EXDWvoG2E",
  authDomain: "blood-bank-356a1.firebaseapp.com",
  projectId: "blood-bank-356a1",
  storageBucket: "blood-bank-356a1.appspot.com",
  messagingSenderId: "439887172797",
  appId: "1:439887172797:web:31a43e7d03f2bee63153d4",
  measurementId: "G-43GG7LPNBX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to update user roles
async function updateUserRole(email, role) {
  try {
    // First, find the user document by email
    const usersSnapshot = await getDoc(doc(db, 'users', email));
    
    let userId;
    
    if (usersSnapshot.exists()) {
      userId = usersSnapshot.id;
    } else {
      console.log(`User with email ${email} not found in 'users' collection.`);
      console.log(`Trying to use email as user ID...`);
      
      // Use email as user ID as a fallback (this is not ideal but might work in some cases)
      userId = email.replace('@', '_').replace('.', '_');
    }
    
    // Set the role in userRoles collection
    await setDoc(doc(db, 'userRoles', userId), { role });
    console.log(`Successfully set role '${role}' for user with ID: ${userId}`);
    
    return true;
  } catch (error) {
    console.error(`Error updating role for ${email}:`, error);
    return false;
  }
}

// Main function to run the script
async function main() {
  try {
    // Update roles for specified users
    console.log('Updating user roles...');
    
    // Admin access for 23h51a05n9@cmrcet.ac.in
    const adminSuccess = await updateUserRole('23h51a05n9@cmrcet.ac.in', 'admin');
    console.log(`Admin role update for 23h51a05n9@cmrcet.ac.in: ${adminSuccess ? 'SUCCESS' : 'FAILED'}`);
    
    // Hospital access for kalluri112005@gmail.com
    const hospitalSuccess = await updateUserRole('kalluri112005@gmail.com', 'hospital');
    console.log(`Hospital role update for kalluri112005@gmail.com: ${hospitalSuccess ? 'SUCCESS' : 'FAILED'}`);
    
    console.log('Role update process completed.');
  } catch (error) {
    console.error('Script execution error:', error);
  } finally {
    process.exit(0); // Ensure the script exits
  }
}

// Run the main function
main(); 