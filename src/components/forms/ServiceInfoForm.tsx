import { useAppStore } from '@/store/appStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { SERVICE_TYPE_LABELS } from '@/types';
import type { ServiceType } from '@/types';
import { Building2, ShoppingCart, Users, Smartphone, Store } from 'lucide-react';
import { cn } from '@/lib/utils';

const serviceTypeIcons: Record<ServiceType, React.ElementType> = {
  saas: Building2,
  commerce: ShoppingCart,
  community: Users,
  app: Smartphone,
  offline: Store,
};

export function ServiceInfoForm() {
  const { serviceInfo, setServiceInfo } = useAppStore();

  const handleServiceTypeSelect = (type: ServiceType) => {
    setServiceInfo({ serviceType: type });
  };

  return (
    <div className="space-y-6">
      {/* Service Type Selection */}
      <div className="space-y-3">
        <Label className="text-base font-medium">서비스 유형</Label>
        <p className="text-sm text-slate-500">서비스 유형을 선택하면 기본 체크 항목이 미리 선택됩니다.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {(Object.keys(SERVICE_TYPE_LABELS) as ServiceType[]).map((type) => {
            const Icon = serviceTypeIcons[type];
            const isSelected = serviceInfo.serviceType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleServiceTypeSelect(type)}
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200',
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                )}
              >
                <Icon className={cn('w-6 h-6 mb-2', isSelected ? 'text-blue-500' : 'text-slate-400')} />
                <span className="text-sm font-medium">{SERVICE_TYPE_LABELS[type]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Basic Info */}
      <Card className="border-slate-200">
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="serviceName" className="text-sm font-medium">
                서비스명 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="serviceName"
                placeholder="예: 마켓컬리"
                value={serviceInfo.serviceName}
                onChange={(e) => setServiceInfo({ serviceName: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-medium">
                회사명 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyName"
                placeholder="예: 주식회사 컬리"
                value={serviceInfo.companyName}
                onChange={(e) => setServiceInfo({ companyName: e.target.value })}
                className="h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="text-sm font-medium">
                대표 이메일 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="예: privacy@company.com"
                value={serviceInfo.contactEmail}
                onChange={(e) => setServiceInfo({ contactEmail: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone" className="text-sm font-medium">
                대표 연락처
              </Label>
              <Input
                id="contactPhone"
                placeholder="예: 02-1234-5678"
                value={serviceInfo.contactPhone}
                onChange={(e) => setServiceInfo({ contactPhone: e.target.value })}
                className="h-11"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Officer Info */}
      <Card className="border-slate-200">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-5 bg-blue-500 rounded-full" />
            <h3 className="font-semibold text-slate-900">개인정보 보호책임자</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="privacyOfficerName" className="text-sm font-medium">
                성명
              </Label>
              <Input
                id="privacyOfficerName"
                placeholder="예: 홍길동"
                value={serviceInfo.privacyOfficerName}
                onChange={(e) => setServiceInfo({ privacyOfficerName: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="privacyOfficerContact" className="text-sm font-medium">
                연락처
              </Label>
              <Input
                id="privacyOfficerContact"
                placeholder="예: privacy@company.com"
                value={serviceInfo.privacyOfficerContact}
                onChange={(e) => setServiceInfo({ privacyOfficerContact: e.target.value })}
                className="h-11"
              />
              <p className="text-xs text-slate-500">미입력 시 대표 이메일로 표시됩니다.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
