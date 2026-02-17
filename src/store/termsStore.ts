import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  TermsState, 
  TermsStep, 
  TermsServiceInfo, 
  TermsFeatureType, 
  TermsFeatureInput,
  GeneratedTerms,
  TermsChapter,
  TermsArticle
} from '@/types/terms';
import { basicTermsTemplate } from '@/data/termsFeatures';

const initialServiceInfo: TermsServiceInfo = {
  serviceName: '',
  companyName: '',
  serviceType: '',
  companyAddress: '',
  businessRegistration: '',
  contactEmail: '',
  contactPhone: '',
  representative: '',
};

const createEmptyFeatureInput = (): TermsFeatureInput => ({
  enabled: false,
  details: {},
});

const calculateCompletionRate = (
  serviceInfo: TermsServiceInfo,
  selectedFeatures: TermsFeatureType[],
  featureInputs: Record<TermsFeatureType, TermsFeatureInput>
): number => {
  let total = 0;
  let completed = 0;

  // Service info (25%)
  total += 25;
  const requiredFields = ['serviceName', 'companyName', 'contactEmail'];
  const filledFields = requiredFields.filter(f => serviceInfo[f as keyof TermsServiceInfo] !== '').length;
  completed += (filledFields / requiredFields.length) * 25;

  // Selected features (25%)
  total += 25;
  if (selectedFeatures.length > 0) {
    completed += 25;
  }

  // Detail inputs (50%)
  total += 50;
  if (selectedFeatures.length > 0) {
    const detailProgress = selectedFeatures.reduce((acc, featureId) => {
      const input = featureInputs[featureId];
      if (!input) return acc;
      // Basic check - if feature is enabled, consider it partially complete
      return acc + (input.enabled ? 50 : 0);
    }, 0);
    completed += (detailProgress / (selectedFeatures.length * 50)) * 50;
  }

  return Math.round(completed);
};

