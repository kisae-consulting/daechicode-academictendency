// ==========================================
// RIASEC 채점 및 진로 분석 엔진
// ==========================================

// 학생 RIASEC 점수 계산
function calculateRIASECScores(answers, questions) {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const counts = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const sectionScores = {};

    // 섹션별 점수도 계산
    ['personality', 'ability', 'interest', 'value'].forEach(sec => {
        sectionScores[sec] = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
        const secCounts = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

        questions.filter(q => q.section === sec && q.riasec).forEach(q => {
            const answer = answers[q.id];
            if (answer && answer.value) {
                let val = answer.value;
                if (q.reverse) val = 6 - val;
                sectionScores[sec][q.riasec] += val;
                secCounts[q.riasec]++;
            }
        });

        // 백분율로 변환 (5점 만점 기준)
        Object.keys(sectionScores[sec]).forEach(type => {
            if (secCounts[type] > 0) {
                sectionScores[sec][type] = Math.round((sectionScores[sec][type] / (secCounts[type] * 5)) * 100);
            }
        });
    });

    // 전체 RIASEC 점수 계산
    questions.filter(q => q.riasec && q.section !== 'subject').forEach(q => {
        const answer = answers[q.id];
        if (answer && answer.value) {
            let val = answer.value;
            if (q.reverse) val = 6 - val;
            scores[q.riasec] += val;
            counts[q.riasec]++;
        }
    });

    // 교과 성향에서 추가 RIASEC 보정
    questions.filter(q => q.section === 'subject' && q.type === 'mc').forEach(q => {
        const answer = answers[q.id];
        if (answer && answer.tag) {
            scores[answer.tag] = (scores[answer.tag] || 0) + 2;
            counts[answer.tag] = (counts[answer.tag] || 0) + 1;
        }
    });

    // 백분율 변환
    const percentScores = {};
    Object.keys(scores).forEach(type => {
        if (counts[type] > 0) {
            percentScores[type] = Math.round((scores[type] / (counts[type] * 5)) * 100);
        } else {
            percentScores[type] = 0;
        }
    });

    return {
        raw: scores,
        counts: counts,
        percent: percentScores,
        sections: sectionScores
    };
}

// 학부모 점수 계산
function calculateParentRIASECScores(answers) {
    const riasecScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const riasecCounts = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const supportScores = { total: 0, count: 0 };
    const careerData = {};

    PARENT_QUESTIONS.forEach(q => {
        const answer = answers[q.id];
        if (!answer) return;

        if (q.category === 'observation' && q.riasec) {
            if (answer.value) {
                riasecScores[q.riasec] += answer.value;
                riasecCounts[q.riasec]++;
            }
        } else if (q.category === 'support') {
            if (answer.value) {
                supportScores.total += answer.value;
                supportScores.count++;
            }
        } else if (q.category === 'career') {
            careerData[q.id] = answer;
        }
    });

    const percentScores = {};
    Object.keys(riasecScores).forEach(type => {
        percentScores[type] = riasecCounts[type] > 0
            ? Math.round((riasecScores[type] / (riasecCounts[type] * 5)) * 100) : 0;
    });

    return {
        riasec: percentScores,
        support: supportScores.count > 0
            ? Math.round((supportScores.total / (supportScores.count * 5)) * 100) : 50,
        career: careerData
    };
}

