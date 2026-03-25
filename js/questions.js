// ==========================================
// Holland RIASEC 진로적성검사 - 대치코드
// ==========================================

// RIASEC 유형 정의
const RIASEC_TYPES = [
    {
        id: 'R', name: '실재형', nameEn: 'Realistic',
        icon: '🔧',
        color: '#3B82F6',
        description: '실용적이고 구체적인 활동을 좋아하며, 기계나 도구를 다루거나 자연 속에서 활동하는 것을 즐깁니다.',
        traits: ['실용적', '솔직한', '신체활동 선호', '기계/도구에 능숙', '자연 친화적']
    },
    {
        id: 'I', name: '탐구형', nameEn: 'Investigative',
        icon: '🔬',
        color: '#8B5CF6',
        description: '호기심이 많고 분석적이며, 문제를 논리적으로 풀어가는 것을 좋아합니다. 과학이나 수학에 흥미가 있습니다.',
        traits: ['분석적', '호기심 많은', '논리적', '독립적', '탐구적']
    },
    {
        id: 'A', name: '예술형', nameEn: 'Artistic',
        icon: '🎨',
        color: '#EC4899',
        description: '창의적이고 독창적이며, 예술적 표현이나 새로운 아이디어를 만드는 것을 좋아합니다.',
        traits: ['창의적', '독창적', '감성적', '자유로운', '상상력 풍부']
    },
    {
        id: 'S', name: '사회형', nameEn: 'Social',
        icon: '🤝',
        color: '#10B981',
        description: '다른 사람들과 어울리고 돕는 것을 좋아하며, 가르치거나 상담하는 활동에 보람을 느낍니다.',
        traits: ['친절한', '이해심 많은', '협력적', '봉사정신', '소통 능력']
    },
    {
        id: 'E', name: '기업형', nameEn: 'Enterprising',
        icon: '📊',
        color: '#F59E0B',
        description: '리더십이 있고 사람들을 설득하거나 이끄는 것을 잘합니다. 목표를 세우고 달성하는 데 열정적입니다.',
        traits: ['리더십', '설득력', '야심적', '경쟁적', '추진력']
    },
    {
        id: 'C', name: '관습형', nameEn: 'Conventional',
        icon: '📋',
        color: '#6366F1',
        description: '꼼꼼하고 체계적이며, 규칙에 따라 정확하게 일을 처리하는 것을 잘합니다.',
        traits: ['꼼꼼한', '체계적', '정확한', '규칙적', '신뢰할 수 있는']
    }
];

// 검사 섹션 정의
const ASSESSMENT_SECTIONS = [
    { id: 'personality', name: '성격 성향', icon: '😊', description: '나의 성격과 행동 패턴을 알아봅니다.' },
    { id: 'ability', name: '능력 자신감', icon: '💪', description: '내가 자신 있는 능력을 알아봅니다.' },
    { id: 'interest', name: '흥미와 관심', icon: '⭐', description: '내가 흥미를 느끼는 활동을 알아봅니다.' },
    { id: 'value', name: '직업 가치관', icon: '💎', description: '일할 때 중요하게 생각하는 것을 알아봅니다.' },
    { id: 'subject', name: '교과 성향', icon: '📚', description: '좋아하는 과목과 학습 스타일을 알아봅니다.' }
];

