import firestore from '@react-native-firebase/firestore';

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'ancient' | 'medieval' | 'modern' | 'mixed';
  region: 'world' | 'india';
  points: number;
}

export interface Ranker {
  id: string;
  name: string;
  email: string;
  score: number;
  totalQuizzes: number;
  averageScore: number;
  lastActive: Date;
  photoURL?: string;
}

export interface TestData {
  id: string;
  title: string;
  description: string;
  questions: TestQuestion[];
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  totalQuestions: number;
  createdAt: Date;
  updatedAt: Date;
}

class FirestoreService {
  private db = firestore();

  // Rankers functionality
  async fetchTopRankers(limit: number = 10): Promise<Ranker[]> {
    try {
      const snapshot = await this.db
        .collection('rankers')
        .orderBy('score', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastActive: doc.data().lastActive?.toDate() || new Date(),
      })) as Ranker[];
    } catch (error: any) {
      console.error('Error fetching rankers:', error);
      
      // Handle specific Firestore errors
      if (error.code === 'permission-denied') {
        console.log('Permission denied for rankers collection. Returning empty array.');
        return [];
      } else if (error.code === 'unavailable') {
        console.log('Firestore unavailable. Returning empty array.');
        return [];
      } else {
        console.log('Unknown error fetching rankers. Returning empty array.');
        return [];
      }
    }
  }

  async updateUserRanking(userId: string, userData: Partial<Ranker>): Promise<void> {
    try {
      const userRef = this.db.collection('rankers').doc(userId);
      const userDoc = await userRef.get();

      if (userDoc.exists()) {
        // Update existing user
        await userRef.update({
          ...userData,
          lastActive: firestore.FieldValue.serverTimestamp(),
        });
      } else {
        // Create new user
        await userRef.set({
          id: userId,
          score: 0,
          totalQuizzes: 0,
          averageScore: 0,
          ...userData,
          lastActive: firestore.FieldValue.serverTimestamp(),
        });
      }
    } catch (error: any) {
      console.error('Error updating user ranking:', error);
      
      // Handle permission errors gracefully
      if (error.code === 'permission-denied') {
        console.log('Permission denied for updating user ranking.');
        return;
      } else {
        console.log('Failed to update user ranking, but continuing...');
        return;
      }
    }
  }

  async submitQuizResult(userId: string, result: any): Promise<void> {
    try {
      // Add test result to user's results collection
      await this.db
        .collection('rankers')
        .doc(userId)
        .collection('results')
        .add({
          ...result,
          submittedAt: firestore.FieldValue.serverTimestamp(),
        });

      // Update user's overall stats
      const userRef = this.db.collection('rankers').doc(userId);
      const userDoc = await userRef.get();

      if (userDoc.exists()) {
        const userData = userDoc.data() as Ranker;
        const newTotalQuizzes = userData.totalQuizzes + 1;
        const newTotalScore = userData.score + result.score;
        const newAverageScore = Math.round(newTotalScore / newTotalQuizzes);

        await userRef.update({
          score: newTotalScore,
          totalQuizzes: newTotalQuizzes,
          averageScore: newAverageScore,
          lastActive: firestore.FieldValue.serverTimestamp(),
        });
      }
    } catch (error: any) {
      console.error('Error submitting result:', error);
      
      // Handle permission errors gracefully
      if (error.code === 'permission-denied') {
        console.log('Permission denied for submitting results. Results not saved to cloud.');
        // Don't throw error, just log it
        return;
      } else {
        // For other errors, still don't throw to avoid breaking user experience
        console.log('Failed to submit results to cloud, but continuing...');
        return;
      }
    }
  }

  // Test data functionality
  async fetchTest(testId: string): Promise<TestData | null> {
    try {
      const doc = await this.db.collection('tests').doc(testId).get();
      
      if (!doc.exists) {
        console.log(`Test ${testId} does not exist in Firestore`);
        return null;
      }

      const data = doc.data();
      if (!data) {
        console.log(`Test ${testId} has no data`);
        return null;
      }

      // Validate and format questions
      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        console.log(`Test ${testId} has no questions or invalid questions format`);
        return null;
      }

      const formattedQuestions: TestQuestion[] = data.questions.map((q: any, idx: number) => {
        // Validate required fields
        if (!q.question || !Array.isArray(q.options) || q.correctAnswer === undefined) {
          throw new Error(`Invalid question format at index ${idx} in test ${testId}`);
        }

        return {
          id: q.id || `${testId}_${idx}`,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || 'No explanation provided.',
          difficulty: q.difficulty || 'medium',
          category: q.category || 'mixed',
          region: q.region || 'india',
          points: q.points || 10,
        };
      });

      return {
        id: doc.id,
        title: data.title || 'Untitled Test',
        description: data.description || '',
        questions: formattedQuestions,
        duration: data.duration || 30,
        difficulty: data.difficulty || 'medium',
        category: data.category || 'mixed',
        totalQuestions: formattedQuestions.length,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    } catch (error: any) {
      console.error('Error fetching test:', error);
      
      // Handle specific Firestore errors
      if (error.code === 'permission-denied') {
        throw new Error('Permission denied. Please check Firestore security rules.');
      } else if (error.code === 'unavailable') {
        throw new Error('Firestore is currently unavailable. Please try again later.');
      } else if (error.message && error.message.includes('Invalid question format')) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to load test data. Please try again.');
      }
    }
  }

  async uploadTest(testData: Omit<TestData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await this.db.collection('tests').add({
        ...testData,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      return docRef.id;
    } catch (error: any) {
      console.error('Error uploading test:', error);
      
      if (error.code === 'permission-denied') {
        throw new Error('Permission denied. Cannot upload test data.');
      } else {
        throw new Error('Failed to upload test data.');
      }
    }
  }

  // Get user's quiz history
  async getUserQuizHistory(userId: string, limit: number = 20): Promise<any[]> {
    try {
      const snapshot = await this.db
        .collection('rankers')
        .doc(userId)
        .collection('results')
        .orderBy('submittedAt', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map(doc => ({
        ...doc.data(),
        date: doc.data().submittedAt?.toDate()?.toISOString() || new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching user quiz history:', error);
      return [];
    }
  }

  // Get user's current ranking position
  async getUserRank(userId: string): Promise<number> {
    try {
      const userDoc = await this.db.collection('rankers').doc(userId).get();
      if (!userDoc.exists()) return 0;

      const userData = userDoc.data() as Ranker;
      const higherScoreCount = await this.db
        .collection('rankers')
        .where('score', '>', userData.score)
        .get();

      return higherScoreCount.size + 1;
    } catch (error: any) {
      console.error('Error getting user rank:', error);
      
      if (error.code === 'permission-denied') {
        console.log('Permission denied for getting user rank.');
        return 0;
      } else {
        return 0;
      }
    }
  }
}

export const firestoreService = new FirestoreService();