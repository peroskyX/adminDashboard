import admin from 'firebase-admin';
// import serviceAccount from '../../firebaseServiceAccount.json';

const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'), // Fix for newline characters
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const auth = admin.auth();
const db = admin.firestore();

const setAdminClaimByEmail = async (email: string) => {
  try {
    // Look up the user by email
    const user = await admin.auth().getUserByEmail(email);
    const uid = user.uid;

    // Set the custom claim for the user
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(
      `Custom claim "admin: true" set for user with email ${email} (UID: ${uid})`
    );
  } catch (error) {
    console.error('Error setting custom claims:', error);
  }
};

// Example usage
// setAdminClaimByEmail('hello@windowshop.ai');

export { db, admin, auth };
