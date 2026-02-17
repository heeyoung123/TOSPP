import { useEffect, useState } from 'react';
import { useTermsStore } from '@/store/termsStore';
import { termsFeatures, getDefaultFeaturesForServiceType } from '@/data/termsFeatures';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { 
  FileText, CreditCard, Repeat, ShoppingCart, MessageSquare,
  Brain, MapPin, Globe, Baby, Search, Info,
  CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TermsFeatureType } from '@/types/terms';

const iconMap: Record<string, React.ElementType> = {
  FileText, CreditCard, Repeat, ShoppingCart, MessageSquare,
  Brain, MapPin, Globe, Baby,
};

export function FeatureSelectionForm() {
  const { 
    serviceInfo, 
    selectedFeatures, 
    toggleFeature, 
    isAdvancedMode, 
    setAdvancedMode,
    setFeatureInput
  } = useTermsStore();
  
  const [searchQuery, setSearchQuery] = useState('');

  // Pre-select default features when service type changes
  useEffect(() => {
    if (serviceInfo.serviceType && selectedFeatures.length <= 1) {
      const defaults = getDefaultFeaturesForServiceType(serviceInfo.serviceType);
      defaults.forEach(featureId => {
        if (featureId !== 'basic' && !selectedFeatures.includes(featureId as TermsFeatureType)) {
          toggleFeature(featureId as TermsFeatureType);
          setFeatureInput(featureId as TermsFeatureType, { enabled: true });
        }
      });
    }
  }, [serviceInfo.serviceType]);

  const filteredFeatures = termsFeatures.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = isAdvancedMode ? true : feature.category === 'basic';
    return matchesSearch && matchesMode;
  });

  const basicFeatures = filteredFeatures.filter(feature => feature.category === 'basic');
  const advancedFeatures = filteredFeatures.filter(feature => feature.category === 'advanced');

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Mode Toggle & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setAdvancedMode(false)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
                  !isAdvancedMode ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                )}
              >
                기본 모드
              </button>
              <button
                onClick={() => setAdvancedMode(true)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
                  isAdvancedMode ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                )}
              >
                고급 모드
              </button>
            </div>
            {!isAdvancedMode && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Sparkles className="w-3 h-3 mr-1" />
                추천
              </Badge>
            )}
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="기능 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Selection Counter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">
              <strong className="text-slate-900">{selectedFeatures.length}</strong>개 기능 선택됨
            </span>
            {selectedFeatures.some(id => {
              const feature = termsFeatures.find(f => f.id === id);
              return feature?.needsLegalNotice;
            }) && (
              <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                <AlertCircle className="w-3 h-3 mr-1" />
                법적 고지 필요
              </Badge>
            )}
          </div>
        </div>

        {/* Basic Features */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            기본 기능
            <Badge variant="secondary" className="text-xs">필수</Badge>
          </h3>
          <div className="grid gap-3">
            {basicFeatures.map((feature) => {
              const Icon = iconMap[feature.icon] || FileText;
              const isSelected = selectedFeatures.includes(feature.id);
              
              return (
                <Tooltip key={feature.id}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        'flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200',
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      )}
                    >
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                        isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn(
                            'font-medium',
                            isSelected ? 'text-slate-900' : 'text-slate-700'
                          )}>
                            {feature.name}
                          </span>
                          <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                            필수
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{feature.description}</p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-sm">{feature.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Advanced Features */}
        {isAdvancedMode && advancedFeatures.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              고급 기능
              <Badge variant="secondary" className="text-xs">선택적</Badge>
            </h3>
            <div className="grid gap-3">
              {advancedFeatures.map((feature) => {
                const Icon = iconMap[feature.icon] || FileText;
                const isSelected = selectedFeatures.includes(feature.id);
                
                return (
                  <Tooltip key={feature.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          'flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer',
                          isSelected
                            ? 'border-blue-500 bg-blue-50/50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        )}
                        onClick={() => toggleFeature(feature.id)}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleFeature(feature.id)}
                          className="mt-0.5"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                          isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                        )}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={cn(
                              'font-medium',
                              isSelected ? 'text-slate-900' : 'text-slate-700'
                            )}>
                              {feature.name}
                            </span>
                            {feature.needsLegalNotice && (
                              <Badge variant="outline" className="text-xs text-amber-600 border-amber-200">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                법적 고지
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 mt-1">{feature.description}</p>
                          {feature.relatedLaws.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {feature.relatedLaws.map(law => (
                                <span key={law} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                                  {law}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-sm">{feature.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="bg-slate-50 rounded-lg p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <div className="text-sm text-slate-600">
            <p className="font-medium text-slate-900 mb-1">기능 선택 가이드</p>
            <p>서비스에서 제공하는 기능을 선택하면 해당 기능에 필요한 법률 조항이 자동으로 추가됩니다. 법적 고지가 필요한 기능은 별도 표시됩니다.</p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
