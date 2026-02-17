import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { processingItems, getDefaultItemsForServiceType } from '@/data/processingItems';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { 
  User, CreditCard, Megaphone, Headphones, BarChart3, 
  Shield, MapPin, Truck, MessageSquare, Search, Info,
  CheckCircle2, AlertCircle, Sparkles,
  Key, Repeat, Mail, Bell, Share2, Undo2, Moon, Smartphone,
  Target, Gift, ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProcessingItemType } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  User,
  CreditCard,
  Megaphone,
  Headphones,
  BarChart3,
  Shield,
  MapPin,
  Truck,
  MessageSquare,
  Key,
  Repeat,
  Mail,
  Bell,
  Share2,
  Undo2,
  Moon,
  Smartphone,
  Target,
  Gift,
  ClipboardList,
};

export function ItemSelectionForm() {
  const { 
    serviceInfo, 
    selectedItems, 
    toggleItem, 
    isAdvancedMode, 
    setAdvancedMode,
    setDetailInput
  } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState('');

  // Pre-select default items when service type changes
  useEffect(() => {
    if (serviceInfo.serviceType && selectedItems.length === 0) {
      const defaults = getDefaultItemsForServiceType(serviceInfo.serviceType);
      defaults.forEach(itemId => {
        toggleItem(itemId as ProcessingItemType);
        // Set default values
        const item = processingItems.find(i => i.id === itemId);
        if (item) {
          setDetailInput(itemId as ProcessingItemType, {
            purpose: item.defaultPurpose,
            retentionPeriod: item.defaultRetention,
          });
        }
      });
    }
  }, [serviceInfo.serviceType]);

  const filteredItems = processingItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = isAdvancedMode ? true : item.category === 'basic';
    return matchesSearch && matchesMode;
  });

  const basicItems = filteredItems.filter(item => item.category === 'basic');
  const advancedItems = filteredItems.filter(item => item.category === 'advanced');

  const handleSelectAll = () => {
    const visibleItems = filteredItems.map(item => item.id);
    const allSelected = visibleItems.every(id => selectedItems.includes(id));
    
    visibleItems.forEach(id => {
      const isCurrentlySelected = selectedItems.includes(id);
      if (allSelected && isCurrentlySelected) {
        toggleItem(id);
      } else if (!allSelected && !isCurrentlySelected) {
        toggleItem(id);
        const item = processingItems.find(i => i.id === id);
        if (item) {
          setDetailInput(id, {
            purpose: item.defaultPurpose,
            retentionPeriod: item.defaultRetention,
          });
        }
      }
    });
  };

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
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                <Sparkles className="w-3 h-3 mr-1" />
                추천
              </Badge>
            )}
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="항목 검색..."
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
              <strong className="text-slate-900">{selectedItems.length}</strong>개 항목 선택됨
            </span>
            {selectedItems.some(id => {
              const item = processingItems.find(i => i.id === id);
              return item?.needsLegalNotice;
            }) && (
              <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                <AlertCircle className="w-3 h-3 mr-1" />
                법적 고지 필요
              </Badge>
            )}
          </div>
          <button
            onClick={handleSelectAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {filteredItems.every(item => selectedItems.includes(item.id)) ? '전체 해제' : '전체 선택'}
          </button>
        </div>

        {/* Basic Items */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            기본 항목
            <Badge variant="secondary" className="text-xs">필수/권장</Badge>
          </h3>
          <div className="grid gap-3">
            {basicItems.map((item) => {
              const Icon = iconMap[item.icon] || User;
              const isSelected = selectedItems.includes(item.id);
              
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        'flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer',
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      )}
                      onClick={() => toggleItem(item.id)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleItem(item.id)}
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
                            {item.name}
                          </span>
                          {item.isRequired && (
                            <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                              필수
                            </Badge>
                          )}
                          {item.isRecommended && !item.isRequired && (
                            <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                              권장
                            </Badge>
                          )}
                          {item.needsLegalNotice && (
                            <Badge variant="outline" className="text-xs text-amber-600 border-amber-200">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              법적 고지
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-sm">{item.tooltip}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      예시: {item.exampleItems.join(', ')}
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Advanced Items */}
        {isAdvancedMode && advancedItems.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              고급 항목
              <Badge variant="secondary" className="text-xs">선택적</Badge>
            </h3>
            <div className="grid gap-3">
              {advancedItems.map((item) => {
                const Icon = iconMap[item.icon] || User;
                const isSelected = selectedItems.includes(item.id);
                
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          'flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer',
                          isSelected
                            ? 'border-blue-500 bg-blue-50/50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        )}
                        onClick={() => toggleItem(item.id)}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleItem(item.id)}
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
                              {item.name}
                            </span>
                            {item.needsLegalNotice && (
                              <Badge variant="outline" className="text-xs text-amber-600 border-amber-200">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                법적 고지
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-sm">{item.tooltip}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        예시: {item.exampleItems.join(', ')}
                      </p>
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
            <p className="font-medium text-slate-900 mb-1">사용 중인 기능을 모르겠어요?</p>
            <p>선택한 항목에 따라 문서가 자동으로 생성됩니다. 필수 항목은 반드시 선택하시고, 나머지는 서비스 기능에 맞게 선택해주세요.</p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
