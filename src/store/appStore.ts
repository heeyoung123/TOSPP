import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import type { 
  AppState, 
  Step, 
  ServiceInfo, 
  ProcessingItemType, 
  DetailInput,
  OutsourcingInfo,
  ThirdPartyInfo,
  OverseasInfo,
  GeneratedDocument 
} from '@/types';

const initialServiceInfo: ServiceInfo = {
  serviceName: '',
  companyName: '',
  serviceType: '',
  contactEmail: '',
  contactPhone: '',
  privacyOfficerName: '',
  privacyOfficerContact: '',
};

const createEmptyDetailInput = (): DetailInput => ({
  purpose: '',
  items: [],
  customItems: '',
  retentionPeriod: 'withdrawal',
  customRetention: '',
  hasOutsourcing: false,
  outsourcingList: [],
  hasThirdParty: false,
  thirdPartyList: [],
  hasOverseasTransfer: false,
  overseasInfo: null,
});

export const calculateCompletionRate = (
  serviceInfo: ServiceInfo,
  selectedItems: ProcessingItemType[],
  detailInputs: Record<ProcessingItemType, DetailInput>
): number => {
  let total = 0;
  let completed = 0;

  // Service info (20%) — 필수 필드(3개)만 기준으로 계산
  total += 20;
  const requiredFields = ['serviceName', 'companyName', 'contactEmail'] as const;
  const filledRequired = requiredFields.filter(f => serviceInfo[f] !== '').length;
  completed += (filledRequired / requiredFields.length) * 20;

  // Selected items (20%)
  total += 20;
  if (selectedItems.length > 0) {
    completed += 20;
  }

  // Detail inputs (60%) — 사용자가 직접 입력해야 점수가 오름
  // purpose: 50pt (직접 입력), items: 40pt (태그 선택), retentionPeriod: 10pt (기본값 포함)
  total += 60;
  if (selectedItems.length > 0) {
    const detailProgress = selectedItems.reduce((acc, itemId) => {
      const input = detailInputs[itemId];
      if (!input) return acc;
      let itemScore = 0;
      if (input.purpose) itemScore += 50;
      if (input.items.length > 0 || input.customItems) itemScore += 40;
      if (input.retentionPeriod) itemScore += 10;
      return acc + itemScore;
    }, 0);
    completed += (detailProgress / (selectedItems.length * 100)) * 60;
  }

  return Math.round(completed);
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentStep: 'service-info',
      serviceInfo: initialServiceInfo,
      selectedItems: [],
      detailInputs: {} as Record<ProcessingItemType, DetailInput>,
      document: null,
      isGenerating: false,
      isAdvancedMode: false,
      completionRate: 0,

      setStep: (step: Step) => set({ currentStep: step }),

      setServiceInfo: (info: Partial<ServiceInfo>) => {
        const newServiceInfo = { ...get().serviceInfo, ...info };
        set({ 
          serviceInfo: newServiceInfo,
          completionRate: calculateCompletionRate(
            newServiceInfo,
            get().selectedItems,
            get().detailInputs
          )
        });
      },

      toggleItem: (itemId: ProcessingItemType) => {
        const currentSelected = get().selectedItems;
        const isSelected = currentSelected.includes(itemId);
        const newSelected = isSelected
          ? currentSelected.filter(id => id !== itemId)
          : [...currentSelected, itemId];
        
        const newDetailInputs = { ...get().detailInputs };
        if (!isSelected && !newDetailInputs[itemId]) {
          newDetailInputs[itemId] = createEmptyDetailInput();
        }

        set({ 
          selectedItems: newSelected,
          detailInputs: newDetailInputs,
          completionRate: calculateCompletionRate(
            get().serviceInfo,
            newSelected,
            newDetailInputs
          )
        });
      },

      setDetailInput: (itemId: ProcessingItemType, input: Partial<DetailInput>) => {
        const currentInput = get().detailInputs[itemId] || createEmptyDetailInput();
        const newDetailInputs = {
          ...get().detailInputs,
          [itemId]: { ...currentInput, ...input }
        };
        set({ 
          detailInputs: newDetailInputs,
          completionRate: calculateCompletionRate(
            get().serviceInfo,
            get().selectedItems,
            newDetailInputs
          )
        });
      },

      addOutsourcing: (itemId: ProcessingItemType, info: OutsourcingInfo) => {
        const currentInput = get().detailInputs[itemId] || createEmptyDetailInput();
        const newDetailInputs = {
          ...get().detailInputs,
          [itemId]: {
            ...currentInput,
            outsourcingList: [...currentInput.outsourcingList, info]
          }
        };
        set({
          detailInputs: newDetailInputs,
          completionRate: calculateCompletionRate(get().serviceInfo, get().selectedItems, newDetailInputs)
        });
      },

      removeOutsourcing: (itemId: ProcessingItemType, outsourcingId: string) => {
        const currentInput = get().detailInputs[itemId] || createEmptyDetailInput();
        const newDetailInputs = {
          ...get().detailInputs,
          [itemId]: {
            ...currentInput,
            outsourcingList: currentInput.outsourcingList.filter(o => o.id !== outsourcingId)
          }
        };
        set({
          detailInputs: newDetailInputs,
          completionRate: calculateCompletionRate(get().serviceInfo, get().selectedItems, newDetailInputs)
        });
      },

      addThirdParty: (itemId: ProcessingItemType, info: ThirdPartyInfo) => {
        const currentInput = get().detailInputs[itemId] || createEmptyDetailInput();
        const newDetailInputs = {
          ...get().detailInputs,
          [itemId]: {
            ...currentInput,
            thirdPartyList: [...currentInput.thirdPartyList, info]
          }
        };
        set({
          detailInputs: newDetailInputs,
          completionRate: calculateCompletionRate(get().serviceInfo, get().selectedItems, newDetailInputs)
        });
      },

      removeThirdParty: (itemId: ProcessingItemType, thirdPartyId: string) => {
        const currentInput = get().detailInputs[itemId] || createEmptyDetailInput();
        const newDetailInputs = {
          ...get().detailInputs,
          [itemId]: {
            ...currentInput,
            thirdPartyList: currentInput.thirdPartyList.filter(t => t.id !== thirdPartyId)
          }
        };
        set({
          detailInputs: newDetailInputs,
          completionRate: calculateCompletionRate(get().serviceInfo, get().selectedItems, newDetailInputs)
        });
      },

      setOverseasInfo: (itemId: ProcessingItemType, info: OverseasInfo) => {
        const currentInput = get().detailInputs[itemId] || createEmptyDetailInput();
        const newDetailInputs = {
          ...get().detailInputs,
          [itemId]: {
            ...currentInput,
            overseasInfo: info
          }
        };
        set({
          detailInputs: newDetailInputs,
          completionRate: calculateCompletionRate(get().serviceInfo, get().selectedItems, newDetailInputs)
        });
      },

      setAdvancedMode: (isAdvanced: boolean) => set({ isAdvancedMode: isAdvanced }),

      generateDocument: async () => {
        const { serviceInfo, selectedItems, detailInputs } = get();
        set({ isGenerating: true });
        try {
          const { data } = await api.post('/generate/privacy-policy', {
            serviceInfo,
            selectedItems,
            detailInputs,
          });
          const result = data.data ?? data;
          set({ document: { ...result, generatedAt: new Date(result.generatedAt) } });
          return;
        } catch (error) {
          console.error('백엔드 생성 실패, 폴백 실행', error);
        } finally {
          set({ isGenerating: false });
        }

        // 백엔드 연결 실패 시 클라이언트 폴백
        {
        
        // Generate document sections based on selected items
        const sections = [];
        let order = 1;

        // Header section
        sections.push({
          id: 'header',
          title: '',
          content: `<h1>개인정보처리방침</h1>
<p><strong>${serviceInfo.companyName}</strong>(이하 "회사")는 「개인정보 보호법」 등 관련 법령을 준수하며, 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보처리방침을 수립·공개합니다.</p>
<p>본 개인정보처리방침은 <strong>${serviceInfo.serviceName}</strong> 서비스(이하 "서비스")에 적용됩니다.</p>
<p class="meta-info">시행일: ${new Date().toLocaleDateString('ko-KR')}</p>`,
          order: order++
        });

        // Article 1: Purpose
        sections.push({
          id: 'purpose',
          title: '제1조 (개인정보의 처리 목적)',
          content: `<p>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
${selectedItems.map(itemId => {
  const input = detailInputs[itemId];
  const itemName = getItemName(itemId);
  return `<div class="purpose-item">
    <h4>${itemName}</h4>
    <p>${input?.purpose || `${itemName} 관련 서비스 제공 및 관리`}</p>
  </div>`;
}).join('')}`,
          order: order++
        });

        // Article 2: Collection items and retention period
        sections.push({
          id: 'collection',
          title: '제2조 (개인정보의 처리 및 보유 기간)',
          content: `<p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
<h4>① 개인정보의 수집 항목 및 보유 기간</h4>
<table class="privacy-table">
  <thead>
    <tr>
      <th>구분</th>
      <th>수집 항목</th>
      <th>보유 기간</th>
    </tr>
  </thead>
  <tbody>
    ${selectedItems.map(itemId => {
      const input = detailInputs[itemId];
      const itemName = getItemName(itemId);
      const items = input?.items?.join(', ') || input?.customItems || '해당 서비스 관련 정보';
      const retention = getRetentionLabel(input?.retentionPeriod, input?.customRetention);
      return `<tr>
        <td>${itemName}</td>
        <td>${items}</td>
        <td>${retention}</td>
      </tr>`;
    }).join('')}
  </tbody>
</table>`,
          order: order++
        });

        // Article 3: Outsourcing
        const hasOutsourcing = selectedItems.some(itemId => {
          const input = detailInputs[itemId];
          return input?.hasOutsourcing && input?.outsourcingList?.length > 0;
        });

        if (hasOutsourcing) {
          sections.push({
            id: 'outsourcing',
            title: '제3조 (개인정보 처리 위탁)',
            content: `<p>회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.</p>
<table class="privacy-table">
  <thead>
    <tr>
      <th>수탁업체</th>
      <th>위탁업무 내용</th>
      <th>위탁 국가</th>
    </tr>
  </thead>
  <tbody>
    ${selectedItems.flatMap(itemId => {
      const input = detailInputs[itemId];
      if (!input?.hasOutsourcing) return [];
      return input.outsourcingList.map(o => `<tr>
        <td>${o.companyName}</td>
        <td>${o.task}</td>
        <td>${o.country}</td>
      </tr>`);
    }).join('')}
  </tbody>
</table>
<p>회사는 위탁계약 체결 시 「개인정보 보호법」 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.</p>`,
            order: order++
          });
        }

        // Article 4: Third party provision
        const hasThirdParty = selectedItems.some(itemId => {
          const input = detailInputs[itemId];
          return input?.hasThirdParty && input?.thirdPartyList?.length > 0;
        });

        if (hasThirdParty) {
          sections.push({
            id: 'thirdparty',
            title: `제${hasOutsourcing ? '4' : '3'}조 (개인정보의 제3자 제공)`,
            content: `<p>회사는 정보주체의 개인정보를 개인정보의 처리 목적에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
<table class="privacy-table">
  <thead>
    <tr>
      <th>제공받는 자</th>
      <th>제공 목적</th>
      <th>제공 항목</th>
      <th>보유·이용기간</th>
    </tr>
  </thead>
  <tbody>
    ${selectedItems.flatMap(itemId => {
      const input = detailInputs[itemId];
      if (!input?.hasThirdParty) return [];
      return input.thirdPartyList.map(t => `<tr>
        <td>${t.recipient}</td>
        <td>${t.purpose}</td>
        <td>${t.items}</td>
        <td>${t.retentionPeriod}</td>
      </tr>`);
    }).join('')}
  </tbody>
</table>`,
            order: order++
          });
        }

        // Article 5: Overseas transfer
        const hasOverseas = selectedItems.some(itemId => {
          const input = detailInputs[itemId];
          return input?.hasOverseasTransfer && input?.overseasInfo;
        });

        if (hasOverseas) {
          sections.push({
            id: 'overseas',
            title: `제${(hasOutsourcing ? 1 : 0) + (hasThirdParty ? 1 : 0) + 3}조 (개인정보의 국외 이전)`,
            content: `<p>회사는 이용자의 개인정보를 국외에 이전하고 있습니다.</p>
${selectedItems.filter(itemId => {
  const input = detailInputs[itemId];
  return input?.hasOverseasTransfer && input?.overseasInfo;
}).map(itemId => {
  const info = detailInputs[itemId].overseasInfo!;
  return `<div class="overseas-item">
    <p><strong>이전받는 자:</strong> ${info.trustee}</p>
    <p><strong>이전 국가:</strong> ${info.country}</p>
    <p><strong>이전 일시:</strong> ${info.transferDate}</p>
    <p><strong>이전 방법:</strong> ${info.method}</p>
    <p><strong>연락처:</strong> ${info.contact}</p>
  </div>`;
}).join('')}
<p>회사는 국외 이전 시 개인정보 보호법에서 요구하는 안전성 확보 조치를 준수합니다.</p>`,
            order: order++
          });
        }

        // Article: Rights of data subject
        sections.push({
          id: 'rights',
          title: `제${(hasOutsourcing ? 1 : 0) + (hasThirdParty ? 1 : 0) + (hasOverseas ? 1 : 0) + 3}조 (정보주체와 법정대리인의 권리·의무 및 그 행사방법)`,
          content: `<p>① 정보주체는 회사에 대해 언제든지 개인정보 열림·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.</p>
<p>② 제1항에 따른 권리 행사는 회사에 대해 「개인정보 보호법」 시행령 제41조제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.</p>
<p>③ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 "개인정보 처리 방법에 관한 고시(제2020-7호)" 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.</p>
<p>④ 개인정보 열림 및 처리정지 요구는 「개인정보 보호법」 제35조 제4항, 제37조 제2항에 의하여 정보주체의 권리가 제한될 수 있습니다.</p>
<p>⑤ 개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.</p>
<p>⑥ 회사는 정보주체 권리에 따른 열림 요구, 정정·삭제 요구, 처리정지 요구 시 열림 등을 요구한 자가 본인이거나 정당한 대리인인지를 확인합니다.</p>`,
          order: order++
        });

        // Article: Destruction
        sections.push({
          id: 'destruction',
          title: `제${(hasOutsourcing ? 1 : 0) + (hasThirdParty ? 1 : 0) + (hasOverseas ? 1 : 0) + 4}조 (개인정보의 파기)`,
          content: `<p>① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
<p>② 정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.</p>
<p>③ 개인정보 파기의 절차 및 방법은 다음과 같습니다.</p>
<p><strong>1. 파기절차</strong><br>회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.</p>
<p><strong>2. 파기방법</strong><br>전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다. 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</p>`,
          order: order++
        });

        // Article: Security measures
        sections.push({
          id: 'security',
          title: `제${(hasOutsourcing ? 1 : 0) + (hasThirdParty ? 1 : 0) + (hasOverseas ? 1 : 0) + 5}조 (개인정보의 안전성 확보 조치)`,
          content: `<p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
<p><strong>1. 관리적 조치</strong>: 내부관리계획 수립·시행, 정기적 직원 교육 등</p>
<p><strong>2. 기술적 조치</strong>: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치 등</p>
<p><strong>3. 물리적 조치</strong>: 전산실, 자료보관실 등의 접근통제 등</p>`,
          order: order++
        });

        // Article: Privacy officer
        sections.push({
          id: 'officer',
          title: `제${(hasOutsourcing ? 1 : 0) + (hasThirdParty ? 1 : 0) + (hasOverseas ? 1 : 0) + 6}조 (개인정보 보호책임자)`,
          content: `<p>① 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
<div class="officer-info">
  <p><strong>▶ 개인정보 보호책임자</strong></p>
  <p>성명: ${serviceInfo.privacyOfficerName || '미지정'}</p>
  <p>연락처: ${serviceInfo.privacyOfficerContact || serviceInfo.contactEmail || '미지정'}</p>
</div>
<p>② 정보주체는 회사의 서비스(또는 사업)를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. 회사는 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.</p>`,
          order: order++
        });

        // Article: Remedies
        sections.push({
          id: 'remedies',
          title: `제${(hasOutsourcing ? 1 : 0) + (hasThirdParty ? 1 : 0) + (hasOverseas ? 1 : 0) + 7}조 (권익침해 구제방법)`,
          content: `<p>정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타 개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기 바랍니다.</p>
<p><strong>1. 개인정보분쟁조정위원회</strong>: (국번없이) 1833-6972 (www.kopico.go.kr)</p>
<p><strong>2. 개인정보침해신고센터</strong>: (국번없이) 118 (privacy.kisa.or.kr)</p>
<p><strong>3. 대검찰청</strong>: (국번없이) 1301 (www.spo.go.kr)</p>
<p><strong>4. 경찰청</strong>: (국번없이) 182 (ecrm.cyber.go.kr)</p>`,
          order: order++
        });

        // Footer
        sections.push({
          id: 'footer',
          title: '',
          content: `<div class="document-footer">
  <p>본 개인정보처리방침은 ${new Date().toLocaleDateString('ko-KR')}부터 적용됩니다.</p>
  <p class="disclaimer">※ 본 문서는 ${serviceInfo.serviceName} 서비스의 특성을 반영하여 생성되었으며, 법률 자문을 대체하지 않습니다. 최종 검토를 권장합니다.</p>
</div>`,
          order: order++
        });

        const document: GeneratedDocument = {
          title: `${serviceInfo.serviceName} 개인정보처리방침`,
          content: sections.map(s => s.content).join('\n'),
          sections,
          generatedAt: new Date(),
          version: 1
        };

          set({ document });
        }
      },

      updateDocumentSection: (sectionId: string, content: string) => {
        const currentDoc = get().document;
        if (!currentDoc) return;

        const newSections = currentDoc.sections.map(s =>
          s.id === sectionId ? { ...s, content } : s
        );

        set({
          document: {
            ...currentDoc,
            sections: newSections,
            content: newSections.map(s => s.content).join('\n')
          }
        });
      },

      reset: () => set({
        currentStep: 'service-info',
        serviceInfo: initialServiceInfo,
        selectedItems: [],
        detailInputs: {} as Record<ProcessingItemType, DetailInput>,
        document: null,
        isGenerating: false,
        isAdvancedMode: false,
        completionRate: 0,
      })
    }),
    {
      name: 'privacy-policy-generator',
      partialize: (state) => ({
        serviceInfo: state.serviceInfo,
        selectedItems: state.selectedItems,
        detailInputs: state.detailInputs,
        isAdvancedMode: state.isAdvancedMode,
      }),
    }
  )
);