// ==========================================
// 학생용 검사 문항 (120문항 RIASEC + 15문항 교과/진로)
// ==========================================
const STUDENT_QUESTIONS = [
    // ========== 섹션 1: 성격 성향 (30문항, RIASEC 각 5문항) ==========
    // R 실재형 - 성격
    { id: 'S001', riasec: 'R', section: 'personality', text: '나는 직접 손으로 무언가를 만들거나 고치는 것을 좋아한다.', scale: 5 },
    { id: 'S002', riasec: 'R', section: 'personality', text: '나는 실내보다 야외에서 활동하는 것이 더 좋다.', scale: 5 },
    { id: 'S003', riasec: 'R', section: 'personality', text: '나는 말로 설명하는 것보다 직접 보여주는 것을 더 좋아한다.', scale: 5 },
    { id: 'S004', riasec: 'R', section: 'personality', text: '나는 복잡한 이론보다 실제로 쓸 수 있는 것에 관심이 많다.', scale: 5 },
    { id: 'S005', riasec: 'R', section: 'personality', text: '나는 체육 활동이나 운동을 하면 기분이 좋아진다.', scale: 5 },

    // I 탐구형 - 성격
    { id: 'S006', riasec: 'I', section: 'personality', text: '나는 궁금한 것이 생기면 끝까지 알아내려고 한다.', scale: 5 },
    { id: 'S007', riasec: 'I', section: 'personality', text: '나는 "왜?"라는 질문을 자주 한다.', scale: 5 },
    { id: 'S008', riasec: 'I', section: 'personality', text: '나는 혼자서 깊이 생각하는 시간이 좋다.', scale: 5 },
    { id: 'S009', riasec: 'I', section: 'personality', text: '나는 문제가 생기면 논리적으로 따져보는 편이다.', scale: 5 },
    { id: 'S010', riasec: 'I', section: 'personality', text: '나는 새로운 지식을 배우는 것 자체가 즐겁다.', scale: 5 },

    // A 예술형 - 성격
    { id: 'S011', riasec: 'A', section: 'personality', text: '나는 남들과 다른 나만의 방식이 있다.', scale: 5 },
    { id: 'S012', riasec: 'A', section: 'personality', text: '나는 상상하는 것을 좋아하고, 공상에 빠질 때가 있다.', scale: 5 },
    { id: 'S013', riasec: 'A', section: 'personality', text: '나는 아름다운 것(음악, 그림, 자연 등)을 보면 감동을 받는다.', scale: 5 },
    { id: 'S014', riasec: 'A', section: 'personality', text: '나는 규칙이나 틀에 맞추는 것보다 자유롭게 하는 게 좋다.', scale: 5 },
    { id: 'S015', riasec: 'A', section: 'personality', text: '나는 나만의 개성을 표현하는 것이 중요하다고 생각한다.', scale: 5 },

    // S 사회형 - 성격
    { id: 'S016', riasec: 'S', section: 'personality', text: '나는 친구가 힘들어하면 꼭 도와주고 싶다.', scale: 5 },
    { id: 'S017', riasec: 'S', section: 'personality', text: '나는 여러 사람과 함께 있을 때 에너지가 생긴다.', scale: 5 },
    { id: 'S018', riasec: 'S', section: 'personality', text: '나는 다른 사람의 이야기를 잘 들어주는 편이다.', scale: 5 },
    { id: 'S019', riasec: 'S', section: 'personality', text: '나는 다른 사람에게 무언가를 가르쳐주는 것이 즐겁다.', scale: 5 },
    { id: 'S020', riasec: 'S', section: 'personality', text: '나는 팀으로 함께 하는 활동이 혼자 하는 것보다 좋다.', scale: 5 },

    // E 기업형 - 성격
    { id: 'S021', riasec: 'E', section: 'personality', text: '나는 친구들 사이에서 자연스럽게 리더 역할을 맡는 편이다.', scale: 5 },
    { id: 'S022', riasec: 'E', section: 'personality', text: '나는 다른 사람을 설득하는 것을 잘한다고 생각한다.', scale: 5 },
    { id: 'S023', riasec: 'E', section: 'personality', text: '나는 목표를 세우면 꼭 이루고 싶은 마음이 강하다.', scale: 5 },
    { id: 'S024', riasec: 'E', section: 'personality', text: '나는 경쟁에서 이기면 아주 뿌듯하다.', scale: 5 },
    { id: 'S025', riasec: 'E', section: 'personality', text: '나는 새로운 프로젝트나 일을 시작하는 것이 신난다.', scale: 5 },

    // C 관습형 - 성격
    { id: 'S026', riasec: 'C', section: 'personality', text: '나는 내 방이나 가방을 깔끔하게 정리하는 편이다.', scale: 5 },
    { id: 'S027', riasec: 'C', section: 'personality', text: '나는 계획을 세우고 그대로 실행하는 것을 좋아한다.', scale: 5 },
    { id: 'S028', riasec: 'C', section: 'personality', text: '나는 실수 없이 정확하게 하는 것이 중요하다고 생각한다.', scale: 5 },
    { id: 'S029', riasec: 'C', section: 'personality', text: '나는 규칙을 잘 지키는 편이다.', scale: 5 },
    { id: 'S030', riasec: 'C', section: 'personality', text: '나는 시간표나 할 일 목록을 만들어두면 마음이 편하다.', scale: 5 },

    // ========== 섹션 2: 능력 자신감 (30문항, RIASEC 각 5문항) ==========
    // R 실재형 - 능력
    { id: 'S031', riasec: 'R', section: 'ability', text: '나는 조립이나 만들기 같은 손작업을 잘하는 편이다.', scale: 5 },
    { id: 'S032', riasec: 'R', section: 'ability', text: '나는 기계나 전자기기가 고장나면 어떻게 고쳐야 할지 감이 온다.', scale: 5 },
    { id: 'S033', riasec: 'R', section: 'ability', text: '나는 체력이 좋은 편이고, 운동 능력에 자신이 있다.', scale: 5 },
    { id: 'S034', riasec: 'R', section: 'ability', text: '나는 지도를 보거나 길을 찾는 것을 잘한다.', scale: 5 },
    { id: 'S035', riasec: 'R', section: 'ability', text: '나는 도구나 장비를 안전하게 다루는 법을 빨리 배운다.', scale: 5 },

    // I 탐구형 - 능력
    { id: 'S036', riasec: 'I', section: 'ability', text: '나는 수학 문제 푸는 것을 잘하는 편이다.', scale: 5 },
    { id: 'S037', riasec: 'I', section: 'ability', text: '나는 과학 실험에서 결과를 예측하는 것을 잘한다.', scale: 5 },
    { id: 'S038', riasec: 'I', section: 'ability', text: '나는 복잡한 정보를 분석하고 정리하는 능력이 있다.', scale: 5 },
    { id: 'S039', riasec: 'I', section: 'ability', text: '나는 컴퓨터 프로그래밍이나 코딩에 자신이 있다(또는 배우고 싶다).', scale: 5 },
    { id: 'S040', riasec: 'I', section: 'ability', text: '나는 그래프나 통계 자료를 읽고 해석하는 것을 잘한다.', scale: 5 },

    // A 예술형 - 능력
    { id: 'S041', riasec: 'A', section: 'ability', text: '나는 그림 그리기, 디자인, 또는 만들기에 소질이 있다.', scale: 5 },
    { id: 'S042', riasec: 'A', section: 'ability', text: '나는 글을 쓰거나 이야기를 만드는 것을 잘한다.', scale: 5 },
    { id: 'S043', riasec: 'A', section: 'ability', text: '나는 악기 연주나 노래를 잘하는 편이다.', scale: 5 },
    { id: 'S044', riasec: 'A', section: 'ability', text: '나는 사진이나 영상을 예쁘게 찍는 감각이 있다.', scale: 5 },
    { id: 'S045', riasec: 'A', section: 'ability', text: '나는 새롭고 독창적인 아이디어를 잘 떠올린다.', scale: 5 },

    // S 사회형 - 능력
    { id: 'S046', riasec: 'S', section: 'ability', text: '나는 다른 사람의 기분이나 감정을 잘 알아차린다.', scale: 5 },
    { id: 'S047', riasec: 'S', section: 'ability', text: '나는 친구들 사이에서 갈등이 생기면 잘 중재할 수 있다.', scale: 5 },
    { id: 'S048', riasec: 'S', section: 'ability', text: '나는 모르는 사람과도 빨리 친해질 수 있다.', scale: 5 },
    { id: 'S049', riasec: 'S', section: 'ability', text: '나는 동생이나 후배에게 공부를 가르쳐준 적이 있고, 잘 가르친다.', scale: 5 },
    { id: 'S050', riasec: 'S', section: 'ability', text: '나는 누군가의 고민을 들어주고 조언해주는 것을 잘한다.', scale: 5 },

    // E 기업형 - 능력
    { id: 'S051', riasec: 'E', section: 'ability', text: '나는 발표나 프레젠테이션을 할 때 자신감이 있다.', scale: 5 },
    { id: 'S052', riasec: 'E', section: 'ability', text: '나는 여러 사람을 모아서 일을 추진하는 것을 잘한다.', scale: 5 },
    { id: 'S053', riasec: 'E', section: 'ability', text: '나는 토론이나 논쟁에서 내 의견을 잘 주장한다.', scale: 5 },
    { id: 'S054', riasec: 'E', section: 'ability', text: '나는 무언가를 기획하고 계획을 세우는 것을 잘한다.', scale: 5 },
    { id: 'S055', riasec: 'E', section: 'ability', text: '나는 다른 사람의 마음을 바꾸도록 설득하는 데 자신이 있다.', scale: 5 },

    // C 관습형 - 능력
    { id: 'S056', riasec: 'C', section: 'ability', text: '나는 숫자나 데이터를 꼼꼼하게 정리하는 것을 잘한다.', scale: 5 },
    { id: 'S057', riasec: 'C', section: 'ability', text: '나는 엑셀이나 표를 만들어서 정리하는 것을 잘한다(또는 배우고 싶다).', scale: 5 },
    { id: 'S058', riasec: 'C', section: 'ability', text: '나는 실수를 잘 발견하고, 틀린 것을 고치는 것을 잘한다.', scale: 5 },
    { id: 'S059', riasec: 'C', section: 'ability', text: '나는 복잡한 것도 차근차근 단계별로 처리할 수 있다.', scale: 5 },
    { id: 'S060', riasec: 'C', section: 'ability', text: '나는 서류나 문서를 정확하게 작성하는 것을 잘한다.', scale: 5 },

    // ========== 섹션 3: 흥미와 관심 (30문항, RIASEC 각 5문항) ==========
    // R 실재형 - 흥미
    { id: 'S061', riasec: 'R', section: 'interest', text: '로봇이나 드론을 조립하고 작동시키는 것에 관심이 있다.', scale: 5 },
    { id: 'S062', riasec: 'R', section: 'interest', text: '요리, 목공, 3D 프린팅 같은 실습 활동이 재미있다.', scale: 5 },
    { id: 'S063', riasec: 'R', section: 'interest', text: '동물을 돌보거나 자연 탐험을 하는 것에 흥미가 있다.', scale: 5 },
    { id: 'S064', riasec: 'R', section: 'interest', text: '자동차, 비행기, 건축물 같은 것에 관심이 많다.', scale: 5 },
    { id: 'S065', riasec: 'R', section: 'interest', text: '캠핑, 등산, 스포츠 같은 야외 활동에 관심이 많다.', scale: 5 },

    // I 탐구형 - 흥미
    { id: 'S066', riasec: 'I', section: 'interest', text: '과학 다큐멘터리나 실험 영상을 보는 것이 재미있다.', scale: 5 },
    { id: 'S067', riasec: 'I', section: 'interest', text: '우주, 생명, 물질의 원리 같은 주제에 관심이 많다.', scale: 5 },
    { id: 'S068', riasec: 'I', section: 'interest', text: '수학 퍼즐이나 논리 문제를 푸는 것이 재미있다.', scale: 5 },
    { id: 'S069', riasec: 'I', section: 'interest', text: '인공지능(AI)이나 최신 기술에 대해 더 알고 싶다.', scale: 5 },
    { id: 'S070', riasec: 'I', section: 'interest', text: '실험을 설계하고 결과를 분석하는 것에 흥미가 있다.', scale: 5 },

    // A 예술형 - 흥미
    { id: 'S071', riasec: 'A', section: 'interest', text: '미술, 음악, 연극, 영화 같은 예술 활동에 관심이 많다.', scale: 5 },
    { id: 'S072', riasec: 'A', section: 'interest', text: '웹툰, 소설, 시 같은 창작 활동을 해보고 싶다(또는 하고 있다).', scale: 5 },
    { id: 'S073', riasec: 'A', section: 'interest', text: '패션, 인테리어, 디자인 분야에 관심이 있다.', scale: 5 },
    { id: 'S074', riasec: 'A', section: 'interest', text: '유튜브 영상을 만들거나 편집하는 것에 흥미가 있다.', scale: 5 },
    { id: 'S075', riasec: 'A', section: 'interest', text: '새롭고 독특한 아이디어를 생각해내는 것이 재미있다.', scale: 5 },

    // S 사회형 - 흥미
    { id: 'S076', riasec: 'S', section: 'interest', text: '봉사활동이나 남을 돕는 활동에 관심이 있다.', scale: 5 },
    { id: 'S077', riasec: 'S', section: 'interest', text: '심리학이나 사람의 마음에 대해 배우고 싶다.', scale: 5 },
    { id: 'S078', riasec: 'S', section: 'interest', text: '선생님이나 상담사처럼 사람을 돕는 직업에 관심이 있다.', scale: 5 },
    { id: 'S079', riasec: 'S', section: 'interest', text: '동아리나 학생회 같은 단체 활동에 관심이 많다.', scale: 5 },
    { id: 'S080', riasec: 'S', section: 'interest', text: '병원, 복지관 같은 곳에서 사람들을 돌보는 일에 관심이 있다.', scale: 5 },

    // E 기업형 - 흥미
    { id: 'S081', riasec: 'E', section: 'interest', text: '사업을 시작하거나 창업하는 것에 관심이 있다.', scale: 5 },
    { id: 'S082', riasec: 'E', section: 'interest', text: '학급 반장이나 회장 같은 리더 역할을 해보고 싶다.', scale: 5 },
    { id: 'S083', riasec: 'E', section: 'interest', text: '마케팅, 광고, 홍보 같은 분야에 관심이 있다.', scale: 5 },
    { id: 'S084', riasec: 'E', section: 'interest', text: '경제, 주식, 투자 같은 분야가 궁금하다.', scale: 5 },
    { id: 'S085', riasec: 'E', section: 'interest', text: '행사나 이벤트를 기획하고 운영하는 것이 재미있다.', scale: 5 },

    // C 관습형 - 흥미
    { id: 'S086', riasec: 'C', section: 'interest', text: '회계, 재무, 세금 같은 분야에 관심이 있다.', scale: 5 },
    { id: 'S087', riasec: 'C', section: 'interest', text: '데이터를 모으고, 정리하고, 분석하는 것에 흥미가 있다.', scale: 5 },
    { id: 'S088', riasec: 'C', section: 'interest', text: '법이나 규칙이 어떻게 만들어지는지 관심이 있다.', scale: 5 },
    { id: 'S089', riasec: 'C', section: 'interest', text: '공무원이나 안정적인 직업에 관심이 있다.', scale: 5 },
    { id: 'S090', riasec: 'C', section: 'interest', text: '도서관이나 박물관에서 자료를 정리하는 일이 재미있을 것 같다.', scale: 5 },

    // ========== 섹션 4: 직업 가치관 (30문항, RIASEC 각 5문항) ==========
    // R 실재형 - 가치
    { id: 'S091', riasec: 'R', section: 'value', text: '일할 때 눈에 보이는 결과물이 만들어지는 것이 중요하다.', scale: 5 },
    { id: 'S092', riasec: 'R', section: 'value', text: '일할 때 몸을 움직이며 활동적으로 일하고 싶다.', scale: 5 },
    { id: 'S093', riasec: 'R', section: 'value', text: '실용적이고 현실적인 결과를 만드는 일이 좋다.', scale: 5 },
    { id: 'S094', riasec: 'R', section: 'value', text: '자연 환경에서 일하거나, 환경을 보호하는 일이 가치 있다.', scale: 5 },
    { id: 'S095', riasec: 'R', section: 'value', text: '전문 기술을 가지고 있는 사람이 되고 싶다.', scale: 5 },

    // I 탐구형 - 가치
    { id: 'S096', riasec: 'I', section: 'value', text: '일할 때 새로운 것을 발견하거나 알아내는 것이 중요하다.', scale: 5 },
    { id: 'S097', riasec: 'I', section: 'value', text: '논리적이고 합리적인 방법으로 문제를 해결하고 싶다.', scale: 5 },
    { id: 'S098', riasec: 'I', section: 'value', text: '독립적으로 내 방식대로 일할 수 있는 환경이 좋다.', scale: 5 },
    { id: 'S099', riasec: 'I', section: 'value', text: '전문적인 지식을 깊이 쌓는 것이 중요하다.', scale: 5 },
    { id: 'S100', riasec: 'I', section: 'value', text: '진실을 밝히거나, 세상의 원리를 이해하는 일이 가치 있다.', scale: 5 },

    // A 예술형 - 가치
    { id: 'S101', riasec: 'A', section: 'value', text: '일할 때 나만의 창의성을 발휘할 수 있어야 한다.', scale: 5 },
    { id: 'S102', riasec: 'A', section: 'value', text: '아름답고 감동적인 것을 만드는 일이 가치 있다.', scale: 5 },
    { id: 'S103', riasec: 'A', section: 'value', text: '자유로운 분위기에서 일하는 것이 중요하다.', scale: 5 },
    { id: 'S104', riasec: 'A', section: 'value', text: '다른 사람들과 다른, 독특한 일을 하고 싶다.', scale: 5 },
    { id: 'S105', riasec: 'A', section: 'value', text: '내 작품이나 아이디어로 사람들에게 감동을 주고 싶다.', scale: 5 },

    // S 사회형 - 가치
    { id: 'S106', riasec: 'S', section: 'value', text: '일할 때 다른 사람에게 도움이 되는 것이 가장 보람 있다.', scale: 5 },
    { id: 'S107', riasec: 'S', section: 'value', text: '사회에 공헌하고 세상을 더 좋게 만드는 일이 가치 있다.', scale: 5 },
    { id: 'S108', riasec: 'S', section: 'value', text: '사람들과 함께 협력하며 일하는 것이 중요하다.', scale: 5 },
    { id: 'S109', riasec: 'S', section: 'value', text: '따뜻하고 친절한 분위기에서 일하고 싶다.', scale: 5 },
    { id: 'S110', riasec: 'S', section: 'value', text: '누군가의 성장이나 변화를 도울 수 있는 일이 좋다.', scale: 5 },

    // E 기업형 - 가치
    { id: 'S111', riasec: 'E', section: 'value', text: '일할 때 높은 지위나 영향력을 갖는 것이 중요하다.', scale: 5 },
    { id: 'S112', riasec: 'E', section: 'value', text: '성과를 인정받고 보상을 받는 것이 중요하다.', scale: 5 },
    { id: 'S113', riasec: 'E', section: 'value', text: '큰 프로젝트를 이끌고 결정을 내리는 것이 좋다.', scale: 5 },
    { id: 'S114', riasec: 'E', section: 'value', text: '경쟁에서 이기고 최고가 되고 싶다.', scale: 5 },
    { id: 'S115', riasec: 'E', section: 'value', text: '경제적으로 성공하고 부를 쌓는 것이 중요하다.', scale: 5 },

    // C 관습형 - 가치
    { id: 'S116', riasec: 'C', section: 'value', text: '일할 때 안정적이고 예측 가능한 환경이 좋다.', scale: 5 },
    { id: 'S117', riasec: 'C', section: 'value', text: '정확하고 실수 없이 일을 마무리하는 것이 중요하다.', scale: 5 },
    { id: 'S118', riasec: 'C', section: 'value', text: '체계적이고 질서 있는 조직에서 일하고 싶다.', scale: 5 },
    { id: 'S119', riasec: 'C', section: 'value', text: '명확한 규칙과 절차에 따라 일하는 것이 편하다.', scale: 5 },
    { id: 'S120', riasec: 'C', section: 'value', text: '신뢰받는 사람으로 인정받는 것이 중요하다.', scale: 5 },

    // ========== 섹션 5: 교과 성향 (15문항) ==========
    { id: 'S121', riasec: null, section: 'subject', subType: 'preference',
      text: '다음 과목 중 가장 좋아하는 과목은?',
      type: 'mc',
      options: [
          { text: '국어', tag: 'A' }, { text: '수학', tag: 'I' },
          { text: '영어', tag: 'C' }, { text: '과학', tag: 'I' },
          { text: '사회/역사', tag: 'S' }, { text: '체육', tag: 'R' },
          { text: '음악/미술', tag: 'A' }, { text: '기술/가정', tag: 'R' },
          { text: '정보(코딩)', tag: 'I' }
      ]
    },
    { id: 'S122', riasec: null, section: 'subject', subType: 'preference',
      text: '다음 과목 중 가장 잘하는 과목은?',
      type: 'mc',
      options: [
          { text: '국어', tag: 'A' }, { text: '수학', tag: 'I' },
          { text: '영어', tag: 'C' }, { text: '과학', tag: 'I' },
          { text: '사회/역사', tag: 'S' }, { text: '체육', tag: 'R' },
          { text: '음악/미술', tag: 'A' }, { text: '기술/가정', tag: 'R' },
          { text: '정보(코딩)', tag: 'I' }
      ]
    },
    { id: 'S123', riasec: null, section: 'subject', subType: 'preference',
      text: '다음 과목 중 가장 싫어하는 과목은?',
      type: 'mc',
      options: [
          { text: '국어', tag: 'A' }, { text: '수학', tag: 'I' },
          { text: '영어', tag: 'C' }, { text: '과학', tag: 'I' },
          { text: '사회/역사', tag: 'S' }, { text: '체육', tag: 'R' },
          { text: '음악/미술', tag: 'A' }, { text: '기술/가정', tag: 'R' },
          { text: '딱히 싫어하는 과목 없음', tag: null }
      ]
    },
    { id: 'S124', riasec: null, section: 'subject', text: '나는 수학/과학 계열 과목이 국어/사회 계열 과목보다 더 좋다.', scale: 5, subType: 'orientation' },
    { id: 'S125', riasec: null, section: 'subject', text: '나는 외국어(영어 등)를 배우는 것이 즐겁다.', scale: 5, subType: 'lang' },
    { id: 'S126', riasec: null, section: 'subject', text: '나는 실험이나 실습 수업이 이론 수업보다 더 재미있다.', scale: 5, subType: 'orientation' },
    { id: 'S127', riasec: null, section: 'subject', text: '나는 글을 읽고 분석하는 수업이 재미있다.', scale: 5, subType: 'orientation' },
    { id: 'S128', riasec: null, section: 'subject', text: '나는 토론이나 발표 수업에 적극적으로 참여한다.', scale: 5, subType: 'participation' },

    // 진로 관련 추가 문항
    { id: 'S129', riasec: null, section: 'subject', subType: 'career_interest',
      text: '다음 중 가장 끌리는 분야는?',
      type: 'mc',
      options: [
          { text: '공학/기술 (로봇, 건축, 자동차)', tag: 'R' },
          { text: '자연과학 (물리, 화학, 생물, 우주)', tag: 'I' },
          { text: '예술/디자인 (미술, 음악, 영화, 패션)', tag: 'A' },
          { text: '교육/복지 (선생님, 상담사, 사회복지)', tag: 'S' },
          { text: '경영/경제 (사업, 마케팅, 금융)', tag: 'E' },
          { text: '행정/법률 (공무원, 법조인, 회계사)', tag: 'C' }
      ]
    },
    { id: 'S130', riasec: null, section: 'subject', subType: 'career_interest',
      text: '다음 중 두 번째로 끌리는 분야는?',
      type: 'mc',
      options: [
          { text: '공학/기술 (로봇, 건축, 자동차)', tag: 'R' },
          { text: '자연과학 (물리, 화학, 생물, 우주)', tag: 'I' },
          { text: '예술/디자인 (미술, 음악, 영화, 패션)', tag: 'A' },
          { text: '교육/복지 (선생님, 상담사, 사회복지)', tag: 'S' },
          { text: '경영/경제 (사업, 마케팅, 금융)', tag: 'E' },
          { text: '행정/법률 (공무원, 법조인, 회계사)', tag: 'C' },
          { text: '의학/보건 (의사, 간호사, 약사)', tag: 'I' }
      ]
    },
    { id: 'S131', riasec: null, section: 'subject',
      text: '장래에 되고 싶은 직업이 있다면 적어주세요. (없으면 비워두세요)',
      type: 'short', subType: 'dream_job' },
    { id: 'S132', riasec: null, section: 'subject',
      text: '관심 있는 대학 학과가 있다면 적어주세요. (없으면 비워두세요)',
      type: 'short', subType: 'dream_major' },
    { id: 'S133', riasec: null, section: 'subject', text: '나는 나의 진로에 대해 구체적으로 생각해본 적이 있다.', scale: 5, subType: 'career_clarity' },
    { id: 'S134', riasec: null, section: 'subject', text: '나는 나의 꿈이나 목표가 자주 바뀌는 편이다.', scale: 5, subType: 'career_consistency', reverse: true },
    { id: 'S135', riasec: null, section: 'subject', text: '나는 공부하는 것이 미래를 위해 중요하다고 생각한다.', scale: 5, subType: 'study_motivation' }
];

