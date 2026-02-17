import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { processingItems } from '@/data/processingItems';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  User, CreditCard, Megaphone, Headphones, BarChart3, 
  Shield, MapPin, Truck, MessageSquare, Plus, X, AlertCircle,
  Key, Repeat, Mail, Bell, Share2, Undo2, Moon, Smartphone,
  Target, Gift, ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProcessingItemType, OutsourcingInfo, ThirdPartyInfo } from '@/types';
import { RETENTION_OPTIONS } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  User, CreditCard, Megaphone, Headphones, BarChart3,
  Shield, MapPin, Truck, MessageSquare,
  Key, Repeat, Mail, Bell, Share2, Undo2, Moon, Smartphone,
  Target, Gift, ClipboardList
};

export function DetailInputForm() {
  const { 
    selectedItems, 
    detailInputs, 
    setDetailInput,
    addOutsourcing,
    removeOutsourcing,
    addThirdParty,
    removeThirdParty,
  } = useAppStore();

  const [expandedItems, setExpandedItems] = useState<string[]>(selectedItems);

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  if (selectedItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">선택된 항목이 없습니다</h3>
        <p className="text-sm text-slate-500">이전 단계에서 처리 항목을 선택해주세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          <strong className="text-slate-900">{selectedItems.length}개</strong> 항목의 상세 정보를 입력해주세요
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setExpandedItems(selectedItems)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            모두 펼치기
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => setExpandedItems([])}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            모두 접기
          </button>
        </div>
      </div>

      <Accordion type="multiple" value={expandedItems} className="space-y-3">
        {selectedItems.map((itemId) => {
          const item = processingItems.find(i => i.id === itemId);
          if (!item) return null;

          const Icon = iconMap[item.icon] || User;
          const input = detailInputs[itemId] || {};

          return (
            <AccordionItem 
              key={itemId} 
              value={itemId}
              className="border border-slate-200 rounded-xl overflow-hidden data-[state=open]:border-blue-300"
            >
              <AccordionTrigger 
                className="px-4 py-4 hover:no-underline hover:bg-slate-50"
                onClick={() => toggleExpand(itemId)}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{item.name}</span>
                      {item.needsLegalNotice && (
                        <Badge variant="outline" className="text-xs text-amber-600 border-amber-200">
                          법적 고지
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">{item.description}</p>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-4 pb-4">
                <div className="pt-4 space-y-5">
                  {/* Purpose */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      수집 목적 <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      placeholder="개인정보 수집 목적을 입력하세요"
                      value={input.purpose || item.defaultPurpose}
                      onChange={(e) => setDetailInput(itemId, { purpose: e.target.value })}
                      className="min-h-[80px] resize-none"
                    />
                    <p className="text-xs text-slate-500">기본값이 제공되었습니다. 필요에 따라 수정하세요.</p>
                  </div>

                  {/* Collection Items */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">수집 항목</Label>
                    <div className="flex flex-wrap gap-2">
                      {item.exampleItems.map((exampleItem) => (
                        <button
                          key={exampleItem}
                          type="button"
                          onClick={() => {
                            const currentItems = input.items || [];
                            const newItems = currentItems.includes(exampleItem)
                              ? currentItems.filter(i => i !== exampleItem)
                              : [...currentItems, exampleItem];
                            setDetailInput(itemId, { items: newItems });
                          }}
                          className={cn(
                            'px-3 py-1.5 text-sm rounded-full border transition-all',
                            (input.items || []).includes(exampleItem)
                              ? 'bg-blue-100 border-blue-300 text-blue-700'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          )}
                        >
                          {exampleItem}
                        </button>
                      ))}
                    </div>
                    <Input
                      placeholder="직접 입력 (쉼표로 구분)"
                      value={input.customItems || ''}
                      onChange={(e) => setDetailInput(itemId, { customItems: e.target.value })}
                      className="mt-2"
                    />
                  </div>

                  {/* Retention Period */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">보관 기간</Label>
                    <div className="flex flex-wrap gap-2">
                      {RETENTION_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setDetailInput(itemId, { retentionPeriod: option.value })}
                          className={cn(
                            'px-4 py-2 text-sm rounded-lg border transition-all',
                            input.retentionPeriod === option.value
                              ? 'bg-blue-100 border-blue-300 text-blue-700 font-medium'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    {input.retentionPeriod === 'custom' && (
                      <Input
                        placeholder="예: 10년"
                        value={input.customRetention || ''}
                        onChange={(e) => setDetailInput(itemId, { customRetention: e.target.value })}
                        className="mt-2"
                      />
                    )}
                  </div>

                  {/* Outsourcing */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">처리 위탁 여부</Label>
                      <Switch
                        checked={input.hasOutsourcing || false}
                        onCheckedChange={(checked) => setDetailInput(itemId, { hasOutsourcing: checked })}
                      />
                    </div>
                    {input.hasOutsourcing && (
                      <div className="space-y-3">
                        {input.outsourcingList?.map((outsourcing) => (
                          <div key={outsourcing.id} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                            <div className="flex-1 grid grid-cols-3 gap-2 text-sm">
                              <span className="font-medium">{outsourcing.companyName}</span>
                              <span className="text-slate-600">{outsourcing.task}</span>
                              <span className="text-slate-500">{outsourcing.country}</span>
                            </div>
                            <button
                              onClick={() => removeOutsourcing(itemId, outsourcing.id)}
                              className="p-1 hover:bg-slate-200 rounded"
                            >
                              <X className="w-4 h-4 text-slate-400" />
                            </button>
                          </div>
                        ))}
                        <OutsourcingForm 
                          onAdd={(info) => addOutsourcing(itemId, info)} 
                        />
                      </div>
                    )}
                  </div>

                  {/* Third Party */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">제3자 제공 여부</Label>
                      <Switch
                        checked={input.hasThirdParty || false}
                        onCheckedChange={(checked) => setDetailInput(itemId, { hasThirdParty: checked })}
                      />
                    </div>
                    {input.hasThirdParty && (
                      <div className="space-y-3">
                        {input.thirdPartyList?.map((thirdParty) => (
                          <div key={thirdParty.id} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                            <div className="flex-1 grid grid-cols-4 gap-2 text-sm">
                              <span className="font-medium">{thirdParty.recipient}</span>
                              <span className="text-slate-600">{thirdParty.purpose}</span>
                              <span className="text-slate-500">{thirdParty.items}</span>
                              <span className="text-slate-500">{thirdParty.retentionPeriod}</span>
                            </div>
                            <button
                              onClick={() => removeThirdParty(itemId, thirdParty.id)}
                              className="p-1 hover:bg-slate-200 rounded"
                            >
                              <X className="w-4 h-4 text-slate-400" />
                            </button>
                          </div>
                        ))}
                        <ThirdPartyForm 
                          onAdd={(info) => addThirdParty(itemId, info)} 
                        />
                      </div>
                    )}
                  </div>

                  {/* Overseas Transfer */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">국외 이전 여부</Label>
                      <Switch
                        checked={input.hasOverseasTransfer || false}
                        onCheckedChange={(checked) => setDetailInput(itemId, { hasOverseasTransfer: checked })}
                      />
                    </div>
                    {input.hasOverseasTransfer && (
                      <OverseasForm 
                        itemId={itemId}
                        currentInfo={input.overseasInfo}
                      />
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

function OutsourcingForm({ onAdd }: { onAdd: (info: OutsourcingInfo) => void }) {
  const [companyName, setCompanyName] = useState('');
  const [task, setTask] = useState('');
  const [country, setCountry] = useState('대한민국');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName && task) {
      onAdd({
        id: Date.now().toString(),
        companyName,
        task,
        country,
      });
      setCompanyName('');
      setTask('');
      setCountry('대한민국');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="수탁업첼명"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        className="flex-1"
      />
      <Input
        placeholder="위탁업무"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="flex-1"
      />
      <Input
        placeholder="국가"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="w-28"
      />
      <Button type="submit" size="sm" variant="outline">
        <Plus className="w-4 h-4" />
      </Button>
    </form>
  );
}

function ThirdPartyForm({ onAdd }: { onAdd: (info: ThirdPartyInfo) => void }) {
  const [recipient, setRecipient] = useState('');
  const [purpose, setPurpose] = useState('');
  const [items, setItems] = useState('');
  const [retentionPeriod, setRetentionPeriod] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipient && purpose && items) {
      onAdd({
        id: Date.now().toString(),
        recipient,
        purpose,
        items,
        retentionPeriod: retentionPeriod || '제공 목적 달성 시',
      });
      setRecipient('');
      setPurpose('');
      setItems('');
      setRetentionPeriod('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2">
      <Input
        placeholder="제공받는 자"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <Input
        placeholder="제공 목적"
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
      />
      <Input
        placeholder="제공 항목"
        value={items}
        onChange={(e) => setItems(e.target.value)}
      />
      <div className="flex gap-2">
        <Input
          placeholder="보유·이용기간"
          value={retentionPeriod}
          onChange={(e) => setRetentionPeriod(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="sm" variant="outline">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}

import { useAppStore as useStoreForOverseas } from '@/store/appStore';

function OverseasForm({ 
  itemId, 
  currentInfo 
}: { 
  itemId: ProcessingItemType; 
  currentInfo: any;
}) {
  const { setOverseasInfo } = useStoreForOverseas();
  const [info, setInfo] = useState({
    country: currentInfo?.country || '',
    transferDate: currentInfo?.transferDate || '',
    method: currentInfo?.method || '',
    trustee: currentInfo?.trustee || '',
    contact: currentInfo?.contact || '',
  });

  const handleChange = (field: string, value: string) => {
    const newInfo = { ...info, [field]: value };
    setInfo(newInfo);
    setOverseasInfo(itemId, newInfo);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Input
        placeholder="이전 국가"
        value={info.country}
        onChange={(e) => handleChange('country', e.target.value)}
      />
      <Input
        placeholder="이전 일시"
        value={info.transferDate}
        onChange={(e) => handleChange('transferDate', e.target.value)}
      />
      <Input
        placeholder="이전 방법"
        value={info.method}
        onChange={(e) => handleChange('method', e.target.value)}
      />
      <Input
        placeholder="수탁자"
        value={info.trustee}
        onChange={(e) => handleChange('trustee', e.target.value)}
      />
      <Input
        placeholder="연락처"
        value={info.contact}
        onChange={(e) => handleChange('contact', e.target.value)}
        className="col-span-2"
      />
    </div>
  );
}
