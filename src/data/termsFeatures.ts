import type { TermsFeature, TermsServiceType } from '@/types/terms';

export const termsFeatures: TermsFeature[] = [
  // ===== 기본 (항상 포함) =====
  {
    id: 'basic',
    name: '기본 조항',
    description: '모든 서비스에 필수적인 기본 약관 조항',
    icon: 'FileText',
    category: 'basic',
    isRequired: true,
    needsLegalNotice: false,
    tooltip: '총칙, 회원가입, 서비스 이용, 금지행위, 계약해지 등 기본 조항이 포함됩니다.',
    relatedLaws: ['정보통신망법', '전자문서법'],
  },

  // ===== 고급 (선택형) =====
  {
    id: 'paid_service',
    name: '유료 서비스',
    description: '유료 콘텐츠, 상품, 서비스 판매',
    icon: 'CreditCard',
    category: 'advanced',
    isRequired: false,
    needsLegalNotice: true,
    tooltip: '유료 서비스 제공 시 전자상거래법 준수 조항이 필요합니다.',
    relatedLaws: ['전자상거래법', '소비자기본법'],
  },
  {
    id: 'subscription',
    name: '구독 모델',
    description: '정기결제 및 자동 갱신 서비스',
    icon: 'Repeat',
    category: 'advanced',
    isRequired: false,
    needsLegalNotice: true,
    tooltip: '구독 서비스는 자동 갱신 및 해지 절차에 대한 명확한 고지가 필요합니다.',
    relatedLaws: ['전자상거래법', '약관규제법'],
  },
  {
    id: 'ecommerce',
    name: '전자상거래/쇼핑몰',
    description: '재화 판매, 배송, 교환/반품',
    icon: 'ShoppingCart',
    category: 'advanced',
    isRequired: false,
    needsLegalNotice: true,
    tooltip: '상품 판매 시 전자상거래법의 청약철회, 환불 등 조항이 필수입니다.',
    relatedLaws: ['전자상거래법', '소비자기본법'],
  },
  {
    id: 'community_ugc',
    name: '커뮤니티/UGC',
    description: '게시물 업로드, 댓글, 사용자 생성 콘텐츠',
    icon: 'MessageSquare',
    category: 'advanced',
    isRequired: false,
    needsLegalNotice: true,
    tooltip: '사용자 생성 콘텐츠에 대한 권리 귀속 및 삭제 정책이 필요합니다.',
    relatedLaws: ['정보통신망법', '저작권법'],
  },
  {
    id: 'ai_feature',
    name: 'AI 기능 제공',
    description: 'AI 생성 결과물, 자동화 서비스',
    icon: 'Brain',
    category: 'advanced',
    isRequired: false,
    needsLegalNotice: true,
    tooltip: 'AI 결과물에 대한 책임 제한 및 데이터 학습 사용 여부 고지가 필요합니다.',
    relatedLaws: ['정보통신망법'],
  },
  {
    id: 'location',
    name: '위치기반 서비스',
    description: 'GPS 기반 위치 정보 수집 및 활용',
    icon: 'MapPin',
    category: 'advanced',
    isRequired: false,
    needsLegalNotice: true,
    tooltip: '위치정보 보호법에 따른 별도 동의 및 관리책임자 명시가 필요합니다.',
    relatedLaws: ['위치정볳호법'],
  },
  {
    id: 'global',
    name: '해외 사용자',
    description: '글로벌 서비스 및 외국인 회원',
    icon: 'Globe',
    category: 'advanced',
    isRequired: false,
    needsLegalNotice: false,
    tooltip: '해외 사용자 대상 서비스 시 준거법 및 중재 조항이 필요합니다.',
    relatedLaws: [],
  },
  {
    id: 'minor',
    name: '미성년자 대상',
    description: '만 14세 미만 이용 가능 서비스',
    icon: 'Baby',
    category: 'advanced',
    isRequired: false,
    needsLegalNotice: true,
    tooltip: '미성년자 이용 시 법정대리인 동의 및 청소년 보호 조항이 필요합니다.',
    relatedLaws: ['청소년보호법'],
  },
];

