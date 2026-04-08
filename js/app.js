// ==========================================
// 대치코드 진로적성검사 - 메인 앱 로직
// ==========================================

let currentQuestion = 0;
let answers = {};
let studentInfo = {};
let gradeData = {};
let testMode = 'student';
let currentQuestionSet = [];
let isYoungVersion = false; // 미취학/초1~3 여부

// ==========================================
// 화면 전환
// ==========================================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    window.scrollTo(0, 0);
}

// ==========================================
// 로그인
// ==========================================
async function handleLogin() {
    const phone = document.getElementById('loginPhone').value.trim();
    const name = document.getElementById('loginName').value.trim();

    if (!phone) { alert('학부모 연락처를 입력해주세요.'); return; }
    if (!name) { alert('학생 이름을 입력해주세요.'); return; }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) { alert('올바른 연락처를 입력해주세요.'); return; }

    studentInfo.phone = cleanPhone;
    studentInfo.name = name;

    // 익명 인증 완료 대기
    await authReady;

    // Firebase에서 기존 데이터 확인
    let existingData = null;
    if (db) {
        try {
            const doc = await db.collection(COLLECTIONS.ASSESSMENTS).doc(cleanPhone).get();
            if (doc.exists) existingData = doc.data();
        } catch (e) {
            console.warn('Firebase 조회 실패, localStorage 사용:', e);
            existingData = loadLocal(cleanPhone);
        }
    } else {
        existingData = loadLocal(cleanPhone);
    }

    // 이미 모든 검사 완료 + 재검사 허용 안 된 경우
    if (existingData && existingData.studentCompleted && existingData.parentCompleted && !existingData.retakeAllowed) {
        document.getElementById('already-done-name').textContent = name;
        showScreen('screen-already-done');
        return;
    }

    // 선택 화면으로
    showScreen('screen-select');
    document.getElementById('select-greeting').textContent = `${name} 학생, 반갑습니다!`;

    if (existingData && existingData.studentCompleted && !existingData.retakeAllowed) {
        document.getElementById('card-student').style.opacity = '0.5';
        document.getElementById('card-student').style.pointerEvents = 'none';
        document.getElementById('select-note').innerHTML =
            '학생 검사가 완료되었습니다. <strong>학부모 검사</strong>를 진행해주세요.';
    } else if (existingData && existingData.retakeAllowed) {
        document.getElementById('card-student').style.opacity = '1';
        document.getElementById('card-student').style.pointerEvents = 'auto';
        document.getElementById('select-note').innerHTML =
            '재검사가 허용되었습니다. 다시 검사를 진행해주세요.';
    } else {
        document.getElementById('card-student').style.opacity = '1';
        document.getElementById('card-student').style.pointerEvents = 'auto';
        document.getElementById('select-note').innerHTML =
            '학생 검사를 먼저 진행한 후, 학부모 검사를 진행해주세요.';
    }
}

// ==========================================
// 검사 유형 선택
// ==========================================
function selectTestType(type) {
    if (type === 'student') {
        testMode = 'student';
        showScreen('screen-student-info');
    } else if (type === 'parent') {
        checkAndStartParent();
    }
}

async function checkAndStartParent() {
    let existingData = null;
    if (db) {
        try {
            const doc = await db.collection(COLLECTIONS.ASSESSMENTS).doc(studentInfo.phone).get();
            if (doc.exists) existingData = doc.data();
        } catch (e) {
            existingData = loadLocal(studentInfo.phone);
        }
    } else {
        existingData = loadLocal(studentInfo.phone);
    }

    if (!existingData || !existingData.studentCompleted) {
        alert('학생 검사를 먼저 완료해주세요.');
        return;
    }

    // 저장된 데이터에서 isYoungVersion 복원 (다른 기기에서 접속 시)
    if (existingData.isYoungVersion !== undefined) {
        isYoungVersion = existingData.isYoungVersion;
    }

    testMode = 'parent';
    startParentTest();
}

// ==========================================
// 학생 정보 → 성적 입력
// ==========================================
function goToGrades() {
    const grade = document.getElementById('studentGrade').value;
    if (!grade) { alert('학년을 선택해주세요.'); return; }

    studentInfo.grade = grade;
    studentInfo.gender = document.getElementById('studentGender').value || '';
    studentInfo.birth = document.getElementById('studentBirth').value.trim();
    studentInfo.targetUniv = document.getElementById('targetUniv').value.trim();
    studentInfo.targetMajor = document.getElementById('targetMajor').value.trim();

    const youngGrades = ['미취학', '초1', '초2', '초3'];
    isYoungVersion = youngGrades.includes(grade);

    // 미취학/초1~3은 성적 입력 건너뛰기
    if (isYoungVersion) {
        gradeData = {};
        startStudentTest();
        return;
    }

    renderGradeEntry(grade);
    showScreen('screen-grades');
}

