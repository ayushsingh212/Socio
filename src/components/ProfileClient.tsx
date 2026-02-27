"use client"
import { useState, useEffect } from 'react';
import { 
  Settings, Grid, Film, UserCheck, Link as LinkIcon, Heart, 
  MessageCircle, MapPin, Calendar, Award, Share2, Users, Loader2, 
  Edit3, LogOut, Shield, Bell, Moon, HelpCircle, ChevronDown,
  MoreHorizontal, Mail, Send, Camera, Image as ImageIcon,
  Music, Video, Smile, Bookmark, Flag, Twitter, Instagram,
  Facebook, Globe, Briefcase, GraduationCap, HeartHandshake,
  Sparkles, Lock, CheckCircle, PlusCircle, X, Star, Download,
  UserPlus, MessageSquare, Volume2, VolumeX, Play, Pause
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFollowers, getFollowing, getUserPosts, getUserProfile } from '@/services/profile.service';
import { getProfile } from "@/services/auth.service";
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { startMessage } from '@/services/message.service';

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
  email?: string;
  phone?: string;
  gender?: string;
  birthday?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  highlights?: Highlight[];
  story?: boolean;
  category?: string;
  pronouns?: string;
}

interface Highlight {
  id: string;
  title: string;
  coverImage: string;
}

