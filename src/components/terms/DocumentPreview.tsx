import { useEffect, useRef, useState } from 'react';
import { useTermsStore } from '@/store/termsStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Edit2, Eye, Clock, AlertTriangle,
  CheckCircle2, ChevronUp
} from 'lucide-react';

export function TermsDocumentPreview() {
  const { document: generatedDoc, generateDocument, updateArticle, serviceInfo } = useTermsStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingArticle, setEditingArticle] = useState<{chapterId: string, articleId: string} | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generateDocument();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setShowScrollTop(scrollRef.current.scrollTop > 300);
      }
    };
    scrollRef.current?.addEventListener('scroll', handleScroll);
    return () => scrollRef.current?.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToArticle = (chapterId: string, articleId: string) => {
    const element = window.document.getElementById(`article-${chapterId}-${articleId}`);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEditStart = (chapterId: string, articleId: string, content: string) => {
    setEditingArticle({ chapterId, articleId });
    setEditContent(content);
  };

  const handleEditSave = () => {
    if (editingArticle) {
      updateArticle(editingArticle.chapterId, editingArticle.articleId, editContent);
      setEditingArticle(null);
      setEditContent('');
    }
  };

  const handleEditCancel = () => {
    setEditingArticle(null);
    setEditContent('');
  };

  if (!generatedDoc) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">문서를 생성하고 있습니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-slate-500" />
            <Switch
              checked={isEditMode}
              onCheckedChange={setIsEditMode}
              id="edit-mode"
            />
            <Label htmlFor="edit-mode" className="text-sm cursor-pointer">
              {isEditMode ? '편집 모드' : '읽기 모드'}
            </Label>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock className="w-4 h-4" />
          <span>방금 업데이트됨</span>
        </div>
      </div>

      {/* TOC + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* TOC Sidebar */}
        <div className="w-48 border-r border-slate-200 bg-slate-50 hidden lg:block">
          <ScrollArea className="h-full">
            <div className="p-4">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                목차
              </h4>
              <nav className="space-y-2">
                {generatedDoc.chapters.map((chapter) => (
                  <div key={chapter.id}>
                    <div className="text-sm font-medium text-slate-900 mb-1">
                      {chapter.title}
                    </div>
                    <div className="pl-2 space-y-1">
                      {chapter.articles.map((article) => (
                        <button
                          key={article.id}
                          onClick={() => scrollToArticle(chapter.id, article.id)}
                          className="w-full text-left text-xs text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded px-2 py-1 transition-colors"
                        >
                          {article.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </ScrollArea>
        </div>

        {/* Document Content */}
        <div className="flex-1 relative">
          <ScrollArea ref={scrollRef} className="h-full">
            <div className="max-w-3xl mx-auto p-8">
              {/* Legal Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">법률 자문 고지</p>
                  <p className="text-sm text-amber-700 mt-1">
                    본 서비스는 법률 자문이 아니며, 생성된 문서는 참고용입니다. 
                    최종 배포 전 법무 전문가의 검토를 권장합니다.
                  </p>
                </div>
              </div>

              {/* Document Header */}
              <div className="text-center mb-8 pb-8 border-b-2 border-slate-900">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                  서비스 이용약관
                </h1>
                <p className="text-sm text-slate-500">
                  {serviceInfo.companyName}
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  시행일: {new Date().toLocaleDateString('ko-KR')}
                </p>
              </div>

              {/* Chapters */}
              <div className="space-y-8">
                {generatedDoc.chapters.map((chapter) => (
                  <div key={chapter.id} className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-900">
                      {chapter.title}
                    </h2>
                    
                    {chapter.articles.map((article) => (
                      <div 
                        key={article.id} 
                        id={`article-${chapter.id}-${article.id}`}
                        className="relative group"
                      >
                        <h3 className="text-lg font-semibold text-slate-800 mb-3">
                          {article.title}
                        </h3>
                        
                        {isEditMode && editingArticle?.chapterId === chapter.id && editingArticle?.articleId === article.id ? (
                          <div className="space-y-3">
                            <Textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="min-h-[200px] font-mono text-sm"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleEditSave}>
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                저장
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleEditCancel}>
                                취소
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="relative">
                            <div className="prose prose-slate max-w-none whitespace-pre-line">
                              {article.content}
                            </div>
                            {isEditMode && (
                              <button
                                onClick={() => handleEditStart(chapter.id, article.id, article.content)}
                                className="absolute top-0 right-0 p-2 text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
                <p>본 이용약관은 AI 생성 도구를 통해 작성되었습니다.</p>
                <p className="mt-1">생성일: {new Date().toLocaleDateString('ko-KR')}</p>
              </div>
            </div>
          </ScrollArea>

          {/* Scroll to top button */}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="absolute bottom-4 right-4 p-2 bg-white border border-slate-200 rounded-full shadow-lg hover:bg-slate-50 transition-all"
            >
              <ChevronUp className="w-5 h-5 text-slate-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