// ==========================================
// 학부모용 검사 문항 (30문항)
// ==========================================
const PARENT_QUESTIONS = [
    // 자녀 관찰 성향 (RIASEC 관련 12문항)
    { id: 'P001', category: 'observation', riasec: 'R',
      text: '우리 아이는 손으로 무언가를 만들거나 조립하는 활동을 좋아합니다.', scale: 5 },
    { id: 'P002', category: 'observation', riasec: 'I',
      text: '우리 아이는 궁금한 것이 있으면 스스로 찾아보고 탐구하는 편입니다.', scale: 5 },
    { id: 'P003', category: 'observation', riasec: 'A',
      text: '우리 아이는 그림, 음악, 글쓰기 등 창작 활동에 재능이나 관심이 있습니다.', scale: 5 },
    { id: 'P004', category: 'observation', riasec: 'S',
      text: '우리 아이는 친구들과 잘 어울리고, 다른 사람을 배려하는 편입니다.', scale: 5 },
    { id: 'P005', category: 'observation', riasec: 'E',
      text: '우리 아이는 또래 친구들 사이에서 리더 역할을 자주 맡습니다.', scale: 5 },
    { id: 'P006', category: 'observation', riasec: 'C',
      text: '우리 아이는 물건이나 자료를 체계적으로 정리하는 편입니다.', scale: 5 },
    { id: 'P007', category: 'observation', riasec: 'R',
      text: '우리 아이는 야외 활동이나 체육 활동을 즐깁니다.', scale: 5 },
    { id: 'P008', category: 'observation', riasec: 'I',
      text: '우리 아이는 수학이나 과학 과목에서 두각을 나타냅니다.', scale: 5 },
    { id: 'P009', category: 'observation', riasec: 'A',
      text: '우리 아이는 독특하고 창의적인 생각을 자주 합니다.', scale: 5 },
    { id: 'P010', category: 'observation', riasec: 'S',
      text: '우리 아이는 봉사활동이나 남을 돕는 일에 관심이 많습니다.', scale: 5 },
    { id: 'P011', category: 'observation', riasec: 'E',
      text: '우리 아이는 경쟁 상황에서 승부욕이 강한 편입니다.', scale: 5 },
    { id: 'P012', category: 'observation', riasec: 'C',
      text: '우리 아이는 계획을 세우고 그대로 실행하려고 노력합니다.', scale: 5 },

    // 교육 환경/지원 (10문항)
    { id: 'P013', category: 'support',
      text: '자녀의 교육을 위해 충분한 경제적 투자를 할 의향이 있다.', scale: 5 },
    { id: 'P014', category: 'support',
      text: '자녀의 학습 활동(숙제, 시험 준비 등)에 적극적으로 관여하고 있다.', scale: 5 },
    { id: 'P015', category: 'support',
      text: '자녀에게 조용하고 집중할 수 있는 학습 공간이 마련되어 있다.', scale: 5 },
    { id: 'P016', category: 'support',
      text: '자녀가 원하는 학원이나 과외를 충분히 지원할 수 있다.', scale: 5 },
    { id: 'P017', category: 'support',
      text: '자녀의 진로에 대해 가족 간 대화를 자주 나누는 편이다.', scale: 5 },
    { id: 'P018', category: 'support',
      text: '자녀가 다양한 체험활동(캠프, 박람회, 직업체험 등)에 참여할 수 있도록 지원하고 있다.', scale: 5 },
    { id: 'P019', category: 'support',
      text: '가정 내에서 독서나 학습 분위기가 잘 형성되어 있다.', scale: 5 },
    { id: 'P020', category: 'support',
      text: '자녀의 학교생활과 교우관계에 관심을 가지고 있다.', scale: 5 },
    { id: 'P021', category: 'support',
      text: '자녀의 적성과 흥미를 존중하여 진로를 선택하도록 지원할 것이다.', scale: 5 },
    { id: 'P022', category: 'support',
      text: '필요하다면 자녀의 교육을 위해 이사나 생활 변화도 고려할 수 있다.', scale: 5 },

    // 진로 관련 (8문항)
    { id: 'P023', category: 'career',
      text: '자녀가 특별히 관심을 보이는 직업 분야가 있다.',
      type: 'mc',
      options: [
          { text: '공학/기술', tag: 'R' }, { text: '자연과학/의학', tag: 'I' },
          { text: '예술/디자인', tag: 'A' }, { text: '교육/사회복지', tag: 'S' },
          { text: '경영/경제', tag: 'E' }, { text: '행정/법률', tag: 'C' },
          { text: '아직 잘 모르겠다', tag: null }
      ]
    },
    { id: 'P024', category: 'career',
      text: '자녀의 진로 방향에 대해 부모로서 얼마나 확신이 있는지 알려주세요.', scale: 5,
      labels: ['전혀 모르겠다', '매우 확신한다'] },
    { id: 'P025', category: 'career',
      text: '자녀가 문과/이과 중 어느 쪽에 더 적합하다고 생각하십니까?', scale: 5,
      labels: ['확실히 문과', '확실히 이과'] },
    { id: 'P026', category: 'career',
      text: '자녀의 자기주도 학습 능력은 어느 수준이라고 생각하십니까?', scale: 5,
      labels: ['매우 부족', '매우 우수'] },
    { id: 'P027', category: 'career',
      text: '자녀가 스트레스나 경쟁 상황을 잘 견디는 편입니까?', scale: 5,
      labels: ['매우 약함', '매우 강함'] },
    { id: 'P028', category: 'career',
      text: '자녀의 전반적인 학업 성취도는 어느 수준입니까?', scale: 5,
      labels: ['하위', '최상위'] },
    { id: 'P029', category: 'career',
      text: '자녀에게 바라는 대학 수준이 있습니까?',
      type: 'mc',
      options: [
          { text: 'SKY (서울대, 고려대, 연세대)', score: 5 },
          { text: '상위권 대학 (서성한, 중경외시 등)', score: 4 },
          { text: '중상위권 대학', score: 3 },
          { text: '대학보다 자녀의 적성이 중요', score: 2 },
          { text: '대학 진학을 꼭 고집하지 않음', score: 1 }
      ]
    },
    { id: 'P030', category: 'career',
      text: '자녀의 교육과 관련하여 추가로 알려주고 싶은 점이 있다면 적어주세요.',
      type: 'short' }
];

