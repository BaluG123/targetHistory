import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

/**
 * Configure Google Sign-In.
 * The webClientId comes from the Firebase Console (Authentication > Sign-in method > Google).
 * It is required even for Android/iOS apps.
 */
export const configureGoogleSignIn = () => {
    GoogleSignin.configure({
        webClientId: '766162303214-chi27bj03eap296om1pr99v70t4mil3i.apps.googleusercontent.com', // User needs to replace this
        offlineAccess: true,
    });
};

export const firebaseAuth = auth();
