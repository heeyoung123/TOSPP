import { useState, useRef } from 'react';
import { useTermsStore } from '@/store/termsStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Copy, FileText, FileCode, Download, CheckCircle2,
  FileDown, Globe
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function TermsExportOptions() {
  const { document: generatedDoc, serviceInfo } = useTermsStore();
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!generatedDoc) return null;

  const handleCopy = async () => {
    const plainText = generatedDoc.chapters
      .map(ch => `${ch.title}\n\n${ch.articles.map(art => `${art.title}\n${art.content}`).join('\n\n')}`)
      .join('\n\n');
    
    try {
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePDFDownload = async () => {
    const element = contentRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      let position = 0;
      let heightLeft = imgHeight;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight * ratio);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight * ratio);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${serviceInfo.serviceName}_이용약관.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
    }
  };

  const handleHTMLDownload = () => {
    const htmlContent = generateFullHTML(generatedDoc, serviceInfo);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${serviceInfo.serviceName}_이용약관.html`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleTextDownload = () => {
    const plainText = generatedDoc.chapters
      .map(ch => `${ch.title}\n\n${ch.articles.map(art => `${art.title}\n${art.content}`).join('\n\n')}`)
      .join('\n\n');
    
    const blob = new Blob([plainText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${serviceInfo.serviceName}_이용약관.txt`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Export Options */}
      <Tabs defaultValue="copy" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="copy">
            <Copy className="w-4 h-4 mr-2" />
            복사
          </TabsTrigger>
          <TabsTrigger value="pdf">
            <FileDown className="w-4 h-4 mr-2" />
            PDF
          </TabsTrigger>
          <TabsTrigger value="html">
            <FileCode className="w-4 h-4 mr-2" />
            HTML
          </TabsTrigger>
          <TabsTrigger value="text">
            <FileText className="w-4 h-4 mr-2" />
            텍스트
          </TabsTrigger>
        </TabsList>

        <TabsContent value="copy" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  {copied ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  ) : (
                    <Copy className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-900">
                    {copied ? '복사 완료!' : '클립보드에 복사'}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    문서 내용을 클립보드에 복사하여 원하는 곳에 붙여넣으세요.
                  </p>
                </div>
                <Button 
                  onClick={handleCopy} 
                  className="w-full sm:w-auto"
                  variant={copied ? 'outline' : 'default'}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      복사됨
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      내용 복사하기
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pdf" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <FileDown className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-900">PDF 다운로드</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    A4 크기의 PDF 파일로 다운로드합니다.
                  </p>
                </div>
                <Button onClick={handlePDFDownload} className="w-full sm:w-auto">
                  <Download className="w-4 h-4 mr-2" />
                  PDF 다운로드
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="html" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <FileCode className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-900">HTML 다운로드</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    웹사이트에 바로 적용할 수 있는 HTML 파일입니다.
                  </p>
                </div>
                <Button onClick={handleHTMLDownload} className="w-full sm:w-auto">
                  <Download className="w-4 h-4 mr-2" />
                  HTML 다운로드
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-900">텍스트 다운로드</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    순수 텍스트 형식으로 다운로드합니다.
                  </p>
                </div>
                <Button onClick={handleTextDownload} className="w-full sm:w-auto">
                  <Download className="w-4 h-4 mr-2" />
                  텍스트 다운로드
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Embed Code */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="w-4 h-4" />
            웹사이트 연동
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 mb-3">
            웹사이트 푸터에 이용약관 링크를 추가하세요.
          </p>
          <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-slate-300">
              {`<a href="/terms-of-service">이용약관</a>`}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Hidden content for PDF generation */}
      <div 
        ref={contentRef} 
        className="absolute left-[-9999px] top-0 bg-white p-8"
        style={{ width: '210mm' }}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">서비스 이용약관</h1>
          <p className="text-sm text-gray-600">{serviceInfo.companyName}</p>
          <p className="text-sm text-gray-500">{new Date().toLocaleDateString('ko-KR')}</p>
        </div>
        {generatedDoc.chapters.map((chapter) => (
          <div key={chapter.id} className="mb-6">
            <h2 className="text-xl font-bold mb-4">{chapter.title}</h2>
            {chapter.articles.map((article) => (
              <div key={article.id} className="mb-4">
                <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                <div className="text-sm whitespace-pre-line">{article.content}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function generateFullHTML(document: any, serviceInfo: any): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>서비스 이용약관 - ${serviceInfo.serviceName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 40px 20px; color: #333; }
    h1 { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
    h2 { font-size: 1.3em; margin-top: 30px; margin-bottom: 15px; color: #1a1a1a; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
    h3 { font-size: 1.1em; margin-top: 20px; margin-bottom: 10px; color: #333; }
    p { margin-bottom: 10px; white-space: pre-line; }
    .meta-info { text-align: center; color: #666; font-size: 0.9em; margin-top: 10px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>서비스 이용약관</h1>
  <p class="meta-info">${serviceInfo.companyName} | 시행일: ${new Date().toLocaleDateString('ko-KR')}</p>
  
  ${document.chapters.map((ch: any) => `
    <h2>${ch.title}</h2>
    ${ch.articles.map((art: any) => `
      <h3>${art.title}</h3>
      <p>${art.content}</p>
    `).join('')}
  `).join('')}
</body>
</html>`;
}
