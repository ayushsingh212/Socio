"use client";

import { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  User, 
  Bell, 
  BellRing, 
  CheckCheck, 
  MoreHorizontal,
  Clock,
  Filter,
  Search,
  AtSign,
  Image,
  Video,
  Users,
  Settings,
  Mail,
  Star,
  Gift,
  Calendar,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'tag' | 'request' | 'birthday' | 'suggestion';

interface Notification {
  id: number;
  type: NotificationType;
  user: {
    id: number;
    username: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  timestamp: string;
  read: boolean;
  image?: string;
  postId?: number;
  action?: boolean;
}

// Sample notifications data
const initialNotifications: Notification[] = [
  {
    id: 1,
    type: 'like',
    user: {
      id: 101,
      username: 'alex_travels',
      avatar: 'https://picsum.photos/seed/avatar1/100/100',
      verified: true
    },
    content: 'liked your photo',
    timestamp: '2m ago',
    read: false,
    image: 'https://picsum.photos/seed/thumb1/100/100',
    postId: 1
  },
  {
    id: 2,
    type: 'comment',
    user: {
      id: 102,
      username: 'chef_mike',
      avatar: 'https://picsum.photos/seed/avatar2/100/100',
      verified: false
    },
    content: 'commented: "This looks amazing! 🔥"',
    timestamp: '15m ago',
    read: false,
    image: 'https://picsum.photos/seed/thumb2/100/100',
    postId: 2
  },
  {
    id: 3,
    type: 'follow',
    user: {
      id: 103,
      username: 'art_world',
      avatar: 'https://picsum.photos/seed/avatar3/100/100',
      verified: true
    },
    content: 'started following you',
    timestamp: '1h ago',
    read: false,
    action: true
  },
  {
    id: 4,
    type: 'mention',
    user: {
      id: 104,
      username: 'music_lover',
      avatar: 'https://picsum.photos/seed/avatar4/100/100',
      verified: false
    },
    content: 'mentioned you in a comment: "@joshua_design check this out!"',
    timestamp: '3h ago',
    read: true,
    postId: 3
  },
  {
    id: 5,
    type: 'tag',
    user: {
      id: 105,
      username: 'fitness_pro',
      avatar: 'https://picsum.photos/seed/avatar5/100/100',
      verified: false
    },
    content: 'tagged you in a photo',
    timestamp: '5h ago',
    read: true,
    image: 'https://picsum.photos/seed/thumb3/100/100',
    postId: 4
  },
  {
    id: 6,
    type: 'request',
    user: {
      id: 106,
      username: 'tech_guru',
      avatar: 'https://picsum.photos/seed/avatar6/100/100',
      verified: true
    },
    content: 'sent you a follow request',
    timestamp: '1d ago',
    read: true,
    action: true
  },
  {
    id: 7,
    type: 'birthday',
    user: {
      id: 107,
      username: 'sarah_designs',
      avatar: 'https://picsum.photos/seed/avatar7/100/100',
      verified: false
    },
    content: `It's Sarah's birthday today`,
    timestamp: '2d ago',
    read: true
  },
  {
    id: 8,
    type: 'suggestion',
    user: {
      id: 108,
      username: 'photo_daily',
      avatar: 'https://picsum.photos/seed/avatar8/100/100',
      verified: false
    },
    content: 'suggested for you based on your interests',
    timestamp: '2d ago',
    read: true,
    action: true
  },
  {
    id: 9,
    type: 'like',
    user: {
      id: 109,
      username: 'nature_lover',
      avatar: 'https://picsum.photos/seed/avatar9/100/100',
      verified: false
    },
    content: 'liked your photo',
    timestamp: '3d ago',
    read: true,
    image: 'https://picsum.photos/seed/thumb4/100/100',
    postId: 5
  },
  {
    id: 10,
    type: 'comment',
    user: {
      id: 110,
      username: 'travel_diaries',
      avatar: 'https://picsum.photos/seed/avatar10/100/100',
      verified: true
    },
    content: 'commented: "Where is this place? 😍"',
    timestamp: '3d ago',
    read: true,
    image: 'https://picsum.photos/seed/thumb5/100/100',
    postId: 6
  },
  {
    id: 11,
    type: 'follow',
    user: {
      id: 111,
      username: 'food_critic',
      avatar: 'https://picsum.photos/seed/avatar11/100/100',
      verified: false
    },
    content: 'started following you',
    timestamp: '4d ago',
    read: true,
    action: true
  },
  {
    id: 12,
    type: 'mention',
    user: {
      id: 112,
      username: 'art_gallery_sf',
      avatar: 'https://picsum.photos/seed/avatar12/100/100',
      verified: true
    },
    content: 'mentioned you in a post',
    timestamp: '5d ago',
    read: true,
    image: 'https://picsum.photos/seed/thumb6/100/100',
    postId: 7
  }
];

// Date groups
const groupNotificationsByDate = (notifications: Notification[]) => {
  const groups: { [key: string]: Notification[] } = {
    'Today': [],
    'Yesterday': [],
    'This Week': [],
    'Earlier': []
  };

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  notifications.forEach(notification => {
    const notifDate = new Date(notification.timestamp); // You'd need to parse properly
    
    if (notification.timestamp.includes('m') || notification.timestamp.includes('h')) {
      groups['Today'].push(notification);
    } else if (notification.timestamp.includes('1d')) {
      groups['Yesterday'].push(notification);
    } else if (notification.timestamp.includes('d') && parseInt(notification.timestamp) <= 7) {
      groups['This Week'].push(notification);
    } else {
      groups['Earlier'].push(notification);
    }
  });

  return groups;
};

// Notification icon mapping
const getNotificationIcon = (type: NotificationType) => {
  switch(type) {
    case 'like':
      return <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 fill-red-500" />;
    case 'comment':
      return <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 fill-blue-500" />;
    case 'follow':
      return <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
    case 'mention':
      return <AtSign className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />;
    case 'tag':
      return <Image className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
    case 'request':
      return <Users className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />;
    case 'birthday':
      return <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />;
    case 'suggestion':
      return <Star className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />;
    default:
      return <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />;
  }
};

export default function ActivityPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<'all' | 'mentions' | 'requests'>('all');
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Stats
  const unreadCount = notifications.filter(n => !n.read).length;
  const groupedNotifications = groupNotificationsByDate(notifications);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    // Tab filter
    if (activeTab === 'mentions' && notification.type !== 'mention') return false;
    if (activeTab === 'requests' && notification.type !== 'request') return false;
    
    // Type filter
    if (filterType !== 'all' && notification.type !== filterType) return false;
    
    // Search filter
    if (searchQuery && !notification.user.username.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  // Mark single as read
  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  // Follow/Unfollow action
  const handleFollowAction = (id: number, action: 'accept' | 'decline') => {
    // Handle follow request
    console.log(`Follow request ${action}ed`, id);
  };

  // Get notification background
  const getNotificationBg = (read: boolean) => {
    return read 
      ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50' 
      : 'bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-100/50 dark:hover:bg-blue-900/20';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <h1 className="text-xl sm:text-2xl font-bold">Activity</h1>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Unread Badge */}
              {unreadCount > 0 && (
                <div className="relative">
                  <BellRing className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {unreadCount}
                  </span>
                </div>
              )}

              {/* Mark all as read */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="hidden sm:flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Mark all as read</span>
                </button>
              )}

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full relative"
              >
                <Filter className="w-5 h-5" />
                {filterType !== 'all' && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </button>

              {/* Settings Button */}
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 sm:gap-6 -mb-px">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors relative ${
                activeTab === 'all'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              All
              {unreadCount > 0 && activeTab === 'all' && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('mentions')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors relative ${
                activeTab === 'mentions'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Mentions
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors relative ${
                activeTab === 'requests'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Follow Requests
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Filter Chips */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Filter by type</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      filterType === 'all'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    All
                  </button>
                  {(['like', 'comment', 'follow', 'mention', 'tag', 'request'] as NotificationType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors flex items-center gap-1 ${
                        filterType === type
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {getNotificationIcon(type)}
                      <span>{type}s</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No notifications</h3>
            <p className="text-sm text-gray-500">
              {searchQuery 
                ? "No notifications match your search" 
                : activeTab === 'mentions' 
                ? "When someone mentions you, it'll show up here"
                : activeTab === 'requests'
                ? "You don't have any follow requests"
                : "When you get notifications, they'll show up here"}
            </p>
          </div>
        ) : (
          Object.entries(groupedNotifications).map(([group, groupNotifications]) => {
            const filteredGroup = groupNotifications.filter(n => 
              filteredNotifications.includes(n)
            );
            
            if (filteredGroup.length === 0) return null;

            return (
              <div key={group} className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {group}
                </h3>
                
                <div className="space-y-1">
                  {filteredGroup.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`group relative p-3 sm:p-4 rounded-xl transition-all cursor-pointer ${getNotificationBg(notification.read)}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3 sm:gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden relative">
                          <img 
                            src={notification.user.avatar} 
                            alt={notification.user.username}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          {/* Type Indicator */}
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-bold text-sm sm:text-base hover:underline">
                                {notification.user.username}
                              </span>
                              {notification.user.verified && (
                                <span className="ml-1 text-blue-500 text-xs">✓</span>
                              )}
                              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-1">
                                {notification.content}
                              </span>
                            </div>
                            
                            {/* Time & Actions */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-gray-400 whitespace-nowrap">
                                {notification.timestamp}
                              </span>
                              
                              {!notification.read && (
                                <span className="w-2 h-2 bg-primary rounded-full" />
                              )}
                            </div>
                          </div>

                          {/* Post Preview */}
                          {notification.image && (
                            <div className="mt-2 flex items-center gap-2">
                              <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                <img 
                                  src={notification.image} 
                                  alt="Post preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-xs text-gray-500">View post</span>
                            </div>
                          )}

                          {/* Action Buttons */}
                          {notification.action && (
                            <div className="mt-3 flex gap-2">
                              {notification.type === 'follow' && (
                                <>
                                  <button className="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
                                    Follow Back
                                  </button>
                                  <button className="border border-gray-300 dark:border-gray-600 px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    Remove
                                  </button>
                                </>
                              )}
                              
                              {notification.type === 'request' && (
                                <>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleFollowAction(notification.id, 'accept');
                                    }}
                                    className="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
                                  >
                                    Accept
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleFollowAction(notification.id, 'decline');
                                    }}
                                    className="border border-gray-300 dark:border-gray-600 px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    Decline
                                  </button>
                                </>
                              )}

                              {notification.type === 'suggestion' && (
                                <button className="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
                                  Follow
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Quick Actions Menu */}
                        <button 
                          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Show options menu
                          }}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })
        )}

        {/* Load More */}
        {filteredNotifications.length > 10 && (
          <div className="text-center mt-8">
            <button className="text-primary text-sm font-medium hover:underline">
              Load more
            </button>
          </div>
        )}
      </div>

      {/* Mobile Quick Actions */}
      <div className="fixed bottom-16 left-0 right-0 lg:hidden">
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="mx-4 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-around">
            <button className="flex flex-col items-center p-2">
              <Heart className="w-5 h-5" />
              <span className="text-xs mt-1">Likes</span>
            </button>
            <button className="flex flex-col items-center p-2">
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs mt-1">Comments</span>
            </button>
            <button className="flex flex-col items-center p-2">
              <UserPlus className="w-5 h-5" />
              <span className="text-xs mt-1">Follows</span>
            </button>
            <button className="flex flex-col items-center p-2 relative">
              <AtSign className="w-5 h-5" />
              <span className="text-xs mt-1">Mentions</span>
              {notifications.filter(n => n.type === 'mention' && !n.read).length > 0 && (
                <span className="absolute top-0 right-2 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Summary Cards */}
      <div className="hidden lg:block fixed right-4 top-20 w-64">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Activity Summary
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Today</span>
              <span className="font-medium">
                {notifications.filter(n => n.timestamp.includes('m') || n.timestamp.includes('h')).length}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">This week</span>
              <span className="font-medium">
                {notifications.filter(n => n.timestamp.includes('d')).length}
              </span>
            </div>
            
            <div className="h-px bg-gray-200 dark:bg-gray-700" />
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Most active</span>
              <span className="font-medium text-primary">Likes</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Response rate</span>
              <span className="font-medium text-green-500">78%</span>
            </div>
          </div>
          
          <button className="w-full mt-4 text-xs text-primary font-medium text-center hover:underline">
            View insights →
          </button>
        </div>
      </div>
    </div>
  );
}