// ==========================================
// 성적 입력 렌더링
// ==========================================
function renderGradeEntry(grade) {
    const container = document.getElementById('grades-container');
    const isElementary = grade.startsWith('초');

    const subjects = isElementary
        ? ['국어', '수학', '사회', '과학', '영어', '체육', '음악', '미술']
        : ['국어', '수학', '영어', '사회', '역사', '과학', '체육', '음악', '미술', '기술가정', '정보'];

    const gradeNum = parseInt(grade.charAt(1));
    const semesters = [];

    if (isElementary) {
        for (let y = Math.max(4, gradeNum - 2); y <= gradeNum; y++) {
            semesters.push({ label: `초${y}-1학기`, key: `e${y}_1` });
            semesters.push({ label: `초${y}-2학기`, key: `e${y}_2` });
        }
    } else {
        for (let y = 1; y <= gradeNum; y++) {
            semesters.push({ label: `중${y}-1학기`, key: `m${y}_1` });
            if (y < gradeNum || true) semesters.push({ label: `중${y}-2학기`, key: `m${y}_2` });
        }
    }

    const gradeOptions = isElementary
        ? ['', '매우잘함', '잘함', '보통', '노력요함']
        : ['', 'A', 'B', 'C', 'D', 'E'];

    let html = '<div class="card"><table><thead><tr><th>과목</th>';
    semesters.forEach(s => { html += `<th>${s.label}</th>`; });
    html += '</tr></thead><tbody>';

    subjects.forEach(subj => {
        html += `<tr><td style="font-weight:600; text-align:left; padding-left:12px;">${subj}</td>`;
        semesters.forEach(s => {
            const selectId = `grade_${subj}_${s.key}`;
            html += '<td><select id="' + selectId + '">';
            gradeOptions.forEach(g => {
                html += `<option value="${g}">${g || '-'}</option>`;
            });
            html += '</select></td>';
        });
        html += '</tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function collectGradeData() {
    const data = {};
    const selects = document.querySelectorAll('#grades-container select');
    selects.forEach(sel => {
        if (sel.value) data[sel.id] = sel.value;
    });
    return data;
}

// ==========================================
// 학생 검사 시작
// ==========================================
function startStudentTest() {
    gradeData = collectGradeData();

    // 미취학/초1~3은 쉬운 버전
    const youngGrades = ['미취학', '초1', '초2', '초3'];
    isYoungVersion = youngGrades.includes(studentInfo.grade);

    currentQuestionSet = isYoungVersion ? YOUNG_QUESTIONS : STUDENT_QUESTIONS;
    currentQuestion = 0;
    answers = {};
    testMode = 'student';

    initSectionDots();
    showScreen('screen-test');
    renderQuestion();
}

// ==========================================
// 학부모 검사 시작
// ==========================================
function startParentTest() {
    currentQuestionSet = isYoungVersion ? YOUNG_PARENT_QUESTIONS : PARENT_QUESTIONS;
    currentQuestion = 0;
    answers = {};
    testMode = 'parent';

    initSectionDots();
    showScreen('screen-test');
    renderQuestion();
}

function goToParentFromComplete() {
    // 학생 검사 직후이므로 재확인 불필요, 바로 학부모 검사 시작
    testMode = 'parent';
    startParentTest();
}

// ==========================================
// 섹션 도트 초기화
// ==========================================
function initSectionDots() {
    const dotsContainer = document.getElementById('section-dots');
    dotsContainer.innerHTML = '';

    let sections;
    if (testMode === 'student') {
        sections = isYoungVersion ? YOUNG_ASSESSMENT_SECTIONS : ASSESSMENT_SECTIONS;
    } else {
        sections = isYoungVersion
            ? [{ id: 'observation', name: '자녀 관찰', icon: '👀' }, { id: 'support', name: '교육 환경', icon: '🏠' }]
            : [{ id: 'observation', name: '자녀 관찰', icon: '👀' }, { id: 'support', name: '교육 환경', icon: '🏠' }, { id: 'career', name: '진로', icon: '🎯' }];
    }

    sections.forEach((sec, i) => {
        const dot = document.createElement('div');
        dot.className = 'section-dot' + (i === 0 ? ' active' : '');
        dot.title = sec.name;
        dot.onclick = () => jumpToSection(sec.id);
        dotsContainer.appendChild(dot);
    });
}

// ==========================================
// 문항 렌더링
// ==========================================
function renderQuestion() {
    const q = currentQuestionSet[currentQuestion];
    if (!q) return;

    const sectionInfo = getSectionInfo(q);
    const container = document.getElementById('question-container');

    let html = `
        <span class="question-number">Q${currentQuestion + 1}</span>
        <span class="question-indicator">${sectionInfo}</span>
        <div class="question-text">${q.text}</div>
    `;

    if (q.type === 'mc') {
        html += renderMC(q);
    } else if (q.type === 'short') {
        html += renderShort(q);
    } else {
        html += renderLikert(q);
    }

    container.innerHTML = html;
    updateProgress();
    updateNavButtons();
    bindEvents(q);
}

function getSectionInfo(q) {
    if (testMode === 'student') {
        const sec = ASSESSMENT_SECTIONS.find(s => s.id === q.section);
        const riasecType = q.riasec ? RIASEC_TYPES.find(t => t.id === q.riasec) : null;
        let info = sec ? `${sec.icon} ${sec.name}` : '';
        if (riasecType) info += ` - ${riasecType.icon} ${riasecType.name}`;
        return info;
    } else {
        const catMap = { observation: '👀 자녀 관찰', support: '🏠 교육 환경', career: '🎯 진로' };
        return catMap[q.category] || '';
    }
}

function renderLikert(q) {
    const scale = q.scale || 5;
    let html = '<div class="likert-scale">';

    if (scale === 3 && isYoungVersion) {
        // 어린이용 3점 척도 (이모지)
        const emojis = ['😔', '😐', '😊'];
        const emojiLabels = ['아니야', '보통이야', '맞아!'];
        for (let i = 1; i <= 3; i++) {
            const selected = answers[q.id] && answers[q.id].value === i ? ' selected' : '';
            html += `<div class="likert-option${selected}" data-value="${i}" style="width:72px; height:72px; font-size:28px; flex-direction:column; gap:2px;">
                ${emojis[i - 1]}<span style="font-size:11px;">${emojiLabels[i - 1]}</span>
            </div>`;
        }
        html += '</div>';
    } else {
        for (let i = 1; i <= scale; i++) {
            const selected = answers[q.id] && answers[q.id].value === i ? ' selected' : '';
            html += `<div class="likert-option${selected}" data-value="${i}">${i}</div>`;
        }
        html += '</div>';
        const labels = q.labels || ['전혀 아니다', '매우 그렇다'];
        html += `<div class="likert-label"><span>${labels[0]}</span><span>${labels[1]}</span></div>`;
    }
    return html;
}

function renderMC(q) {
    let html = '<div class="options-list">';
    q.options.forEach((opt, idx) => {
        const selected = answers[q.id] && answers[q.id].selectedIndex === idx ? ' selected' : '';
        html += `
            <div class="option-item${selected}" data-index="${idx}">
                <div class="option-radio"></div>
                <span class="option-label">${opt.text}</span>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

function renderShort(q) {
    const val = answers[q.id] ? answers[q.id].value : '';
    return `<input type="text" class="short-answer-input" placeholder="자유롭게 입력해주세요" value="${escapeHtml(val)}">`;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function bindEvents(q) {
    const container = document.getElementById('question-container');

    if (q.type === 'mc') {
        container.querySelectorAll('.option-item').forEach(item => {
            item.addEventListener('click', () => {
                const idx = parseInt(item.dataset.index);
                container.querySelectorAll('.option-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                answers[q.id] = {
                    selectedIndex: idx,
                    value: q.options[idx].score || idx + 1,
                    tag: q.options[idx].tag || null,
                    type: 'mc'
                };
            });
        });
    } else if (q.type === 'short') {
        const input = container.querySelector('.short-answer-input');
        if (input) {
            input.addEventListener('input', e => {
                answers[q.id] = { value: e.target.value, type: 'short' };
            });
            input.focus();
        }
    } else {
        container.querySelectorAll('.likert-option').forEach(item => {
            item.addEventListener('click', () => {
                const value = parseInt(item.dataset.value);
                container.querySelectorAll('.likert-option').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                answers[q.id] = { value, type: 'likert' };
            });
        });
    }
}

// ==========================================
// 진행 관리
// ==========================================
function updateProgress() {
    const q = currentQuestionSet[currentQuestion];
    const total = currentQuestionSet.length;

    document.getElementById('current-section').textContent = getSectionInfo(q);
    document.getElementById('progress-count').textContent = `${currentQuestion + 1} / ${total}`;
    document.getElementById('progress-fill').style.width = `${((currentQuestion + 1) / total) * 100}%`;

    // 섹션 도트 업데이트
    const sectionKey = testMode === 'student' ? q.section : q.category;
    const sections = testMode === 'student'
        ? ASSESSMENT_SECTIONS.map(s => s.id)
        : ['observation', 'support', 'career'];
    const sectionIndex = sections.indexOf(sectionKey);

    document.querySelectorAll('.section-dot').forEach((dot, idx) => {
        dot.classList.remove('active');
        if (idx < sectionIndex) dot.classList.add('completed');
        if (idx === sectionIndex) { dot.classList.add('active'); dot.classList.remove('completed'); }
    });
}

function updateNavButtons() {
    document.getElementById('btn-prev').style.visibility = currentQuestion === 0 ? 'hidden' : 'visible';
    const nextBtn = document.getElementById('btn-next');

    if (currentQuestion === currentQuestionSet.length - 1) {
        nextBtn.textContent = '검사 완료';
        nextBtn.onclick = finishTest;
    } else {
        nextBtn.textContent = '다음';
        nextBtn.onclick = nextQuestion;
    }
}

function nextQuestion() {
    // 미응답 체크 (단답형/short는 건너뛰기 허용)
    const q = currentQuestionSet[currentQuestion];
    if (!answers[q.id] && q.type !== 'short') {
        showAnswerWarning();
        return;
    }

    if (currentQuestion < currentQuestionSet.length - 1) {
        currentQuestion++;
        renderQuestion();
    }
}

function showAnswerWarning() {
    const container = document.getElementById('question-container');
    let warning = container.querySelector('.answer-warning');
    if (!warning) {
        warning = document.createElement('div');
        warning.className = 'answer-warning';
        warning.style.cssText = 'color:var(--danger); font-size:14px; font-weight:600; margin-top:16px; text-align:center; animation: shake 0.4s ease;';
        warning.textContent = '응답을 선택해주세요.';
        container.appendChild(warning);
        setTimeout(() => { if (warning.parentNode) warning.remove(); }, 2000);
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
}

function jumpToSection(sectionId) {
    const key = testMode === 'student' ? 'section' : 'category';
    const idx = currentQuestionSet.findIndex(q => q[key] === sectionId);
    if (idx >= 0) {
        currentQuestion = idx;
        renderQuestion();
    }
}

// ==========================================
// 검사 완료
// ==========================================
function finishTest() {
    // 마지막 문항 미응답 체크 (단답형 제외)
    const lastQ = currentQuestionSet[currentQuestion];
    if (!answers[lastQ.id] && lastQ.type !== 'short') {
        showAnswerWarning();
        return;
    }

    const unanswered = currentQuestionSet.filter(q =>
        !answers[q.id] && q.type !== 'short'
    );

    if (unanswered.length > 0) {
        if (!confirm(`아직 ${unanswered.length}개 문항에 답하지 않았습니다.\n해당 문항으로 이동하시겠습니까?`)) {
            // 그래도 완료
        } else {
            currentQuestion = currentQuestionSet.indexOf(unanswered[0]);
            renderQuestion();
            return;
        }
    }

    showScreen('screen-loading');

    const loadingTexts = [
        '응답을 저장하고 있습니다.',
        '데이터를 안전하게 암호화하고 있습니다.',
        '검사 접수가 거의 완료되었습니다.'
    ];
    let loadIdx = 0;
    const loadInterval = setInterval(() => {
        loadIdx = (loadIdx + 1) % loadingTexts.length;
        document.getElementById('loading-text').textContent = loadingTexts[loadIdx];
    }, 800);

    setTimeout(async () => {
        clearInterval(loadInterval);

        if (testMode === 'student') {
            await handleStudentComplete();
        } else {
            await handleParentComplete();
        }
    }, 2500);
}

// ==========================================
// 학생 검사 완료
// ==========================================
async function handleStudentComplete() {
    const qSet = isYoungVersion ? YOUNG_QUESTIONS : STUDENT_QUESTIONS;
    const riasec = calculateRIASECScores(answers, qSet);
    const cvPairs = isYoungVersion ? YOUNG_CROSS_VALIDATION : CROSS_VALIDATION_PAIRS;
    const accuracy = calculateAccuracyWithPairs(answers, cvPairs);
    const careerCode = determineCareerCode(riasec.percent);

    const data = {
        studentInfo: studentInfo,
        studentAnswers: answers,
        studentScores: riasec,
        careerCode: careerCode,
        gradeData: gradeData,
        accuracy: accuracy,
        isYoungVersion: isYoungVersion,
        studentCompleted: true,
        studentCompletedAt: new Date().toISOString(),
        parentCompleted: false,
        retakeAllowed: false
    };

    await saveData(studentInfo.phone, data);

    // 완료 화면 표시 (결과 없음)
    document.getElementById('complete-name').textContent = studentInfo.name;
    document.getElementById('complete-steps').innerHTML = `
        <div class="step-item"><span class="step-num done">1</span><span>학생 검사 완료</span></div>
        <div class="step-item"><span class="step-num">2</span><span>학부모 검사 진행 필요</span></div>
        <div class="step-item"><span class="step-num">3</span><span>컨설턴트 분석 후 상담 안내</span></div>
    `;
    document.getElementById('btn-parent-test').style.display = 'block';
    showScreen('screen-complete');
}

// ==========================================
// 학부모 검사 완료
// ==========================================
async function handleParentComplete() {
    const parentScores = calculateParentRIASECScores(answers);

    // 기존 데이터 불러오기
    let existingData = await loadDataAsync(studentInfo.phone);
    if (!existingData) existingData = {};

    existingData.parentAnswers = answers;
    existingData.parentScores = parentScores;
    existingData.parentCompleted = true;
    existingData.parentCompletedAt = new Date().toISOString();
    existingData.retakeAllowed = false;

    // 종합 분석 데이터 생성
    if (existingData.studentAnswers && existingData.studentInfo) {
        existingData.analysisData = generateAnalysisData(
            existingData.studentAnswers,
            answers,
            existingData.studentInfo,
            existingData.gradeData
        );
    }

    await saveData(studentInfo.phone, existingData);

    // 완료 화면 (결과 없음)
    document.getElementById('complete-name').textContent = studentInfo.name;
    document.getElementById('complete-steps').innerHTML = `
        <div class="step-item"><span class="step-num done">1</span><span>학생 검사 완료</span></div>
        <div class="step-item"><span class="step-num done">2</span><span>학부모 검사 완료</span></div>
        <div class="step-item"><span class="step-num">3</span><span>컨설턴트 분석 후 상담 안내</span></div>
    `;
    document.getElementById('btn-parent-test').style.display = 'none';
    showScreen('screen-complete');
}

// ==========================================
// 데이터 저장/로드 (Firebase + localStorage 이중화)
// ==========================================
const STORAGE_PREFIX = 'dc_assessment_';

async function saveData(phone, data) {
    // localStorage 저장 (백업)
    try {
        localStorage.setItem(STORAGE_PREFIX + phone, JSON.stringify(data));
    } catch (e) { console.warn('localStorage 저장 실패:', e); }

    // Firebase 저장
    if (db) {
        try {
            await db.collection(COLLECTIONS.ASSESSMENTS).doc(phone).set(data, { merge: true });
        } catch (e) { console.warn('Firebase 저장 실패:', e); }
    }
}

async function loadDataAsync(phone) {
    if (db) {
        try {
            const doc = await db.collection(COLLECTIONS.ASSESSMENTS).doc(phone).get();
            if (doc.exists) return doc.data();
        } catch (e) { console.warn('Firebase 로드 실패:', e); }
    }
    return loadLocal(phone);
}

function loadLocal(phone) {
    try {
        const raw = localStorage.getItem(STORAGE_PREFIX + phone);
        return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
}

// ==========================================
// 유틸리티
// ==========================================
function backToLogin() {
    showScreen('screen-login');
}

// 키보드 네비게이션
document.addEventListener('keydown', e => {
    if (!document.getElementById('screen-test').classList.contains('active')) return;

    if (e.key === 'ArrowRight' || (e.key === 'Enter' && e.target.tagName !== 'INPUT')) {
        e.preventDefault();
        if (currentQuestion === currentQuestionSet.length - 1) finishTest();
        else nextQuestion();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevQuestion();
    } else if (e.key >= '1' && e.key <= '5' && e.target.tagName !== 'INPUT') {
        const q = currentQuestionSet[currentQuestion];
        if (!q.type || q.type !== 'mc') {
            const options = document.querySelectorAll('.likert-option');
            const idx = parseInt(e.key) - 1;
            if (options[idx]) options[idx].click();
        } else {
            const options = document.querySelectorAll('.option-item');
            const idx = parseInt(e.key) - 1;
            if (options[idx]) options[idx].click();
        }
    }
});

// 전화번호 자동 포맷
document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('loginPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', e => {
            let val = e.target.value.replace(/[^0-9]/g, '');
            if (val.length > 3 && val.length <= 7) {
                val = val.slice(0, 3) + '-' + val.slice(3);
            } else if (val.length > 7) {
                val = val.slice(0, 3) + '-' + val.slice(3, 7) + '-' + val.slice(7, 11);
            }
            e.target.value = val;
        });
    }
});
