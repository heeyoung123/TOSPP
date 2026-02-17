// 개인정보처리방침 생성기 타입 정의

export type Step = 
  | 'service-info'
  | 'select-items'
  | 'detail-input'
  | 'preview'
  | 'export';

export type ServiceType = 'saas' | 'commerce' | 'community' | 'app' | 'offline';

export type ProcessingItemType = 
  // 기본 모드
  | 'account_signup'
  | 'auth_session'
  | 'payment_onetime'
  | 'payment_subscription'
  | 'marketing_email'
  | 'marketing_push'
  | 'support_inquiry'
  | 'analytics_cookie'
  | 'auth_social'
  | 'payment_refund'
  | 'account_dormant'
  // 고급 모드
  | 'auth_phone'
  | 'delivery_shipping'
  | 'location_gps'
  | 'community_content'
  | 'marketing_adpixel'
  | 'event_promotion'
  | 'survey_feedback'
  | 'admin_operator';

export interface ProcessingItem {
  id: ProcessingItemType;
  name: string;
  description: string;
  icon: string;
  category: 'basic' | 'advanced';
  isRecommended: boolean;
  isRequired: boolean;
  needsLegalNotice: boolean;
  tooltip: string;
  defaultRetention: string;
  defaultPurpose: string;
  exampleItems: string[];
}

export interface DetailInput {
  purpose: string;
  items: string[];
  customItems: string;
  retentionPeriod: string;
  customRetention: string;
  hasOutsourcing: boolean;
  outsourcingList: OutsourcingInfo[];
  hasThirdParty: boolean;
  thirdPartyList: ThirdPartyInfo[];
  hasOverseasTransfer: boolean;
  overseasInfo: OverseasInfo | null;
}

export interface OutsourcingInfo {
  id: string;
  companyName: string;
  task: string;
  country: string;
}

export interface ThirdPartyInfo {
  id: string;
  recipient: string;
  purpose: string;
  items: string;
  retentionPeriod: string;
}

export interface OverseasInfo {
  country: string;
  transferDate: string;
  method: string;
  trustee: string;
  contact: string;
}

export interface ServiceInfo {
  serviceName: string;
  companyName: string;
  serviceType: ServiceType | '';
  contactEmail: string;
  contactPhone: string;
  privacyOfficerName: string;
  privacyOfficerContact: string;
}

export interface GeneratedDocument {
  title: string;
  content: string;
  sections: DocumentSection[];
  generatedAt: Date;
  version: number;
}

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface AppState {
  currentStep: Step;
  serviceInfo: ServiceInfo;
  selectedItems: ProcessingItemType[];
  detailInputs: Record<ProcessingItemType, DetailInput>;
  document: GeneratedDocument | null;
  isAdvancedMode: boolean;
  completionRate: number;
  
  // Actions
  setStep: (step: Step) => void;
  setServiceInfo: (info: Partial<ServiceInfo>) => void;
  toggleItem: (itemId: ProcessingItemType) => void;
  setDetailInput: (itemId: ProcessingItemType, input: Partial<DetailInput>) => void;
  addOutsourcing: (itemId: ProcessingItemType, info: OutsourcingInfo) => void;
  removeOutsourcing: (itemId: ProcessingItemType, outsourcingId: string) => void;
  addThirdParty: (itemId: ProcessingItemType, info: ThirdPartyInfo) => void;
  removeThirdParty: (itemId: ProcessingItemType, thirdPartyId: string) => void;
  setOverseasInfo: (itemId: ProcessingItemType, info: OverseasInfo) => void;
  setAdvancedMode: (isAdvanced: boolean) => void;
  generateDocument: () => void;
  updateDocumentSection: (sectionId: string, content: string) => void;
  reset: () => void;
}

export const STEP_LABELS: Record<Step, { title: string; subtitle: string; estimatedTime: string }> = {
  'service-info': { title: '서비스 기본 정보', subtitle: '서비스의 기본 정보를 입력해주세요', estimatedTime: '1분' },
  'select-items': { title: '처리 항목 선택', subtitle: '수집하는 개인정보 항목을 선택해주세요', estimatedTime: '2분' },
  'detail-input': { title: '상세 입력', subtitle: '선택한 항목의 상세 정보를 입력해주세요', estimatedTime: '3분' },
  'preview': { title: '문서 미리보기', subtitle: '생성된 개인정보처리방침을 확인하세요', estimatedTime: '2분' },
  'export': { title: '다운로드/배포', subtitle: '문서를 다운로드하거나 배포하세요', estimatedTime: '1분' },
};

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  saas: 'SaaS',
  commerce: '커머스',
  community: '커뮤니티',
  app: '앱',
  offline: '오프라인 연계',
};

export const RETENTION_OPTIONS = [
  { value: 'withdrawal', label: '회원탈퇴 시까지' },
  { value: '1year', label: '1년' },
  { value: '3years', label: '3년' },
  { value: '5years', label: '5년' },
  { value: 'custom', label: '직접 입력' },
];
