
"use client";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Verified } from 'lucide-react';


const stories = [
  { id: 1, name: 'Your Story', image: 'https://picsum.photos/seed/story1/100/100' },
  { id: 2, name: 'alex_travels', image: 'https://picsum.photos/seed/story2/100/100' },
  { id: 3, name: 'chef_mike', image: 'https://picsum.photos/seed/story3/100/100' },
  { id: 4, name: 'daily_news', image: 'https://picsum.photos/seed/story4/100/100' },
  { id: 5, name: 'art_world', image: 'https://picsum.photos/seed/story5/100/100' },
  { id: 6, name: 'music_lover', image: 'https://picsum.photos/seed/story6/100/100' },
];

const posts = [
  {
    id: 1,
    author: 'alex_travels',
    location: 'Zermatt, Switzerland',
    avatar: 'https://picsum.photos/seed/avatar1/100/100',
    image: 'https://picsum.photos/seed/swiss/800/800',
    likes: '12,402',
    caption: 'Exploring the hidden gems of the Swiss Alps this weekend. The air is so crisp up here! 🏔️✨ #travel #nature #mountains',
    time: '4h',
    verified: true,
  },
  {
    id: 2,
    author: 'chef_mike',
    location: 'The Kitchen Lab',
    avatar: 'https://picsum.photos/seed/avatar2/100/100',
    image: 'https://picsum.photos/seed/pasta-feed/800/800',
    likes: '8,912',
    caption: 'Homemade pasta from scratch. There is no shortcut to quality. 🍝👨‍🍳 #cooking #foodie #fresh',
    time: '8h',
    verified: false,
  }
];

const suggestions = [
  { id: 1, name: 'art_gallery_sf', info: 'Followed by alex_travels + 2 more', image: 'https://picsum.photos/seed/sug1/100/100' },
  { id: 2, name: 'tech_insider', info: 'Suggested for you', image: 'https://picsum.photos/seed/sug2/100/100' },
  { id: 3, name: 'fitness_pro', info: 'Followed by chef_mike', image: 'https://picsum.photos/seed/sug3/100/100' },
];

export default function Home() {
  return (
    <div className="flex justify-center py-8">
      <div className="max-w-[630px] w-full px-4">
        {/* Stories */}
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-8 mb-4">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
              <div className="relative p-0.5 rounded-full story-ring transition-transform group-hover:scale-105">
                <div className="p-0.5 bg-background-light dark:bg-background-dark rounded-full">
                  <img 
                    src={story.image} 
                    alt={story.name} 
                    className="w-16 h-16 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <span className="text-[12px] truncate w-20 text-center">{story.name}</span>
            </div>
          ))}
        </div>

        {/* Feed */}
        <div className="space-y-8 pb-10">
          {posts.map((post) => (
            <article key={post.id} className="border-b border-slate-200 dark:border-slate-800 pb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <img src={post.avatar} alt="" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold hover:text-slate-500 cursor-pointer">{post.author}</span>
                      {post.verified && <Verified className="w-3.5 h-3.5 text-primary fill-current" />}
                      <span className="text-slate-500 text-sm">• {post.time}</span>
                    </div>
                    <span className="text-[12px] text-slate-500">{post.location}</span>
                  </div>
                </div>
                <button className="text-slate-500 hover:text-primary transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-surface-dark aspect-square">
                <img src={post.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-4">
                  <button className="hover:text-slate-500 transition-colors"><Heart className="w-6 h-6" /></button>
                  <button className="hover:text-slate-500 transition-colors"><MessageCircle className="w-6 h-6" /></button>
                  <button className="hover:text-slate-500 transition-colors"><Send className="w-6 h-6" /></button>
                </div>
                <button className="hover:text-slate-500 transition-colors"><Bookmark className="w-6 h-6" /></button>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-bold">{post.likes} likes</p>
                <p className="text-sm">
                  <span className="font-bold mr-2">{post.author}</span>
                  {post.caption}
                </p>
                <button className="text-sm text-slate-500 block hover:underline">View all comments</button>
              </div>

              <div className="mt-3 flex items-center justify-between group">
                <input 
                  type="text" 
                  placeholder="Add a comment..." 
                  className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 placeholder:text-slate-500"
                />
                <button className="text-primary text-sm font-semibold opacity-0 group-focus-within:opacity-100 transition-opacity">Post</button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="w-[380px] h-full p-8 shrink-0 hidden xl:block">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border border-slate-200 dark:border-slate-800 overflow-hidden">
              <img src="https://picsum.photos/seed/me/100/100" alt="" referrerPolicy="no-referrer" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold">joshua_design</span>
              <span className="text-sm text-slate-500">Joshua Miller</span>
            </div>
          </div>
          <button className="text-primary text-[12px] font-bold hover:text-white transition-colors">Switch</button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-500">Suggested for you</h3>
          <button className="text-slate-100 text-[12px] font-bold hover:text-slate-500">See All</button>
        </div>

        <div className="space-y-4">
          {suggestions.map((sug) => (
            <div key={sug.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img src={sug.image} alt="" referrerPolicy="no-referrer" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{sug.name}</span>
                  <span className="text-[12px] text-slate-500 truncate w-40">{sug.info}</span>
                </div>
              </div>
              <button className="text-primary text-[12px] font-bold hover:text-white">Follow</button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-[12px] text-slate-600 leading-relaxed uppercase tracking-wider">
          <nav className="flex flex-wrap gap-2 mb-4">
            <a className="hover:underline" href="#">About</a>
            <a className="hover:underline" href="#">Help</a>
            <a className="hover:underline" href="#">Privacy</a>
            <a className="hover:underline" href="#">Terms</a>
          </nav>
          <p>© 2024 INSTADASH FROM META</p>
        </div>
      </aside>
    </div>
  );
}
