"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Video, Phone, Info, Smile, Image as ImageIcon, Mic, Send, Flame, CheckCheck, X, MessageCircle, PhoneOff, VideoOff, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react';
import { io } from 'socket.io-client';
import { getAllActveChatRoom, getMessages, searchUsersForDM, startMessage } from '@/services/message.service';
import { useAuthStore } from '@/store/auth.store';
import { useAuthBootstrap } from '@/hooks/useAuth';

import { CallButton } from '@/components/call/CallButton';
import { CallHistory, CallLog } from '@/components/call/CallHistory';
import toast from 'react-hot-toast';
import { useCall } from '@/context/CallContext';
import { useSocket } from '@/context/SocketContext';

interface Member {
  _id: string;
  email: string;
  isEmailVerified: boolean;
  username: string;
  fullName: string;
  DOB: string;
  avatarInfo: {
    avatarUrl: string;
    avatarId: string;
  };
  location: {
    type: string;
    coordinates: number[];
  };
  userFriends: any[];
  modeTag: string;
}

interface ChatRoom {
  _id: string;
  name: string;
  members: Member[];
  isP2P: boolean;
  streak: string;
  lastActiveTime: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Message {
  id: string;
  senderId: string;
  message: string;
  timestamp: Date;
  read?: boolean;
  roomId?: string;
  callType?: 'audio' | 'video';
  callDuration?: number;
  callStatus?: 'missed' | 'completed' | 'rejected';
}

interface Contact {
  id: string;
  name: string;
  lastMsg: string;
  time: string;
  avatar: string;
  active?: boolean;
  streak?: number;
  unread?: boolean;
  roomId: string;
  memberId: string;
  username?: string;
  email?: string;
}

interface SearchUser {
  _id: string;
  username: string;
  fullName: string;
  avatarInfo: {
    avatarUrl: string;
    avatarId: string;
  };
  bio?: string;
  accountVerified?: boolean;
  email?: string;
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Messages() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showCallHistory, setShowCallHistory] = useState(false);
  const [callHistory, setCallHistory] = useState<CallLog[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const selectedContactRef = useRef<Contact | null>(null);
  // Use a ref for contacts inside socketInstance handlers to avoid stale closures
  const contactsRef = useRef<Contact[]>([]);

  useAuthBootstrap();
  const { user } = useAuthStore();
  const { initiateCall, activeCall, incomingCall } = useCall();

  // Keep contactsRef in sync with contacts state
  useEffect(() => {
    contactsRef.current = contacts;
  }, [contacts]);

  const getAllChatRooms = useCallback(async () => {
    const userId = user?.user?.data?._id;
    if (!userId) return;

    try {
      const res = await getAllActveChatRoom();
      if (res.data.success) {
        const rooms: ChatRoom[] = res.data.data;
        setCurrentUserId(userId);

        const transformedContacts: Contact[] = rooms.map((room) => {
          const otherMember = room.members.find((member) => member._id !== userId) || room.members[0];
          return {
            id: room._id,
            name: otherMember?.fullName || 'Unknown User',
            lastMsg: 'Start a conversation',
            time: room.lastActiveTime === 'ACTIVE' ? 'ACTIVE' : new Date(room.updatedAt).toLocaleTimeString(),
            avatar: otherMember?.avatarInfo?.avatarUrl || 'https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg',
            active: room.lastActiveTime === 'ACTIVE',
            streak: parseInt(room.streak) || 0,
            unread: false,
            roomId: room._id,
            memberId: otherMember?._id || '',
            username: otherMember?.username,
            email: otherMember?.email,
          };
        });

        setContacts(transformedContacts);
        setSelectedContact((prev) => {
          if (!prev && transformedContacts.length > 0) {
            return transformedContacts[0];
          }
          return prev;
        });
      }
    } catch (err) {
      console.error('Unable to fetch contacts', err);
    }
  }, [user]);

  const loadCallHistory = useCallback(() => {
    const mockCallHistory: CallLog[] = messages
      .filter(msg => msg.callType)
      .map((msg, index) => ({
        id: `call-${index}`,
        participant: {
          id: selectedContact?.memberId || '',
          name: selectedContact?.name || '',
          avatar: selectedContact?.avatar || '',
          username: selectedContact?.username || '',
        },
        type: msg.callType || 'audio',
        direction: msg.senderId === currentUserId ? 'outgoing' : 'incoming',
        status: msg.callStatus || 'completed',
        duration: msg.callDuration || 0,
        timestamp: msg.timestamp,
      }));
    setCallHistory(mockCallHistory);
  }, [messages, selectedContact, currentUserId]);

  useEffect(() => {
    loadCallHistory();
  }, [messages, loadCallHistory]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);

    try {
      const res = await searchUsersForDM(query);
      if (res.data.success) {
        setSearchResults(res.data.data);
      }
    } catch (error) {
      console.error("Search failed", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(query);
    }, 500);
  };

