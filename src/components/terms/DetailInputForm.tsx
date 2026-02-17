import { useState } from 'react';
import { useTermsStore } from '@/store/termsStore';
import { termsFeatures } from '@/data/termsFeatures';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  FileText, CreditCard, Repeat, ShoppingCart, MessageSquare,
  Brain, MapPin, Globe, Baby, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PAYMENT_METHODS, WITHDRAWAL_PERIODS, SHIPPING_PERIODS } from '@/types/terms';

const iconMap: Record<string, React.ElementType> = {
  FileText, CreditCard, Repeat, ShoppingCart, MessageSquare,
  Brain, MapPin, Globe, Baby,
};

export function TermsDetailInputForm() {
  const { 
    selectedFeatures, 
    featureInputs, 
    setFeatureInput,
  } = useTermsStore();

  const [expandedFeatures, setExpandedFeatures] = useState<string[]>(selectedFeatures);

  const toggleExpand = (featureId: string) => {
    setExpandedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  if (selectedFeatures.length <= 1) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">추가 기능을 선택해주세요</h3>
        <p className="text-sm text-slate-500">기본 조항 외에 추가 기능을 선택하면 상세 설정이 가능합니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          <strong className="text-slate-900">{selectedFeatures.length - 1}개</strong> 추가 기능의 상세 정보를 입력해주세요
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setExpandedFeatures(selectedFeatures)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            모두 펼치기
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => setExpandedFeatures([])}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            모두 접기
          </button>
        </div>
      </div>

      <Accordion type="multiple" value={expandedFeatures} className="space-y-3">
        {selectedFeatures.filter(id => id !== 'basic').map((featureId) => {
          const feature = termsFeatures.find(f => f.id === featureId);
          if (!feature) return null;

          const Icon = iconMap[feature.icon] || FileText;
          const input = featureInputs[featureId] || { enabled: true, details: {} };

          return (
            <AccordionItem 
              key={featureId} 
              value={featureId}
              className="border border-slate-200 rounded-xl overflow-hidden data-[state=open]:border-blue-300"
            >
              <AccordionTrigger 
                className="px-4 py-4 hover:no-underline hover:bg-slate-50"
                onClick={() => toggleExpand(featureId)}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{feature.name}</span>
                      {feature.needsLegalNotice && (
                        <Badge variant="outline" className="text-xs text-amber-600 border-amber-200">
                          법적 고지
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">{feature.description}</p>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-4 pb-4">
                <div className="pt-4 space-y-5">
                  {/* Paid Service Details */}
                  {featureId === 'paid_service' && (
                    <>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">결제 수단</Label>
                        <div className="flex flex-wrap gap-2">
                          {PAYMENT_METHODS.map((method) => (
                            <button
                              key={method.value}
                              type="button"
                              onClick={() => {
                                const current = input.details?.paymentMethods || [];
                                const newMethods = current.includes(method.value)
                                  ? current.filter((m: string) => m !== method.value)
                                  : [...current, method.value];
                                setFeatureInput(featureId, {
                                  details: { ...input.details, paymentMethods: newMethods }
                                });
                              }}
                              className={cn(
                                'px-3 py-1.5 text-sm rounded-full border transition-all',
                                (input.details?.paymentMethods || []).includes(method.value)
                                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                              )}
                            >
                              {method.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">청약철회 기간</Label>
                        <div className="flex flex-wrap gap-2">
                          {WITHDRAWAL_PERIODS.map((period) => (
                            <button
                              key={period.value}
                              type="button"
                              onClick={() => setFeatureInput(featureId, {
                                details: { ...input.details, withdrawalPeriod: period.value }
                              })}
                              className={cn(
                                'px-4 py-2 text-sm rounded-lg border transition-all',
                                input.details?.withdrawalPeriod === period.value
                                  ? 'bg-blue-100 border-blue-300 text-blue-700 font-medium'
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                              )}
                            >
                              {period.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">환불 정책</Label>
                        <Textarea
                          placeholder="환불 조건 및 절차를 입력하세요"
                          value={input.details?.refundPolicy || ''}
                          onChange={(e) => setFeatureInput(featureId, {
                            details: { ...input.details, refundPolicy: e.target.value }
                          })}
                          className="min-h-[80px]"
                        />
                      </div>
                    </>
                  )}

                  {/* Subscription Details */}
                  {featureId === 'subscription' && (
                    <>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">자동 갱신</Label>
                        <Switch
                          checked={input.details?.autoRenewal ?? true}
                          onCheckedChange={(checked) => setFeatureInput(featureId, {
                            details: { ...input.details, autoRenewal: checked }
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">해지 사전 통지 기간</Label>
                        <Input
                          placeholder="예: 갱신일 7일 전"
                          value={input.details?.cancellationNotice || ''}
                          onChange={(e) => setFeatureInput(featureId, {
                            details: { ...input.details, cancellationNotice: e.target.value }
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">요금 변경 통지 기간</Label>
                        <Input
                          placeholder="예: 변경 적용일 30일 전"
                          value={input.details?.priceChangeNotice || ''}
                          onChange={(e) => setFeatureInput(featureId, {
                            details: { ...input.details, priceChangeNotice: e.target.value }
                          })}
                        />
                      </div>
                    </>
                  )}

                  {/* E-commerce Details */}
                  {featureId === 'ecommerce' && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">배송 기간</Label>
                        <div className="flex flex-wrap gap-2">
                          {SHIPPING_PERIODS.map((period) => (
                            <button
                              key={period.value}
                              type="button"
                              onClick={() => setFeatureInput(featureId, {
                                details: { ...input.details, shippingPeriod: period.value }
                              })}
                              className={cn(
                                'px-4 py-2 text-sm rounded-lg border transition-all',
                                input.details?.shippingPeriod === period.value
                                  ? 'bg-blue-100 border-blue-300 text-blue-700 font-medium'
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                              )}
                            >
                              {period.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">반품 기간</Label>
                        <Input
                          placeholder="예: 수령일로부터 7일 이내"
                          value={input.details?.returnPeriod || ''}
                          onChange={(e) => setFeatureInput(featureId, {
                            details: { ...input.details, returnPeriod: e.target.value }
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">교환 정책</Label>
                        <Textarea
                          placeholder="교환 조건 및 절차를 입력하세요"
                          value={input.details?.exchangePolicy || ''}
                          onChange={(e) => setFeatureInput(featureId, {
                            details: { ...input.details, exchangePolicy: e.target.value }
                          })}
                          className="min-h-[80px]"
                        />
                      </div>
                    </>
                  )}

                  {/* Community Details */}
                  {featureId === 'community_ugc' && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">게시물 라이선스 범위</Label>
                        <Textarea
                          placeholder="회사가 게시물을 어떤 범위에서 사용할 수 있는지 입력하세요"
                          value={input.details?.contentLicense || ''}
                          onChange={(e) => setFeatureInput(featureId, {
                            details: { ...input.details, contentLicense: e.target.value }
                          })}
                          className="min-h-[80px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">신고 처리 정책</Label>
                        <Textarea
                          placeholder="신고 접수 및 처리 절차를 입력하세요"
                          value={input.details?.reportPolicy || ''}
                          onChange={(e) => setFeatureInput(featureId, {
                            details: { ...input.details, reportPolicy: e.target.value }
                          })}
                          className="min-h-[80px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">계정 차단 기준</Label>
                        <Textarea
                          placeholder="계정 제한/차단 기준을 입력하세요"
                          value={input.details?.banCriteria || ''}
                          onChange={(e) => setFeatureInput(featureId, {
                            details: { ...input.details, banCriteria: e.target.value }
                          })}
                          className="min-h-[80px]"
                        />
                      </div>
                    </>
                  )}

                  {/* AI Feature Details */}
                  {featureId === 'ai_feature' && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">AI 결과물 면책 문구</Label>
                        <Textarea
                          placeholder="AI 생성 결과물에 대한 책임 제한 문구를 입력하세요"
                          value={input.details?.aiDisclaimer || ''}
                          onChange={(e) => setFeatureInput(featureId, {
                            details: { ...input.details, aiDisclaimer: e.target.value }
                          })}
                          className="min-h-[80px]"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">데이터 학습 사용</Label>
                        <Switch
                          checked={input.details?.dataUsage ?? false}
                          onCheckedChange={(checked) => setFeatureInput(featureId, {
                            details: { ...input.details, dataUsage: checked }
                          })}
                        />
                      </div>
                    </>
                  )}

                  {/* Location Details */}
                  {featureId === 'location' && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">위치정보 수집 목적</Label>
                        <Textarea
                          placeholder="위치정보를 수집하는 목적을 입력하세요"
                          value={input.details?.locationPurpose || ''}
                          onChange={(e) => setFeatureInput(featureId, {
                            details: { ...input.details, locationPurpose: e.target.value }
                          })}
                          className="min-h-[80px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">위치정보 보관 기간</Label>
                        <Input
                          placeholder="예: 수집 목적 달성 시까지"
                          value={input.details?.locationRetention || ''}
                          onChange={(e) => setFeatureInput(featureId, {
                            details: { ...input.details, locationRetention: e.target.value }
                          })}
                        />
                      </div>
                    </>
                  )}

                  {/* Global Details */}
                  {featureId === 'global' && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">준거법</Label>
                        <Input
                          placeholder="예: 대한민국 법"
                          value={input.details?.governingLaw || ''}
                          onChange={(e) => setFeatureInput(featureId, {
                            details: { ...input.details, governingLaw: e.target.value }
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">분쟁 해결 방식</Label>
                        <Input
                          placeholder="예: 대한민국 법원의 전속관할"
                          value={input.details?.arbitration || ''}
                          onChange={(e) => setFeatureInput(featureId, {
                            details: { ...input.details, arbitration: e.target.value }
                          })}
                        />
                      </div>
                    </>
                  )}

                  {/* Minor Details */}
                  {featureId === 'minor' && (
                    <>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">법정대리인 동의 필수</Label>
                        <Switch
                          checked={input.details?.parentalConsent ?? true}
                          onCheckedChange={(checked) => setFeatureInput(featureId, {
                            details: { ...input.details, parentalConsent: checked }
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">연령 제한</Label>
                        <Input
                          placeholder="예: 만 14세 미만"
                          value={input.details?.ageLimit || ''}
                          onChange={(e) => setFeatureInput(featureId, {
                            details: { ...input.details, ageLimit: e.target.value }
                          })}
                        />
                      </div>
                    </>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
