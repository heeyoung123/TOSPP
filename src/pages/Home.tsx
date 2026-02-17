import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, Shield, ArrowRight, Sparkles, 
  CheckCircle2, Clock, Zap, Lock
} from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-slate-900">PolicyGen</span>
            </div>
            <nav className="hidden sm:flex items-center gap-6">
              <a href="#features" className="text-sm text-slate-600 hover:text-slate-900">기능</a>
              <a href="#pricing" className="text-sm text-slate-600 hover:text-slate-900">가격</a>
              <a href="#faq" className="text-sm text-slate-600 hover:text-slate-900">FAQ</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            5분이면 완성하는 스마트 문서 생성
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            서비스 필수 법률 문서를<br />
            <span className="text-blue-600">AI로 간편하게</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            개인정보처리방침과 서비스 이용약관을 체크박스 방식으로 쉽게 생성하세요.
            <br className="hidden sm:block" />
            한국 법률 기준을 반영한 전문적인 문서를 5~10분 만에 완성합니다.
          </p>
        </div>
      </section>

      {/* Generator Cards */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Privacy Policy Card */}
            <Link to="/privacy-policy">
              <Card className="group h-full border-2 border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Shield className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    개인정보처리방침
                  </h2>
                  <p className="text-slate-600 mb-6">
                    수집하는 개인정보 항목, 보관 기간, 제3자 제공 등을 
                    체크박스로 선택하여 맞춤형 개인정보처리방침을 생성합니다.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      약 5분
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      19개 항목
                    </span>
                  </div>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    생성하기
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Terms of Service Card */}
            <Link to="/terms-of-service">
              <Card className="group h-full border-2 border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FileText className="w-7 h-7 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    서비스 이용약관
                  </h2>
                  <p className="text-slate-600 mb-6">
                    서비스 유형별 기본 조항에 기능별 추가 조항을 선택하여
                    한국 법률 기준을 반영한 이용약관을 생성합니다.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      약 7분
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      13+ 조항
                    </span>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    생성하기
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              왜 PolicyGen인가?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              법률 전문가가 아니어도 전문적인 법률 문서를 만들 수 있습니다
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">5분 완성</h3>
              <p className="text-sm text-slate-600">
                체크박스 방식으로 빠르게 입력하고 즉시 문서를 받아보세요
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">법률 기준 반영</h3>
              <p className="text-sm text-slate-600">
                개인정볳호법, 전자상거래법 등 한국 법률을 반영
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">AI 문장화</h3>
              <p className="text-sm text-slate-600">
                선택한 항목을 자동으로 전문적인 법률 문장으로 변환
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">다양한 포맷</h3>
              <p className="text-sm text-slate-600">
                PDF, HTML, 텍스트 등 원하는 형식으로 다운로드
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Notice */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">법률 자문 고지</h3>
              <p className="text-sm text-amber-800">
                본 서비스는 법률 자문을 제공하지 않습니다. 생성된 문서는 참고용이며, 
                실제 배포 전 반드시 법무 전문가의 검토를 받으시기 바랍니다. 
                문서의 내용에 따라 관련 법규 준수 여부를 반드시 확인하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-white">PolicyGen</span>
            </div>
            <p className="text-sm">
              © 2024 PolicyGen. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