// 진로 코드 결정 (상위 2~3개)
function determineCareerCode(percentScores) {
    const sorted = Object.entries(percentScores)
        .sort((a, b) => b[1] - a[1]);

    const primary = sorted[0];
    const secondary = sorted[1];
    const tertiary = sorted[2];

    // 분화도 계산 (1위와 6위 점수 차이)
    const differentiation = primary[1] - sorted[5][1];
    let diffLevel;
    if (differentiation >= 30) diffLevel = '높음';
    else if (differentiation >= 15) diffLevel = '보통';
    else diffLevel = '낮음';

    // 일관성 계산 (1위와 2위가 Holland 육각형에서 인접한지)
    const hexOrder = ['R', 'I', 'A', 'S', 'E', 'C'];
    const idx1 = hexOrder.indexOf(primary[0]);
    const idx2 = hexOrder.indexOf(secondary[0]);
    const dist = Math.min(Math.abs(idx1 - idx2), 6 - Math.abs(idx1 - idx2));
    let consistency;
    if (dist <= 1) consistency = '높음';
    else if (dist === 2) consistency = '보통';
    else consistency = '낮음';

    return {
        code2: primary[0] + secondary[0],
        code3: primary[0] + secondary[0] + tertiary[0],
        primary: { type: primary[0], score: primary[1] },
        secondary: { type: secondary[0], score: secondary[1] },
        tertiary: { type: tertiary[0], score: tertiary[1] },
        sorted: sorted,
        differentiation: { value: differentiation, level: diffLevel },
        consistency: { value: dist, level: consistency },
        positiveRate: primary[1]
    };
}

// 추천 직업 가져오기
function getRecommendedCareers(code2) {
    const direct = CAREER_DATABASE.careers[code2] || [];
    const reverse = CAREER_DATABASE.careers[code2[1] + code2[0]] || [];
    return { primary: direct, secondary: reverse };
}

// 추천 학과 가져오기
function getRecommendedDepartments(code2) {
    const direct = CAREER_DATABASE.departments[code2] || [];
    const reverse = CAREER_DATABASE.departments[code2[1] + code2[0]] || [];
    return { primary: direct, secondary: reverse };
}

// 직무분야 적합도 계산
function calculateFieldScores(percentScores) {
    const results = [];
    Object.entries(CAREER_DATABASE.fieldScores).forEach(([field, weights]) => {
        let score = 0;
        Object.keys(weights).forEach(type => {
            score += (percentScores[type] / 100) * weights[type];
        });
        results.push({ field, score: Math.round(score) });
    });
    return results.sort((a, b) => b.score - a.score);
}

// 교차 검증 정확도 계산 (커스텀 쌍 지원)
function calculateAccuracyWithPairs(answers, pairs) {
    if (!pairs || !pairs.length) return 100;

    let consistentCount = 0;
    let totalPairs = 0;

    pairs.forEach(pair => {
        const a1 = answers[pair.q1];
        const a2 = answers[pair.q2];
        if (!a1 || !a2) return;
        totalPairs++;

        const v1 = a1.value || 0;
        const v2 = a2.value || 0;

        if (pair.type === 'same') {
            if (Math.abs(v1 - v2) <= 1.5) consistentCount++;
        } else if (pair.type === 'reverse') {
            if (Math.abs((v1 + v2) - 6) <= 1.5) consistentCount++;
        }
    });

    return totalPairs === 0 ? 100 : Math.round((consistentCount / totalPairs) * 100);
}

// 교차 검증 정확도 계산 (기본 쌍 사용)
function calculateAccuracy(answers) {
    if (!CROSS_VALIDATION_PAIRS || !CROSS_VALIDATION_PAIRS.length) return 100;

    let consistentCount = 0;
    let totalPairs = 0;

    CROSS_VALIDATION_PAIRS.forEach(pair => {
        const a1 = answers[pair.q1];
        const a2 = answers[pair.q2];
        if (!a1 || !a2) return;
        totalPairs++;

        const v1 = a1.value || 0;
        const v2 = a2.value || 0;

        if (pair.type === 'same') {
            if (Math.abs(v1 - v2) <= 1.5) consistentCount++;
        } else if (pair.type === 'reverse') {
            if (Math.abs((v1 + v2) - 6) <= 1.5) consistentCount++;
        }
    });

    return totalPairs === 0 ? 100 : Math.round((consistentCount / totalPairs) * 100);
}