// Helper functions
function getItemName(itemId: ProcessingItemType): string {
  const names: Record<ProcessingItemType, string> = {
    // 기본 모드
    account_signup: '회원가입(이메일)',
    auth_session: '로그인/인증(세션/JWT)',
    payment_onetime: '결제(단건)',
    payment_subscription: '구독(자동결제)',
    marketing_email: '마케팅(이메일)',
    marketing_push: '마케팅(푸시)',
    support_inquiry: '고객센터/문의',
    analytics_cookie: '분석/로그(쿠키/접속기록)',
    auth_social: '소셜 로그인',
    payment_refund: '환불/분쟁 처리',
    account_dormant: '휴면계정(비활성 관리)',
    // 고급 모드
    auth_phone: '휴대전화 본인인증',
    delivery_shipping: '배송/물류',
    location_gps: '위치기반 서비스',
    community_content: '커뮤니티/게시물 업로드',
    marketing_adpixel: '광고/리타게팅 픽셀',
    event_promotion: '이벤트/경품 응모',
    survey_feedback: '설문조사/피드백 수집',
    admin_operator: '관리자/운영자 계정',
  };
  return names[itemId] || itemId;
}

function getRetentionLabel(value: string, custom: string): string {
  const labels: Record<string, string> = {
    withdrawal: '회원탈퇴 시까지',
    '1year': '1년',
    '3years': '3년',
    '5years': '5년',
    custom: custom || '직접 입력',
  };
  return labels[value] || value;
}
