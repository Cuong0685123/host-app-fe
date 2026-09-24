import React, { useState, Suspense, lazy } from 'react';
import { Image, Globe, Video, Loader2, Sparkles, Compass, Search } from 'lucide-react';

const ImageSearchGallery = lazy(() => import('gallery/ImageSearchGallery'));
const WebSearch = lazy(() => import('web_links/WebSearchList'));
const VideoSearchGallery = lazy(() => import('video/VideoSearchGallery'));

export default function App() {
  const [activeTab, setActiveTab] = useState('web');

  const tabs = [
    { id: 'web', label: 'Trang web', icon: Globe },
    { id: 'images', label: 'Hình ảnh', icon: Image },
    { id: 'videos', label: 'Video', icon: Video },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* Header tối ưu chuẩn Mobile */}
      <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:h-16 flex flex-wrap items-center justify-between gap-2">
          
          {/* Logo & Tên ứng dụng */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Compass size={18} className="animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5 font-bold text-sm sm:text-base tracking-tight text-white">
              OmniSearch <span className="text-[9px] px-1 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">HUB</span>
            </div>
          </div>

          {/* Navigation Tabs: Tự co gọn trên mobile */}
          <nav className="flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800 shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Vùng hiển thị Module Micro-Frontend */}
      <main className="w-full max-w-7xl mx-auto px-2 sm:px-6 py-4 flex-1 flex flex-col overflow-x-hidden">
        <Suspense
          fallback={
            <div className="flex-1 flex flex-col items-center justify-center py-32 text-slate-400 gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
                <Search size={16} className="absolute inset-0 m-auto text-blue-400" />
              </div>
              <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">
                Đang nạp dữ liệu...
              </p>
            </div>
          }
        >
          {activeTab === 'web' && <WebSearch />}
          {activeTab === 'images' && <ImageSearchGallery />}
          {activeTab === 'videos' && <VideoSearchGallery />}
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-3 text-center text-[11px] text-slate-500">
        OmniSearch Portal • Kiến trúc Micro-Frontend đa nguồn
      </footer>
    </div>
  );
}