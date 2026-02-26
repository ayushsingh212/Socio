"use client"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Music, ChevronUp, ChevronDown, Volume2, PlusSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const upNext = [
  { id: 1, title: 'The best hiking spots in the Alps...', author: '@mountain_man', views: '89K', image: 'https://picsum.photos/seed/hiking/200/300' },
  { id: 2, title: '5-minute pasta recipe for busy...', author: '@chef_daily', views: '1.2M', image: 'https://picsum.photos/seed/pasta/200/300' },
  { id: 3, title: 'New Tech Unboxing: Must have...', author: '@gadget_guru', views: '450K', image: 'https://picsum.photos/seed/tech/200/300' },
];

export default function Reels() {
  return (
    <div className="flex h-screen bg-black overflow-hidden relative">
      <div 
        className="absolute inset-0 opacity-40 blur-[60px] scale-110"
        style={{ backgroundImage: "url('https://picsum.photos/seed/reel-bg/1920/1080')" }}
      />

      {/* Navigation Arrows */}
      <button className="absolute left-8 top-1/2 -translate-y-1/2 z-40 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white backdrop-blur-md transition-all">
        <ChevronUp className="w-8 h-8" />
      </button>
      <button className="absolute right-8 top-1/2 -translate-y-1/2 z-40 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white backdrop-blur-md transition-all">
        <ChevronDown className="w-8 h-8" />
      </button>

      <div className="flex-1 flex items-center justify-center z-10 p-4">
        <div className="flex items-end gap-6 max-w-full">
          {/* Center Video Player */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="aspect-[9/16] max-h-[85vh] relative bg-neutral-900 rounded-xl overflow-hidden shadow-2xl border border-white/10 group"
          >
            <img 
              src="https://picsum.photos/seed/reel-main/1080/1920" 
              alt="Reel" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div className="h-full bg-primary w-[45%]" />
            </div>

            <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="bg-black/40 p-2 rounded-full text-white backdrop-blur-sm">
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
                    <img src="https://picsum.photos/seed/author/100/100" alt="Avatar" referrerPolicy="no-referrer" />
                  </div>
                  <span className="font-bold text-white text-sm">@creative_soul</span>
                  <button className="px-4 py-1 border border-white rounded-lg text-xs font-bold text-white hover:bg-white hover:text-black transition-all">
                    Follow
                  </button>
                </div>
                <p className="text-white text-sm line-clamp-2">
                  Exploring the hidden gems of the city tonight. The vibes are absolutely immaculate! ✨ #citylife #vlog #aesthetic
                </p>
                <div className="flex items-center gap-2 text-white/80 text-xs mt-1">
                  <Music className="w-4 h-4" />
                  <div className="overflow-hidden whitespace-nowrap w-40">
                    <span className="inline-block animate-marquee">Midnight Melodies - Artist Name (Original Audio)</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interaction Sidebar */}
          <div className="flex flex-col gap-5 items-center mb-4">
            <div className="flex flex-col items-center gap-1 group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center text-white hover:bg-white/20 transition-all">
                <Heart className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-white">124K</span>
            </div>
            <div className="flex flex-col items-center gap-1 group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center text-white hover:bg-white/20 transition-all">
                <MessageCircle className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-white">1.2K</span>
            </div>
            <div className="flex flex-col items-center gap-1 group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center text-white hover:bg-white/20 transition-all">
                <Send className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-white">45K</span>
            </div>
            <div className="flex flex-col items-center gap-1 group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center text-white hover:bg-white/20 transition-all">
                <Bookmark className="w-7 h-7" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center text-white hover:bg-white/20 transition-all">
                <MoreHorizontal className="w-7 h-7" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-10 h-10 rounded-lg border-2 border-white/20 overflow-hidden animate-spin-slow">
                <img src="https://picsum.photos/seed/music/100/100" alt="Audio" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Panel */}
      <aside className="hidden xl:flex flex-col w-80 border-l border-primary/10 bg-background-dark p-6 z-20">
        <h3 className="text-lg font-bold mb-4 text-white">Up Next</h3>
        <div className="space-y-4">
          {upNext.map((item) => (
            <div key={item.id} className="flex gap-3 group cursor-pointer">
              <div className="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-800">
                <img src={item.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" alt="" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col justify-center gap-1">
                <p className="font-bold text-sm text-white line-clamp-2">{item.title}</p>
                <p className="text-xs text-slate-500">{item.author}</p>
                <p className="text-xs text-primary font-medium">{item.views} views</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto pt-6 border-t border-primary/10">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500 uppercase tracking-widest font-semibold">
            <a className="hover:underline" href="#">About</a>
            <a className="hover:underline" href="#">Help</a>
            <a className="hover:underline" href="#">Privacy</a>
            <a className="hover:underline" href="#">Terms</a>
          </div>
          <p className="mt-4 text-[11px] text-slate-500">© 2024 REELS EXPLORER FROM SOCIALAPP</p>
        </div>
      </aside>
    </div>
  );
}
