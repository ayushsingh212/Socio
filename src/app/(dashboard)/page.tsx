"use client";

import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Verified, ChevronLeft, ChevronRight } from 'lucide-react';

const stories = [
  { id: 1, name: 'Your Story', image: 'https://picsum.photos/seed/story1/100/100', viewed: false },
  { id: 2, name: 'alex_travels', image: 'https://picsum.photos/seed/story2/100/100', viewed: false },
  { id: 3, name: 'chef_mike', image: 'https://picsum.photos/seed/story3/100/100', viewed: false },
  { id: 4, name: 'daily_news', image: 'https://picsum.photos/seed/story4/100/100', viewed: true },
  { id: 5, name: 'art_world', image: 'https://picsum.photos/seed/story5/100/100', viewed: false },
  { id: 6, name: 'music_lover', image: 'https://picsum.photos/seed/story6/100/100', viewed: true },
  { id: 7, name: 'tech_guru', image: 'https://picsum.photos/seed/story7/100/100', viewed: false },
  { id: 8, name: 'fitness_freak', image: 'https://picsum.photos/seed/story8/100/100', viewed: false },
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
    time: '4 hours ago',
    verified: true,
    comments: 89,
  },
  {
    id: 2,
    author: 'chef_mike',
    location: 'The Kitchen Lab',
    avatar: 'https://picsum.photos/seed/avatar2/100/100',
    image: 'https://picsum.photos/seed/pasta-feed/800/800',
    likes: '8,912',
    caption: 'Homemade pasta from scratch. There is no shortcut to quality. 🍝👨‍🍳 #cooking #foodie #fresh',
    time: '8 hours ago',
    verified: false,
    comments: 45,
  },
  {
    id: 3,
    author: 'art_world',
    location: 'Modern Art Gallery',
    avatar: 'https://picsum.photos/seed/avatar3/100/100',
    image: 'https://picsum.photos/seed/art/800/800',
    likes: '15,287',
    caption: 'New exhibition opening tonight! Featuring emerging artists from around the world. 🎨✨ #art #exhibition #contemporary',
    time: '12 hours ago',
    verified: true,
    comments: 123,
  }
];

const suggestions = [
  { id: 1, name: 'art_gallery_sf', info: 'Followed by alex_travels + 2 more', image: 'https://picsum.photos/seed/sug1/100/100', followed: false },
  { id: 2, name: 'tech_insider', info: 'Suggested for you', image: 'https://picsum.photos/seed/sug2/100/100', followed: false },
  { id: 3, name: 'fitness_pro', info: 'Followed by chef_mike', image: 'https://picsum.photos/seed/sug3/100/100', followed: true },
  { id: 4, name: 'travel_diaries', info: 'Popular in your area', image: 'https://picsum.photos/seed/sug4/100/100', followed: false },
];

