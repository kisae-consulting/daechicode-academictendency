// ==========================================
// Firebase Configuration
// ==========================================
// Firebase 프로젝트 설정 후 아래 값을 교체하세요.
// SETUP.md 파일을 참고하세요.
const firebaseConfig = {
    apiKey: "AIzaSyCC2BEoZzJ-TMVRJdak9_0nqGmPVLFAHAQ",
    authDomain: "daechicode-assessment.firebaseapp.com",
    projectId: "daechicode-assessment",
    storageBucket: "daechicode-assessment.firebasestorage.app",
    messagingSenderId: "837661983118",
    appId: "1:837661983118:web:3c564d8b299cf39165a4df"
};

// Firebase 초기화
let db, auth;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
} catch (e) {
    console.warn('Firebase 초기화 실패. SETUP.md를 참고하여 설정하세요.', e);
}

// 컬렉션 이름
const COLLECTIONS = {
    ASSESSMENTS: 'assessments',
    ADMINS: 'admins'
};