// 성격 강점 텍스트 생성
function generatePersonalityStrengths(code2, percentScores) {
    const type1 = RIASEC_TYPES.find(t => t.id === code2[0]);
    const type2 = RIASEC_TYPES.find(t => t.id === code2[1]);

    const strengthTexts = {
        'R': '실용적이고 행동력이 있으며, 구체적인 결과물을 만들어내는 데 능숙합니다.',
        'I': '분석적이고 논리적인 사고력이 뛰어나며, 깊이 있는 탐구를 즐깁니다.',
        'A': '창의력과 감성이 풍부하며, 독창적인 아이디어와 표현력이 뛰어납니다.',
        'S': '타인에 대한 공감 능력이 뛰어나고, 협력과 봉사 정신이 강합니다.',
        'E': '리더십과 추진력이 있으며, 목표를 향해 사람들을 이끌어가는 능력이 있습니다.',
        'C': '꼼꼼하고 체계적이며, 규칙을 잘 따르고 정확하게 일을 처리합니다.'
    };

    const detailTexts = {
        'RI': '기술적 문제를 논리적으로 분석하고 실용적인 해결책을 찾는 능력이 뛰어납니다.',
        'RA': '손으로 직접 만드는 것을 좋아하며, 실용적이면서도 미적 감각이 있는 결과물을 만듭니다.',
        'RS': '체력과 행동력을 바탕으로 다른 사람을 직접적으로 돕는 것을 좋아합니다.',
        'RE': '실용적인 기술을 활용하여 프로젝트를 추진하고 관리하는 능력이 있습니다.',
        'RC': '기술적이면서도 정확하고 체계적으로 일을 처리하는 능력이 있습니다.',
        'IR': '과학적 지식을 실제 기술이나 제품에 적용하는 것에 관심이 많습니다.',
        'IA': '분석적 사고와 창의력을 결합하여 혁신적인 아이디어를 만들어냅니다.',
        'IS': '과학적 지식을 바탕으로 사람들의 건강과 복지를 돕는 데 관심이 많습니다.',
        'IE': '전문 지식을 활용하여 사업이나 프로젝트를 이끌어가는 능력이 있습니다.',
        'IC': '정밀한 분석과 체계적인 연구를 통해 정확한 결과를 도출하는 능력이 뛰어납니다.',
        'AR': '예술적 감각과 실용적 기술을 결합하여 독창적인 작품을 만듭니다.',
        'AI': '창의적 사고와 분석력을 결합하여 새로운 콘텐츠나 솔루션을 만듭니다.',
        'AS': '예술적 재능을 활용하여 다른 사람들에게 감동과 치유를 줍니다.',
        'AE': '창의적인 아이디어로 사람들을 설득하고 새로운 트렌드를 만들어갑니다.',
        'AC': '예술적 감각과 정확성을 결합하여 완성도 높은 작품을 만듭니다.',
        'SR': '따뜻한 마음과 실행력으로 어려운 사람들을 직접 돕습니다.',
        'SI': '과학적 이해와 공감 능력을 바탕으로 전문적인 도움을 제공합니다.',
        'SA': '예술과 교육을 결합하여 사람들의 성장과 치유를 돕습니다.',
        'SE': '사람들을 이해하고 이끌어가는 리더십으로 조직과 사회에 기여합니다.',
        'SC': '체계적이고 정확한 방법으로 사회적 서비스를 제공합니다.',
        'ER': '실용적인 비즈니스 감각과 기술적 이해를 결합하여 사업을 성공시킵니다.',
        'EI': '전문 지식과 비즈니스 감각을 결합하여 혁신적인 사업을 만듭니다.',
        'EA': '창의적인 콘텐츠와 마케팅 감각으로 새로운 가치를 창출합니다.',
        'ES': '사람을 이해하고 설득하는 능력으로 조직을 이끌어갑니다.',
        'EC': '체계적인 관리 능력과 추진력으로 조직의 성과를 극대화합니다.',
        'CR': '기술적 지식과 정확성을 결합하여 시스템을 관리하고 유지합니다.',
        'CI': '데이터 분석과 체계적 사고로 정확한 결론을 도출합니다.',
        'CA': '예술적 감각과 체계적 관리 능력을 결합합니다.',
        'CS': '체계적인 행정 능력으로 사회적 서비스를 효율적으로 운영합니다.',
        'CE': '정확한 분석과 관리 능력으로 조직의 재무와 운영을 책임집니다.'
    };

    return {
        primary: strengthTexts[code2[0]] || '',
        secondary: strengthTexts[code2[1]] || '',
        combined: detailTexts[code2] || detailTexts[code2[1] + code2[0]] || ''
    };
}

