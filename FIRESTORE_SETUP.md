# Firestore Setup Guide

## 1. Firestore Security Rules

To fix the permission denied errors, you need to set up Firestore security rules. Go to Firebase Console → Firestore Database → Rules and use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to tests collection for authenticated users
    match /tests/{testId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null; // For admin uploads
    }
    
    // Allow read/write access to rankers collection for authenticated users
    match /rankers/{userId} {
      allow read: if true; // Allow reading leaderboard
      allow write: if request.auth != null && request.auth.uid == userId;
      
      // Allow read/write access to user's results subcollection
      match /results/{resultId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## 2. Upload Test Data

After setting up the rules:

1. Sign in to the app
2. Go to Profile screen
3. Scroll down to "Admin Tools"
4. Tap "Sync Content"
5. Choose "Upload Test1 (20Q)"

This will upload the test data to Firestore.

## 3. Test the App

1. Go to Tests tab
2. Sign in with Google
3. Click on "History Test 1"
4. The test should load with 20 questions
5. Complete the test to see results and leaderboard

## 4. Troubleshooting

### If you still get permission errors:
- Make sure you're signed in
- Check Firebase Console → Authentication to see if user is authenticated
- Verify the security rules are published

### If test data is empty:
- Make sure you uploaded the test using ProfileScreen
- Check Firebase Console → Firestore to see if 'tests' collection exists
- Verify the test document 'test1' has questions array

### If rankers don't show:
- Complete at least one test while signed in
- Check if 'rankers' collection exists in Firestore
- Results are automatically submitted when test is completed