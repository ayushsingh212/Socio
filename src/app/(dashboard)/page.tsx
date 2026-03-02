
"use client";

import { useEffect, useState, useCallback } from 'react';
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
  Star,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { getFollowersCount, getFollowSuggestions, toggleFollow } from '@/services/profile.service';
import { useAuthStore } from '@/store/auth.store';
import { CallHistory, CallLog } from '@/components/call/CallHistory';
import { toast } from 'react-hot-toast';
import { useCall } from '@/context/CallContext';
import Link from 'next/link';

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
  authorId: string;
}

interface Suggestion {
  _id: string;
  username: string;
  fullName: string;
  bio: string;
  avatarInfo: {
    avatarUrl: string;
  };
  verified: boolean;
  followersCount?: number;
}

interface CallLog {
  id: string;
  participant: {
    name: string;
    avatar: string;
    username: string;
  };
  type: 'audio' | 'video';
  direction: 'incoming' | 'outgoing';
  status: 'completed' | 'missed' | 'rejected';
  duration: number;
  timestamp: Date;
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
    authorId: '2',
    author: 'Alex Travels',
    location: 'Zermatt, Switzerland',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&h=800&fit=crop',
    ],
    likes: '12.4k',
    caption: 'Exploring the hidden gems of the Swiss Alps. The air is so crisp up here! 🏔️✨',
    time: '4h ago',
    verified: true,
    comments: 89,
    tags: ['#travel', '#nature', '#mountains', '#adventure'],
  },
  {
    id: 2,
    authorId: '3',
    author: 'Chef Mike',
    location: 'The Kitchen Lab',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&h=150&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=800&fit=crop',
    ],
    likes: '8.9k',
    caption: 'Homemade pasta from scratch. There is no shortcut to quality. 🍝👨‍🍳',
    time: '8h ago',
    verified: false,
    comments: 45,
    tags: ['#cooking', '#foodie', '#fresh', '#italian'],
  },
  {
    id: 3,
    authorId: '4',
    author: 'Art World',
    location: 'Modern Art Gallery',
    avatar: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=150&h=150&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&h=800&fit=crop',
    ],
    likes: '15.2k',
    caption: 'New exhibition opening tonight! Featuring emerging artists from around the world. 🎨✨',
    time: '12h ago',
    verified: true,
    comments: 123,
    tags: ['#art', '#exhibition', '#contemporary', '#gallery'],
  },
];

const categories = [
  { icon: Flame, name: 'Trending', color: 'from-orange-500 to-red-500' },
  { icon: Music, name: 'Music', color: 'from-purple-500 to-pink-500' },
  { icon: Camera, name: 'Photography', color: 'from-blue-500 to-cyan-500' },
  { icon: Globe2, name: 'Travel', color: 'from-green-500 to-emerald-500' },
  { icon: Palette, name: 'Art', color: 'from-pink-500 to-rose-500' },
];

const mockCallHistory: CallLog[] = [
  {
    id: '1',
    participant: {
      name: 'Alex Travels',
      avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop',
      username: 'alextravels',
    },
    type: 'video',
    direction: 'outgoing',
    status: 'completed',
    duration: 125,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '2',
    participant: {
      name: 'Chef Mike',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&h=150&fit=crop',
      username: 'chefmike',
    },
    type: 'audio',
    direction: 'incoming',
    status: 'missed',
    duration: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
  },
];

/** Parse like strings such as "12.4k" → 12400 */
function parseLikeCount(likes: string): number {
  if (likes.toLowerCase().endsWith('k')) {
    return Math.round(parseFloat(likes) * 1000);
  }
  return parseInt(likes, 10) || 0;
}

/** Format a raw like count back to a display string */
function formatLikeCount(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return count.toLocaleString();
}

