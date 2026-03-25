// ==========================================
// 대치코드 관리자 대시보드
// ==========================================

let allAssessments = [];
const ADMIN_STORAGE_KEY = 'dc_admin_session';

// ==========================================
// 관리자 로그인
// ==========================================
async function adminLogin() {
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const errorEl = document.getElementById('admin-login-error');

    if (!email || !password) {
        errorEl.textContent = '이메일과 비밀번호를 입력해주세요.';
        errorEl.style.display = 'block';
        return;
    }

    if (auth) {
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify({ email: result.user.email }));
            showDashboard(result.user.email);
        } catch (e) {
            errorEl.textContent = '로그인 실패: ' + (e.message || '이메일 또는 비밀번호를 확인해주세요.');
            errorEl.style.display = 'block';
        }
    } else {
        // Firebase 없을 때 로컬 모드 (개발용)
        if (email === 'admin@dachicode.com' && password === 'admin1234') {
            sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify({ email }));
            showDashboard(email);
        } else {
            errorEl.textContent = '이메일 또는 비밀번호가 올바르지 않습니다.';
            errorEl.style.display = 'block';
        }
    }
}

function adminLogout() {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    if (auth) auth.signOut().catch(() => {});
    document.getElementById('admin-login').style.display = 'flex';
    document.getElementById('admin-dashboard').style.display = 'none';
}

// 세션 복구
document.addEventListener('DOMContentLoaded', () => {
    const session = sessionStorage.getItem(ADMIN_STORAGE_KEY);
    if (session) {
        const { email } = JSON.parse(session);
        showDashboard(email);
    }
});

// ==========================================
// 대시보드 표시
// ==========================================
function showDashboard(email) {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    document.getElementById('admin-user').textContent = email;
    loadAssessments();
}

// ==========================================
// 검사 데이터 로드
// ==========================================
async function loadAssessments() {
    allAssessments = [];

    if (db) {
        try {
            const snapshot = await db.collection(COLLECTIONS.ASSESSMENTS)
                .orderBy('studentCompletedAt', 'desc')
                .get();
            snapshot.forEach(doc => {
                allAssessments.push({ id: doc.id, ...doc.data() });
            });
        } catch (e) {
            console.warn('Firebase 로드 실패, localStorage 사용:', e);
            loadFromLocalStorage();
        }
    } else {
        loadFromLocalStorage();
    }

    renderTable();
    updateStats();
}

function loadFromLocalStorage() {
    const prefix = 'dc_assessment_';
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(prefix)) {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                const phone = key.replace(prefix, '');
                allAssessments.push({ id: phone, ...data });
            } catch (e) {}
        }
    }
}

// ==========================================
// 통계 업데이트
// ==========================================
function updateStats() {
    const total = allAssessments.length;
    const complete = allAssessments.filter(a => a.studentCompleted && a.parentCompleted).length;
    const studentOnly = allAssessments.filter(a => a.studentCompleted && !a.parentCompleted).length;
    const pending = total - complete - studentOnly;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-complete').textContent = complete;
    document.getElementById('stat-student-only').textContent = studentOnly;
    document.getElementById('stat-pending').textContent = pending;
}