export default function Home() {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [savedPosts, setSavedPosts] = useState<number[]>([]);
  const [followedSuggestions, setFollowedSuggestions] = useState<number[]>(
    suggestions.filter(s => s.followed).map(s => s.id)
  );
  const [commentText, setCommentText] = useState<{ [key: number]: string }>({});

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const toggleSave = (postId: number) => {
    setSavedPosts(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const toggleFollow = (suggestionId: number) => {
    setFollowedSuggestions(prev =>
      prev.includes(suggestionId) ? prev.filter(id => id !== suggestionId) : [...prev, suggestionId]
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-col lg:flex-row lg:justify-center lg:py-8">
        {/* Main Feed */}
        <div className="w-full lg:max-w-[630px] px-0 sm:px-4">
          {/* Stories - Horizontal Scroll */}
          <div className="relative border-b border-gray-200 dark:border-gray-800 lg:border-0 pb-4 mb-4">
            <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4 lg:px-0 scroll-smooth">
              {stories.map((story) => (
                <div key={story.id} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
                  <div className={cn(
                    "relative p-[2px] rounded-full transition-transform group-hover:scale-105",
                    story.viewed 
                      ? "bg-gray-300 dark:bg-gray-700" 
                      : "bg-gradient-to-tr from-yellow-400 to-pink-600"
                  )}>
                    <div className="p-[2px] bg-white dark:bg-gray-900 rounded-full">
                      <img 
                        src={story.image} 
                        alt={story.name} 
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white dark:border-gray-900"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <span className="text-[11px] sm:text-[12px] truncate w-14 sm:w-20 text-center text-gray-600 dark:text-gray-400">
                    {story.name}
                  </span>
                </div>
              ))}
            </div>
            
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-lg hidden lg:block hover:scale-105 transition">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Feed Posts */}
          <div className="space-y-6 sm:space-y-8 pb-10">
            {posts.map((post) => (
              <article key={post.id} className="border-b border-gray-200 dark:border-gray-800 pb-6 last:border-0">
                {/* Post Header */}
                <div className="flex items-center justify-between px-4 sm:px-0 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                      <img 
                        src={post.avatar} 
                        alt={post.author} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-sm font-bold hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
                          {post.author}
                        </span>
                        {post.verified && (
                          <Verified className="w-3.5 h-3.5 text-blue-500 fill-current" />
                        )}
                        <span className="text-gray-500 text-xs">• {post.time}</span>
                      </div>
                      <span className="text-[11px] sm:text-xs text-gray-500">{post.location}</span>
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors p-1">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Post Image */}
                <div className="relative bg-gray-100 dark:bg-gray-800">
                  <img 
                    src={post.image} 
                    alt="Post content" 
                    className="w-full aspect-square object-cover"
                    referrerPolicy="no-referrer" 
                  />
                  
                  <button 
                    onClick={() => toggleLike(post.id)}
                    className="absolute inset-0 w-full h-full"
                    aria-label="Like post"
                  />
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between px-4 sm:px-0 py-3">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleLike(post.id)}
                      className="transition-transform active:scale-125"
                    >
                      <Heart 
                        className={cn(
                          "w-6 h-6 sm:w-7 sm:h-7 transition-colors",
                          likedPosts.includes(post.id) 
                            ? "fill-red-500 text-red-500" 
                            : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        )} 
                      />
                    </button>
                    <button className="hover:text-gray-900 dark:hover:text-white transition-transform active:scale-125">
                      <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                    </button>
                    <button className="hover:text-gray-900 dark:hover:text-white transition-transform active:scale-125">
                      <Send className="w-6 h-6 sm:w-7 sm:h-7" />
                    </button>
                  </div>
                  <button 
                    onClick={() => toggleSave(post.id)}
                    className="transition-transform active:scale-125"
                  >
                    <Bookmark 
                      className={cn(
                        "w-6 h-6 sm:w-7 sm:h-7 transition-colors",
                        savedPosts.includes(post.id) 
                          ? "fill-gray-900 dark:fill-white text-gray-900 dark:text-white" 
                          : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      )} 
                    />
                  </button>
                </div>

                {/* Post Info */}
                <div className="px-4 sm:px-0 space-y-2">
                  <p className="text-sm font-semibold">
                    {likedPosts.includes(post.id) 
                      ? (parseInt(post.likes.replace(',', '')) + 1).toLocaleString() 
                      : post.likes} likes
                  </p>
                  
                  <p className="text-sm">
                    <span className="font-bold mr-2">{post.author}</span>
                    {post.caption}
                  </p>
                  
                  <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 block">
                    View all {post.comments} comments
                  </button>
                </div>

        
                <div className="mt-3 px-4 sm:px-0 flex items-center gap-2">
                  <input 
                    type="text" 
                    value={commentText[post.id] || ''}
                    onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                    placeholder="Add a comment..." 
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2 placeholder:text-gray-500"
                  />
                  <button 
                    className={cn(
                      "text-sm font-semibold transition",
                      commentText[post.id]?.trim() 
                        ? "text-blue-500 hover:text-blue-600" 
                        : "text-blue-300 cursor-not-allowed"
                    )}
                    disabled={!commentText[post.id]?.trim()}
                  >
                    Post
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

     
        <aside className="hidden xl:block w-[380px] h-full p-8 shrink-0">
       
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/me/100/100" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer" 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">joshua_design</span>
                <span className="text-sm text-gray-500">Joshua Miller</span>
              </div>
            </div>
            <button className="text-blue-500 text-xs font-bold hover:text-blue-700 transition">
              Switch
            </button>
          </div>

          {/* Suggestions */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-500">Suggested for you</h3>
              <button className="text-xs font-bold hover:text-gray-700 dark:hover:text-gray-300 transition">
                See All
              </button>
            </div>

            <div className="space-y-4">
              {suggestions.map((sug) => (
                <div key={sug.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img 
                        src={sug.image} 
                        alt={sug.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{sug.name}</span>
                      <span className="text-xs text-gray-500 truncate w-40">{sug.info}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleFollow(sug.id)}
                    className={cn(
                      "text-xs font-bold transition",
                      followedSuggestions.includes(sug.id)
                        ? "text-gray-500 hover:text-gray-700"
                        : "text-blue-500 hover:text-blue-700"
                    )}
                  >
                    {followedSuggestions.includes(sug.id) ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          </div>

        
          <div className="mt-8 text-[11px] text-gray-400">
            <nav className="flex flex-wrap gap-2 mb-4">
              <a className="hover:underline hover:text-gray-600" href="#">About</a>
              <a className="hover:underline hover:text-gray-600" href="#">Help</a>
              <a className="hover:underline hover:text-gray-600" href="#">Privacy</a>
              <a className="hover:underline hover:text-gray-600" href="#">Terms</a>
              <a className="hover:underline hover:text-gray-600" href="#">Locations</a>
              <a className="hover:underline hover:text-gray-600" href="#">Language</a>
            </nav>
            <p>© 2024 SOCIALHUB FROM META</p>
          </div>
        </aside>
      </div>
    </div>
  );
}


function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}