interface Post {
  id: string;
  image: string;
  likes: number;
  comments: number;
  isVideo: boolean;
  createdAt: string;
  caption?: string;
  location?: string;
  music?: string;
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeStory, setActiveStory] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { username } = useParams();

  useEffect(() => {
    fetchProfileData();
  }, [username, user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      const currentUserRes = await getProfile();
      const currentUsername = currentUserRes?.data?.data?.username;
      
      if (!username || username === currentUsername) {
        setIsOwnProfile(true);
        const profileRes = await getUserProfile(currentUsername);
        if (profileRes?.data?.data) {
          setProfile({
            ...profileRes.data.data,
            story: Math.random() > 0.5,
            highlights: generateMockHighlights(),
            socialLinks: {
              twitter: 'https://twitter.com/' + currentUsername,
              instagram: 'https://instagram.com/' + currentUsername,
            }
          });
        }
      } else {
        setIsOwnProfile(false);
        const profileRes = await getUserProfile(username as string);
        if (profileRes?.data?.data) {
          setProfile({
            ...profileRes.data.data,
            story: Math.random() > 0.3,
            isFollowing: profileRes.data.data.isFollowing || false,
            highlights: generateMockHighlights(),
          });
          setIsFollowing(profileRes.data.data.isFollowing || false);
        }
      }

      await fetchUserPosts(username || currentUsername);
      await fetchFollowers(username || currentUsername);
      await fetchFollowing(username || currentUsername);
      
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockHighlights = (): Highlight[] => {
    return [
      { id: '1', title: 'Travel', coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop' },
      { id: '2', title: 'Food', coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop' },
      { id: '3', title: 'Fitness', coverImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop' },
      { id: '4', title: 'Music', coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop' },
    ];
  };

  const fetchUserPosts = async (targetUsername: string) => {
    try {
      const res = await getUserPosts(targetUsername);
      if (res?.data?.success) {
        const mockPosts = res.data.data?.map((post: any, index: number) => ({
          ...post,
          isVideo: index % 3 === 0,
          music: index % 4 === 0 ? 'Original Audio' : undefined,
          location: index % 5 === 0 ? 'New York, NY' : undefined,
        })) || [];
        setPosts(mockPosts);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const fetchFollowers = async (targetUsername: string) => {
    try {
      const res = await getFollowers(targetUsername);
      if (res?.data?.success) {
        setFollowers(res.data.data?.slice(0, 5) || []);
      }
    } catch (error) {
      console.error('Failed to fetch followers:', error);
    }
  };

  const fetchFollowing = async (targetUsername: string) => {
    try {
      const res = await getFollowing(targetUsername);
      if (res?.data?.success) {
        setFollowing(res.data.data?.slice(0, 5) || []);
      }
    } catch (error) {
      console.error('Failed to fetch following:', error);
    }
  };

  const handleFollowToggle = async () => {
    try {
      setIsFollowing(!isFollowing);
      if (profile) {
        setProfile({
          ...profile,
          followersCount: isFollowing ? profile.followersCount - 1 : profile.followersCount + 1
        });
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  const handleMessage = () => {
    setShowMessageModal(true);
  };

  const handleSendMessage = async() => {
    if (messageText.trim()) {
      // Implement send message logic

    try{
      console.log("here is the profile",profile)
   const res = await startMessage({receiver:profile?._id,
    message:messageText
   })
    }
    catch{

    }

      console.log('Sending message:', profile);
      setMessageText('');
      setShowMessageModal(false);
      // Show success toast
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleSettings = () => {
    setShowSettingsMenu(!showSettingsMenu);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Users className="w-12 h-12 text-gray-600" />
          </div>
          <p className="text-gray-400 mb-4">Profile not found</p>
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 transition">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Cover Photo with Gradient Overlay */}
      <div className="relative h-56 md:h-80 w-full overflow-hidden group">
        <div className="absolute inset-0">
          <img 
            src={profile.coverImage || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop"} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            alt="Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
        </div>
        
        {isOwnProfile && (
          <button className="absolute bottom-4 right-4 bg-gray-900/80 hover:bg-gray-900 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all">
            <Camera className="w-4 h-4" />
            Edit Cover
          </button>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-10 relative">
        {/* Profile Header */}
        <div className="relative -mt-20 md:-mt-24 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar with Story Ring */}
            <div className="relative group">
              <div className={cn(
                "w-32 h-32 md:w-40 md:h-40 rounded-full p-[3px]",
                profile.story 
                  ? "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 animate-spin-slow" 
                  : "bg-gray-700"
              )}>
                <div className="w-full h-full rounded-full border-4 border-gray-900 overflow-hidden bg-gray-800">
                  <img 
                    src={profile.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    alt={profile.username}
                  />
                </div>
              </div>
              {profile.story && (
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-yellow-400 to-pink-600 rounded-full flex items-center justify-center border-4 border-gray-900 hover:scale-110 transition-transform">
                  <PlusCircle className="w-4 h-4 text-gray-900" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      {profile.username}
                    </h2>
                    {profile.isVerified && (
                      <CheckCircle className="w-6 h-6 text-blue-400 fill-current" />
                    )}
                    {profile.pronouns && (
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                        {profile.pronouns}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-lg">{profile.fullName}</p>
                  {profile.category && (
                    <p className="text-sm text-gray-500 mt-1">{profile.category}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {isOwnProfile ? (
                    <>
                      <button 
                        onClick={handleEditProfile}
                        className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all flex items-center gap-2 border border-gray-700"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Profile
                      </button>
                      <button 
                        onClick={() => router.push('/profile/archive')}
                        className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all border border-gray-700"
                      >
                        Archive
                      </button>
                      <div className="relative">
                        <button 
                          onClick={handleSettings}
                          className="bg-gray-800 hover:bg-gray-700 p-2.5 rounded-lg transition-colors border border-gray-700"
                        >
                          <Settings className="w-5 h-5 text-gray-300" />
                        </button>
                        
                        {/* Settings Dropdown Menu */}
                        <AnimatePresence>
                          {showSettingsMenu && (
                            <>
                              <div 
                                className="fixed inset-0 z-10"
                                onClick={() => setShowSettingsMenu(false)}
                              />
                              <motion.div 
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-xl border border-gray-700 z-20 overflow-hidden"
                              >
                                <div className="py-1">
                                  <button className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-3 transition-colors">
                                    <Shield className="w-4 h-4" />
                                    Privacy & Security
                                  </button>
                                  <button className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-3 transition-colors">
                                    <Bell className="w-4 h-4" />
                                    Notifications
                                  </button>
                                  <button className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-3 transition-colors">
                                    <Moon className="w-4 h-4" />
                                    Dark Mode
                                  </button>
                                  <button className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-3 transition-colors">
                                    <Bookmark className="w-4 h-4" />
                                    Saved
                                  </button>
                                  <button className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-3 transition-colors">
                                    <HelpCircle className="w-4 h-4" />
                                    Help
                                  </button>
                                  <div className="border-t border-gray-700 my-1"></div>
                                  <button 
                                    onClick={handleLogout}
                                    className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center gap-3 transition-colors"
                                  >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                  </button>
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={handleFollowToggle}
                        className={cn(
                          "px-8 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
                          isFollowing 
                            ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700" 
                            : "bg-gradient-to-r from-yellow-400 to-pink-600 text-gray-900 hover:from-yellow-300 hover:to-pink-500 shadow-lg shadow-pink-500/25"
                        )}
                      >
                        <UserPlus className="w-4 h-4" />
                        {isFollowing ? 'Following' : 'Follow'}
                      </button>
                      <button 
                        onClick={handleMessage}
                        className="bg-gray-800 hover:bg-gray-700 p-2.5 rounded-xl transition-colors border border-gray-700"
                      >
                        <MessageCircle className="w-5 h-5 text-gray-300" />
                      </button>
                      <button 
                        onClick={handleShare}
                        className="bg-gray-800 hover:bg-gray-700 p-2.5 rounded-xl transition-colors border border-gray-700"
                      >
                        <Share2 className="w-5 h-5 text-gray-300" />
                      </button>
                      <button className="bg-gray-800 hover:bg-gray-700 p-2.5 rounded-xl transition-colors border border-gray-700">
                        <MoreHorizontal className="w-5 h-5 text-gray-300" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Stats - Clickable */}
              <div className="flex gap-8 py-2">
                <div className="text-center md:text-left cursor-pointer hover:opacity-80 transition">
                  <span className="font-bold text-xl text-white block">{profile.postsCount || 0}</span>
                  <span className="text-gray-500 text-sm">posts</span>
                </div>
                <div 
                  className="text-center md:text-left cursor-pointer hover:opacity-80 transition"
                  onClick={() => setShowFollowersModal(true)}
                >
                  <span className="font-bold text-xl text-white block">{profile.followersCount?.toLocaleString() || 0}</span>
                  <span className="text-gray-500 text-sm">followers</span>
                </div>
                <div 
                  className="text-center md:text-left cursor-pointer hover:opacity-80 transition"
                  onClick={() => setShowFollowingModal(true)}
                >
                  <span className="font-bold text-xl text-white block">{profile.followingCount || 0}</span>
                  <span className="text-gray-500 text-sm">following</span>
                </div>
              </div>

              {/* Bio with enhanced styling */}
              <div className="space-y-3">
                <p className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  {profile.occupation || 'Content Creator'}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">
                  {profile.bio || 'No bio yet'}
                </p>
                
                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-500">
                  {profile.location && (
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      {profile.location}
                    </span>
                  )}
                  {profile.website && (
                    <a 
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition truncate"
                    >
                      <LinkIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{profile.website.replace(/^https?:\/\//, '')}</span>
                    </a>
                  )}
                  {profile.joinedDate && (
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      Joined {new Date(profile.joinedDate).toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                    </span>
                  )}
                  {profile.email && isOwnProfile && (
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-600" />
                      {profile.email}
                    </span>
                  )}
                </div>

                {/* Social Links */}
                {profile.socialLinks && (
                  <div className="flex gap-3 pt-2">
                    {profile.socialLinks.twitter && (
                      <a href={profile.socialLinks.twitter} target="_blank" rel="noopener" className="text-gray-500 hover:text-blue-400 transition">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {profile.socialLinks.instagram && (
                      <a href={profile.socialLinks.instagram} target="_blank" rel="noopener" className="text-gray-500 hover:text-pink-500 transition">
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {profile.socialLinks.facebook && (
                      <a href={profile.socialLinks.facebook} target="_blank" rel="noopener" className="text-gray-500 hover:text-blue-600 transition">
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Mutual Followers */}
              {!isOwnProfile && followers.length > 0 && (
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex -space-x-2">
                    {followers.slice(0, 3).map((follower, i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-gray-900 overflow-hidden hover:z-10 transition-transform hover:scale-110">
                        <img 
                          src={follower.avatar || `https://images.unsplash.com/photo-${1500000000000 + i}?w=100&h=100&fit=crop`} 
                          alt={follower.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    Followed by <span className="text-white font-medium hover:underline cursor-pointer">{followers[0]?.username}</span>
                    {followers.length > 1 && (
                      <> and <span className="text-white font-medium hover:underline cursor-pointer">{followers.length - 1} others</span></>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Highlights Section */}
        {profile.highlights && profile.highlights.length > 0 && (
          <div className="mb-8 overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 pb-2">
              {profile.highlights.map((highlight) => (
                <div key={highlight.id} className="flex flex-col items-center gap-1 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full p-[2px] bg-gray-700 group-hover:bg-gradient-to-r from-yellow-400 to-pink-600 transition-all">
                    <div className="w-full h-full rounded-full border-2 border-gray-900 overflow-hidden">
                      <img 
                        src={highlight.coverImage} 
                        alt={highlight.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-white transition">{highlight.title}</span>
                </div>
              ))}
              {isOwnProfile && (
                <div className="flex flex-col items-center gap-1 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-dashed border-gray-700 flex items-center justify-center group-hover:border-yellow-400 transition-all">
                    <PlusCircle className="w-6 h-6 text-gray-500 group-hover:text-yellow-400" />
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-white transition">New</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tabs with icons and active indicators */}
        <div className="border-t border-gray-800 mb-6">
          <div className="flex justify-center gap-8 md:gap-12 -mt-px">
            {[
              { id: 'posts', icon: Grid, label: 'Posts' },
              { id: 'reels', icon: Film, label: 'Reels' },
              { id: 'tagged', icon: UserCheck, label: 'Tagged' },
              { id: 'saved', icon: Bookmark, label: 'Saved', showIfOwn: true }
            ].map((tab) => {
              if (tab.showIfOwn && !isOwnProfile) return null;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 py-4 border-t-2 text-sm font-bold uppercase tracking-wider transition-all relative",
                    activeTab === tab.id
                      ? "border-yellow-400 text-yellow-400"
                      : "border-transparent text-gray-500 hover:text-gray-300"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-px left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-pink-600"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Posts Grid with Masonry Layout */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-3 gap-1 md:gap-6"
          >
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => handlePostClick(post)}
                  className="relative aspect-square group overflow-hidden rounded-lg bg-gray-800 cursor-pointer"
                >
                  <img 
                    src={post.image} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt=""
                  />
                  
                  {/* Multiple media indicator */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {post.isVideo && (
                      <div className="bg-black/50 backdrop-blur-sm p-1.5 rounded-full">
                        <Video className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {post.music && (
                      <div className="bg-black/50 backdrop-blur-sm p-1.5 rounded-full">
                        <Music className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Overlay with stats */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                    <div className="flex gap-4 text-white font-medium">
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-5 h-5 fill-white" /> 
                        <span className="text-sm">{post.likes?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="w-5 h-5 fill-white" /> 
                        <span className="text-sm">{post.comments || 0}</span>
                      </div>
                    </div>
                    {post.location && (
                      <div className="flex items-center gap-1 text-white/80 text-xs">
                        <MapPin className="w-3 h-3" />
                        {post.location}
                      </div>
                    )}
                  </div>

                  {/* Music indicator */}
                  {post.music && (
                    <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs flex items-center gap-1">
                      <Music className="w-3 h-3" />
                      {post.music}
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-3 text-center py-16"
              >
                <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-500 text-lg mb-2">No posts yet</p>
                <p className="text-gray-600 text-sm">
                  {isOwnProfile ? 'Share your first photo or video' : 'This user hasn\'t posted anything yet'}
                </p>
                {isOwnProfile && (
                  <button className="mt-4 px-6 py-2 bg-gradient-to-r from-yellow-400 to-pink-600 text-gray-900 rounded-lg text-sm font-semibold hover:from-yellow-300 hover:to-pink-500 transition">
                    Create Post
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
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

      {/* Followers Modal */}
      <AnimatePresence>
        {showFollowersModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowFollowersModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden border border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Followers</h3>
                <button onClick={() => setShowFollowersModal(false)} className="p-1 hover:bg-gray-800 rounded-lg transition">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="overflow-y-auto p-4 space-y-4">
                {followers.map((follower, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={follower.avatar || `https://images.unsplash.com/photo-${1500000000000 + i}?w=100&h=100&fit=crop`}
                        className="w-12 h-12 rounded-full object-cover"
                        alt={follower.username}
                      />
                      <div>
                        <p className="font-semibold text-white">{follower.username}</p>
                        <p className="text-sm text-gray-500">{follower.fullName}</p>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Modal */}
      <AnimatePresence>
        {showPostModal && selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
            onClick={() => setShowPostModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-900 rounded-2xl w-full max-w-4xl overflow-hidden border border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image/Video Section */}
                <div className="relative flex-1 bg-black min-h-[400px] md:min-h-[600px]">
                  <img 
                    src={selectedPost.image} 
                    className="w-full h-full object-contain"
                    alt=""
                  />
                  {selectedPost.isVideo && (
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button className="bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition">
                        {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
                      </button>
                      <button className="bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition">
                        <Play className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Comments/Info Section */}
                <div className="w-full md:w-96 flex flex-col">
                  <div className="p-4 border-b border-gray-800 flex items-center gap-3">
                    <img 
                      src={profile.avatar} 
                      className="w-8 h-8 rounded-full object-cover"
                      alt={profile.username}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-white">{profile.username}</p>
                      <p className="text-xs text-gray-500">{selectedPost.location}</p>
                    </div>
                    <button className="text-gray-400 hover:text-white transition">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="flex gap-3">
                      <img 
                        src={profile.avatar} 
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        alt={profile.username}
                      />
                      <div>
                        <p className="text-white">
                          <span className="font-semibold mr-2">{profile.username}</span>
                          {selectedPost.caption || 'Awesome post! 🔥'}
                        </p>
                        {selectedPost.music && (
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Music className="w-3 h-3" />
                            {selectedPost.music}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Comments would go here */}
                  </div>
                  
                  <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-4 mb-3">
                      <Heart className="w-6 h-6 text-gray-400 hover:text-red-500 cursor-pointer transition" />
                      <MessageCircle className="w-6 h-6 text-gray-400 hover:text-yellow-400 cursor-pointer transition" />
                      <Send className="w-6 h-6 text-gray-400 hover:text-blue-400 cursor-pointer transition" />
                      <Bookmark className="w-6 h-6 text-gray-400 hover:text-yellow-400 cursor-pointer transition ml-auto" />
                    </div>
                    <p className="font-semibold text-white mb-1">{selectedPost.likes?.toLocaleString()} likes</p>
                    <p className="text-xs text-gray-500">{new Date(selectedPost.createdAt).toLocaleDateString()}</p>
                    <div className="flex gap-2 mt-3">
                      <input 
                        type="text" 
                        placeholder="Add a comment..." 
                        className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-600"
                      />
                      <button className="text-blue-400 text-sm font-semibold hover:text-blue-300 transition">
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Modal */}
      <AnimatePresence>
        {showMessageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowMessageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden border border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Message @{profile.username}</h3>
                <button onClick={() => setShowMessageModal(false)} className="p-1 hover:bg-gray-800 rounded-lg transition">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-800/50 rounded-xl">
                  <img 
                    src={profile.avatar} 
                    className="w-10 h-10 rounded-full object-cover"
                    alt={profile.username}
                  />
                  <div>
                    <p className="font-semibold text-white">{profile.username}</p>
                    <p className="text-xs text-gray-500">{profile.fullName}</p>
                  </div>
                </div>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Write a message to @${profile.username}...`}
                  className="w-full h-32 bg-gray-800 text-white rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400/50 resize-none"
                />
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-pink-600 text-gray-900 rounded-xl text-sm font-semibold hover:from-yellow-300 hover:to-pink-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 rounded-2xl w-full max-w-sm overflow-hidden border border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Share Profile</h3>
                <button onClick={() => setShowShareModal(false)} className="p-1 hover:bg-gray-800 rounded-lg transition">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <button className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center gap-3 text-white transition">
                  <Send className="w-5 h-5 text-blue-400" />
                  Send in message
                </button>
                <button className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center gap-3 text-white transition">
                  <Twitter className="w-5 h-5 text-blue-400" />
                  Share on Twitter
                </button>
                <button className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center gap-3 text-white transition">
                  <Facebook className="w-5 h-5 text-blue-600" />
                  Share on Facebook
                </button>
                <button className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center gap-3 text-white transition">
                  <LinkIcon className="w-5 h-5 text-green-400" />
                  Copy link
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}