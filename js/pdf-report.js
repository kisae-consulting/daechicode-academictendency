// ==========================================
// 대치코드 진로적성검사 PDF 보고서 생성
// jsPDF + html2canvas 기반
// ==========================================

async function generatePDFReport(assessmentData, analysisData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const W = 210, H = 297;
    const M = 20; // margin
    const CW = W - M * 2; // content width

    const info = assessmentData.studentInfo || {};
    const scores = analysisData.riasec?.percent || {};
    const code = analysisData.careerCode || {};
    const accuracy = analysisData.accuracy != null ? Math.round(analysisData.accuracy) : '-';

    // 색상 정의
    const PRIMARY = [212, 114, 42]; // #D4722A
    const DARK = [26, 26, 26];
    const GRAY = [102, 102, 102];
    const LIGHT_GRAY = [200, 200, 200];
    const WHITE = [255, 255, 255];
    const RIASEC_COLORS = {
        R: [59, 130, 246], I: [139, 92, 246], A: [236, 72, 153],
        S: [16, 185, 129], E: [245, 158, 11], C: [99, 102, 241]
    };
    const TYPE_NAMES = { R: '실재형(R)', I: '탐구형(I)', A: '예술형(A)', S: '사회형(S)', E: '기업형(E)', C: '관습형(C)' };

    let y = 0; // current y position

    // ==========================================
    // 헬퍼 함수
    // ==========================================
    function addPage() {
        doc.addPage();
        y = M;
        drawPageHeader();
    }

    function checkPage(needed) {
        if (y + needed > H - M) addPage();
    }

    function drawPageHeader() {
        doc.setFontSize(8);
        doc.setTextColor(...GRAY);
        doc.text(`대치코드 진로적성검사 보고서`, M, 12);
        doc.text(`${info.name || ''} | ${info.grade || ''} | ${assessmentData.studentCompletedAt ? new Date(assessmentData.studentCompletedAt).toLocaleDateString('ko-KR') : ''}`, W - M, 12, { align: 'right' });
        doc.setDrawColor(...LIGHT_GRAY);
        doc.line(M, 15, W - M, 15);
    }

    function drawSectionTitle(title) {
        checkPage(20);
        doc.setFillColor(...PRIMARY);
        doc.rect(M, y, CW, 8, 'F');
        doc.setFontSize(11);
        doc.setTextColor(...WHITE);
        doc.text(title, M + 4, y + 5.5);
        y += 12;
        doc.setTextColor(...DARK);
    }

    function drawSubTitle(title) {
        checkPage(12);
        doc.setFontSize(10);
        doc.setTextColor(...PRIMARY);
        doc.text(title, M, y);
        y += 6;
        doc.setTextColor(...DARK);
    }

    function drawText(text, fontSize, color, maxWidth) {
        fontSize = fontSize || 9;
        color = color || DARK;
        maxWidth = maxWidth || CW;
        doc.setFontSize(fontSize);
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text, maxWidth);
        checkPage(lines.length * (fontSize * 0.5) + 4);
        doc.text(lines, M, y);
        y += lines.length * (fontSize * 0.5) + 2;
    }

    function drawKeyValue(key, value, xOffset) {
        xOffset = xOffset || 0;
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        doc.text(key, M + xOffset, y);
        doc.setTextColor(...DARK);
        doc.text(String(value || '-'), M + xOffset + 35, y);
    }

    function drawHBar(label, value, color, maxVal) {
        maxVal = maxVal || 100;
        checkPage(8);
        doc.setFontSize(8);
        doc.setTextColor(...DARK);
        doc.text(label, M, y + 3);

        const barX = M + 28;
        const barW = CW - 45;
        const fillW = (value / maxVal) * barW;

        doc.setFillColor(230, 230, 230);
        doc.roundedRect(barX, y - 1, barW, 5, 1, 1, 'F');
        doc.setFillColor(...(color || PRIMARY));
        doc.roundedRect(barX, y - 1, Math.max(fillW, 1), 5, 1, 1, 'F');

        doc.setFontSize(8);
        doc.setTextColor(...DARK);
        doc.text(`${value}%`, barX + barW + 2, y + 3);
        y += 7;
    }

    // ==========================================
    // 페이지 1: 표지
    // ==========================================
    // 상단 컬러바
    doc.setFillColor(...PRIMARY);
    doc.rect(0, 0, W, 4, 'F');

    // 로고 텍스트
    y = 50;
    doc.setFontSize(14);
    doc.setTextColor(...PRIMARY);
    doc.text('DACHICODE', W / 2, y, { align: 'center' });
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(...GRAY);
    doc.text('Academic Tendency Assessment', W / 2, y, { align: 'center' });

    y = 90;
    doc.setFontSize(28);
    doc.setTextColor(...DARK);
    doc.text('진로적성검사', W / 2, y, { align: 'center' });
    y += 14;
    doc.setFontSize(14);
    doc.setTextColor(...GRAY);
    doc.text('학업성향 분석 보고서', W / 2, y, { align: 'center' });

    y += 8;
    doc.setDrawColor(...PRIMARY);
    doc.setLineWidth(0.5);
    doc.line(W / 2 - 30, y, W / 2 + 30, y);

    // 학생 정보 테이블
    y = 140;
    const infoRows = [
        ['이    름', info.name || '-'],
        ['성    별', info.gender || '-'],
        ['학    년', info.grade || '-'],
        ['생년월일', info.birth || '-'],
        ['연 락 처', formatPhone(assessmentData.id) || '-'],
        ['검 사 일', assessmentData.studentCompletedAt ? new Date(assessmentData.studentCompletedAt).toLocaleDateString('ko-KR') : '-'],
        ['검사기관', '대치코드'],
        ['진로코드', `${code.code2 || '-'} (${code.code3 || '-'})`]
    ];

    doc.setFontSize(10);
    infoRows.forEach(([key, val]) => {
        doc.setFillColor(245, 245, 245);
        doc.rect(M + 20, y - 4, 35, 8, 'F');
        doc.setTextColor(...GRAY);
        doc.text(key, M + 22, y + 1);
        doc.setTextColor(...DARK);
        doc.text(String(val), M + 60, y + 1);
        y += 10;
    });

    // 하단
    y = H - 30;
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text('본 검사 보고서는 대치코드 학습컨설팅을 위한 참고자료입니다.', W / 2, y, { align: 'center' });
    y += 5;
    doc.text('검사 결과는 웩슬러 지능검사 등 다른 검사 결과와 종합적으로 해석되어야 합니다.', W / 2, y, { align: 'center' });

    doc.setFillColor(...PRIMARY);
    doc.rect(0, H - 4, W, 4, 'F');

    // ==========================================
    // 페이지 2: 검사결과의 타당도
    // ==========================================
    addPage();
    drawSectionTitle('1. 검사결과의 타당도');
    y += 2;

    drawSubTitle('진로유형의 분화도와 1순위 진로코드의 긍정응답률');
    drawText(`분화도: ${code.differentiation?.level || '-'} (${code.differentiation?.value || 0}점)  |  1순위 긍정응답률: ${code.positiveRate || 0}%`, 9);
    y += 2;

    if (code.differentiation?.level === '높음') {
        drawText('1순위 진로코드의 특성이 뚜렷하게 나타나며, 진로유형이 명확합니다.', 9, GRAY);
    } else if (code.differentiation?.level === '보통') {
        drawText('1순위 진로코드에 긍정 비율이 높지만 분화도가 보통이므로 진로유형이 완전히 뚜렷하지는 않습니다.', 9, GRAY);
    } else {
        drawText('분화도가 낮아 아직 진로유형이 명확하지 않습니다. 다양한 경험을 통해 적성을 탐색할 필요가 있습니다.', 9, GRAY);
    }
    y += 4;

    drawSubTitle('검사영역간 진로코드의 일치도 수준');
    if (analysisData.consistency) {
        const c = analysisData.consistency;
        const conData = [
            ['성격적성', c.details.personality],
            ['능력적성', c.details.ability],
            ['흥미', c.details.interest],
            ['직업가치', c.details.value]
        ];

        doc.setFontSize(9);
        // 테이블 헤더
        doc.setFillColor(245, 245, 245);
        doc.rect(M, y - 3, CW, 7, 'F');
        doc.setTextColor(...GRAY);
        const colW = CW / 5;
        ['영역', '성격적성', '능력적성', '흥미', '직업가치'].forEach((h, i) => {
            doc.text(h, M + colW * i + colW / 2, y + 1, { align: 'center' });
        });
        y += 9;

        doc.setTextColor(...DARK);
        doc.text('진로코드', M + colW / 2, y, { align: 'center' });
        conData.forEach(([, val], i) => {
            doc.text(val || '--', M + colW * (i + 1) + colW / 2, y, { align: 'center' });
        });
        y += 8;

        drawText(`종합 일치도: ${c.overallLevel}`, 9);
        if (c.overallLevel === '매우높음' || c.overallLevel === '높음') {
            drawText('성격, 능력, 흥미, 직업가치 영역에서 진로코드의 일치수준이 높습니다. 검사결과를 타당하게 해석할 수 있습니다.', 9, GRAY);
        } else {
            drawText('영역별 진로코드에 차이가 있습니다. 각 영역의 특성을 개별적으로 살펴볼 필요가 있습니다.', 9, GRAY);
        }
    }
    y += 4;

    drawSubTitle('응답 일관성');
    const accColor = accuracy >= 70 ? [16, 185, 129] : [239, 68, 68];
    drawText(`응답 일관성 점수: ${accuracy}% ${accuracy >= 70 ? '(양호)' : '(주의 - 재검사 고려)'}`, 10, accColor);
    y += 4;

    // ==========================================
    // 페이지 3: RIASEC 점수 분포
    // ==========================================
    addPage();
    drawSectionTitle('2. 각 영역별 진로코드의 점수분포(%)');
    y += 2;

    drawText(`1차 진로코드: ${code.code2 || '-'}  |  3코드: ${code.code3 || '-'}`, 10);
    y += 4;

    // 종합 RIASEC 바 차트
    drawSubTitle('종합 점수');
    ['R', 'I', 'A', 'S', 'E', 'C'].forEach(type => {
        drawHBar(TYPE_NAMES[type], scores[type] || 0, RIASEC_COLORS[type]);
    });
    y += 4;

    // 섹션별 점수 테이블
    drawSubTitle('영역별 상세 점수');
    const sections = analysisData.riasec?.sections || {};
    const sectionNames = { personality: '성격적성', ability: '능력적성', interest: '흥미', value: '직업가치' };

    // 테이블 헤더
    doc.setFillColor(245, 245, 245);
    doc.rect(M, y - 3, CW, 7, 'F');
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    const tw = CW / 8;
    doc.text('영역', M + 2, y + 1);
    ['R', 'I', 'A', 'S', 'E', 'C'].forEach((t, i) => {
        doc.text(TYPE_NAMES[t], M + tw * (i + 1) + tw / 2, y + 1, { align: 'center' });
    });
    doc.text('코드', M + tw * 7 + tw / 2, y + 1, { align: 'center' });
    y += 8;

    doc.setTextColor(...DARK);
    Object.entries(sectionNames).forEach(([secKey, secName]) => {
        checkPage(8);
        doc.text(secName, M + 2, y);
        const secScores = sections[secKey] || {};
        const sorted = Object.entries(secScores).sort((a, b) => b[1] - a[1]);
        const secCode = sorted.length >= 2 ? sorted[0][0] + sorted[1][0] : '--';

        ['R', 'I', 'A', 'S', 'E', 'C'].forEach((t, i) => {
            doc.text(String(secScores[t] || 0), M + tw * (i + 1) + tw / 2, y, { align: 'center' });
        });
        doc.text(secCode, M + tw * 7 + tw / 2, y, { align: 'center' });
        y += 7;
    });

    // 종합 행
    doc.setFillColor(255, 248, 240);
    doc.rect(M, y - 4, CW, 7, 'F');
    doc.setFontSize(8);
    doc.text('종합', M + 2, y);
    ['R', 'I', 'A', 'S', 'E', 'C'].forEach((t, i) => {
        doc.text(String(scores[t] || 0), M + tw * (i + 1) + tw / 2, y, { align: 'center' });
    });
    doc.text(code.code2 || '--', M + tw * 7 + tw / 2, y, { align: 'center' });
    y += 10;

    // ==========================================
    // 페이지 4: 백분위 + 성격 강점
    // ==========================================
    addPage();
    drawSectionTitle('3. 진로코드의 규준적 백분위');
    y += 2;

    drawText('백분위 점수가 높을수록 다른 학생들보다 해당 코드에 강점을 가지고 있다고 볼 수 있습니다.', 9, GRAY);
    y += 4;

    // 백분위 바 차트 (종합 점수를 백분위로 사용)
    ['R', 'I', 'A', 'S', 'E', 'C'].forEach(type => {
        drawHBar(TYPE_NAMES[type], scores[type] || 0, RIASEC_COLORS[type]);
    });
    y += 8;

    drawSectionTitle(`4. ${code.code2 || '--'} 코드에 따른 성격 강점`);
    y += 2;

    if (analysisData.strengths) {
        drawText(analysisData.strengths.primary, 9);
        y += 2;
        drawText(analysisData.strengths.secondary, 9);
        y += 2;
        drawText(analysisData.strengths.combined, 9, PRIMARY);
    }
    y += 4;

    // 문/이과 성향
    if (analysisData.orientation) {
        drawSubTitle('문/이과 성향 분석');
        const o = analysisData.orientation;
        drawText(`판정: ${o.orientation}  |  이과 지수: ${o.sciencePercent}%  |  문과 지수: ${o.humanPercent}%`, 9);
        y += 4;
    }

    // ==========================================
    // 페이지 5: 적합 직무분야 + 적합 직업
    // ==========================================
    addPage();
    drawSectionTitle(`5. ${code.code2 || '--'} 코드에 적합한 직무분야`);
    y += 2;

    if (analysisData.fieldScores) {
        const topFields = analysisData.fieldScores.slice(0, 14);
        topFields.forEach(f => {
            drawHBar(f.field.length > 15 ? f.field.slice(0, 15) + '..' : f.field, f.score, PRIMARY, 100);
        });
    }
    y += 4;

    drawSectionTitle(`6. ${code.code2 || '--'} 코드에 적합한 직업`);
    y += 2;

    if (analysisData.careers) {
        drawSubTitle('유망직업');
        drawText((analysisData.careers.primary || []).join('  |  ') || '해당 없음', 9);
        y += 2;
        drawSubTitle('일반직업');
        drawText((analysisData.careers.secondary || []).join('  |  ') || '해당 없음', 9);
    }

    // ==========================================
    // 페이지 6: 추천 대학 학과
    // ==========================================
    addPage();
    drawSectionTitle(`7. ${code.code2 || '--'} 코드에 적합한 전공학과`);
    y += 2;

    if (analysisData.departments) {
        drawSubTitle('1순위 추천 학과');
        const depts1 = analysisData.departments.primary || [];
        drawText(depts1.join(',  ') || '해당 없음', 9);
        y += 4;

        drawSubTitle('2순위 추천 학과');
        const depts2 = analysisData.departments.secondary || [];
        drawText(depts2.join(',  ') || '해당 없음', 9);
    }
    y += 6;

    // 희망 진로 정보
    if (info.targetUniv || info.targetMajor) {
        drawSubTitle('학생 희망 진로');
        if (info.targetUniv) drawText(`희망 대학: ${info.targetUniv}`, 9);
        if (info.targetMajor) drawText(`희망 학과: ${info.targetMajor}`, 9);
        y += 4;
    }

    // 주관식 응답
    const dreamJob = assessmentData.studentAnswers?.['S131'];
    const dreamMajor = assessmentData.studentAnswers?.['S132'];
    if (dreamJob?.value || dreamMajor?.value) {
        drawSubTitle('검사 중 기재한 희망 진로');
        if (dreamJob?.value) drawText(`희망 직업: ${dreamJob.value}`, 9);
        if (dreamMajor?.value) drawText(`관심 학과: ${dreamMajor.value}`, 9);
    }

    // ==========================================
    // 페이지 7: 성적 분석
    // ==========================================
    if (assessmentData.gradeData && Object.keys(assessmentData.gradeData).length > 0) {
        addPage();
        drawSectionTitle('8. 성적 분석');
        y += 2;

        const gradeData = assessmentData.gradeData;
        const gradeMap = { '매우잘함': 4, '잘함': 3, '보통': 2, '노력요함': 1, 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1 };

        // 성적 테이블
        const subjects = [...new Set(Object.keys(gradeData).map(k => k.split('_')[1]))];
        const semesters = [...new Set(Object.keys(gradeData).map(k => {
            const parts = k.split('_');
            return parts.slice(2).join('_');
        }))].sort();

        if (subjects.length > 0 && semesters.length > 0) {
            doc.setFontSize(8);
            const colWidth = Math.min((CW - 30) / semesters.length, 22);

            // 헤더
            doc.setFillColor(245, 245, 245);
            doc.rect(M, y - 3, CW, 7, 'F');
            doc.setTextColor(...GRAY);
            doc.text('과목', M + 2, y + 1);
            semesters.forEach((sem, i) => {
                const label = sem.replace('_', '-');
                doc.text(label, M + 30 + colWidth * i + colWidth / 2, y + 1, { align: 'center' });
            });
            y += 8;

            doc.setTextColor(...DARK);
            subjects.forEach(subj => {
                checkPage(7);
                doc.text(subj.length > 5 ? subj.slice(0, 5) : subj, M + 2, y);
                semesters.forEach((sem, i) => {
                    const key = `grade_${subj}_${sem}`;
                    const val = gradeData[key] || '';
                    doc.text(val, M + 30 + colWidth * i + colWidth / 2, y, { align: 'center' });
                });
                y += 6;
            });
        }
    }

    // ==========================================
    // 페이지 8: 학부모 검사 결과
    // ==========================================
    if (analysisData.parentAnalysis) {
        addPage();
        drawSectionTitle('9. 학부모 검사 결과');
        y += 2;

        const pa = analysisData.parentAnalysis;

        drawSubTitle('학부모 관찰 RIASEC 점수');
        if (pa.riasec) {
            ['R', 'I', 'A', 'S', 'E', 'C'].forEach(type => {
                drawHBar(TYPE_NAMES[type], pa.riasec[type] || 0, RIASEC_COLORS[type]);
            });
        }
        y += 4;

        drawSubTitle('교육 지원 환경');
        drawHBar('지원 수준', pa.support || 0, PRIMARY);
        y += 4;

        // 학생 vs 학부모 비교
        drawSubTitle('학생 자가진단 vs 학부모 관찰 비교');
        doc.setFontSize(8);
        ['R', 'I', 'A', 'S', 'E', 'C'].forEach(type => {
            checkPage(8);
            const sv = scores[type] || 0;
            const pv = pa.riasec?.[type] || 0;
            const diff = sv - pv;
            const diffText = diff > 0 ? `+${diff}` : String(diff);

            doc.setTextColor(...DARK);
            doc.text(TYPE_NAMES[type], M, y + 2);
            doc.text(`학생: ${sv}%`, M + 30, y + 2);
            doc.text(`학부모: ${pv}%`, M + 60, y + 2);
            doc.setTextColor(...(diff > 10 ? [245, 158, 11] : diff < -10 ? [59, 130, 246] : [102, 102, 102]));
            doc.text(`차이: ${diffText}`, M + 95, y + 2);
            y += 6;
        });
    }

    // ==========================================
    // 마지막 페이지: 종합 소견
    // ==========================================
    addPage();
    drawSectionTitle('10. 검사자 종합 소견 및 제언');
    y += 2;

    drawText('※ 종합 소견은 검사 결과를 바탕으로 한 분석입니다. 웩슬러 지능검사, 학업성적, 개인 특성을 종합적으로 고려하여 최종 진로를 결정해야 합니다.', 8, GRAY);
    y += 6;

    // 빈 소견란 (컨설턴트 직접 작성용)
    doc.setDrawColor(...LIGHT_GRAY);
    doc.rect(M, y, CW, 100);
    y += 106;

    // 하단 안내문
    checkPage(30);
    doc.setDrawColor(...PRIMARY);
    doc.setLineWidth(0.5);
    doc.line(M, y, W - M, y);
    y += 6;

    drawText('※ 본 검사결과표는 학생의 한정된 정보를 바탕으로 산출된 결과입니다.', 8, GRAY);
    drawText('부모님의 유전적 특성, 학업성적, NEO 성격검사 그리고 다른 특성 및 적성개발자료 등의 결과를 종합적으로 고려하여 최종 진로를 결정해야 합니다.', 8, GRAY);
    drawText('또한, 선정된 결과는 개별적으로 진로상담전문가와 상담을 통해 진로지도 받으시길 바랍니다.', 8, GRAY);

    // ==========================================
    // 저장
    // ==========================================
    const fileName = `대치코드_진로적성검사_${info.name || 'report'}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);

    return fileName;
}

// PDF용 전화번호 포맷
function formatPhone(phone) {
    if (!phone || phone.length < 10) return phone || '-';
    if (phone.length === 11) return phone.slice(0, 3) + '-****-' + phone.slice(7);
    return phone.slice(0, 3) + '-***-' + phone.slice(6);
}