export const useTermsStore = create<TermsState>()(
  persist(
    (set, get) => ({
      currentStep: 'service-info',
      serviceInfo: initialServiceInfo,
      selectedFeatures: ['basic'],
      featureInputs: { basic: { enabled: true, details: {} } } as Record<TermsFeatureType, TermsFeatureInput>,
      document: null,
      isAdvancedMode: false,
      completionRate: 0,

      setStep: (step: TermsStep) => set({ currentStep: step }),

      setServiceInfo: (info: Partial<TermsServiceInfo>) => {
        const newServiceInfo = { ...get().serviceInfo, ...info };
        set({ 
          serviceInfo: newServiceInfo,
          completionRate: calculateCompletionRate(
            newServiceInfo,
            get().selectedFeatures,
            get().featureInputs
          )
        });
      },

      toggleFeature: (featureId: TermsFeatureType) => {
        if (featureId === 'basic') return; // Basic cannot be toggled

        const currentSelected = get().selectedFeatures;
        const isSelected = currentSelected.includes(featureId);
        const newSelected = isSelected
          ? currentSelected.filter(id => id !== featureId)
          : [...currentSelected, featureId];
        
        const newFeatureInputs = { ...get().featureInputs };
        if (!isSelected && !newFeatureInputs[featureId]) {
          newFeatureInputs[featureId] = createEmptyFeatureInput();
        }
        if (!isSelected) {
          newFeatureInputs[featureId].enabled = true;
        }

        set({ 
          selectedFeatures: newSelected,
          featureInputs: newFeatureInputs,
          completionRate: calculateCompletionRate(
            get().serviceInfo,
            newSelected,
            newFeatureInputs
          )
        });
      },

      setFeatureInput: (featureId: TermsFeatureType, input: Partial<TermsFeatureInput>) => {
        const currentInput = get().featureInputs[featureId] || createEmptyFeatureInput();
        const newFeatureInputs = {
          ...get().featureInputs,
          [featureId]: { ...currentInput, ...input }
        };
        set({ 
          featureInputs: newFeatureInputs,
          completionRate: calculateCompletionRate(
            get().serviceInfo,
            get().selectedFeatures,
            newFeatureInputs
          )
        });
      },

      setAdvancedMode: (isAdvanced: boolean) => set({ isAdvancedMode: isAdvanced }),

      generateDocument: () => {
        const { serviceInfo, selectedFeatures } = get();
        
        const chapters: TermsChapter[] = [];
        let articleNumber = 1;

        // Chapter 1: Basic terms (always included)
        const chapter1Articles: TermsArticle[] = basicTermsTemplate.chapter1.articles.map(art => ({
          id: `ch1-art${art.number}`,
          articleNumber: articleNumber++,
          title: art.title,
          content: replaceTemplateVars(art.content, serviceInfo),
        }));
        chapters.push({
          id: 'chapter1',
          chapterNumber: 1,
          title: basicTermsTemplate.chapter1.title,
          articles: chapter1Articles,
        });

        // Chapter 2: Basic terms continued
        const chapter2Articles: TermsArticle[] = basicTermsTemplate.chapter2.articles.map(art => ({
          id: `ch2-art${art.number}`,
          articleNumber: articleNumber++,
          title: art.title,
          content: replaceTemplateVars(art.content, serviceInfo),
        }));
        chapters.push({
          id: 'chapter2',
          chapterNumber: 2,
          title: basicTermsTemplate.chapter2.title,
          articles: chapter2Articles,
        });

        // Chapter 3: User obligations
        const chapter3Articles: TermsArticle[] = basicTermsTemplate.chapter3.articles.map(art => ({
          id: `ch3-art${art.number}`,
          articleNumber: articleNumber++,
          title: art.title,
          content: replaceTemplateVars(art.content, serviceInfo),
        }));
        chapters.push({
          id: 'chapter3',
          chapterNumber: 3,
          title: basicTermsTemplate.chapter3.title,
          articles: chapter3Articles,
        });

        // Chapter 4: Content (with UGC additions if selected)
        const chapter4Articles: TermsArticle[] = [];
        basicTermsTemplate.chapter4.articles.forEach(art => {
          chapter4Articles.push({
            id: `ch4-art${art.number}`,
            articleNumber: articleNumber++,
            title: art.title,
            content: replaceTemplateVars(art.content, serviceInfo),
          });
        });

        // Add UGC specific articles if community feature selected
        if (selectedFeatures.includes('community_ugc')) {
          chapter4Articles.push({
            id: 'ch4-art-ugc',
            articleNumber: articleNumber++,
            title: '제10조의2 (게시물의 라이선스)',
            content: `① 회원은 서비스 내에 게시물을 게시함으로써 회사에게 다음과 같은 권리를 부여합니다.
1. 게시물을 복제, 배포, 전시, 전송할 수 있는 권리
2. 게시물을 검색 노출, 홍보, 마케팅에 활용할 수 있는 권리
② 회사는 회원의 개별 동의 없이 게시물을 상업적으로 이용하지 않습니다.
③ 회원이 게시물을 삭제하는 경우, 회사는 관련 법령에 따라 보관이 필요한 경우를 제외하고 해당 게시물을 삭제합니다.`,
          });
          chapter4Articles.push({
            id: 'ch4-art-report',
            articleNumber: articleNumber++,
            title: '제10조의3 (신고 및 삭제 정책)',
            content: `① 회원은 타인의 게시물이 권리를 침해하거나 부적절한 경우 신고할 수 있습니다.
② 회사는 신고 접수 후 검토를 거쳐 해당 게시물을 삭제하거나 수정을 요청할 수 있습니다.
③ 회사는 다음 각 호에 해당하는 회원의 계정을 제한하거나 삭제할 수 있습니다.
1. 반복적으로 금지행위를 하는 경우
2. 타인의 권리를 침해하는 게시물을 다수 게시한 경우
3. 기타 서비스 운영을 방해하는 행위를 한 경우`,
          });
        }

        chapters.push({
          id: 'chapter4',
          chapterNumber: 4,
          title: basicTermsTemplate.chapter4.title,
          articles: chapter4Articles,
        });

        // Chapter 5: Termination
        const chapter5Articles: TermsArticle[] = basicTermsTemplate.chapter5.articles.map(art => ({
          id: `ch5-art${art.number}`,
          articleNumber: articleNumber++,
          title: art.title,
          content: replaceTemplateVars(art.content, serviceInfo),
        }));
        chapters.push({
          id: 'chapter5',
          chapterNumber: 5,
          title: basicTermsTemplate.chapter5.title,
          articles: chapter5Articles,
        });

        // Chapter 6: Liability (with additions)
        const chapter6Articles: TermsArticle[] = [];
        basicTermsTemplate.chapter6.articles.forEach(art => {
          chapter6Articles.push({
            id: `ch6-art${art.number}`,
            articleNumber: articleNumber++,
            title: art.title,
            content: replaceTemplateVars(art.content, serviceInfo),
          });
        });

        // Add AI disclaimer if AI feature selected
        if (selectedFeatures.includes('ai_feature')) {
          chapter6Articles.push({
            id: 'ch6-art-ai',
            articleNumber: articleNumber++,
            title: '제12조의2 (AI 서비스 관련 특약)',
            content: `① 회사가 제공하는 AI 서비스는 참고용이며, AI가 생성한 결과물의 정확성, 적법성, 유용성 등을 보장하지 않습니다.
② 회원은 AI 서비스를 이용하여 얻은 결과물을 자신의 판단과 책임 하에 사용하여야 합니다.
③ 회사는 AI 서비스 이용 과정에서 수집된 데이터를 서비스 개선 및 학습 목적으로 활용할 수 있습니다.
④ AI 서비스는 자동화된 시스템으로 운영되며, 특정 결과물에 대한 회사의 의도를 반영하지 않습니다.`,
          });
        }

        chapters.push({
          id: 'chapter6',
          chapterNumber: 6,
          title: basicTermsTemplate.chapter6.title,
          articles: chapter6Articles,
        });

        // Chapter 7: Paid services (if selected)
        if (selectedFeatures.includes('paid_service') || selectedFeatures.includes('ecommerce')) {
          const paidArticles: TermsArticle[] = [];
          
          paidArticles.push({
            id: 'ch7-art1',
            articleNumber: articleNumber++,
            title: '제14조 (유료서비스의 내용)',
            content: `① 회사가 제공하는 유료서비스의 내용은 서비스 내 별도 안내 페이지에 게시합니다.
② 유료서비스의 이용 요금, 결제 방식, 이용 기간 등은 서비스별로 다를 수 있습니다.`,
          });

          paidArticles.push({
            id: 'ch7-art2',
            articleNumber: articleNumber++,
            title: '제15조 (결제)',
            content: `① 회원은 회사가 정한 방법(신용카드, 계좌이체, 휴전화 결제 등)을 통해 유료서비스 요금을 결제합니다.
② 미성년자가 유료서비스를 이용하려는 경우 법정대리인의 동의를 받아야 합니다.
③ 결제 과정에서 발생하는 오류로 인한 손해에 대해 회사는 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다.`,
          });

          paidArticles.push({
            id: 'ch7-art3',
            articleNumber: articleNumber++,
            title: '제16조 (청약철회 및 환불)',
            content: `① 회원은 유료서비스 구매일로부터 7일 이내에 청약을 철회할 수 있습니다. 다만, 다음 각 호의 경우는 예외로 합니다.
1. 즉시 사용이 시작되는 서비스
2. 추가 혜택이 제공되는 서비스에서 추가 혜택을 사용한 경우
3. 개봉 또는 사용으로 인해 재판매가 곤란한 경우
② 회사는 청약철회 요청을 접수한 날로부터 3영업일 이내에 환불을 처리합니다.
③ 환불 금액은 실제 결제 금액에서 이용 기간에 해당하는 금액과 수수료를 차감하여 산정합니다.`,
          });

          // Add subscription specific articles
          if (selectedFeatures.includes('subscription')) {
            paidArticles.push({
              id: 'ch7-art4',
              articleNumber: articleNumber++,
              title: '제17조 (정기결제 및 자동 갱신)',
              content: `① 구독 서비스는 매 결제 주기가 종료되는 시점에 자동으로 갱신됩니다.
② 회원은 갱신일 전까지 서비스 내 설정에서 자동 갱신을 해지할 수 있습니다.
③ 회사는 요금 변경 시 변경 적용일 30일 전에 회원에게 통지합니다.
④ 회원이 요금 변경에 동의하지 않는 경우 변경 적용일 전까지 이용계약을 해지할 수 있습니다.`,
            });
          }

          // Add ecommerce specific articles
          if (selectedFeatures.includes('ecommerce')) {
            paidArticles.push({
              id: 'ch7-art5',
              articleNumber: articleNumber++,
              title: '제18조 (재화의 배송)',
              content: `① 회사는 회원이 주문한 재화를 결제 완료일로부터 3~7일 이내에 배송합니다. 단, 천재지변 등 불가항력적인 사유가 있는 경우는 예외로 합니다.
② 배송 지연 시 회사는 회원에게 지체 없이 통지하고 적절한 보상을 제공합니다.`,
            });
            paidArticles.push({
              id: 'ch7-art6',
              articleNumber: articleNumber++,
              title: '제19조 (교환 및 반품)',
              content: `① 회원은 재화를 수령한 날로부터 7일 이내에 교환 또는 반품을 신청할 수 있습니다.
② 다음 각 호의 경우 교환 및 반품이 제한될 수 있습니다.
1. 회원의 책임 있는 사유로 재화가 멸실 또는 훼손된 경우
2. 포장을 개봉하여 재판매가 곤란한 경우
3. 시간이 지나 다시 판매하기 곤란할 정도로 재화의 가치가 현저히 감소한 경우`,
            });
          }

          chapters.push({
            id: 'chapter7',
            chapterNumber: 7,
            title: '제7장 유료서비스',
            articles: paidArticles,
          });
        }

        // Chapter 8: Location based (if selected)
        if (selectedFeatures.includes('location')) {
          chapters.push({
            id: 'chapter8',
            chapterNumber: 8,
            title: '제8장 위치기반서비스',
            articles: [
              {
                id: 'ch8-art1',
                articleNumber: articleNumber++,
                title: '제20조 (위치정보의 수집 및 이용)',
                content: `① 회사는 회원의 위치정보를 수집·이용하기 위하여 사전에 동의를 받습니다.
② 위치정보는 서비스 제공 목적에만 사용되며, 회원이 동의를 철회하면 즉시 수집을 중단하고 관련 데이터를 삭제합니다.
③ 회사는 위치정보의 보호를 위하여 위치정보관리책임자를 지정하고 있습니다.`,
              },
              {
                id: 'ch8-art2',
                articleNumber: articleNumber++,
                title: '제21조 (위치정보관리책임자)',
                content: `① 회사의 위치정보관리책임자는 다음과 같습니다.
- 성명: {representative}
- 연락처: {contactEmail}
② 회원은 위치정보와 관련된 문의사항을 위 연락처로 문의할 수 있습니다.`,
              },
            ],
          });
        }

        // Chapter 9: Global/Misc (if selected)
        if (selectedFeatures.includes('global') || selectedFeatures.includes('minor')) {
          const miscArticles: TermsArticle[] = [];

          if (selectedFeatures.includes('global')) {
            miscArticles.push({
              id: 'ch9-art1',
              articleNumber: articleNumber++,
              title: '제22조 (국제 분쟁)',
              content: `① 이 약관은 대한민국 법에 따라 규율되고 해석됩니다.
② 회사와 회원 간에 발생한 분쟁은 상호 협의하여 해결하며, 협의가 이루어지지 않는 경우 대한민국 법원의 관할에 따릅니다.
③ 해외에 거주하는 회원의 경우, 회사는 해당 국가의 법률을 준수하여 서비스를 제공합니다.`,
            });
          }

          if (selectedFeatures.includes('minor')) {
            miscArticles.push({
              id: 'ch9-art2',
              articleNumber: articleNumber++,
              title: '제23조 (미성년자 이용)',
              content: `① 만 14세 미만의 아동은 법정대리인의 동의를 받은 경우에만 서비스를 이용할 수 있습니다.
② 법정대리인은 아동의 개인정보에 대한 열림, 정정, 삭제를 요청할 수 있습니다.
③ 회사는 청소년 보호를 위하여 연령 확인 절차를 진행할 수 있습니다.`,
            });
          }

          if (miscArticles.length > 0) {
            chapters.push({
              id: 'chapter9',
              chapterNumber: 9,
              title: '제9장 기타',
              articles: miscArticles,
            });
          }
        }

        const document: GeneratedTerms = {
          title: `${serviceInfo.serviceName} 서비스 이용약관`,
          content: generateFullText(chapters),
          chapters,
          generatedAt: new Date(),
          version: 1
        };

        set({ document });
      },

      updateArticle: (chapterId: string, articleId: string, content: string) => {
        const currentDoc = get().document;
        if (!currentDoc) return;

        const newChapters = currentDoc.chapters.map(ch => {
          if (ch.id !== chapterId) return ch;
          return {
            ...ch,
            articles: ch.articles.map(art =>
              art.id === articleId ? { ...art, content } : art
            )
          };
        });

        set({
          document: {
            ...currentDoc,
            chapters: newChapters,
            content: generateFullText(newChapters)
          }
        });
      },

      reset: () => set({
        currentStep: 'service-info',
        serviceInfo: initialServiceInfo,
        selectedFeatures: ['basic'],
        featureInputs: { basic: { enabled: true, details: {} } } as Record<TermsFeatureType, TermsFeatureInput>,
        document: null,
        isAdvancedMode: false,
        completionRate: 0,
      })
    }),
    {
      name: 'terms-of-service-generator',
      partialize: (state) => ({
        serviceInfo: state.serviceInfo,
        selectedFeatures: state.selectedFeatures,
        featureInputs: state.featureInputs,
        isAdvancedMode: state.isAdvancedMode,
        completionRate: state.completionRate,
      })
    }
  )
);

// Helper functions
function replaceTemplateVars(content: string, serviceInfo: TermsServiceInfo): string {
  return content
    .replace(/{companyName}/g, serviceInfo.companyName || '회사')
    .replace(/{serviceName}/g, serviceInfo.serviceName || '서비스')
    .replace(/{representative}/g, serviceInfo.representative || '대표')
    .replace(/{contactEmail}/g, serviceInfo.contactEmail || 'contact@example.com');
}

function generateFullText(chapters: TermsChapter[]): string {
  return chapters.map(ch => {
    const articlesText = ch.articles.map(art => 
      `${art.title}\n\n${art.content}`
    ).join('\n\n');
    return `${ch.title}\n\n${articlesText}`;
  }).join('\n\n');
}
