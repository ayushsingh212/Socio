import React from 'react';
import { Search, Film, Heart, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = ["For You", "Trending", "Art", "Music", "Gaming", "Travel"];

const posts = [
  { id: 1, type: 'large', title: 'Night City Vibez', author: '@cyber_neo', likes: '24.5k', comments: '1.2k', image: 'https://picsum.photos/seed/cyber/800/800' },
  { id: 2, type: 'small', likes: '842', comments: '45', image: 'https://picsum.photos/seed/arch/400/400' },
  { id: 3, type: 'small', likes: '3.1k', comments: '120', image: 'https://picsum.photos/seed/abstract/400/400' },
  { id: 4, type: 'small', likes: '562', comments: '18', image: 'https://picsum.photos/seed/work/400/400' },
  { id: 5, type: 'small', likes: '12k', comments: '672', image: 'https://picsum.photos/seed/tokyo/400/400', isVideo: true },
  { id: 6, type: 'large', title: 'Wanderlust Horizons', author: '@earth_scapes', likes: '42.1k', comments: '2.8k', image: 'https://picsum.photos/seed/mountain/800/800' },
  { id: 7, type: 'small', likes: '1.5k', comments: '88', image: 'https://picsum.photos/seed/leaf/400/400' },
  { id: 8, type: 'small', likes: '4.2k', comments: '312', image: 'https://picsum.photos/seed/fashion/400/400' },
  { id: 9, type: 'small', likes: '9.1k', comments: '244', image: 'https://picsum.photos/seed/food/400/400' },
  { id: 10, type: 'small', likes: '15.5k', comments: '892', image: 'https://picsum.photos/seed/car/400/400', isVideo: true },
];

export default function Explore() {
  return (
    <div className="flex flex-col">
      <header className="sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-40 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for creators, tags, or places"
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary text-slate-100 placeholder:text-slate-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar pb-1 lg:pb-0">
            {categories.map((cat, i) => (
              <button 
                key={cat}
                className={i === 0 
                  ? "px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold whitespace-nowrap"
                  : "px-5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium whitespace-nowrap transition-colors"
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[240px]">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
                post.type === 'large' ? 'col-span-2 row-span-2' : ''
              }`}
            >
              <img 
                src={post.image} 
                alt="" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              
              {post.isVideo && (
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-lg text-white">
                  <Film className="w-4 h-4" />
                </div>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-8">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Heart className="w-5 h-5 fill-current" /> {post.likes}
                </div>
                <div className="flex items-center gap-2 text-white font-bold">
                  <MessageCircle className="w-5 h-5 fill-current" /> {post.comments}
                </div>
              </div>

              {post.title && (
                <div className="absolute bottom-6 left-6 text-white group-hover:translate-y-[-10px] transition-transform">
                  <p className="text-xl font-bold drop-shadow-lg">{post.title}</p>
                  <p className="text-sm opacity-90 drop-shadow-md">{post.author}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center py-12">
          <div className="flex items-center gap-3 text-slate-500">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="font-medium">Discovering more...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
