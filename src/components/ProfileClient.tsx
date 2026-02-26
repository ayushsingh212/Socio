"use client"
import { useState, useEffect } from 'react';
import { Settings, Grid, Film, UserCheck, Link as LinkIcon, Heart, MessageCircle, MapPin, Calendar, Award, Share2, Users, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProfile, getFollowers, getFollowing, getUserPosts } from '@/services/user.service';

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

interface ProfileData {
  id: string;
  username: string;
  fullName: string;
  bio: string;
  avatar: string;
  coverImage: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isVerified: boolean;
  isFollowing: boolean;
  location: string;
  website: string;
  joinedDate: string;
  occupation: string;
}

interface Post {
  id: string;
  image: string;
  likes: number;
  comments: number;
  isVideo: boolean;
  createdAt: string;
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);

  useEffect(() => {
    fetchProfileData();
    fetchUserPosts();
    fetchFollowers();
    fetchFollowing();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      if (res.data.success) {
        setProfile(res.data.data);
        setIsFollowing(res.data.data.isFollowing);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await getUserPosts();
      if (res.data.success) {
        setPosts(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const fetchFollowers = async () => {
    try {
      const res = await getFollowers();
      if (res.data.success) {
        setFollowers(res.data.data.slice(0, 3));
      }
    } catch (error) {
      console.error('Failed to fetch followers:', error);
    }
  };

  const fetchFollowing = async () => {
    try {
      const res = await getFollowing();
      if (res.data.success) {
        setFollowing(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch following:', error);
    }
  };

  const handleFollowToggle = async () => {
    try {
      // Call follow/unfollow API
      // await toggleFollow(profile?.id);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-yellow-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Cover Photo */}
      <div className="relative h-48 md:h-64 w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={profile?.coverImage || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop"} 
            className="w-full h-full object-cover"
            alt="Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-10 relative">
        {/* Profile Header */}
        <div className="relative -mt-20 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
                <div className="w-full h-full rounded-full border-4 border-gray-900 overflow-hidden bg-gray-800">
                  <img 
                    src={profile?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"} 
                    className="w-full h-full object-cover" 
                    alt={profile?.username}
                  />
                </div>
              </div>
              {profile?.isVerified && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-pink-600 text-gray-900 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  VERIFIED
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                    {profile?.username || 'username'}
                    {profile?.isVerified && (
                      <span className="bg-gradient-to-r from-yellow-400 to-pink-600 text-xs px-2 py-1 rounded-full text-gray-900 font-bold">
                        PRO
                      </span>
                    )}
                  </h2>
                  <p className="text-gray-400">{profile?.fullName}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleFollowToggle}
                    className={cn(
                      "px-6 py-2 rounded-lg text-sm font-semibold transition-all",
                      isFollowing 
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700" 
                        : "bg-gradient-to-r from-yellow-400 to-pink-600 text-gray-900 hover:from-yellow-300 hover:to-pink-500"
                    )}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors">
                    <Settings className="w-5 h-5 text-gray-300" />
                  </button>
                  <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5 text-gray-300" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 py-4">
                <div className="text-center md:text-left">
                  <span className="font-bold text-xl text-white block">{profile?.postsCount || 0}</span>
                  <span className="text-gray-500 text-sm">Posts</span>
                </div>
                <div className="text-center md:text-left">
                  <span className="font-bold text-xl text-white block">{profile?.followersCount?.toLocaleString() || 0}</span>
                  <span className="text-gray-500 text-sm">Followers</span>
                </div>
                <div className="text-center md:text-left">
                  <span className="font-bold text-xl text-white block">{profile?.followingCount || 0}</span>
                  <span className="text-gray-500 text-sm">Following</span>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <p className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600">
                  {profile?.occupation || 'Content Creator'}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                  {profile?.bio || 'No bio yet'}
                </p>
                
                {/* Details */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  {profile?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {profile.location}
                    </span>
                  )}
                  {profile?.joinedDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Joined {new Date(profile.joinedDate).getFullYear()}
                    </span>
                  )}
                  {profile?.website && (
                    <a 
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 transition"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      {profile.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
              </div>

              {/* Mutual Followers */}
              {followers.length > 0 && (
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex -space-x-3">
                    {followers.map((follower, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 overflow-hidden">
                        <img 
                          src={follower.avatar || `https://images.unsplash.com/photo-${1500000000000 + i}?w=100&h=100&fit=crop`} 
                          alt={follower.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Followed by <span className="text-white font-medium">{followers[0]?.username}</span>
                    {followers.length > 1 && (
                      <> and {followers.length - 1} others</>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-800 mb-6">
          <div className="flex justify-center gap-12 -mt-px">
            <button
              onClick={() => setActiveTab('posts')}
              className={cn(
                "flex items-center gap-2 py-4 border-t-2 text-sm font-bold uppercase tracking-wider transition-all",
                activeTab === 'posts'
                  ? "border-yellow-400 text-yellow-400"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              )}
            >
              <Grid className="w-4 h-4" /> Posts
            </button>
            <button
              onClick={() => setActiveTab('reels')}
              className={cn(
                "flex items-center gap-2 py-4 border-t-2 text-sm font-bold uppercase tracking-wider transition-all",
                activeTab === 'reels'
                  ? "border-pink-500 text-pink-500"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              )}
            >
              <Film className="w-4 h-4" /> Reels
            </button>
            <button
              onClick={() => setActiveTab('tagged')}
              className={cn(
                "flex items-center gap-2 py-4 border-t-2 text-sm font-bold uppercase tracking-wider transition-all",
                activeTab === 'tagged'
                  ? "border-purple-500 text-purple-500"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              )}
            >
              <UserCheck className="w-4 h-4" /> Tagged
            </button>
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-3 gap-1 md:gap-6"
          >
            {posts.map((post) => (
              <motion.div 
                key={post.id}
                whileHover={{ scale: 1.02 }}
                className="relative aspect-square group overflow-hidden rounded-lg bg-gray-800 cursor-pointer"
              >
                <img 
                  src={post.image} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt=""
                />
                {post.isVideo && (
                  <div className="absolute top-2 right-2 text-white">
                    <Film className="w-5 h-5" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center gap-6 text-white font-bold p-4">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-5 h-5 fill-current" /> 
                    {post.likes.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-5 h-5 fill-current" /> 
                    {post.comments}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        <footer className="py-12 border-t border-gray-800 text-center mt-12">
          <div className="flex justify-center gap-6 text-xs text-gray-500 font-medium uppercase tracking-widest mb-4">
            <a className="hover:text-yellow-400 transition-colors" href="#">About</a>
            <a className="hover:text-yellow-400 transition-colors" href="#">Help</a>
            <a className="hover:text-yellow-400 transition-colors" href="#">Press</a>
            <a className="hover:text-yellow-400 transition-colors" href="#">API</a>
            <a className="hover:text-yellow-400 transition-colors" href="#">Jobs</a>
            <a className="hover:text-yellow-400 transition-colors" href="#">Privacy</a>
            <a className="hover:text-yellow-400 transition-colors" href="#">Terms</a>
          </div>
          <p className="text-xs text-gray-600">© 2024 SOCIO • CONNECT DIFFERENTLY</p>
        </footer>
      </div>
    </div>
  );
}