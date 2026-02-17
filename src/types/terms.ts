// 서비스 이용약관 생성기 타입 정의

export type TermsStep = 
  | 'service-info'
  | 'select-features'
  | 'detail-input'
  | 'preview'
  | 'export';

export type TermsServiceType = 'saas' | 'commerce' | 'community' | 'app' | 'content' | 'platform';

export type TermsFeatureType = 
  // 기본 (항상 포함)
  | 'basic'
  // 고급 (선택형)
  | 'paid_service'
  | 'subscription'
  | 'ecommerce'
  | 'community_ugc'
  | 'ai_feature'
  | 'location'
  | 'global'
  | 'minor';

export interface TermsFeature {
  id: TermsFeatureType;
  name: string;
  description: string;
  icon: string;
  category: 'basic' | 'advanced';
  isRequired: boolean;
  needsLegalNotice: boolean;
  tooltip: string;
  relatedLaws: string[];
}

export interface TermsFeatureInput {
  enabled: boolean;
  details: {
    // 유료 서비스
    paymentMethods?: string[];
    refundPolicy?: string;
    withdrawalPeriod?: string;
    // 구독
    autoRenewal?: boolean;
    cancellationNotice?: string;
    priceChangeNotice?: string;
    // 전자상거래
    shippingPeriod?: string;
    returnPeriod?: string;
    exchangePolicy?: string;
    // 커뮤니티
    contentLicense?: string;
    reportPolicy?: string;
    banCriteria?: string;
    // AI
    aiDisclaimer?: string;
    dataUsage?: boolean;
    // 위치정보
    locationPurpose?: string;
    locationRetention?: string;
    // 글로벌
    governingLaw?: string;
    arbitration?: string;
    // 미성년자
    parentalConsent?: boolean;
    ageLimit?: string;
  };
}

export interface TermsServiceInfo {
  serviceName: string;
  companyName: string;
  serviceType: TermsServiceType | '';
  companyAddress: string;
  businessRegistration: string;
  contactEmail: string;
  contactPhone: string;
  representative: string;
}

export interface GeneratedTerms {
  title: string;
  content: string;
  chapters: TermsChapter[];
  generatedAt: Date;
  version: number;
}

export interface TermsChapter {
  id: string;
  chapterNumber: number;
  title: string;
  articles: TermsArticle[];
}

export interface TermsArticle {
  id: string;
  articleNumber: number;
  title: string;
  content: string;
}

export interface TermsState {
  currentStep: TermsStep;
  serviceInfo: TermsServiceInfo;
  selectedFeatures: TermsFeatureType[];
  featureInputs: Record<TermsFeatureType, TermsFeatureInput>;
  document: GeneratedTerms | null;
  isAdvancedMode: boolean;
  completionRate: number;
  
  // Actions
  setStep: (step: TermsStep) => void;
  setServiceInfo: (info: Partial<TermsServiceInfo>) => void;
  toggleFeature: (featureId: TermsFeatureType) => void;
  setFeatureInput: (featureId: TermsFeatureType, input: Partial<TermsFeatureInput>) => void;
  setAdvancedMode: (isAdvanced: boolean) => void;
  generateDocument: () => void;
  updateArticle: (chapterId: string, articleId: string, content: string) => void;
  reset: () => void;
}

export const TERMS_STEP_LABELS: Record<TermsStep, { title: string; subtitle: string; estimatedTime: string }> = {
  'service-info': { title: '서비스 기본 정보', subtitle: '서비스의 기본 정보를 입력해주세요', estimatedTime: '1분' },
  'select-features': { title: '기능 선택', subtitle: '서비스에서 제공하는 기능을 선택해주세요', estimatedTime: '2분' },
  'detail-input': { title: '상세 입력', subtitle: '선택한 기능의 상세 정보를 입력해주세요', estimatedTime: '3분' },
  'preview': { title: '문서 미리보기', subtitle: '생성된 이용약관을 확인하세요', estimatedTime: '2분' },
  'export': { title: '다운로드/배포', subtitle: '문서를 다운로드하거나 배포하세요', estimatedTime: '1분' },
};

export const TERMS_SERVICE_TYPE_LABELS: Record<TermsServiceType, string> = {
  saas: 'SaaS',
  commerce: '커머스/쇼핑몰',
  community: '커뮤니티',
  app: '모바일 앱',
  content: '콘텐츠',
  platform: '플랫폼',
};

export const PAYMENT_METHODS = [
  { value: 'card', label: '신용카드' },
  { value: 'transfer', label: '계좌이체' },
  { value: 'mobile', label: '휴전화 결제' },
  { value: 'virtual', label: '가상계좌' },
  { value: 'kakao', label: '카카오페이' },
  { value: 'naver', label: '네이버페이' },
  { value: 'toss', label: '토스페이' },
];

export const WITHDRAWAL_PERIODS = [
  { value: '7days', label: '7일 (전자상거래법 기준)' },
  { value: '14days', label: '14일' },
  { value: '30days', label: '30일' },
  { value: 'custom', label: '직접 입력' },
];

export const SHIPPING_PERIODS = [
  { value: '1-3', label: '1~3일' },
  { value: '3-5', label: '3~5일' },
  { value: '5-7', label: '5~7일' },
  { value: 'custom', label: '직접 입력' },
];