// ==========================================
// 교차 검증 쌍 (응답 일관성 검사)
// ==========================================
const CROSS_VALIDATION_PAIRS = [
    // 같은 RIASEC, 같은 방향 → 비슷한 답이어야 함
    { q1: 'S001', q2: 'S031', type: 'same' }, // R 성격 ↔ R 능력
    { q1: 'S006', q2: 'S036', type: 'same' }, // I 성격 ↔ I 능력
    { q1: 'S011', q2: 'S041', type: 'same' }, // A 성격 ↔ A 능력
    { q1: 'S016', q2: 'S046', type: 'same' }, // S 성격 ↔ S 능력
    { q1: 'S021', q2: 'S051', type: 'same' }, // E 성격 ↔ E 능력
    { q1: 'S026', q2: 'S056', type: 'same' }, // C 성격 ↔ C 능력
    { q1: 'S002', q2: 'S065', type: 'same' }, // R 야외성격 ↔ R 야외흥미
    { q1: 'S007', q2: 'S066', type: 'same' }, // I 호기심 ↔ I 과학흥미
    { q1: 'S013', q2: 'S071', type: 'same' }, // A 감동 ↔ A 예술흥미
    { q1: 'S017', q2: 'S076', type: 'same' }, // S 어울림 ↔ S 봉사흥미
    { q1: 'S023', q2: 'S081', type: 'same' }, // E 목표 ↔ E 사업흥미
    { q1: 'S027', q2: 'S116', type: 'same' }, // C 계획 ↔ C 안정가치
    // 성격 ↔ 흥미 비교
    { q1: 'S003', q2: 'S062', type: 'same' }, // R
    { q1: 'S010', q2: 'S067', type: 'same' }, // I
    { q1: 'S015', q2: 'S075', type: 'same' }, // A
    { q1: 'S020', q2: 'S079', type: 'same' }, // S
    { q1: 'S025', q2: 'S085', type: 'same' }, // E
    { q1: 'S029', q2: 'S119', type: 'same' }, // C
    // 진로 일관성
    { q1: 'S133', q2: 'S134', type: 'reverse' }  // 진로확신 ↔ 꿈변경(역코딩)
];

