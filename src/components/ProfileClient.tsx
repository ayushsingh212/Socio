"use client"
import { Settings, Grid, Film, UserCheck, Link as LinkIcon, Heart, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const posts = Array.from({ length: 9 }).map((_, i) => ({
  id: i,
  image: `https://picsum.photos/seed/profile-${i}/400/400`,
  likes: '2.4K',
  comments: '128',
  isVideo: i % 3 === 1,
}));

export default function Profile() {
  return (
    <div className="max-w-[960px] mx-auto px-4 py-10">
      {/* Profile Header */}
      <section className="flex flex-col md:flex-row gap-10 items-start mb-12">
        <div className="relative group mx-auto md:mx-0">
          <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-primary to-blue-400">
            <div className="w-full h-full rounded-full border-4 border-background-dark overflow-hidden bg-neutral-800">
              <img src="https://picsum.photos/seed/profile-main/400/400" className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-background-dark text-[10px] font-bold px-3 py-1 rounded-full tracking-wider flex items-center gap-1 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            LIVE
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h2 className="text-2xl font-bold">username_123</h2>
            <div className="flex items-center gap-2">
              <button className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">Edit Profile</button>
              <button className="bg-primary hover:bg-primary/90 text-background-dark px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">Add Friend</button>
              <button className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 p-1.5 rounded-lg flex items-center transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex gap-8 border-y border-slate-200 dark:border-slate-800 py-4 md:border-none md:py-0">
            <div className="flex flex-col md:flex-row md:gap-1.5 items-center">
              <span className="font-bold text-lg">1,284</span>
              <span className="text-slate-500 text-sm">Posts</span>
            </div>
            <div className="flex flex-col md:flex-row md:gap-1.5 items-center">
              <span className="font-bold text-lg">45.2K</span>
              <span className="text-slate-500 text-sm">Followers</span>
            </div>
            <div className="flex flex-col md:flex-row md:gap-1.5 items-center">
              <span className="font-bold text-lg">892</span>
              <span className="text-slate-500 text-sm">Following</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-primary">Professional Photographer | Visual Storyteller</p>
            <p className="text-slate-500 text-sm leading-relaxed max-w-md">Capturing the unseen moments of urban life. Based in Tokyo. Available for worldwide projects. 📸⛩️</p>
            <a className="text-primary text-sm font-medium flex items-center gap-1 hover:underline" href="#">
              <LinkIcon className="w-3.5 h-3.5" />
              portfolio.me/username_123
            </a>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background-dark overflow-hidden">
                  <img src={`https://picsum.photos/seed/mutual-${i}/100/100`} alt="" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">Followed by <span className="text-slate-100 font-medium">UserX</span>, <span className="text-slate-100 font-medium">UserY</span> and 15 others</p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-t border-slate-200 dark:border-slate-800 mb-6">
        <div className="flex justify-center gap-12 -mt-px">
          <button className="flex items-center gap-2 py-4 border-t-2 border-primary text-primary text-sm font-bold uppercase tracking-wider">
            <Grid className="w-4 h-4" /> Posts
          </button>
          <button className="flex items-center gap-2 py-4 border-t-2 border-transparent text-slate-500 hover:text-slate-100 text-sm font-bold uppercase tracking-wider transition-colors">
            <Film className="w-4 h-4" /> Reels
          </button>
          <button className="flex items-center gap-2 py-4 border-t-2 border-transparent text-slate-500 hover:text-slate-100 text-sm font-bold uppercase tracking-wider transition-colors">
            <UserCheck className="w-4 h-4" /> Tagged
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-6">
        {posts.map((post) => (
          <motion.div 
            key={post.id}
            whileHover={{ scale: 1.02 }}
            className="relative aspect-square group overflow-hidden rounded-lg bg-neutral-800 cursor-pointer"
          >
            <img src={post.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" referrerPolicy="no-referrer" />
            {post.isVideo && (
              <div className="absolute top-2 right-2 text-white">
                <Film className="w-5 h-5 fill-current" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
              <div className="flex items-center gap-1.5"><Heart className="w-5 h-5 fill-current" /> {post.likes}</div>
              <div className="flex items-center gap-1.5"><MessageCircle className="w-5 h-5 fill-current" /> {post.comments}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 text-center mt-12">
        <div className="flex justify-center gap-6 text-xs text-slate-500 font-medium uppercase tracking-widest mb-4">
          <a className="hover:text-primary transition-colors" href="#">About</a>
          <a className="hover:text-primary transition-colors" href="#">Help</a>
          <a className="hover:text-primary transition-colors" href="#">Press</a>
          <a className="hover:text-primary transition-colors" href="#">API</a>
          <a className="hover:text-primary transition-colors" href="#">Jobs</a>
          <a className="hover:text-primary transition-colors" href="#">Privacy</a>
          <a className="hover:text-primary transition-colors" href="#">Terms</a>
        </div>
        <p className="text-xs text-slate-600">© 2024 SocialPlatform from Meta-ish</p>
      </footer>
    </div>
  );
}