  const handleStartChat = async (selectedUser: SearchUser) => {
    try {
      const res = await startMessage({ receiver: selectedUser._id });
      if (res.data.success) {
        const newRoom = res.data.data;
        const newContact: Contact = {
          id: newRoom._id,
          name: selectedUser.fullName,
          lastMsg: 'Start a conversation',
          time: 'ACTIVE',
          avatar: selectedUser.avatarInfo?.avatarUrl || 'https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg',
          active: true,
          streak: 0,
          unread: false,
          roomId: newRoom._id,
          memberId: selectedUser._id,
          username: selectedUser.username,
          email: selectedUser.email,
        };

        setContacts(prev => [newContact, ...prev]);
        setSelectedContact(newContact);
        setSearchQuery('');
        setSearchResults([]);
        setShowSearchResults(false);

        toast.success(`Started chat with ${selectedUser.fullName}`);
      }
    } catch (error) {
      console.error("Failed to create chat", error);
      toast.error("Failed to start chat");
    }
  };

  const handleStartCall = useCallback((type: 'audio' | 'video') => {

    console.log(("Call chalu ho rha"))
    if (!selectedContactRef.current) return;

    if (activeCall) {
      toast.error("You're already in a call");
      return;
    }

    const contact = selectedContactRef.current;
    console.log("Here is contact",contact)

    if (!contact.memberId || !contact.username) {
      toast.error("User information incomplete");
      return;
    }

    initiateCall({
      id: contact.memberId,
      username: contact.username,
      fullName: contact.name,
      avatar: contact.avatar,
      email: contact.email || '',
    }, type);

    const callMessage: Message = {
      id: `call-${Date.now()}`,
      senderId: currentUserId,
      message: `${type === 'video' ? '📹' : '📞'} ${type === 'video' ? 'Video' : 'Voice'} call started`,
      timestamp: new Date(),
      roomId: contact.roomId,
      callType: type,
      callStatus: 'completed',
    };

    setMessages(prev => [...prev, callMessage]);

  
    
  }, [activeCall, currentUserId, initiateCall]);

