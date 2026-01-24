import firestore from '@react-native-firebase/firestore';
import { quizQuestions } from '../data/quizData';
import { test1Questions } from '../data/test1Questions';
import { test2Questions } from '../data/test2Questions';

const sampleQuestions = [
    {
        question: "Who was the first Governor-General of Bengal?",
        options: ["Warren Hastings", "Robert Clive", "Lord Cornwallis", "Lord Wellesley"],
        correctAnswer: 0,
        explanation: "Warren Hastings became the first Governor-General of Bengal in 1773 through the Regulating Act.",
        difficulty: "medium",
        category: "modern",
        region: "india",
        points: 10
    },
    {
        question: "The Battle of Plassey was fought in which year?",
        options: ["1757", "1764", "1761", "1857"],
        correctAnswer: 0,
        explanation: "The Battle of Plassey was fought on 23 June 1757 between Siraj-ud-Daulah and the British East India Company.",
        difficulty: "easy",
        category: "modern",
        region: "india",
        points: 5
    },
    {
        question: "Who founded the Brahmo Samaj?",
        options: ["Raja Ram Mohan Roy", "Dayanand Saraswati", "Swami Vivekananda", "Ishwar Chandra Vidyasagar"],
        correctAnswer: 0,
        explanation: "Raja Ram Mohan Roy founded the Brahmo Samaj in 1828 to reform Hindu society.",
        difficulty: "medium",
        category: "modern",
        region: "india",
        points: 10
    },
    {
        question: "Which Act transferred power from the East India Company to the British Crown?",
        options: ["Government of India Act 1858", "Indian Councils Act 1861", "Charter Act 1853", "Regulating Act 1773"],
        correctAnswer: 0,
        explanation: "The Government of India Act 1858 ended Company rule and transferred power to the British Crown following the 1857 revolt.",
        difficulty: "hard",
        category: "modern",
        region: "india",
        points: 15
    },
    {
        question: "Who gave the slogan 'Swaraj is my birthright and I shall have it'?",
        options: ["Bal Gangadhar Tilak", "Mahatma Gandhi", "Subhash Chandra Bose", "Lala Lajpat Rai"],
        correctAnswer: 0,
        explanation: "Bal Gangadhar Tilak gave this slogan to inspire the Indian freedom struggle.",
        difficulty: "easy",
        category: "modern",
        region: "india",
        points: 5
    }
];

export const uploadSampleQuestions = async () => {
    try {
        const testRef = firestore().collection('tests').doc('test1');

        await testRef.set({
            title: 'History Test 1',
            description: 'Test your knowledge on Indian History - 20 Questions',
            difficulty: 'medium',
            category: 'mixed',
            duration: 30,
            questions: sampleQuestions,
            createdAt: firestore.FieldValue.serverTimestamp(),
            updatedAt: firestore.FieldValue.serverTimestamp(),
        });

        console.log('Test1 uploaded successfully!');
        return true;
    } catch (error) {
        console.error('Error uploading test1:', error);
        return false;
    }
};

export const uploadTest1With20Questions = async () => {
    try {
        const testRef = firestore().collection('tests').doc('test1');

        await testRef.set({
            title: 'History Test 1',
            description: 'Comprehensive history test covering ancient, medieval, and modern periods - 20 Questions',
            difficulty: 'medium',
            category: 'mixed',
            duration: 30,
            questions: test1Questions,
            createdAt: firestore.FieldValue.serverTimestamp(),
            updatedAt: firestore.FieldValue.serverTimestamp(),
        });

        console.log('Test1 with 20 questions uploaded successfully!');
        return true;
    } catch (error) {
        console.error('Error uploading test1:', error);
        return false;
    }
};

export const uploadTest2With20Questions = async () => {
    try {
        const testRef = firestore().collection('tests').doc('test2');

        await testRef.set({
            title: 'History Test 2',
            description: 'Advanced history test covering medieval empires, freedom struggle, and ancient civilizations - 20 Questions',
            difficulty: 'medium',
            category: 'mixed',
            duration: 30,
            questions: test2Questions,
            createdAt: firestore.FieldValue.serverTimestamp(),
            updatedAt: firestore.FieldValue.serverTimestamp(),
        });

        console.log('Test2 with 20 questions uploaded successfully!');
        return true;
    } catch (error) {
        console.error('Error uploading test2:', error);
        return false;
    }
};

export const uploadFullTestSuite = async () => {
    try {
        // Ancient History Quiz
        const ancientQuestions = quizQuestions.filter(q => q.category === 'ancient').slice(0, 25);
        await firestore().collection('tests').doc('ancient-history-quiz').set({
            title: 'Ancient History Quiz',
            description: 'Test your knowledge of ancient civilizations and empires',
            difficulty: 'medium',
            category: 'ancient',
            duration: 30,
            questions: ancientQuestions,
            createdAt: firestore.FieldValue.serverTimestamp(),
            updatedAt: firestore.FieldValue.serverTimestamp(),
        });

        // Medieval India Quiz
        const medievalQuestions = quizQuestions.filter(q => q.category === 'medieval' && q.region === 'india').slice(0, 30);
        await firestore().collection('tests').doc('medieval-india-quiz').set({
            title: 'Medieval India',
            description: 'Explore the rich history of medieval Indian kingdoms and empires',
            difficulty: 'medium',
            category: 'medieval',
            duration: 45,
            questions: medievalQuestions,
            createdAt: firestore.FieldValue.serverTimestamp(),
            updatedAt: firestore.FieldValue.serverTimestamp(),
        });

        // Modern World History Quiz
        const modernQuestions = quizQuestions.filter(q => q.category === 'modern').slice(0, 40);
        await firestore().collection('tests').doc('modern-world-history').set({
            title: 'Modern World History',
            description: 'From industrial revolution to contemporary times',
            difficulty: 'hard',
            category: 'modern',
            duration: 60,
            questions: modernQuestions,
            createdAt: firestore.FieldValue.serverTimestamp(),
            updatedAt: firestore.FieldValue.serverTimestamp(),
        });

        console.log('Full test suite uploaded successfully!');
        return true;
    } catch (error) {
        console.error('Error uploading test suite:', error);
        return false;
    }
};