export default function HomePage() {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [savedPosts, setSavedPosts] = useState<number[]>([]);
  const [followedSuggestions, setFollowedSuggestions] = useState<string[]>([]);
  const [commentText, setCommentText] = useState<{ [key: number]: string }>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState('Trending');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCallHistory, setShowCallHistory] = useState(false);
  const [callHistoryLogs, setCallHistoryLogs] = useState<CallLog[]>(mockCallHistory);

  // ✅ Renamed from `user` → `authUser` to avoid shadowing in handler params
  const { user: authUser } = useAuthStore();
  const { activeCall } = useCall();

  // ✅ Wrapped in useCallback so the useEffect dependency is stable
  const getSuggestionsForUser = useCallback(async () => {
    try {
      setLoading(true);
      if (authUser?.user?.data?._id) {
        const resF = await getFollowersCount(authUser.user.data._id);
        setFollowersCount(resF.data?.data?.totalFollowers || 0);

        const res = await getFollowSuggestions();
        if (res.data?.success) {
          setSuggestions(res.data.data?.suggestions || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setLoading(false);
    }
  }, [authUser]);

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

  const handleToggleFollow = async (suggestionId: string) => {
    // ✅ Snapshot the current state BEFORE the optimistic update so the toast is always correct
    const wasFollowing = followedSuggestions.includes(suggestionId);

    // Optimistic update
    setFollowedSuggestions(prev =>
      wasFollowing ? prev.filter(id => id !== suggestionId) : [...prev, suggestionId]
    );

    try {
      await toggleFollow(suggestionId);
      toast.success(wasFollowing ? 'Unfollowed successfully' : 'Followed successfully');
    } catch (error) {
      // Rollback on failure
      setFollowedSuggestions(prev =>
        wasFollowing ? [...prev, suggestionId] : prev.filter(id => id !== suggestionId)
      );
      toast.error('Failed to toggle follow');
    }
  };

  const nextImage = (postId: number, maxImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [postId]: ((prev[postId] || 0) + 1) % maxImages,
    }));
  };

  const prevImage = (postId: number, maxImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [postId]: ((prev[postId] || 0) - 1 + maxImages) % maxImages,
    }));
  };

  useEffect(() => {
    getSuggestionsForUser();
  }, [getSuggestionsForUser]);

  const currentUsername = authUser?.user?.data?.username || 'username';
  const currentFullName = authUser?.user?.data?.fullName || 'User';
  const currentBio = authUser?.user?.data?.bio || 'No bio yet';
  const currentAvatar =
    authUser?.user?.data?.avatar ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-yellow-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative flex flex-col lg:flex-row lg:justify-center lg:py-8 max-w-7xl mx-auto">

        {/* ─── Feed ─── */}
        <div className="w-full lg:max-w-[630px] px-0 sm:px-4">

          {/* Stories */}
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
                      'relative p-[2px] rounded-full transition-all duration-300 group-hover:scale-110',
                      story.viewed
                        ? 'bg-gray-700'
                        : 'bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 animate-gradient'
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

          {/* Posts */}
          <div className="space-y-6 sm:space-y-8 pb-10">
            {posts.map((post) => {
              const isLiked = likedPosts.includes(post.id);
              const baseLikes = parseLikeCount(post.likes);
              // ✅ Fixed: parseLikeCount handles "12.4k" correctly → 12400
              const displayLikes = formatLikeCount(isLiked ? baseLikes + 1 : baseLikes);

              return (
                <article
                  key={post.id}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-all duration-300"
                >
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

                    <div className="flex items-center gap-2">
                      {/*
                        ✅ CallButton REMOVED from post headers.
                           Calls can only be made from an active DM room (Messages page).
                           We show a Message icon instead that navigates there.
                      */}
                      <Link
                        href="/messages"
                        className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition border border-gray-700 text-gray-400 hover:text-white"
                        title={`Message ${post.author}`}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Link>
                      <button className="text-gray-500 hover:text-white transition p-1">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Post Image */}
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
                                'h-1.5 rounded-full transition-all',
                                idx === (currentImageIndex[post.id] || 0)
                                  ? 'bg-white w-3'
                                  : 'bg-white/50 w-1.5'
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
                      <button onClick={() => toggleLike(post.id)} className="transition-all active:scale-125">
                        <Heart className={cn(
                          'w-7 h-7 transition-all',
                          isLiked
                            ? 'fill-pink-600 text-pink-600 filter drop-shadow-lg'
                            : 'text-gray-400 hover:text-white'
                        )} />
                      </button>
                      <button className="text-gray-400 hover:text-white transition-all active:scale-125">
                        <MessageCircle className="w-7 h-7" />
                      </button>
                      <button className="text-gray-400 hover:text-white transition-all active:scale-125">
                        <Send className="w-7 h-7" />
                      </button>
                    </div>
                    <button onClick={() => toggleSave(post.id)} className="transition-all active:scale-125">
                      <Bookmark className={cn(
                        'w-7 h-7 transition-all',
                        savedPosts.includes(post.id)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-400 hover:text-white'
                      )} />
                    </button>
                  </div>

                  {/* Post Meta */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-white flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-600" />
                      {displayLikes} likes
                    </p>

                    <p className="text-sm text-gray-300">
                      <span className="font-bold text-white mr-2 hover:text-yellow-400 transition cursor-pointer">
                        {post.author}
                      </span>
                      {post.caption}
                    </p>

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

                  {/* Comment Input */}
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
                        'text-sm font-semibold transition',
                        commentText[post.id]?.trim()
                          ? 'bg-gradient-to-r from-yellow-400 to-pink-600 bg-clip-text text-transparent hover:from-yellow-300 hover:to-pink-500'
                          : 'text-gray-600 cursor-not-allowed'
                      )}
                      disabled={!commentText[post.id]?.trim()}
                    >
                      Post
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* ─── Sidebar ─── */}
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
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border',
                      selectedCategory === cat.name
                        ? `bg-gradient-to-r ${cat.color} text-white border-transparent`
                        : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-700'
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current User Profile Card */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-yellow-400 to-pink-600 p-[2px]">
                  <img
                    src={currentAvatar}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-2 border-gray-900"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-gray-900 rounded-full" />
              </div>
              <div>
                <span className="text-sm font-bold text-white flex items-center gap-1">
                  {currentUsername}
                  <Verified className="w-3 h-3 text-blue-500" />
                </span>
                <span className="text-sm text-gray-500">{currentFullName}</span>
                <p className="text-xs text-gray-600 mt-1">
                  {currentBio.length > 20 ? currentBio.slice(0, 20) + '...' : currentBio} • {followersCount} followers
                </p>
              </div>
            </div>
          </div>

          {/* Call History */}
          <div className="mb-6">
            <button
              onClick={() => setShowCallHistory(!showCallHistory)}
              className="w-full flex items-center justify-between p-3 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl hover:bg-gray-800/50 transition"
            >
              <span className="text-sm font-medium text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-400" />
                Call History
                {callHistoryLogs.filter(c => c.status === 'missed').length > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {callHistoryLogs.filter(c => c.status === 'missed').length} missed
                  </span>
                )}
              </span>
              <ChevronRight className={cn(
                'w-4 h-4 text-gray-400 transition-transform',
                showCallHistory ? 'rotate-90' : ''
              )} />
            </button>

            {showCallHistory && (
              <div className="mt-4">
                {/*
                  ✅ Call-back from history redirects to Messages instead of calling directly.
                     Calls must be initiated inside an active DM room.
                */}
                <CallHistory
                  calls={callHistoryLogs}
                  onCallBack={() => {
                    toast('Open the Messages tab to call this person', { icon: '💬' });
                  }}
                  onClear={() => setCallHistoryLogs([])}
                />
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-400 flex items-center gap-2">
                <Users className="w-4 h-4 text-pink-500" />
                Suggested for you
              </h3>
              <button
                onClick={getSuggestionsForUser}
                className="text-xs font-bold text-yellow-400 hover:text-yellow-300 transition"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-500 mt-2">Loading suggestions...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {suggestions.length > 0 ? (
                  suggestions.map((sug) => (
                    <div
                      key={sug._id}
                      className="group bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-pink-600 p-[2px]">
                              <img
                                src={sug.avatarInfo?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'}
                                alt={sug.username}
                                className="w-full h-full rounded-full object-cover border-2 border-gray-900"
                              />
                            </div>
                            {sug.verified && (
                              <Verified className="absolute -bottom-1 -right-1 w-3 h-3 text-blue-500 bg-gray-900 rounded-full" />
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white group-hover:text-yellow-400 transition block">
                              {sug.fullName || sug.username}
                            </span>
                            <p className="text-xs text-gray-500">{sug.bio || 'No bio'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/*
                            ✅ CallButton REMOVED from suggestions.
                               Must DM first → then call from the Messages page.
                               Show a Message link instead.
                          */}
                          <Link
                            href="/messages"
                            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition border border-gray-700 text-gray-400 hover:text-white"
                            title={`Message ${sug.username}`}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleToggleFollow(sug._id)}
                            className={cn(
                              'text-xs font-bold px-3 py-1.5 rounded-lg transition-all',
                              followedSuggestions.includes(sug._id)
                                ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                : 'bg-gradient-to-r from-yellow-400 to-pink-600 text-white hover:from-yellow-300 hover:to-pink-500'
                            )}
                          >
                            {followedSuggestions.includes(sug._id) ? 'Following' : 'Follow'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-900/30 rounded-lg border border-gray-800">
                    <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No suggestions available</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Links */}
          <div className="mt-8">
            <div className="flex flex-wrap gap-3 mb-4">
              {['About', 'Help', 'Privacy', 'Terms', 'Locations', 'Language'].map((item) => (
                <a key={item} href="#" className="text-xs text-gray-600 hover:text-yellow-400 transition">
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
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