  const handleCallBack = (username: string, type: 'audio' | 'video') => {
    const contact = contactsRef.current.find(c => c.username === username);
    if (contact) {

      setSelectedContact(contact);
        console.log("Here is the ss",selectedContact)
      selectedContactRef.current = contact;
      handleStartCall(type);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  useEffect(() => {
    getAllChatRooms();
  }, [getAllChatRooms]);
const socketInstance = useSocket();

useEffect(() => {
  if (!socketInstance) return;

  socketInstance.on("receiveMessage", (message: Message) => {
    setMessages((prev) => [
      ...prev,
      { ...message, timestamp: new Date(message.timestamp) },
    ]);
  });

  return () => {
    socketInstance.off("receiveMessage");
  };
}, [socketInstance]);
  useEffect(() => {
    selectedContactRef.current = selectedContact;
  }, [selectedContact]);

  const prevRoomIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!socketInstance || !selectedContact?.roomId ) return;

    if (prevRoomIdRef.current && prevRoomIdRef.current !== selectedContact.roomId) {
      socketInstance.emit('leaveRoom', { roomId: prevRoomIdRef.current });
    }

    prevRoomIdRef.current = selectedContact.roomId;
    socketInstance.emit('joinRoom', { roomId: selectedContact.roomId });
    setMessages([]);
    setTypingUsers(new Set());
    fetchMessageHistory(selectedContact.roomId);
    console.log("Seleccted c",selectedContact)
  }, [selectedContact?.roomId, socketInstance]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessageHistory = async (roomId: string) => {
    try {
      const response = await getMessages(roomId);
      if (!response.data.success) return;
      const messagesArray = response.data.data;
      const normalized: Message[] = messagesArray.map((msg: any) => ({
        id: msg._id,
        senderId: msg.sender._id,
        message: msg.message,
        timestamp: new Date(msg.createdAt),
        roomId: msg.roomId,
        read: msg.viewedBy?.length > 0,
        callType: msg.callType,
        callDuration: msg.callDuration,
        callStatus: msg.callStatus,
      }));
      setMessages(normalized);
    } catch (error) {
      console.error("Failed to fetch message history:", error);
      toast.error("Failed to load message history");
    }
  };

  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketInstance || !selectedContact?.roomId) return;

    socketInstance.emit('sendMessage', {
      roomId: selectedContact.roomId,
      message: newMessage.trim(),
      senderId: currentUserId,
    });

    setNewMessage('');
  };

  const handleTyping = () => {
    if (!socketInstance || !selectedContact?.roomId) return;
    socketInstance.emit('typing', { roomId: selectedContact.roomId, isTyping: true });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketInstance.emit('typing', {
        roomId: selectedContact.roomId,
        isTyping: false,
      });
    }, 1000);
  };

  const formatMessageTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCallDuration = (seconds: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isCurrentUser = (senderId: any) => String(senderId) === String(currentUserId);

  const renderCallMessage = (msg: Message) => {
    const icon = msg.callType === 'video'
      ? <Video className="w-4 h-4" />
      : <Phone className="w-4 h-4" />;

    let statusIcon: React.ReactNode = null;
    if (msg.callStatus === 'missed') {
      statusIcon = <PhoneMissed className="w-4 h-4 text-red-400" />;
    } else if (msg.callStatus === 'completed') {
      statusIcon = <CheckCheck className="w-4 h-4 text-green-400" />;
    } else if (msg.callStatus === 'rejected') {
      statusIcon = <PhoneOff className="w-4 h-4 text-orange-400" />;
    }

    return (
      <div className={cn(
        'flex items-center gap-2 p-3 rounded-lg',
        msg.callStatus === 'missed' ? 'bg-red-500/10' : 'bg-primary/10'
      )}>
        <div className={cn(
          'p-2 rounded-full',
          msg.callStatus === 'missed' ? 'bg-red-500/20' : 'bg-primary/20'
        )}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">
            {msg.callType === 'video' ? 'Video call' : 'Voice call'} {msg.callStatus}
          </p>
          {msg.callDuration ? (
            <p className="text-xs text-gray-500">
              Duration: {formatCallDuration(msg.callDuration)}
            </p>
          ) : null}
        </div>
        {statusIcon}
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      

      {/* Incoming Call Notification */}
      {incomingCall && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 animate-bounce">
          <PhoneIncoming className="w-5 h-5 animate-pulse" />
          <span className="font-medium">Incoming call from {incomingCall.from.fullName}</span>
          <div className="flex gap-2">
            <button className="bg-green-500 p-2 rounded-full hover:bg-green-600 transition">
              <Phone className="w-4 h-4" />
            </button>
            <button className="bg-red-500 p-2 rounded-full hover:bg-red-600 transition">
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <section className="w-80 lg:w-96 border-r border-slate-800 flex flex-col bg-gray-900/50 backdrop-blur-sm relative">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
              Messages
            </h2>
            <button
              onClick={() => setShowCallHistory(!showCallHistory)}
              className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition relative"
            >
              <Phone className="w-5 h-5 text-gray-400" />
              {callHistory.filter(c => c.status === 'missed').length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                  {callHistory.filter(c => c.status === 'missed').length}
                </span>
              )}
            </button>
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-400 transition-colors w-4 h-4" />
            <input
              type="text"
              placeholder="Search direct messages"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2.5 pl-10 pr-10 focus:ring-2 focus:ring-yellow-400 text-sm transition-all text-white placeholder-gray-500"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => searchQuery && setShowSearchResults(true)}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {showSearchResults && (
          <div className="absolute top-32 left-6 right-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-50 max-h-96 overflow-y-auto custom-scrollbar">
            {isSearching ? (
              <div className="p-4 text-center text-gray-400">Searching...</div>
            ) : searchResults.length > 0 ? (
              <div className="py-2">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleStartChat(user)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <img
                      src={user.avatarInfo?.avatarUrl || 'https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                      alt={user.fullName}
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-white">{user.fullName}</p>
                      <p className="text-sm text-gray-400">@{user.username}</p>
                    </div>
                    <button className="bg-gradient-to-r from-yellow-400 to-pink-600 text-white p-2 rounded-xl hover:from-yellow-300 hover:to-pink-500 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="p-8 text-center text-gray-400">
                <p className="font-medium">No users found</p>
                <p className="text-sm mt-1">Try searching with a different name</p>
              </div>
            ) : null}
          </div>
        )}

        {/* Call History Dropdown */}
        {showCallHistory && (
          <div className="absolute top-32 left-6 right-6 z-50">
            <CallHistory
              calls={callHistory}
              onCallBack={handleCallBack}
              onClear={() => setCallHistory([])}
            />
          </div>
        )}

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-2">
          {contacts.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-gray-600" />
              </div>
              <p className="font-medium">No conversations yet</p>
              <p className="text-sm mt-1">Search for users above to start chatting</p>
            </div>
          ) : (
            <div className="space-y-1">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all',
                    selectedContact?.id === contact.id
                      ? 'bg-gradient-to-r from-yellow-400/10 to-pink-600/10 border-l-4 border-pink-500'
                      : 'hover:bg-gray-800/50'
                  )}
                >
                  <div className="relative">
                    <img
                      src={contact.avatar}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                      alt={contact.name}
                      referrerPolicy="no-referrer"
                    />
                    {contact.active && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-gray-900 rounded-full animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className="font-bold truncate text-white">
                        {contact.name}
                      </p>
                      <span
                        className={cn(
                          'text-[10px] font-bold',
                          contact.time === 'ACTIVE' ? 'text-green-400' : 'text-gray-500'
                        )}
                      >
                        {contact.time}
                      </span>
                    </div>
                    <p className="text-sm truncate text-gray-400">
                      {contact.lastMsg}
                    </p>
                  </div>
                  {contact.streak ? (
                    <div className="flex items-center gap-1 bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      <Flame className="w-3 h-3 fill-current" /> {contact.streak}
                    </div>
                  ) : null}
                  {contact.unread && (
                    <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-600 rounded-full animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-gray-900/30 backdrop-blur-sm">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <header className="h-20 border-b border-gray-800 px-6 flex items-center justify-between bg-gray-900/50 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={selectedContact.avatar}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                    alt={selectedContact.name}
                    referrerPolicy="no-referrer"
                  />
                  {selectedContact.active && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full animate-pulse" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-white">{selectedContact.name}</h3>
                    {selectedContact.streak ? (
                      <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400/20 to-pink-600/20 text-yellow-400 px-2 py-0.5 rounded-full text-[11px] font-bold">
                        <Flame className="w-3 h-3 fill-current" />{' '}
                        {selectedContact.streak}
                      </div>
                    ) : null}
                  </div>
                  <p className="text-xs text-green-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    {selectedContact.active ? 'Active now' : 'Offline'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Call Buttons */}
                {selectedContact.email && (
                  <CallButton
                    userId={selectedContact.memberId}
                    roomId={selectedContact?.roomId}
                    username={selectedContact.username || ''}
                    userAvatar={selectedContact.avatar}
                    userFullName={selectedContact.name}
                    userEmail={selectedContact.email}
                    onStartCall={handleStartCall}
                  />
                )}
                <button className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700">
                  <Info className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
              {/* Welcome Message */}
              <div className="flex flex-col items-center py-10 opacity-70">
                <div className="relative">
                  <img
                    src={selectedContact.avatar}
                    className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-gray-700"
                    alt={selectedContact.name}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                    <span className="text-xs text-gray-400">@{selectedContact.username}</span>
                  </div>
                </div>
                <h4 className="font-bold text-lg text-white mt-4">{selectedContact.name}</h4>
                <p className="text-sm text-gray-400">You follow each other</p>
                <button className="mt-3 text-xs font-bold text-yellow-400 hover:text-yellow-300 transition">
                  View Profile
                </button>
              </div>

              {/* Date Separator */}
              {messages.length > 0 && (
                <div className="flex justify-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}

              {/* Messages */}
              {messages.map((msg, index) => (
                <div key={msg.id ?? index}>
                  {msg.callType ? (
                    // Call message
                    <div className={cn('flex', isCurrentUser(msg.senderId) ? 'justify-end' : 'justify-start')}>
                      <div className={cn('max-w-[80%]', isCurrentUser(msg.senderId) ? 'ml-auto' : '')}>
                        {renderCallMessage(msg)}
                      </div>
                    </div>
                  ) : (
                    // Text message
                    isCurrentUser(msg.senderId) ? (
                      <div className="flex flex-col items-end gap-1 ml-auto max-w-[80%]">
                        <div className="bg-gradient-to-r from-yellow-400 to-pink-600 text-white p-4 rounded-2xl rounded-br-none shadow-lg">
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                        </div>
                        <p className="text-[10px] text-gray-500 px-1 flex items-center gap-1">
                          {formatMessageTime(msg.timestamp)}
                          <CheckCheck
                            className={cn('w-3 h-3', msg.read ? 'text-blue-400' : 'text-gray-500')}
                          />
                        </p>
                      </div>
                    ) : (
                      <div className="flex gap-3 max-w-[80%]">
                        <img
                          src={selectedContact.avatar}
                          className="w-8 h-8 rounded-full mt-auto object-cover border-2 border-gray-700"
                          alt={selectedContact.name}
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-1">
                          <div className="bg-gray-800 p-4 rounded-2xl rounded-bl-none border border-gray-700">
                            <p className="text-sm leading-relaxed text-gray-200">
                              {msg.message}
                            </p>
                          </div>
                          <p className="text-[10px] text-gray-500 px-1">
                            {formatMessageTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {typingUsers.size > 0 && (
                <div className="flex gap-3 max-w-[80%]">
                  <img
                    src={selectedContact.avatar}
                    className="w-8 h-8 rounded-full mt-auto object-cover border-2 border-gray-700"
                    alt={selectedContact.name}
                    referrerPolicy="no-referrer"
                  />
                  <div className="bg-gray-800 p-4 rounded-2xl rounded-bl-none border border-gray-700">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <footer className="p-6 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
              <form onSubmit={handleSendMessage}>
                <div className="bg-gray-800 rounded-2xl p-2 flex items-center gap-2 border border-gray-700 focus-within:border-yellow-400 transition">
                  <button
                    type="button"
                    className="p-2 text-gray-500 hover:text-yellow-400 transition-colors"
                  >
                    <Smile className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    className="p-2 text-gray-500 hover:text-yellow-400 transition-colors"
                  >
                    <ImageIcon className="w-6 h-6" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleTyping}
                    placeholder={`Message ${selectedContact.name}...`}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-1 text-white placeholder-gray-500"
                  />
                  <button
                    type="button"
                    className="p-2 text-gray-500 hover:text-yellow-400 transition-colors"
                  >
                    <Mic className="w-6 h-6" />
                  </button>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() }
                    className="bg-gradient-to-r from-yellow-400 to-pink-600 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:from-yellow-300 hover:to-pink-500 transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* Streak Reminder */}
              <p className="text-[10px] text-center mt-3 text-gray-500 font-medium uppercase tracking-wider">
                Keep your{' '}
                <Flame className="w-3 h-3 inline fill-yellow-400 text-yellow-400" /> streak alive!
                {selectedContact.active ? (
                  <span className="text-green-400 ml-1">They're active now!</span>
                ) : (
                  <span className="text-gray-600 ml-1">Send a message to start</span>
                )}
              </p>
            </footer>
          </>
        ) : (
        
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-24 h-24 bg-gray-800 rounded-full mb-4 flex items-center justify-center">
              <MessageCircle className="w-12 h-12 text-gray-600" />
            </div>
            <p className="text-lg font-semibold text-white">No conversation selected</p>
            <p className="text-sm mt-1 text-gray-500">Pick a chat from the sidebar to get started</p>
            <button className="mt-4 px-6 py-2 bg-gradient-to-r from-yellow-400 to-pink-600 text-white rounded-xl text-sm font-semibold hover:from-yellow-300 hover:to-pink-500 transition">
              Start a new chat
            </button>
          </div>
        )}
      </main>
    </div>
  );
}