// 검사영역간 일치도 수준 계산
function calculateConsistencyLevels(sectionScores) {
    if (!sectionScores) return null;

    const sections = ['personality', 'ability', 'interest', 'value'];
    const sectionCodes = {};

    sections.forEach(sec => {
        if (sectionScores[sec]) {
            const sorted = Object.entries(sectionScores[sec]).sort((a, b) => b[1] - a[1]);
            sectionCodes[sec] = sorted[0][0] + sorted[1][0];
        }
    });

    // 각 섹션 코드의 1순위 비교
    const primaryTypes = Object.values(sectionCodes).map(code => code[0]);
    const uniquePrimary = [...new Set(primaryTypes)];

    let overallLevel;
    if (uniquePrimary.length <= 2) overallLevel = '매우높음';
    else if (uniquePrimary.length <= 3) overallLevel = '높음';
    else overallLevel = '보통';

    return {
        sectionCodes,
        overallLevel,
        details: {
            personality: sectionCodes.personality || '--',
            ability: sectionCodes.ability || '--',
            interest: sectionCodes.interest || '--',
            value: sectionCodes.value || '--'
        }
    };
}

// 문/이과 성향 분석
function analyzeOrientation(answers, percentScores) {
    // 수학/과학 vs 국어/사회 문항
    const scienceScore = (percentScores['R'] + percentScores['I']) / 2;
    const humanScore = (percentScores['A'] + percentScores['S']) / 2;

    // 교과 성향 문항 반영
    const orientQ = answers['S124'];
    const orientValue = orientQ ? orientQ.value : 3;

    // 종합 판단
    const orientationScore = (scienceScore - humanScore) * 0.6 + (orientValue - 3) * 20 * 0.4;

    let orientation;
    if (orientationScore > 15) orientation = '이과';
    else if (orientationScore > 5) orientation = '이과 성향';
    else if (orientationScore > -5) orientation = '균형';
    else if (orientationScore > -15) orientation = '문과 성향';
    else orientation = '문과';

    return {
        score: Math.round(orientationScore),
        orientation,
        sciencePercent: Math.round(scienceScore),
        humanPercent: Math.round(humanScore)
    };
}

// 종합 분석 리포트 데이터 생성
function generateAnalysisData(studentAnswers, parentAnswers, studentInfo, gradeData) {
    const riasec = calculateRIASECScores(studentAnswers, STUDENT_QUESTIONS);
    const careerCode = determineCareerCode(riasec.percent);
    const accuracy = calculateAccuracy(studentAnswers);
    const careers = getRecommendedCareers(careerCode.code2);
    const departments = getRecommendedDepartments(careerCode.code2);
    const fieldScores = calculateFieldScores(riasec.percent);
    const strengths = generatePersonalityStrengths(careerCode.code2, riasec.percent);
    const consistency = calculateConsistencyLevels(riasec.sections);
    const orientation = analyzeOrientation(studentAnswers, riasec.percent);

    let parentAnalysis = null;
    if (parentAnswers) {
        parentAnalysis = calculateParentRIASECScores(parentAnswers);
    }

    return {
        studentInfo,
        gradeData,
        riasec,
        careerCode,
        accuracy,
        careers,
        departments,
        fieldScores,
        strengths,
        consistency,
        orientation,
        parentAnalysis,
        testDate: new Date().toISOString(),
        answeredCount: Object.keys(studentAnswers).length,
        totalQuestions: STUDENT_QUESTIONS.length
    };
}
