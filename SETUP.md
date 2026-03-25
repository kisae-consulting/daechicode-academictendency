# 대치코드 진로적성검사 - Firebase 설정 가이드

## 1단계: Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. **프로젝트 추가** 클릭
3. 프로젝트 이름: `dachicode-assessment` (자유롭게 설정)
4. Google Analytics 비활성화 (선택) → **프로젝트 만들기**

## 2단계: 웹 앱 등록

1. 프로젝트 대시보드에서 **웹 아이콘 (</>)** 클릭
2. 앱 이름: `진로적성검사`
3. **Firebase SDK** 설정 정보가 표시됨 → 복사
4. `js/config.js` 파일을 열고 `firebaseConfig` 값을 교체

```javascript
const firebaseConfig = {
    apiKey: "여기에_복사한_값",
    authDomain: "여기에_복사한_값",
    projectId: "여기에_복사한_값",
    storageBucket: "여기에_복사한_값",
    messagingSenderId: "여기에_복사한_값",
    appId: "여기에_복사한_값"
};
```

## 3단계: Firestore 데이터베이스 활성화

1. 좌측 메뉴 → **Firestore Database** → **데이터베이스 만들기**
2. 위치: `asia-northeast3` (서울)
3. **프로덕션 모드로 시작** 선택

## 4단계: Firestore 보안 규칙 설정

Firestore → **규칙** 탭에서 아래 내용으로 교체:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // assessments 컬렉션: 누구나 쓸 수 있지만, 읽기는 인증된 관리자만
    match /assessments/{phone} {
      allow create: if true;
      allow update: if true;
      allow read: if request.auth != null;
      allow delete: if request.auth != null;
    }

    // admins 컬렉션: 관리자만 접근
    match /admins/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    // 기본: 모든 접근 차단
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 5단계: 관리자 계정 생성

1. 좌측 메뉴 → **Authentication** → **시작하기**
2. **로그인 방법** 탭 → **이메일/비밀번호** 활성화
3. **사용자** 탭 → **사용자 추가**
   - 이메일: `admin@dachicode.com` (원하는 이메일)
   - 비밀번호: 안전한 비밀번호 설정

## 6단계: GitHub Pages 배포

```bash
cd ~/deachicode-academictendency
git init
git add .
git commit -m "Initial commit: 대치코드 진로적성검사"
git remote add origin https://github.com/kisae-consulting/deachicode-academictendency.git
git push -u origin main
```

GitHub 리포지토리 설정:
1. Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: `main`, Folder: `/ (root)`
4. Save

배포 URL: `https://kisae-consulting.github.io/deachicode-academictendency/`

## 보안 체크리스트

- [x] Firestore 보안 규칙: 검사 결과 읽기는 인증된 관리자만 가능
- [x] 검사 완료 후 결과 화면 없음 (관리자만 열람 가능)
- [x] PDF 보고서에서 전화번호 마스킹 처리
- [x] `noindex, nofollow` 메타태그로 검색엔진 차단
- [x] `X-Frame-Options: DENY`로 iframe 삽입 차단
- [x] `no-referrer` 정책으로 외부 참조 차단
- [x] Firebase API 키는 Firestore 보안 규칙으로 보호됨 (클라이언트 키 노출은 정상)
