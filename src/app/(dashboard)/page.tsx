"use client";

import { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  Verified, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Flame,
  Music,
  Camera,
  Globe2,
  Palette,
  TrendingUp,
  Users,
  Star
} from 'lucide-react';

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

interface Story {
  id: number;
  name: string;
  image: string;
  viewed: boolean;
  category?: string;
}

interface Post {
  id: number;
  author: string;
  location: string;
  avatar: string;
  images: string[];
  likes: string;
  caption: string;
  time: string;
  verified: boolean;
  comments: number;
  tags: string[];
}

interface Suggestion {
  id: number;
  name: string;
  bio: string;
  image: string;
  followers: string;
  verified: boolean;
  category: string;
}

const stories: Story[] = [
  { id: 1, name: 'Your Story', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop', viewed: false, category: 'personal' },
  { id: 2, name: 'Alex Travels', image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop', viewed: false, category: 'travel' },
  { id: 3, name: 'Chef Mike', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&h=150&fit=crop', viewed: false, category: 'food' },
  { id: 4, name: 'Daily News', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=150&h=150&fit=crop', viewed: true, category: 'news' },
  { id: 5, name: 'Art World', image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=150&h=150&fit=crop', viewed: false, category: 'art' },
  { id: 6, name: 'Music Lover', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&h=150&fit=crop', viewed: true, category: 'music' },
  { id: 7, name: 'Tech Guru', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop', viewed: false, category: 'tech' },
  { id: 8, name: 'Fitness Pro', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&h=150&fit=crop', viewed: false, category: 'fitness' },
];

const posts: Post[] = [
  {
    id: 1,
    author: 'Alex Travels',
    location: 'Zermatt, Switzerland',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&h=800&fit=crop'
    ],
    likes: '12.4k',
    caption: 'Exploring the hidden gems of the Swiss Alps. The air is so crisp up here! 🏔️✨',
    time: '4h ago',
    verified: true,
    comments: 89,
    tags: ['#travel', '#nature', '#mountains', '#adventure']
  },
  {
    id: 2,
    author: 'Chef Mike',
    location: 'The Kitchen Lab',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&h=150&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=800&fit=crop'
    ],
    likes: '8.9k',
    caption: 'Homemade pasta from scratch. There is no shortcut to quality. 🍝👨‍🍳',
    time: '8h ago',
    verified: false,
    comments: 45,
    tags: ['#cooking', '#foodie', '#fresh', '#italian']
  },
  {
    id: 3,
    author: 'Art World',
    location: 'Modern Art Gallery',
    avatar: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=150&h=150&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&h=800&fit=crop'
    ],
    likes: '15.2k',
    caption: 'New exhibition opening tonight! Featuring emerging artists from around the world. 🎨✨',
    time: '12h ago',
    verified: true,
    comments: 123,
    tags: ['#art', '#exhibition', '#contemporary', '#gallery']
  }
];

const suggestions: Suggestion[] = [
  { 
    id: 1, 
    name: 'Art Gallery SF', 
    bio: 'Contemporary art curator',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=150&h=150&fit=crop', 
    followers: '45.6k',
    verified: true,
    category: 'Art'
  },
  { 
    id: 2, 
    name: 'Tech Insider', 
    bio: 'Latest in tech & innovation',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&h=150&fit=crop', 
    followers: '89.2k',
    verified: true,
    category: 'Tech'
  },
  { 
    id: 3, 
    name: 'Fitness Pro', 
    bio: 'Certified trainer • Wellness coach',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&h=150&fit=crop', 
    followers: '123k',
    verified: false,
    category: 'Fitness'
  },
  { 
    id: 4, 
    name: 'Travel Diaries', 
    bio: 'Exploring hidden gems 🌍',
    image: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=150&h=150&fit=crop', 
    followers: '67.8k',
    verified: false,
    category: 'Travel'
  },
];

const categories = [
  { icon: Flame, name: 'Trending', color: 'from-orange-500 to-red-500' },
  { icon: Music, name: 'Music', color: 'from-purple-500 to-pink-500' },
  { icon: Camera, name: 'Photography', color: 'from-blue-500 to-cyan-500' },
  { icon: Globe2, name: 'Travel', color: 'from-green-500 to-emerald-500' },
  { icon: Palette, name: 'Art', color: 'from-pink-500 to-rose-500' },
];

export default function HomePage() {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [savedPosts, setSavedPosts] = useState<number[]>([]);
  const [followedSuggestions, setFollowedSuggestions] = useState<number[]>([]);
  const [commentText, setCommentText] = useState<{ [key: number]: string }>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState('Trending');

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

  const nextImage = (postId: number, maxImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [postId]: ((prev[postId] || 0) + 1) % maxImages
    }));
  };

  const prevImage = (postId: number, maxImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [postId]: ((prev[postId] || 0) - 1 + maxImages) % maxImages
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-yellow-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative flex flex-col lg:flex-row lg:justify-center lg:py-8 max-w-7xl mx-auto">
        {/* Main Feed */}
        <div className="w-full lg:max-w-[630px] px-0 sm:px-4">
          {/* Stories - Horizontal Scroll with Categories */}
          <div className="relative mb-6">
            <div className="flex items-center gap-4 px-4 lg:px-0 mb-4">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
                Stories
              </h2>
            </div>
            
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 lg:px-0 scroll-smooth pb-2">
                {stories.map((story) => (
                  <div key={story.id} className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group">
                    <div className={cn(
                      "relative p-[2px] rounded-full transition-all duration-300 group-hover:scale-110",
                      story.viewed 
                        ? "bg-gray-700" 
                        : "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 animate-gradient"
                    )}>
                      <div className="p-[2px] bg-black rounded-full">
                        <img 
                          src={story.image} 
                          alt={story.name} 
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-black"
                          loading="lazy"
                        />
                      </div>
                      {!story.viewed && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-pink-600 rounded-full flex items-center justify-center">
                          <span className="text-black text-xs">+</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs truncate w-16 sm:w-20 text-center text-gray-400 group-hover:text-white transition">
                      {story.name}
                    </span>
                  </div>
                ))}
              </div>

              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800/80 backdrop-blur-sm rounded-full p-2 shadow-lg hidden lg:block hover:bg-gray-700 transition border border-gray-700">
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
              
              <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800/80 backdrop-blur-sm rounded-full p-2 shadow-lg hidden lg:block hover:bg-gray-700 transition border border-gray-700">
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Feed Posts */}
          <div className="space-y-6 sm:space-y-8 pb-10">
            {posts.map((post) => (
              <article key={post.id} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-all duration-300">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-pink-600 p-[2px]">
                        <img 
                          src={post.avatar} 
                          alt={post.author} 
                          className="w-full h-full rounded-full object-cover border-2 border-gray-900"
                          loading="lazy"
                        />
                      </div>
                      {post.verified && (
                        <Verified className="absolute -bottom-1 -right-1 w-4 h-4 text-blue-500 bg-gray-900 rounded-full" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white hover:text-yellow-400 transition cursor-pointer">
                          {post.author}
                        </span>
                        <span className="text-gray-500 text-xs">{post.time}</span>
                      </div>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Globe2 className="w-3 h-3" />
                        {post.location}
                      </span>
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-white transition p-1">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Post Image Carousel */}
                <div className="relative rounded-xl overflow-hidden bg-gray-800 mb-4 group">
                  <img 
                    src={post.images[currentImageIndex[post.id] || 0]} 
                    alt="Post content" 
                    className="w-full aspect-square object-cover"
                    loading="lazy"
                  />
                  
                  {post.images.length > 1 && (
                    <>
                      <button 
                        onClick={() => prevImage(post.id, post.images.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70"
                      >
                        <ChevronLeft className="w-4 h-4 text-white" />
                      </button>
                      <button 
                        onClick={() => nextImage(post.id, post.images.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70"
                      >
                        <ChevronRight className="w-4 h-4 text-white" />
                      </button>
                      
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {post.images.map((_, idx) => (
                          <div 
                            key={idx}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full transition-all",
                              idx === (currentImageIndex[post.id] || 0)
                                ? "bg-white w-3"
                                : "bg-white/50"
                            )}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  <div 
                    onDoubleClick={() => toggleLike(post.id)}
                    className="absolute inset-0 cursor-pointer"
                  />
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleLike(post.id)}
                      className="transition-all active:scale-125"
                    >
                      <Heart 
                        className={cn(
                          "w-7 h-7 transition-all",
                          likedPosts.includes(post.id) 
                            ? "fill-pink-600 text-pink-600 filter drop-shadow-lg" 
                            : "text-gray-400 hover:text-white"
                        )} 
                      />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-all active:scale-125">
                      <MessageCircle className="w-7 h-7" />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-all active:scale-125">
                      <Send className="w-7 h-7" />
                    </button>
                  </div>
                  <button 
                    onClick={() => toggleSave(post.id)}
                    className="transition-all active:scale-125"
                  >
                    <Bookmark 
                      className={cn(
                        "w-7 h-7 transition-all",
                        savedPosts.includes(post.id) 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "text-gray-400 hover:text-white"
                      )} 
                    />
                  </button>
                </div>

                {/* Post Info */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-white flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-600" />
                    {likedPosts.includes(post.id) 
                      ? (parseInt(post.likes.replace('k', '')) * 1000 + 1).toLocaleString() 
                      : post.likes} likes
                  </p>
                  
                  <p className="text-sm text-gray-300">
                    <span className="font-bold text-white mr-2 hover:text-yellow-400 transition cursor-pointer">
                      {post.author}
                    </span>
                    {post.caption}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <button className="text-sm text-gray-500 hover:text-gray-400 transition">
                    View all {post.comments} comments
                  </button>
                </div>

                {/* Add Comment */}
                <div className="mt-3 flex items-center gap-2 border-t border-gray-800 pt-3">
                  <input 
                    type="text" 
                    value={commentText[post.id] || ''}
                    onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                    placeholder="Add a comment..." 
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2 text-gray-300 placeholder:text-gray-600"
                  />
                  <button 
                    className={cn(
                      "text-sm font-semibold transition",
                      commentText[post.id]?.trim() 
                        ? "bg-gradient-to-r from-yellow-400 to-pink-600 bg-clip-text text-transparent hover:from-yellow-300 hover:to-pink-500" 
                        : "text-gray-600 cursor-not-allowed"
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

        {/* Right Sidebar - Suggestions */}
        <aside className="hidden xl:block w-[380px] h-full p-8 shrink-0">
          {/* Categories */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-yellow-400" />
              Explore Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border",
                      selectedCategory === cat.name
                        ? `bg-gradient-to-r ${cat.color} text-white border-transparent`
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-700"
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current User Profile */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-yellow-400 to-pink-600 p-[2px]">
                  <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop" 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover border-2 border-gray-900"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-gray-900 rounded-full"></div>
              </div>
              <div>
                <span className="text-sm font-bold text-white flex items-center gap-1">
                  joshua_design
                  <Verified className="w-3 h-3 text-blue-500" />
                </span>
                <span className="text-sm text-gray-500">Joshua Miller</span>
                <p className="text-xs text-gray-600 mt-1">Digital artist • 2.3k followers</p>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-400 flex items-center gap-2">
                <Users className="w-4 h-4 text-pink-500" />
                Suggested for you
              </h3>
              <button className="text-xs font-bold text-yellow-400 hover:text-yellow-300 transition">
                Refresh
              </button>
            </div>

            <div className="space-y-4">
              {suggestions.map((sug) => (
                <div key={sug.id} className="group bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-pink-600 p-[2px]">
                          <img 
                            src={sug.image} 
                            alt={sug.name} 
                            className="w-full h-full rounded-full object-cover border-2 border-gray-900"
                          />
                        </div>
                        {sug.verified && (
                          <Verified className="absolute -bottom-1 -right-1 w-3 h-3 text-blue-500 bg-gray-900 rounded-full" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-white group-hover:text-yellow-400 transition">
                            {sug.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{sug.bio}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{sug.followers} followers</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleFollow(sug.id)}
                      className={cn(
                        "text-xs font-bold px-3 py-1.5 rounded-lg transition-all",
                        followedSuggestions.includes(sug.id)
                          ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                          : "bg-gradient-to-r from-yellow-400 to-pink-600 text-white hover:from-yellow-300 hover:to-pink-500"
                      )}
                    >
                      {followedSuggestions.includes(sug.id) ? 'Following' : 'Follow'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8">
            <div className="flex flex-wrap gap-3 mb-4">
              {['About', 'Help', 'Privacy', 'Terms', 'Locations', 'Language'].map((item) => (
                <a 
                  key={item} 
                  href="#" 
                  className="text-xs text-gray-600 hover:text-yellow-400 transition"
                >
                  {item}
                </a>
              ))}
            </div>
            <p className="text-xs text-gray-700 flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400" />
              © 2024 SOCIO • CONNECT DIFFERENTLY
            </p>
          </div>
        </aside>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 2s ease infinite;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}