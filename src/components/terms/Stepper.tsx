import { Check } from 'lucide-react';
import type { TermsStep } from '@/types/terms';
import { TERMS_STEP_LABELS } from '@/types/terms';
import { cn } from '@/lib/utils';

interface StepperProps {
  currentStep: TermsStep;
  className?: string;
}

const steps: TermsStep[] = ['service-info', 'select-features', 'detail-input', 'preview', 'export'];

export function TermsStepper({ currentStep, className }: StepperProps) {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div key={step} className="flex items-center flex-1">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200',
                    isCompleted && 'bg-blue-500 text-white',
                    isCurrent && 'bg-blue-600 text-white ring-4 ring-blue-100',
                    isUpcoming && 'bg-slate-200 text-slate-500'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium hidden sm:block',
                    isCompleted && 'text-blue-600',
                    isCurrent && 'text-blue-600',
                    isUpcoming && 'text-slate-400'
                  )}
                >
                  {TERMS_STEP_LABELS[step].title.split(' ')[0]}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 sm:mx-4 transition-all duration-300',
                    index < currentIndex ? 'bg-blue-500' : 'bg-slate-200'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Current step info */}
      <div className="mt-4 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <span className="text-sm text-slate-500">
            {currentIndex + 1}/{steps.length}
          </span>
          <span className="text-slate-300">·</span>
          <h2 className="text-lg font-semibold text-slate-900">
            {TERMS_STEP_LABELS[currentStep].title}
          </h2>
          <span className="text-slate-300">·</span>
          <span className="text-sm text-slate-500">
            예상 {TERMS_STEP_LABELS[currentStep].estimatedTime}
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          {TERMS_STEP_LABELS[currentStep].subtitle}
        </p>
      </div>
    </div>
  );
}