export const getDefaultFeaturesForServiceType = (serviceType: TermsServiceType): string[] => {
  const defaults: Record<TermsServiceType, string[]> = {
    saas: ['basic', 'paid_service', 'subscription'],
    commerce: ['basic', 'paid_service', 'ecommerce'],
    community: ['basic', 'community_ugc'],
    app: ['basic', 'paid_service', 'location'],
    content: ['basic', 'paid_service', 'community_ugc'],
    platform: ['basic', 'paid_service', 'community_ugc', 'subscription'],
  };
  return defaults[serviceType] || ['basic'];
};

export const getFeaturesByCategory = (category: 'basic' | 'advanced') => {
  return termsFeatures.filter(feature => feature.category === category);
};

export const getFeatureById = (id: string) => {
  return termsFeatures.find(feature => feature.id === id);
};

// 기본 약관 조항 템플릿
export const basicTermsTemplate = {
  chapter1: {
    title: '제1장 총칙',
    articles: [
      {
        number: 1,
        title: '제1조 (목적)',
        content: `이 약관은 {companyName}(이하 "회사")가 제공하는 {serviceName}(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무, 책임사항 및 기타 필요한 사항을 규정함을 목적으로 합니다.`,
      },
      {
        number: 2,
        title: '제2조 (정의)',
        content: `이 약관에서 사용하는 용어의 정의는 다음과 같습니다.

① "회사"란 {serviceName}을 운영하는 {companyName}을 의미합니다.
② "회원"이란 회사와 이용계약을 체결하고 서비스를 이용하는 자를 의미합니다.
③ "서비스"란 회사가 제공하는 모든 온라인 서비스 및 관련 제반 서비스를 의미합니다.
④ "게시물"이란 회원이 서비스에 게시하는 모든 정보를 의미합니다.`,
      },
      {
        number: 3,
        title: '제3조 (약관의 효력 및 변경)',
        content: `① 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.
② 회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
③ 회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행 약관과 함께 서비스 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.
④ 회원은 변경된 약관에 동의하지 않을 경우 회원 탈퇴를 요청할 수 있습니다.`,
      },
    ],
  },
  chapter2: {
    title: '제2장 회원 및 서비스 이용',
    articles: [
      {
        number: 4,
        title: '제4조 (회원가입)',
        content: `① 회원가입은 이용자가 약관의 내용에 대하여 동의를 한 다음 회원가입 신청을 하고 회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.
② 회사는 다음 각 호에 해당하는 신청에 대하여는 승낙하지 않을 수 있습니다.
  1. 실명이 아니거나 타인의 명의를 이용한 경우
  2. 허위의 정보를 기재하거나 회사가 제시하는 내용을 기재하지 않은 경우
  3. 기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우`,
      },
      {
        number: 5,
        title: '제5조 (회원정보의 변경)',
        content: `① 회원은 개인정보관리화면을 통하여 언제든지 본인의 개인정보를 열람하고 수정할 수 있습니다.
② 회원은 회원가입 신청 시 기재한 사항이 변경되었을 경우 온라인으로 수정을 하거나 기타 방법으로 회사에 대하여 그 변경사항을 알려야 합니다.
③ 제2항의 변경사항을 회사에 알리지 않아 발생한 불이익에 대하여 회사는 책임지지 않습니다.`,
      },
      {
        number: 6,
        title: '제6조 (계정 관리 책임)',
        content: `① 회원은 자신의 계정 정보(아이디, 비밀번호 등)에 대한 관리 책임이 있으며, 제3자에게 이를 양도하거나 대여할 수 없습니다.
② 회원은 자신의 계정 정보가 도용되거나 제3자가 사용하고 있음을 인지한 경우에는 즉시 회사에 통지하고 회사의 안내에 따라야 합니다.
③ 회사는 회원이 본 조를 위반하여 발생한 손해에 대하여 책임을 지지 않습니다.`,
      },
      {
        number: 7,
        title: '제7조 (서비스의 제공)',
        content: `① 회사는 다음과 같은 서비스를 제공합니다.
  1. {serviceName} 관련 모든 서비스
  2. 기타 회사가 정하는 서비스
② 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.
③ 회사는 서비스의 내용, 운영 방식 등을 변경할 수 있으며, 변경 시 사전에 공지합니다.`,
      },
      {
        number: 8,
        title: '제8조 (서비스의 중단)',
        content: `① 회사는 다음 각 호의 경우 서비스 제공을 일시적으로 중단할 수 있습니다.
  1. 시스템 정기점검, 보수, 교체 등의 경우
  2. 천재지변, 정전, 서비스 설비의 장애 등 불가항력적인 경우
  3. 기타 회사가 서비스 제공을 할 수 없는 정당한 사유가 있는 경우
② 회사는 서비스 중단으로 인한 손해에 대하여 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다.`,
      },
    ],
  },
  chapter3: {
    title: '제3장 이용자의 의무',
    articles: [
      {
        number: 9,
        title: '제9조 (금지행위)',
        content: `① 회원은 다음 각 호의 행위를 하여서는 안 됩니다.
  1. 타인의 정보 도용
  2. 회사가 게시한 정보의 변경
  3. 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시
  4. 회사와 기타 제3자의 저작권 등 지식재산권에 대한 침해
  5. 회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위
  6. 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위
  7. 기타 불법적이거나 부당한 행위
② 회원은 관계 법령, 이 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 주의사항, 회사가 통지하는 사항 등을 준수하여야 하며, 기타 회사의 업무에 방하이 되는 행위를 하여서는 안 됩니다.`,
      },
    ],
  },
  chapter4: {
    title: '제4장 게시물 및 권리',
    articles: [
      {
        number: 10,
        title: '제10조 (게시물의 권리 및 책임)',
        content: `① 회원이 서비스 내에 게시한 게시물의 저작권은 해당 게시물의 저작자에게 귀속됩니다.
② 회원은 자신이 게시한 게시물이 제3자의 권리를 침해하지 않도록 주의 의무를 다해야 합니다.
③ 회사는 회원이 게시한 게시물이 다음 각 호에 해당하는 경우 사전 통지 없이 삭제할 수 있습니다.
  1. 타인의 권리를 침해하거나 명예를 훼손하는 내용
  2. 공서양속에 위반되는 내용
  3. 불법적이거나 범죄와 관련된 내용
  4. 기타 관계 법령이나 회사 정책에 위반되는 내용`,
      },
    ],
  },
  chapter5: {
    title: '제5장 계약해지 및 이용제한',
    articles: [
      {
        number: 11,
        title: '제11조 (계약 해지)',
        content: `① 회원은 언제든지 서비스 초기화면의 회원탈퇴 메뉴를 통해 이용계약 해지 신청을 할 수 있으며, 회사는 관련 법령 등이 정하는 바에 따라 이를 즉시 처리하여야 합니다.
② 회사는 회원이 이 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 사전 통지 후 이용계약을 해지하거나 서비스 이용을 제한할 수 있습니다.
③ 회사는 회원이 계속해서 1년 이상 로그인하지 않는 경우, 회원정보의 보호 및 운영의 효율성을 위해 이용을 제한할 수 있습니다.`,
      },
    ],
  },
  chapter6: {
    title: '제6장 책임 및 분쟁',
    articles: [
      {
        number: 12,
        title: '제12조 (면책조항)',
        content: `① 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
② 회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.
③ 회사는 회원이 서비스와 관련하여 게재한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는 책임을 지지 않습니다.
④ 회사는 회원 간 또는 회원과 제3자 상호간에 서비스를 매개로 하여 거래 등을 한 경우에는 책임이 면제됩니다.
⑤ 회사는 물리적, 기술적 수단의 한계로 인해 발생할 수 있는 보안 사고에 대해 고의 또는 중과실이 없는 한 책임을 지지 않습니다.`,
      },
      {
        number: 13,
        title: '제13조 (준거법 및 관할)',
        content: `① 이 약관의 해석 및 회사와 회원 간의 분쟁에 대하여는 대한민국의 법을 적용합니다.
② 서비스 이용으로 발생한 분쟁에 대해 소송이 제기될 경우, 회사의 본사 소재지를 관할하는 법원을 전속관할로 합니다.`,
      },
    ],
  },
};
