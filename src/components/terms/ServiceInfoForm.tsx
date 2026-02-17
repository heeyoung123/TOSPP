import { useTermsStore } from '@/store/termsStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { TERMS_SERVICE_TYPE_LABELS } from '@/types/terms';
import type { TermsServiceType } from '@/types/terms';
import { 
  Building2, ShoppingCart, Users, Smartphone, 
  FileText, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

const serviceTypeIcons: Record<TermsServiceType, React.ElementType> = {
  saas: Building2,
  commerce: ShoppingCart,
  community: Users,
  app: Smartphone,
  content: FileText,
  platform: Layers,
};

export function TermsServiceInfoForm() {
  const { serviceInfo, setServiceInfo } = useTermsStore();

  const handleServiceTypeSelect = (type: TermsServiceType) => {
    setServiceInfo({ serviceType: type });
  };

  return (
    <div className="space-y-6">
      {/* Service Type Selection */}
      <div className="space-y-3">
        <Label className="text-base font-medium">서비스 유형</Label>
        <p className="text-sm text-slate-500">서비스 유형을 선택하면 기본 기능이 미리 선택됩니다.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(Object.keys(TERMS_SERVICE_TYPE_LABELS) as TermsServiceType[]).map((type) => {
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
                <span className="text-sm font-medium">{TERMS_SERVICE_TYPE_LABELS[type]}</span>
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
                placeholder="예: 네이버"
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
                placeholder="예: 주식회사 네이버"
                value={serviceInfo.companyName}
                onChange={(e) => setServiceInfo({ companyName: e.target.value })}
                className="h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="representative" className="text-sm font-medium">
                대표자명
              </Label>
              <Input
                id="representative"
                placeholder="예: 홍길동"
                value={serviceInfo.representative}
                onChange={(e) => setServiceInfo({ representative: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessRegistration" className="text-sm font-medium">
                사업자등록번호
              </Label>
              <Input
                id="businessRegistration"
                placeholder="예: 123-45-67890"
                value={serviceInfo.businessRegistration}
                onChange={(e) => setServiceInfo({ businessRegistration: e.target.value })}
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyAddress" className="text-sm font-medium">
              회사 주소
            </Label>
            <Input
              id="companyAddress"
              placeholder="예: 서울특별시 강남구 테헤란로 123"
              value={serviceInfo.companyAddress}
              onChange={(e) => setServiceInfo({ companyAddress: e.target.value })}
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="text-sm font-medium">
                대표 이메일 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="예: support@company.com"
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
    </div>
  );
}
