import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

class AuthService {
    async signInWithGoogle() {
        try {
            // Check if your device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            // Get the users ID token
            const signInResult = await GoogleSignin.signIn();

            // Try the new style of getting the ID token (Not yet in v16+, checking docs)
            // For v16.1.1, we use data.idToken
            let idToken = signInResult.data?.idToken;

            if (!idToken) {
                throw new Error('No ID token found');
            }

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            return auth().signInWithCredential(googleCredential);
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            throw error;
        }
    }

    async signOut() {
        try {
            await GoogleSignin.signOut();
            await auth().signOut();
        } catch (error) {
            console.error('Sign Out Error:', error);
        }
    }

    getCurrentUser() {
        return auth().currentUser;
    }
}

export const authService = new AuthService();