// ==========================================
// RIASEC 코드별 추천 직업 및 학과 매핑
// ==========================================
const CAREER_DATABASE = {
    // 단일 코드별 직무 분야
    fields: {
        R: ['기계공학', '건축', '토목', '농업', '임업', '체육', '군사', '항공', '해양', '전기전자', '자동차', '환경'],
        I: ['자연과학', '의학', '약학', '수학', '컴퓨터과학', '생명과학', '물리학', '화학', '천문학', '통계학', '데이터과학'],
        A: ['미술', '음악', '디자인', '영화', '방송', '문학', '연극', '사진', '건축디자인', '패션', '애니메이션', '게임디자인'],
        S: ['교육', '상담심리', '사회복지', '간호', '재활', '종교', '청소년지도', '특수교육', '보건', '아동'],
        E: ['경영', '마케팅', '법률', '정치', '외교', '무역', '부동산', '금융', '창업', '언론', '광고', '이벤트기획'],
        C: ['회계', '세무', '행정', '금융', '보험', '물류', '사서', '비서', '감사', '통관', '문서관리', '공무원']
    },

    // 2코드 조합별 추천 직업
    careers: {
        'RI': ['기계공학자', '로봇공학자', '항공우주공학자', '전기전자기술자', '자동차설계사', '건축공학자', 'IT기술자'],
        'RA': ['건축가', '산업디자이너', '조경사', '인테리어디자이너', '가구디자이너', '공예가'],
        'RS': ['체육교사', '물리치료사', '작업치료사', '소방관', '경찰관', '군인', '운동코치'],
        'RE': ['건설관리자', '농업경영인', '스포츠매니저', '시설관리자'],
        'RC': ['항공정비사', '자동차정비사', '전기기사', '측량기사', '품질관리기사'],
        'IR': ['의공학자', '재료공학자', '환경공학자', '생명공학자', '에너지공학자'],
        'IA': ['건축설계사', 'UX디자이너', '사운드엔지니어', '과학일러스트레이터'],
        'IS': ['의사', '임상심리전문가', '수의사', '언어치료사', '영양사', '보건교육사'],
        'IE': ['기술경영자', '벤처기업가', 'IT컨설턴트', '데이터분석가', '기술영업'],
        'IC': ['약사', '치과의사', '한의사', '병리학자', '법의학자', '감정평가사'],
        'AR': ['제품디자이너', '쥬얼리디자이너', '도예가', '조각가', '무대디자이너'],
        'AI': ['과학저널리스트', '게임기획자', '교육콘텐츠개발자', 'CGI아티스트'],
        'AS': ['음악치료사', '미술치료사', '방과후교사', '문화기획자', '사회적기업가'],
        'AE': ['광고기획자', '방송PD', '영화감독', '뮤지컬프로듀서', '패션머천다이저', '콘텐츠크리에이터'],
        'AC': ['편집디자이너', '웹디자이너', '카피라이터', '출판편집자', '큐레이터'],
        'SR': ['간호사', '응급구조사', '재활치료사', '스포츠트레이너', '안전관리사'],
        'SI': ['심리학자', '교육연구자', '보건연구원', '의료사회복지사', '카운슬러'],
        'SA': ['음악교사', '미술교사', '연극치료사', '문화예술교육사', '유아교사'],
        'SE': ['학교상담사', '사회복지관장', '비영리단체장', 'HR담당자', '교육컨설턴트'],
        'SC': ['의무기록사', '보건행정가', '학교행정직원', '사회조사분석사'],
        'ER': ['건설회사CEO', '스포츠에이전트', '부동산개발자', '물류회사경영'],
        'EI': ['제약회사경영', '기술스타트업CEO', '바이오벤처대표', 'CTO'],
        'EA': ['엔터테인먼트CEO', '갤러리운영자', '이벤트기획사대표', '미디어경영'],
        'ES': ['교육기업CEO', '의료원장', '변호사', '정치인', '외교관', '사회적기업CEO'],
        'EC': ['회계법인대표', '금융회사경영', '보험회사경영', 'CFO', '세무사'],
        'CR': ['전산관리자', '네트워크엔지니어', '시스템관리자', '기술문서작성자'],
        'CI': ['데이터엔지니어', '통계분석가', '재무분석가', '보험계리사', '감사관'],
        'CA': ['웹퍼블리셔', '타이포그래피디자이너', '악보편집자', '도서관사서'],
        'CS': ['의무행정사', '교육행정직', '사회복지행정가', '고용서비스전문가'],
        'CE': ['은행원', '증권분석사', '세무사', '관세사', '공인회계사', '법무사'],
    },

    // 2코드 조합별 추천 대학 학과
    departments: {
        'RI': ['기계공학과', '로봇공학과', '전기전자공학과', '항공우주공학과', '자동차공학과', '컴퓨터공학과', '메카트로닉스공학과', '조선해양공학과', '산업공학과', '재료공학과'],
        'RA': ['건축학과', '산업디자인학과', '조경학과', '실내건축학과', '도시공학과'],
        'RS': ['체육교육과', '물리치료학과', '작업치료학과', '스포츠과학과', '군사학과', '경호학과', '소방방재학과'],
        'RE': ['건설경영공학과', '농업경제학과', '스포츠경영학과', '물류학과'],
        'RC': ['항공정비학과', '자동차정비학과', '전기공학과', '토목공학과', '환경공학과', '측지정보공학과'],
        'IR': ['의공학과', '신소재공학과', '환경공학과', '생명공학과', '에너지공학과', '나노공학과'],
        'IA': ['건축공학과', '멀티미디어공학과', '게임공학과', '인터랙션디자인학과'],
        'IS': ['의학과', '치의학과', '한의학과', '수의학과', '임상심리학과', '언어치료학과', '식품영양학과', '보건학과', '간호학과'],
        'IE': ['경영공학과', '기술경영학과', '산업경영공학과', 'IT경영학과', '정보시스템학과'],
        'IC': ['약학과', '임상병리학과', '법과학과', '통계학과', '수학과', '물리학과', '화학과', '생물학과', '천문학과'],
        'AR': ['도예학과', '조소학과', '금속공예학과', '가구디자인학과', '섬유공예학과'],
        'AI': ['디지털미디어학과', '게임디자인학과', '과학커뮤니케이션학과', '콘텐츠학과'],
        'AS': ['음악치료학과', '미술치료학과', '아동미술학과', '문화예술경영학과', '공연예술학과'],
        'AE': ['광고홍보학과', '방송영상학과', '영화학과', '시각디자인학과', '패션디자인학과', '연극영화학과', '실용음악과', '문화콘텐츠학과'],
        'AC': ['시각디자인학과', '편집디자인학과', '출판학과', '웹디자인학과', '미술사학과'],
        'SR': ['간호학과', '응급구조학과', '재활학과', '특수체육학과', '안전공학과'],
        'SI': ['심리학과', '교육학과', '보건교육학과', '아동학과', '상담심리학과', '사회복지학과'],
        'SA': ['음악교육과', '미술교육과', '유아교육과', '특수교육과', '무용학과'],
        'SE': ['교육공학과', '사회복지학과', '행정학과', '인적자원개발학과', '평생교육학과', '국어교육과', '영어교육과'],
        'SC': ['보건행정학과', '의무기록학과', '사회조사학과', '교육행정학과'],
        'ER': ['부동산학과', '도시계획학과', '건설경영학과', '물류학과'],
        'EI': ['경영학과(기술경영)', '바이오산업학과', '정보통신학과'],
        'EA': ['문화산업학과', '엔터테인먼트학과', '미디어커뮤니케이션학과', '스포츠마케팅학과'],
        'ES': ['법학과', '정치외교학과', '행정학과', '사회학과', '교육학과', '경영학과', '국제학과', '외교학과'],
        'EC': ['경영학과', '경제학과', '회계학과', '금융학과', '세무학과', '무역학과', '보험학과'],
        'CR': ['정보통신공학과', '네트워크학과', '시스템공학과', '컴퓨터공학과'],
        'CI': ['통계학과', '데이터사이언스학과', '보험계리학과', '수리과학과', '정보보안학과'],
        'CA': ['문헌정보학과', '기록관리학과', '디지털아카이빙학과'],
        'CS': ['사회복지행정학과', '교육행정학과', '보건행정학과'],
        'CE': ['회계학과', '세무학과', '금융학과', '경제학과', '경영정보학과', '관세학과', '법학과', '행정학과']
    },

    // 직무분야별 적합도 매핑 (RIASEC 타입별 가중치)
    fieldScores: {
        '인문/철학/역사/언어/문화': { R: 0, I: 30, A: 60, S: 30, E: 10, C: 20 },
        '외국어/국제학/여행': { R: 0, I: 20, A: 30, S: 40, E: 50, C: 30 },
        '교육/사회/심리/간호/건강/종교': { R: 10, I: 30, A: 20, S: 80, E: 20, C: 20 },
        '사무/행정/법률/경영/무역/보험/정치/행정': { R: 0, I: 10, A: 0, S: 20, E: 60, C: 70 },
        '식품/요리/영양/방역/위생/보건': { R: 40, I: 40, A: 20, S: 40, E: 10, C: 30 },
        '의학/약학/치의학/한의학': { R: 20, I: 70, A: 0, S: 50, E: 20, C: 30 },
        '컴퓨터/전산/정보/문헌/수학/통계/인터넷/게임': { R: 30, I: 70, A: 30, S: 10, E: 20, C: 50 },
        '공업/기계/전기/전자/화학/물리/해양/통신': { R: 70, I: 60, A: 10, S: 0, E: 10, C: 30 },
        '농업/축산/수산/어업/원예/임업/환경/물류': { R: 70, I: 30, A: 10, S: 10, E: 20, C: 20 },
        '체육/스포츠/생활체육/미용/무술/무용': { R: 60, I: 10, A: 40, S: 30, E: 30, C: 10 },
        '순수예술/미술/음악/문학': { R: 10, I: 10, A: 90, S: 10, E: 10, C: 10 },
        '응용예술/디자인/산업/건축/공예/도예': { R: 40, I: 20, A: 70, S: 10, E: 20, C: 20 },
        '종합예술/연예/영화/방송/애니메이션/만화': { R: 20, I: 10, A: 70, S: 30, E: 40, C: 10 },
        '군인/부사관/육사/공사/해사/경찰/철도': { R: 60, I: 20, A: 0, S: 30, E: 40, C: 50 }
    }
};

