import React from 'react';
import { ArrowLeft, Upload, Maximize, ZoomIn, Smile, MapPin, UserPlus, ChevronRight, ChevronDown, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Create() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-10 relative">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0" />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-6xl bg-white dark:bg-[#192b33] rounded-xl shadow-2xl overflow-hidden flex flex-col h-[85vh]"
      >
        <header className="flex items-center justify-between border-b border-slate-200 dark:border-[#233c48] px-6 py-4 bg-white dark:bg-[#192b33] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-[#233c48] rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold tracking-tight">Create new post</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-100 dark:bg-[#233c48] p-1 rounded-lg">
              <button className="px-4 py-1.5 text-sm font-semibold rounded-md bg-white dark:bg-[#111c22] shadow-sm text-primary">Post</button>
              <button className="px-4 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">Reel</button>
            </div>
            <button className="bg-primary hover:bg-primary/90 text-[#111c22] px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-primary/20">
              Share
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          <div className="flex-1 bg-slate-50 dark:bg-[#111c22] flex items-center justify-center p-8 border-r border-slate-200 dark:border-[#233c48] relative overflow-hidden">
            <div className="flex flex-col items-center text-center max-w-sm">
              <div className="w-24 h-24 mb-6 rounded-full bg-slate-200 dark:bg-[#233c48] flex items-center justify-center text-slate-400 dark:text-[#45748c]">
                <Upload className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold mb-2">Drag photos and videos here</h3>
              <p className="text-slate-500 dark:text-[#92b7c9] mb-8 text-sm">Upload up to 10 photos and videos in a single post.</p>
              <button className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-5 py-2.5 rounded-lg font-bold text-sm transition-colors">
                Select from computer
              </button>
            </div>
            <div className="absolute bottom-6 left-6 flex gap-2">
              <button className="bg-black/40 hover:bg-black/60 backdrop-blur-md p-2 rounded-full text-white transition-colors">
                <Maximize className="w-5 h-5" />
              </button>
              <button className="bg-black/40 hover:bg-black/60 backdrop-blur-md p-2 rounded-full text-white transition-colors">
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
          </div>

          <aside className="w-full md:w-[400px] flex flex-col bg-white dark:bg-[#192b33] overflow-y-auto hide-scrollbar">
            <div className="px-6 py-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px]">
                <div className="w-full h-full rounded-full bg-white dark:bg-[#111c22] p-[2px]">
                  <img src="https://picsum.photos/seed/user/100/100" className="w-full h-full rounded-full object-cover" alt="" referrerPolicy="no-referrer" />
                </div>
              </div>
              <span className="font-bold text-sm">alex_design_studio</span>
            </div>

            <div className="px-6 pb-4">
              <textarea 
                className="w-full h-40 bg-transparent border-none focus:ring-0 p-0 text-base placeholder:text-slate-400 dark:placeholder:text-[#45748c] resize-none" 
                placeholder="Write a caption..."
              />
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-[#233c48]">
                <button className="text-slate-400 dark:text-[#92b7c9] hover:text-primary transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
                <span className="text-xs text-slate-400 dark:text-[#45748c]">0/2,200</span>
              </div>
            </div>

            <div className="flex flex-col border-t border-slate-200 dark:border-[#233c48]">
              <button className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-[#233c48]/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                  <span className="text-sm font-medium">Add location</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </button>
              <button className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-[#233c48]/50 transition-colors group border-t border-slate-100 dark:border-[#233c48]/30">
                <div className="flex items-center gap-3">
                  <UserPlus className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                  <span className="text-sm font-medium">Tag people</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </button>
              <div className="border-t border-slate-200 dark:border-[#233c48]">
                <div className="px-6 py-4 flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium">Advanced settings</span>
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="mt-auto p-6 bg-slate-50 dark:bg-[#111c22]/50">
              <div className="flex items-center gap-2 text-[#92b7c9]">
                <Info className="w-4 h-4" />
                <p className="text-[10px] leading-relaxed uppercase tracking-wider font-bold">Accessibility</p>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Alt text describes your photos for people with visual impairments. Alt text will be automatically created for your photos or you can choose to write your own.</p>
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
