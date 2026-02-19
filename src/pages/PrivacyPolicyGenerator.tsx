import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { Stepper } from '@/components/stepper/Stepper';
import { ServiceInfoForm } from '@/components/forms/ServiceInfoForm';
import { ItemSelectionForm } from '@/components/forms/ItemSelectionForm';
import { DetailInputForm } from '@/components/forms/DetailInputForm';
import { DocumentPreview } from '@/components/preview/DocumentPreview';
import { ExportOptions } from '@/components/export/ExportOptions';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ChevronLeft, ChevronRight, Sparkles, AlertTriangle,
  RotateCcw, FileText, CheckCircle2, ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Step } from '@/types';
import { processingItems } from '@/data/processingItems';

const steps: Step[] = ['service-info', 'select-items', 'detail-input', 'preview', 'export'];

export function PrivacyPolicyGenerator() {
  const {
    currentStep,
    setStep,
    serviceInfo,
    selectedItems,
    reset
  } = useAppStore();

  const stepProgress: Record<string, number> = {
    'service-info': 20,
    'select-items': 40,
    'detail-input': 60,
    'preview': 80,
    'export': 100,
  };
  const completionRate = stepProgress[currentStep] ?? 0;

  const currentIndex = steps.indexOf(currentStep);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === steps.length - 1;

  // Exit warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (completionRate > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [completionRate]);

  const canProceed = () => {
    switch (currentStep) {
      case 'service-info':
        return serviceInfo.serviceName && serviceInfo.companyName && serviceInfo.contactEmail;
      case 'select-items':
        return selectedItems.length > 0;
      case 'detail-input':
        return selectedItems.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!isLastStep && canProceed()) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleReset = () => {
    if (confirm('모든 입력 내용이 삭제됩니다. 처음부터 다시 시작하시겠습니까?')) {
      reset();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'service-info':
        return <ServiceInfoForm />;
      case 'select-items':
        return <ItemSelectionForm />;
      case 'detail-input':
        return <DetailInputForm />;
      case 'preview':
        return (
          <div className="h-[calc(100vh-280px)] min-h-[500px]">
            <DocumentPreview />
          </div>
        );
      case 'export':
        return <ExportOptions />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-slate-900">개인정보처리방침 생성기</h1>
                  <p className="text-xs text-slate-500 hidden sm:block">5~10분이면 완성되는 스마트 문서 생성</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Progress */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-slate-500">완성도</p>
                  <p className="text-sm font-medium text-slate-900">{completionRate}%</p>
                </div>
                <div className="w-24">
                  <Progress value={completionRate} className="h-2" />
                </div>
              </div>
              
              {/* Reset */}
              <button
                onClick={handleReset}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="처음부터 다시 시작"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel - Input */}
          <div className={cn(
            'lg:col-span-7 space-y-6',
            currentStep === 'preview' && 'lg:col-span-12'
          )}>
            {/* Stepper */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <Stepper currentStep={currentStep} />
            </div>

            {/* Legal Notice */}
            {currentStep !== 'export' && (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <AlertDescription className="text-amber-700 text-sm">
                  본 서비스는 법률 자문이 아니며, 생성된 문서는 참고용입니다. 
                  최종 배포 전 법무 전문가의 검토를 권장합니다.
                </AlertDescription>
              </Alert>
            )}

            {/* Form Content */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              {renderStepContent()}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isFirstStep}
                className={cn(isFirstStep && 'invisible')}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                이전
              </Button>

              {!isLastStep ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  다음
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleReset}
                  variant="outline"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  새 문서 만들기
                </Button>
              )}
            </div>
          </div>

          {/* Right Panel - Preview (Desktop only, except preview step) */}
          {currentStep !== 'preview' && (
            <div className="hidden lg:block lg:col-span-5">
              <div className="sticky top-24">
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <h3 className="font-medium text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      실시간 미리보기
                    </h3>
                    <span className="text-xs text-slate-500">
                      {selectedItems.length}개 항목
                    </span>
                  </div>
                  <div className="h-[calc(100vh-400px)] min-h-[400px] overflow-auto p-4">
                    {selectedItems.length > 0 ? (
                      <PreviewSummary />
                    ) : (
                      <div className="text-center py-12 text-slate-400">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">항목을 선택하면<br />미리보기가 표시됩니다</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Preview Toggle */}
      {currentStep !== 'preview' && currentStep !== 'export' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
          <button
            onClick={() => setStep('preview')}
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-lg font-medium"
          >
            <Eye className="w-5 h-5" />
            미리보기 보기
          </button>
        </div>
      )}
    </div>
  );
}

// Preview Summary Component
function PreviewSummary() {
  const { selectedItems, detailInputs, serviceInfo } = useAppStore();

  return (
    <div className="space-y-4">
      {/* Service Info Summary */}
      <div className="pb-4 border-b border-slate-100">
        <h4 className="text-sm font-medium text-slate-900 mb-2">{serviceInfo.serviceName}</h4>
        <p className="text-xs text-slate-500">{serviceInfo.companyName}</p>
      </div>

      {/* Selected Items */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          선택된 항목
        </h4>
        {selectedItems.map((itemId) => {
          const item = processingItems.find((i: any) => i.id === itemId);
          const input = detailInputs[itemId];
          if (!item) return null;

          return (
            <div key={itemId} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{item.name}</p>
                {input?.retentionPeriod && (
                  <p className="text-xs text-slate-500">
                    보관: {getRetentionLabel(input.retentionPeriod, input.customRetention)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legal Warnings */}
      {selectedItems.some((id: string) => {
        const item = processingItems.find((i: any) => i.id === id);
        return item?.needsLegalNotice;
      }) && (
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-xs text-amber-700 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            법적 고지가 필요한 항목이 포함되어 있습니다.
          </p>
        </div>
      )}
    </div>
  );
}

function getRetentionLabel(value: string, custom: string): string {
  const labels: Record<string, string> = {
    withdrawal: '탈퇴 시',
    '1year': '1년',
    '3years': '3년',
    '5years': '5년',
    custom: custom || '직접 입력',
  };
  return labels[value] || value;
}

// Eye icon for mobile
function Eye(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
