import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
    setItem: async (key: string, value: string) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (e) {
            console.error('Failed to save to storage', e);
        }
    },
    getItem: async (key: string) => {
        try {
            return await AsyncStorage.getItem(key);
        } catch (e) {
            console.error('Failed to fetch from storage', e);
            return null;
        }
    },
    removeItem: async (key: string) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.error('Failed to remove from storage', e);
        }
    }
};

export const StorageKeys = {
    USER_SESSION: 'user_session',
    USER_PROGRESS: 'user_progress',
    THEME_PREFERENCE: 'theme_preference',
};
