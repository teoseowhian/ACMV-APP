import React, { useState, useEffect } from 'react';
import { HomePagePoster } from './components/HomePagePoster';
import { LabView, LabTabId } from './components/LabView';
import { AskAiTutorModal } from './components/AskAiTutorModal';
import { PdfViewerModal } from './components/PdfViewerModal';

export default function App() {
  const [viewMode, setViewMode] = useState<'poster' | 'lab'>('poster');
  const [activeLabId, setActiveLabId] = useState<LabTabId>('refrigeration');
  const [activePdfPath, setActivePdfPath] = useState<string | null>(null);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState<string | undefined>(undefined);

  // Sync hash routing: #/ -> poster, #/lab/:id -> lab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/lab/')) {
        const labId = hash.replace('#/lab/', '') as LabTabId;
        setActiveLabId(labId || 'refrigeration');
        setViewMode('lab');
      } else {
        setViewMode('poster');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenLab = (labId?: string) => {
    const target = (labId as LabTabId) || 'refrigeration';
    setActiveLabId(target);
    setViewMode('lab');
    window.location.hash = `#/lab/${target}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToPoster = () => {
    setViewMode('poster');
    window.location.hash = '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPdf = (pdfPath: string, _title?: string) => {
    setActivePdfPath(pdfPath);
  };

  const handleClosePdf = () => {
    setActivePdfPath(null);
  };

  const handleOpenAiTutor = (topic?: string) => {
    setAiTopic(topic);
    setIsAiTutorOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Route Views */}
      {viewMode === 'poster' ? (
        <HomePagePoster
          onOpenLab={handleOpenLab}
          onOpenPdf={handleOpenPdf}
          onOpenAiTutor={handleOpenAiTutor}
        />
      ) : (
        <LabView
          initialLabId={activeLabId}
          onBackToPoster={handleBackToPoster}
          onOpenAiTutor={handleOpenAiTutor}
          onOpenPdf={handleOpenPdf}
        />
      )}

      {/* Official Course PDF Viewer Modal */}
      <PdfViewerModal pdfPath={activePdfPath} onClose={handleClosePdf} />

      {/* Socratic AI Tutor Modal */}
      <AskAiTutorModal
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
        initialTopic={aiTopic}
      />
    </div>
  );
}