// ==========================================
// 미취학 / 초등 1~3학년용 검사 문항 (60문항)
// 쉬운 언어, 구체적 활동 중심, 3점 척도
// ==========================================
const YOUNG_ASSESSMENT_SECTIONS = [
    { id: 'like', name: '좋아하는 것', icon: '😊', description: '내가 좋아하는 활동을 알아봅니다.' },
    { id: 'good', name: '잘하는 것', icon: '💪', description: '내가 잘하는 것을 알아봅니다.' },
    { id: 'want', name: '하고 싶은 것', icon: '⭐', description: '앞으로 해보고 싶은 것을 알아봅니다.' }
];

const YOUNG_QUESTIONS = [
    // ========== 좋아하는 것 (30문항, RIASEC 각 5문항) ==========
    // R 실재형
    { id: 'Y001', riasec: 'R', section: 'like', text: '레고나 블록으로 뭔가를 만드는 게 좋아요.', scale: 3 },
    { id: 'Y002', riasec: 'R', section: 'like', text: '밖에서 뛰어놀거나 운동하는 게 좋아요.', scale: 3 },
    { id: 'Y003', riasec: 'R', section: 'like', text: '장난감을 분해하거나 어떻게 생겼는지 살펴보는 게 재미있어요.', scale: 3 },
    { id: 'Y004', riasec: 'R', section: 'like', text: '동물이나 곤충을 관찰하는 게 좋아요.', scale: 3 },
    { id: 'Y005', riasec: 'R', section: 'like', text: '요리하거나 만들기 같은 활동이 재미있어요.', scale: 3 },

    // I 탐구형
    { id: 'Y006', riasec: 'I', section: 'like', text: '"왜?"라고 궁금한 게 많아요.', scale: 3 },
    { id: 'Y007', riasec: 'I', section: 'like', text: '과학 실험이나 관찰하는 게 재미있어요.', scale: 3 },
    { id: 'Y008', riasec: 'I', section: 'like', text: '퍼즐이나 수수께끼 푸는 게 좋아요.', scale: 3 },
    { id: 'Y009', riasec: 'I', section: 'like', text: '새로운 것을 배우면 기분이 좋아요.', scale: 3 },
    { id: 'Y010', riasec: 'I', section: 'like', text: '숫자를 세거나 계산하는 게 재미있어요.', scale: 3 },

    // A 예술형
    { id: 'Y011', riasec: 'A', section: 'like', text: '그림 그리기가 좋아요.', scale: 3 },
    { id: 'Y012', riasec: 'A', section: 'like', text: '노래 부르거나 춤추는 게 좋아요.', scale: 3 },
    { id: 'Y013', riasec: 'A', section: 'like', text: '이야기를 만들거나 상상하는 게 재미있어요.', scale: 3 },
    { id: 'Y014', riasec: 'A', section: 'like', text: '예쁜 것, 멋진 것을 보면 기분이 좋아요.', scale: 3 },
    { id: 'Y015', riasec: 'A', section: 'like', text: '나만의 방식으로 꾸미거나 만드는 게 좋아요.', scale: 3 },

    // S 사회형
    { id: 'Y016', riasec: 'S', section: 'like', text: '친구들과 함께 노는 게 좋아요.', scale: 3 },
    { id: 'Y017', riasec: 'S', section: 'like', text: '누군가를 도와주면 기분이 좋아요.', scale: 3 },
    { id: 'Y018', riasec: 'S', section: 'like', text: '동생이나 친구에게 무언가를 알려주는 게 좋아요.', scale: 3 },
    { id: 'Y019', riasec: 'S', section: 'like', text: '슬픈 친구를 보면 위로해주고 싶어요.', scale: 3 },
    { id: 'Y020', riasec: 'S', section: 'like', text: '여러 명이 함께 하는 놀이가 좋아요.', scale: 3 },

    // E 기업형
    { id: 'Y021', riasec: 'E', section: 'like', text: '놀이할 때 내가 먼저 "이렇게 하자!"라고 말할 때가 많아요.', scale: 3 },
    { id: 'Y022', riasec: 'E', section: 'like', text: '게임에서 이기면 아주 기분이 좋아요.', scale: 3 },
    { id: 'Y023', riasec: 'E', section: 'like', text: '친구들 앞에서 발표하는 것이 무섭지 않아요.', scale: 3 },
    { id: 'Y024', riasec: 'E', section: 'like', text: '가게 놀이나 사장님 놀이가 재미있어요.', scale: 3 },
    { id: 'Y025', riasec: 'E', section: 'like', text: '새로운 놀이를 만들어서 친구들에게 알려주는 게 좋아요.', scale: 3 },

    // C 관습형
    { id: 'Y026', riasec: 'C', section: 'like', text: '내 물건을 깔끔하게 정리하는 게 좋아요.', scale: 3 },
    { id: 'Y027', riasec: 'C', section: 'like', text: '색칠하기를 할 때 선 밖으로 안 나가게 하려고 해요.', scale: 3 },
    { id: 'Y028', riasec: 'C', section: 'like', text: '규칙을 잘 지키는 편이에요.', scale: 3 },
    { id: 'Y029', riasec: 'C', section: 'like', text: '스티커나 카드를 모으고 정리하는 게 좋아요.', scale: 3 },
    { id: 'Y030', riasec: 'C', section: 'like', text: '차례대로 줄 서서 기다리는 건 괜찮아요.', scale: 3 },

    // ========== 잘하는 것 (18문항, RIASEC 각 3문항) ==========
    // R
    { id: 'Y031', riasec: 'R', section: 'good', text: '나는 달리기나 운동을 잘하는 편이에요.', scale: 3 },
    { id: 'Y032', riasec: 'R', section: 'good', text: '나는 손으로 만들기를 잘해요.', scale: 3 },
    { id: 'Y033', riasec: 'R', section: 'good', text: '나는 길을 잘 찾거나 방향 감각이 좋아요.', scale: 3 },
    // I
    { id: 'Y034', riasec: 'I', section: 'good', text: '나는 수학 문제를 잘 푸는 편이에요.', scale: 3 },
    { id: 'Y035', riasec: 'I', section: 'good', text: '나는 무언가를 자세히 관찰하는 걸 잘해요.', scale: 3 },
    { id: 'Y036', riasec: 'I', section: 'good', text: '나는 이유를 생각해서 설명하는 걸 잘해요.', scale: 3 },
    // A
    { id: 'Y037', riasec: 'A', section: 'good', text: '나는 그림을 잘 그려요.', scale: 3 },
    { id: 'Y038', riasec: 'A', section: 'good', text: '나는 재미있는 이야기를 잘 만들어요.', scale: 3 },
    { id: 'Y039', riasec: 'A', section: 'good', text: '나는 노래를 잘 부르거나 악기를 잘 다뤄요.', scale: 3 },
    // S
    { id: 'Y040', riasec: 'S', section: 'good', text: '나는 친구를 잘 사귀어요.', scale: 3 },
    { id: 'Y041', riasec: 'S', section: 'good', text: '나는 친구 사이에서 싸움을 잘 말려요.', scale: 3 },
    { id: 'Y042', riasec: 'S', section: 'good', text: '나는 다른 사람의 기분을 잘 알아차려요.', scale: 3 },
    // E
    { id: 'Y043', riasec: 'E', section: 'good', text: '나는 친구들에게 내 생각을 잘 말해요.', scale: 3 },
    { id: 'Y044', riasec: 'E', section: 'good', text: '나는 모둠 활동에서 역할을 잘 나눠요.', scale: 3 },
    { id: 'Y045', riasec: 'E', section: 'good', text: '나는 여러 사람 앞에서 말하는 게 잘 돼요.', scale: 3 },
    // C
    { id: 'Y046', riasec: 'C', section: 'good', text: '나는 받아쓰기를 잘하는 편이에요.', scale: 3 },
    { id: 'Y047', riasec: 'C', section: 'good', text: '나는 실수 없이 꼼꼼하게 하는 걸 잘해요.', scale: 3 },
    { id: 'Y048', riasec: 'C', section: 'good', text: '나는 준비물을 빠뜨리지 않고 잘 챙겨요.', scale: 3 },

    // ========== 하고 싶은 것 (12문항, RIASEC 각 2문항) ==========
    // R
    { id: 'Y049', riasec: 'R', section: 'want', text: '로봇이나 자동차를 직접 만들어보고 싶어요.', scale: 3 },
    { id: 'Y050', riasec: 'R', section: 'want', text: '농장에서 동물을 돌보는 일을 해보고 싶어요.', scale: 3 },
    // I
    { id: 'Y051', riasec: 'I', section: 'want', text: '과학자처럼 실험을 해보고 싶어요.', scale: 3 },
    { id: 'Y052', riasec: 'I', section: 'want', text: '우주나 바다 속을 탐험해보고 싶어요.', scale: 3 },
    // A
    { id: 'Y053', riasec: 'A', section: 'want', text: '만화나 애니메이션을 만들어보고 싶어요.', scale: 3 },
    { id: 'Y054', riasec: 'A', section: 'want', text: '무대에서 연기하거나 공연해보고 싶어요.', scale: 3 },
    // S
    { id: 'Y055', riasec: 'S', section: 'want', text: '선생님처럼 다른 사람을 가르쳐보고 싶어요.', scale: 3 },
    { id: 'Y056', riasec: 'S', section: 'want', text: '아픈 사람을 도와주는 일을 해보고 싶어요.', scale: 3 },
    // E
    { id: 'Y057', riasec: 'E', section: 'want', text: '나만의 가게나 회사를 만들어보고 싶어요.', scale: 3 },
    { id: 'Y058', riasec: 'E', section: 'want', text: '유튜브 채널을 만들어서 사람들에게 보여주고 싶어요.', scale: 3 },
    // C
    { id: 'Y059', riasec: 'C', section: 'want', text: '컴퓨터로 자료를 정리하는 일을 해보고 싶어요.', scale: 3 },
    { id: 'Y060', riasec: 'C', section: 'want', text: '도서관에서 책을 정리하는 일을 해보고 싶어요.', scale: 3 }
];