// ==========================================
// 테이블 렌더링
// ==========================================
function renderTable() {
    const tbody = document.getElementById('assessment-list');
    const search = (document.getElementById('searchInput').value || '').toLowerCase();

    const filtered = allAssessments.filter(a => {
        if (!search) return true;
        const name = (a.studentInfo?.name || '').toLowerCase();
        const phone = (a.id || '').toLowerCase();
        return name.includes(search) || phone.includes(search);
    });

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:40px; color:var(--text-light);">검사 데이터가 없습니다.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(a => {
        const name = a.studentInfo?.name || '-';
        const phone = formatPhone(a.id);
        const grade = a.studentInfo?.grade || '-';
        const code = a.careerCode?.code2 || '-';
        const accuracy = a.accuracy != null ? `${Math.round(a.accuracy)}%` : '-';
        const accuracyClass = a.accuracy >= 70 ? 'color:var(--success)' : 'color:var(--danger)';

        let status, statusClass;
        if (a.studentCompleted && a.parentCompleted) {
            status = '완료'; statusClass = 'complete';
        } else if (a.studentCompleted) {
            status = '학생완료'; statusClass = 'partial';
        } else {
            status = '미완료'; statusClass = 'pending';
        }

        const date = a.studentCompletedAt
            ? new Date(a.studentCompletedAt).toLocaleDateString('ko-KR')
            : '-';

        return `
            <tr>
                <td><strong>${escHtml(name)}</strong></td>
                <td>${phone}</td>
                <td>${grade}</td>
                <td><strong>${code}</strong></td>
                <td style="${accuracyClass}; font-weight:600;">${accuracy}</td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td>${date}</td>
                <td>
                    <div class="admin-actions">
                        <button class="btn-sm primary" onclick="viewDetail('${a.id}')">상세</button>
                        <button class="btn-sm" onclick="downloadPDF('${a.id}')">PDF</button>
                        <button class="btn-sm" onclick="allowRetake('${a.id}')" title="재검사 허용">재검사</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function filterTable() { renderTable(); }

function formatPhone(phone) {
    if (!phone || phone.length < 10) return phone || '-';
    if (phone.length === 11) return phone.slice(0, 3) + '-' + phone.slice(3, 7) + '-' + phone.slice(7);
    return phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
}

function escHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ==========================================
// 재검사 허용
// ==========================================
async function allowRetake(phone) {
    const a = allAssessments.find(x => x.id === phone);
    const name = a?.studentInfo?.name || phone;

    if (!confirm(`${name} 학생의 재검사를 허용하시겠습니까?\n기존 검사 데이터는 유지됩니다.`)) return;

    if (db) {
        try {
            await db.collection(COLLECTIONS.ASSESSMENTS).doc(phone).update({
                retakeAllowed: true,
                studentCompleted: false,
                parentCompleted: false
            });
        } catch (e) { console.warn('Firebase 업데이트 실패:', e); }
    }

    // localStorage도 업데이트
    try {
        const raw = localStorage.getItem('dc_assessment_' + phone);
        if (raw) {
            const data = JSON.parse(raw);
            data.retakeAllowed = true;
            data.studentCompleted = false;
            data.parentCompleted = false;
            localStorage.setItem('dc_assessment_' + phone, JSON.stringify(data));
        }
    } catch (e) {}

    alert(`${name} 학생의 재검사가 허용되었습니다.`);
    loadAssessments();
}

// ==========================================
// 상세 보기
// ==========================================
function viewDetail(phone) {
    const a = allAssessments.find(x => x.id === phone);
    if (!a) { alert('데이터를 찾을 수 없습니다.'); return; }

    const content = document.getElementById('detail-content');
    const info = a.studentInfo || {};
    const scores = a.studentScores?.percent || a.analysisData?.riasec?.percent || {};
    const code = a.careerCode || a.analysisData?.careerCode || {};
    const accuracy = a.accuracy != null ? Math.round(a.accuracy) : '-';
    const sections = a.studentScores?.sections || a.analysisData?.riasec?.sections || {};

    // 분석 데이터 재생성 (없으면)
    let analysisData = a.analysisData;
    if (!analysisData && a.studentAnswers) {
        analysisData = generateAnalysisData(
            a.studentAnswers,
            a.parentAnswers || {},
            a.studentInfo,
            a.gradeData
        );
    }

    let html = `
        <div class="detail-section">
            <h3>학생 정보</h3>
            <div class="detail-grid">
                <div class="detail-item"><span class="label">이름</span><span class="value">${escHtml(info.name)}</span></div>
                <div class="detail-item"><span class="label">학년</span><span class="value">${info.grade || '-'}</span></div>
                <div class="detail-item"><span class="label">성별</span><span class="value">${info.gender || '-'}</span></div>
                <div class="detail-item"><span class="label">생년월일</span><span class="value">${info.birth || '-'}</span></div>
                <div class="detail-item"><span class="label">연락처</span><span class="value">${formatPhone(phone)}</span></div>
                <div class="detail-item"><span class="label">검사일</span><span class="value">${a.studentCompletedAt ? new Date(a.studentCompletedAt).toLocaleDateString('ko-KR') : '-'}</span></div>
                <div class="detail-item"><span class="label">희망대학</span><span class="value">${info.targetUniv || '-'}</span></div>
                <div class="detail-item"><span class="label">희망학과</span><span class="value">${info.targetMajor || '-'}</span></div>
            </div>
        </div>

        <div class="detail-section">
            <h3>RIASEC 진로코드: ${code.code2 || '-'} (${code.code3 || '-'})</h3>
            <div class="detail-grid" style="margin-bottom:16px;">
                <div class="detail-item"><span class="label">응답 일관성</span><span class="value" style="color:${accuracy >= 70 ? 'var(--success)' : 'var(--danger)'}">${accuracy}%</span></div>
                <div class="detail-item"><span class="label">분화도</span><span class="value">${code.differentiation?.level || '-'} (${code.differentiation?.value || 0})</span></div>
                <div class="detail-item"><span class="label">일관성</span><span class="value">${code.consistency?.level || '-'}</span></div>
                <div class="detail-item"><span class="label">1순위 긍정률</span><span class="value">${code.positiveRate || 0}%</span></div>
            </div>
    `;

    // RIASEC 바 차트
    const colors = { R: '#3B82F6', I: '#8B5CF6', A: '#EC4899', S: '#10B981', E: '#F59E0B', C: '#6366F1' };
    const typeNames = { R: '실재형(R)', I: '탐구형(I)', A: '예술형(A)', S: '사회형(S)', E: '기업형(E)', C: '관습형(C)' };

    Object.keys(scores).forEach(type => {
        html += `
            <div class="riasec-bar">
                <span class="bar-label">${typeNames[type]}</span>
                <div class="bar-track"><div class="bar-fill" style="width:${scores[type]}%; background:${colors[type]}"></div></div>
                <span class="bar-value">${scores[type]}%</span>
            </div>
        `;
    });
    html += '</div>';

    // 영역별 진로코드
    if (analysisData?.consistency) {
        const c = analysisData.consistency;
        html += `
            <div class="detail-section">
                <h3>검사영역간 진로코드 일치도: ${c.overallLevel}</h3>
                <div class="detail-grid">
                    <div class="detail-item"><span class="label">성격적성</span><span class="value">${c.details.personality}</span></div>
                    <div class="detail-item"><span class="label">능력적성</span><span class="value">${c.details.ability}</span></div>
                    <div class="detail-item"><span class="label">흥미</span><span class="value">${c.details.interest}</span></div>
                    <div class="detail-item"><span class="label">직업가치</span><span class="value">${c.details.value}</span></div>
                </div>
            </div>
        `;
    }

    // 추천 직업/학과
    if (analysisData) {
        const careers = analysisData.careers || getRecommendedCareers(code.code2 || 'RI');
        const depts = analysisData.departments || getRecommendedDepartments(code.code2 || 'RI');

        html += `
            <div class="detail-section">
                <h3>추천 직업</h3>
                <p style="font-size:14px; line-height:1.8;">
                    <strong>유망직업:</strong> ${(careers.primary || []).join(', ') || '-'}<br>
                    <strong>일반직업:</strong> ${(careers.secondary || []).join(', ') || '-'}
                </p>
            </div>
            <div class="detail-section">
                <h3>추천 대학 학과</h3>
                <p style="font-size:14px; line-height:1.8;">
                    <strong>1순위:</strong> ${(depts.primary || []).join(', ') || '-'}<br>
                    <strong>2순위:</strong> ${(depts.secondary || []).join(', ') || '-'}
                </p>
            </div>
        `;

        // 문/이과 성향
        if (analysisData.orientation) {
            const o = analysisData.orientation;
            html += `
                <div class="detail-section">
                    <h3>문/이과 성향: ${o.orientation}</h3>
                    <div class="detail-grid">
                        <div class="detail-item"><span class="label">이과 지수</span><span class="value">${o.sciencePercent}%</span></div>
                        <div class="detail-item"><span class="label">문과 지수</span><span class="value">${o.humanPercent}%</span></div>
                    </div>
                </div>
            `;
        }
    }

    // 학부모 결과
    if (a.parentScores || a.parentCompleted) {
        const ps = a.parentScores || {};
        html += `
            <div class="detail-section">
                <h3>학부모 검사 결과</h3>
                <div class="detail-item"><span class="label">교육 지원 수준</span><span class="value">${ps.support || '-'}%</span></div>
        `;
        if (ps.riasec) {
            Object.keys(ps.riasec).forEach(type => {
                html += `
                    <div class="riasec-bar">
                        <span class="bar-label">${typeNames[type]}</span>
                        <div class="bar-track"><div class="bar-fill" style="width:${ps.riasec[type]}%; background:${colors[type]}; opacity:0.6;"></div></div>
                        <span class="bar-value">${ps.riasec[type]}%</span>
                    </div>
                `;
            });
        }
        html += '</div>';
    }

    // 액션 버튼
    html += `
        <div style="display:flex; gap:12px; margin-top:24px;">
            <button class="btn-primary" style="flex:1;" onclick="downloadPDF('${phone}')">PDF 다운로드</button>
            <button class="btn-secondary" style="flex:1;" onclick="allowRetake('${phone}'); closeModal();">재검사 허용</button>
        </div>
    `;

    content.innerHTML = html;
    document.getElementById('detail-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('detail-modal').classList.remove('active');
}

// ESC로 모달 닫기
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});

// ==========================================
// PDF 다운로드
// ==========================================
async function downloadPDF(phone) {
    const a = allAssessments.find(x => x.id === phone);
    if (!a) { alert('데이터를 찾을 수 없습니다.'); return; }

    // 분석 데이터 재생성
    let analysisData = a.analysisData;
    if (!analysisData && a.studentAnswers) {
        analysisData = generateAnalysisData(
            a.studentAnswers,
            a.parentAnswers || {},
            a.studentInfo,
            a.gradeData
        );
    }

    if (!analysisData) {
        alert('분석 데이터가 충분하지 않습니다.');
        return;
    }

    try {
        await generatePDFReport(a, analysisData);
    } catch (e) {
        console.error('PDF 생성 실패:', e);
        alert('PDF 생성에 실패했습니다: ' + e.message);
    }
}
