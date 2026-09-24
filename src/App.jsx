import React, { useState, Suspense, lazy } from 'react';
import { Image, Globe, Video, Loader2, Sparkles, Compass, Search } from 'lucide-react';

// Remote 1: Tra cứu Ảnh (port 3003)
const ImageSearchGallery = lazy(() => import('gallery/ImageSearchGallery'));

// Host App: App.jsx
const WebSearch = lazy(() => import('web_links/WebSearchList'));

// Remote 3: Tra cứu Video Web (port 3004)
const VideoSearchGallery = lazy(() => import('video/VideoSearchGallery'));

export default function App() {
  const [activeTab, setActiveTab] = useState('web'); // Mặc định mở Trang web tra cứu

  const tabs = [
    { id: 'web', label: 'Trang web', icon: Globe, desc: 'Dữ liệu toàn cầu' },
    { id: 'images', label: 'Hình ảnh', icon: Image, desc: 'Kho ảnh trực quan' },
    { id: 'videos', label: 'Video', icon: Video, desc: 'Đa phương tiện' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* Header trung tâm điều phối tìm kiếm */}
      <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Tên ứng dụng */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Compass size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-base tracking-tight text-white">
                OmniSearch <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">HUB</span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Tra cứu thông tin & dữ liệu mạng mở</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
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
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col">
        <Suspense
          fallback={
            <div className="flex-1 flex flex-col items-center justify-center py-32 text-slate-400 gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
                <Search size={18} className="absolute inset-0 m-auto text-blue-400" />
              </div>
              <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">
                Đang nạp module dữ liệu...
              </p>
            </div>
          }
        >
          {activeTab === 'web' && <WebSearch />}
          {activeTab === 'images' && <ImageSearchGallery />}
          {activeTab === 'videos' && <VideoSearchGallery />}
        </Suspense>
      </main>

      {/* Footer tối giản */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        OmniSearch Portal • Kiến trúc Micro-Frontend đa nguồn
      </footer>
    </div>
  );
}