// 미취학/초1~3 학부모용 검사 (20문항)
const YOUNG_PARENT_QUESTIONS = [
    // 자녀 관찰 RIASEC (12문항)
    { id: 'YP01', category: 'observation', riasec: 'R', text: '우리 아이는 블록이나 조립 장난감을 좋아합니다.', scale: 5 },
    { id: 'YP02', category: 'observation', riasec: 'R', text: '우리 아이는 야외 활동이나 체육을 좋아합니다.', scale: 5 },
    { id: 'YP03', category: 'observation', riasec: 'I', text: '우리 아이는 "왜?"라는 질문을 자주 합니다.', scale: 5 },
    { id: 'YP04', category: 'observation', riasec: 'I', text: '우리 아이는 숫자나 과학적인 것에 관심이 많습니다.', scale: 5 },
    { id: 'YP05', category: 'observation', riasec: 'A', text: '우리 아이는 그림 그리기, 만들기, 노래 등 예술 활동을 좋아합니다.', scale: 5 },
    { id: 'YP06', category: 'observation', riasec: 'A', text: '우리 아이는 상상력이 풍부하고 독창적인 편입니다.', scale: 5 },
    { id: 'YP07', category: 'observation', riasec: 'S', text: '우리 아이는 다른 아이들과 잘 어울리고 배려심이 있습니다.', scale: 5 },
    { id: 'YP08', category: 'observation', riasec: 'S', text: '우리 아이는 동생이나 친구를 도와주려고 합니다.', scale: 5 },
    { id: 'YP09', category: 'observation', riasec: 'E', text: '우리 아이는 또래 사이에서 리더 역할을 맡으려 합니다.', scale: 5 },
    { id: 'YP10', category: 'observation', riasec: 'E', text: '우리 아이는 승부욕이 강하고 경쟁을 좋아합니다.', scale: 5 },
    { id: 'YP11', category: 'observation', riasec: 'C', text: '우리 아이는 물건을 정리정돈하는 편입니다.', scale: 5 },
    { id: 'YP12', category: 'observation', riasec: 'C', text: '우리 아이는 규칙을 잘 따르고 약속을 지킵니다.', scale: 5 },

    // 교육 환경 (8문항)
    { id: 'YP13', category: 'support', text: '자녀의 교육을 위해 충분한 투자를 할 의향이 있다.', scale: 5 },
    { id: 'YP14', category: 'support', text: '자녀의 학습 활동에 적극적으로 관여하고 있다.', scale: 5 },
    { id: 'YP15', category: 'support', text: '자녀가 다양한 체험활동에 참여할 수 있도록 지원하고 있다.', scale: 5 },
    { id: 'YP16', category: 'support', text: '가정 내에서 독서 습관이 잘 형성되어 있다.', scale: 5 },
    { id: 'YP17', category: 'support', text: '자녀의 관심 분야와 재능을 존중하여 지원할 것이다.', scale: 5 },
    { id: 'YP18', category: 'support', text: '자녀의 학교생활과 교우관계에 관심을 가지고 있다.', scale: 5 },
    { id: 'YP19', category: 'support', text: '자녀의 자기주도 학습 능력은 어느 수준이라고 생각하십니까?', scale: 5, labels: ['매우 부족', '매우 우수'] },
    { id: 'YP20', category: 'support', text: '자녀의 교육과 관련하여 추가로 알려주고 싶은 점이 있다면 적어주세요.', type: 'short' }
];

// 미취학/초1~3 교차검증 쌍
const YOUNG_CROSS_VALIDATION = [
    { q1: 'Y001', q2: 'Y032', type: 'same' }, // R 만들기
    { q1: 'Y006', q2: 'Y035', type: 'same' }, // I 관찰
    { q1: 'Y011', q2: 'Y037', type: 'same' }, // A 그림
    { q1: 'Y016', q2: 'Y040', type: 'same' }, // S 친구
    { q1: 'Y021', q2: 'Y043', type: 'same' }, // E 리더
    { q1: 'Y026', q2: 'Y047', type: 'same' }, // C 꼼꼼
    { q1: 'Y002', q2: 'Y031', type: 'same' }, // R 운동
    { q1: 'Y007', q2: 'Y034', type: 'same' }, // I 수학
];
