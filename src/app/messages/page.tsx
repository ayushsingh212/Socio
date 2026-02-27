"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Video, Phone, Info, Smile, Image as ImageIcon, Mic, Send, Flame, CheckCheck } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { getAllActveChatRoom, getMessages } from '@/services/message.service';
import { useAuthStore } from '@/store/auth.store';
import { useAuthBootstrap } from '@/hooks/useAuth';

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
}

export default function Messages() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const selectedContactRef = useRef<Contact | null>(null);

  useAuthBootstrap();
  const { user } = useAuthStore();


  const getAllChatRooms = useCallback(async () => {

    const userId = user?.user?.data?._id;
    if (!userId) return;

    try {
      const res = await getAllActveChatRoom();

      if (res.data.success) {
        const rooms: ChatRoom[] = res.data.data;
        setCurrentUserId(userId);

        const transformedContacts: Contact[] = rooms.map((room) => {
          const otherMember =
            room.members.find((member) => member._id !== userId) ||
            room.members[0];

          return {
            id: room._id,
            name: otherMember?.fullName || 'Unknown User',
            lastMsg: 'Start a conversation',
            time:
              room.lastActiveTime === 'ACTIVE'
                ? 'ACTIVE'
                : new Date(room.updatedAt).toLocaleTimeString(),
            avatar:
              otherMember?.avatarInfo?.avatarUrl ||
              'https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg',
            active: room.lastActiveTime === 'ACTIVE',
            streak: parseInt(room.streak) || 0,
            unread: false,
            roomId: room._id,
            memberId: otherMember?._id || '',
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

  useEffect(() => {
    getAllChatRooms();
  }, [getAllChatRooms]);

 
  useEffect(() => {

    const socketInstance = io('http://localhost:8000', {
      transports: ['websocket'],
      withCredentials:true
    });

    socketInstance.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });

    socketInstance.on('receiveMessage', (message: Message) => {
      setMessages((prev) => [
        ...prev,
        { ...message, timestamp: new Date(message.timestamp) },
      ]);

      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.roomId === message.roomId
            ? { ...contact, lastMsg: message.message, time: 'Just now' }
            : contact
        )
      );
    });

    socketInstance.on(
      'userTyping',
      (data: { userId: string; isTyping: boolean }) => {
        setTypingUsers((prev) => {
          const updated = new Set(prev);
          if (data.isTyping) {
            updated.add(data.userId);
          } else {
            updated.delete(data.userId);
          }
          return updated;
        });
      }
    );

    socketInstance.on('joinedRoom', (data) => {
      console.log(`Joined room: ${data.roomId}`);
    });

    socketInstance.on('joinError', (error) => {
      console.error('Failed to join room:', error.error);
    });

    socketInstance.on('messageError', (error) => {
      console.error('Failed to send message:', error.error);
    });

    setSocket(socketInstance);

    
    return () => {
      if (selectedContactRef.current?.roomId) {
        socketInstance.emit('leaveRoom', {
          roomId: selectedContactRef.current.roomId,
        });
      }
      socketInstance.disconnect();
    };
  }, []); 

  useEffect(() => {
    selectedContactRef.current = selectedContact;
  }, [selectedContact]);

  const prevRoomIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!socket || !selectedContact?.roomId || !isConnected) return;

    if (prevRoomIdRef.current && prevRoomIdRef.current !== selectedContact.roomId) {
      socket.emit('leaveRoom', { roomId: prevRoomIdRef.current });
    }

    prevRoomIdRef.current = selectedContact.roomId;
    socket.emit('joinRoom', { roomId: selectedContact.roomId });
    setMessages([]);
    setTypingUsers(new Set());
    console.log("I am the selected contact",selectedContact)
    fetchMessageHistory(selectedContact.roomId);
  }, [selectedContact?.roomId, socket, isConnected]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

const fetchMessageHistory = async (roomId: string) => {
  try {
    const response = await getMessages(roomId);

    if (!response.data.success) return;

    const messagesArray = response.data.data;

    const normalized = messagesArray.map((msg: any) => ({
      id: msg._id,
      senderId: msg.sender._id,
      message: msg.message,
      timestamp: new Date(msg.createdAt),
      roomId: msg.roomId,
      read: msg.viewedBy?.length > 0
    }));

    setMessages(normalized);

  } catch (error) {
    console.error("Failed to fetch message history:", error);
  }
};

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !selectedContact?.roomId) return;

    socket.emit('sendMessage', {
      roomId: selectedContact.roomId,
      message: newMessage.trim(),
      senderId: currentUserId,
    });

    setNewMessage('');
  };

  const handleTyping = () => {
    if (!socket || !selectedContact?.roomId) return;

    socket.emit('typing', { roomId: selectedContact.roomId, isTyping: true });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', {
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

const isCurrentUser = (senderId: any) =>

  String(senderId) === String(currentUserId);

  return (
    <div className="flex h-screen overflow-hidden">
      {!isConnected && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-1 text-sm z-50">
          Loading Chats
        </div>
      )}

      <section className="w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-background-light dark:bg-background-dark/50">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Messages</h2>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-4 h-4" />
            <input
              type="text"
              placeholder="Search direct messages"
              className="w-full bg-slate-200 dark:bg-slate-800 border-none rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary text-sm transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="px-2 space-y-1">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                  selectedContact?.id === contact.id
                    ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-primary'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="relative">
                  <img
                    src={contact.avatar}
                    className="w-12 h-12 rounded-full object-cover"
                    alt={contact.name}
                    referrerPolicy="no-referrer"
                  />
                  {contact.active && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="font-bold truncate text-slate-900 dark:text-slate-100">
                      {contact.name}
                    </p>
                    <span
                      className={`text-[10px] font-bold ${
                        contact.time === 'ACTIVE'
                          ? 'text-primary'
                          : 'text-slate-400'
                      }`}
                    >
                      {contact.time}
                    </span>
                  </div>
                  <p
                    className={`text-sm truncate ${
                      contact.unread
                        ? 'font-bold text-slate-100'
                        : 'text-slate-500'
                    }`}
                  >
                    {contact.lastMsg}
                  </p>
                </div>
                {contact.streak ? (
                  <div className="flex items-center gap-1 bg-orange-500/10 text-orange-500 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    <Flame className="w-3 h-3 fill-current" /> {contact.streak}
                  </div>
                ) : null}
                {contact.unread && (
                  <div className="w-2 h-2 bg-primary rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    
      <main className="flex-1 flex flex-col bg-background-light dark:bg-background-dark">
        {selectedContact ? (
          <>
            <header className="h-20 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedContact.avatar}
                  className="w-10 h-10 rounded-full object-cover"
                  alt={selectedContact.name}
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{selectedContact.name}</h3>
                    {selectedContact.streak ? (
                      <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[11px] font-bold">
                        <Flame className="w-3 h-3 fill-current" />{' '}
                        {selectedContact.streak}
                      </div>
                    ) : null}
                  </div>
                  <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    {selectedContact.active ? 'Active now' : 'Active 5m ago'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-2 px-5 rounded-xl transition-all shadow-lg shadow-primary/20">
                  <Video className="w-5 h-5" />
                  <span className="hidden sm:inline">Video Call</span>
                </button>
                <button className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar flex flex-col">
              <div className="flex flex-col items-center py-10 opacity-50">
                <img
                  src={selectedContact.avatar}
                  className="w-20 h-20 rounded-full object-cover mb-4"
                  alt={selectedContact.name}
                  referrerPolicy="no-referrer"
                />
                <h4 className="font-bold text-lg">{selectedContact.name}</h4>
                <p className="text-sm">You follow each other on SocialHub</p>
                <button className="mt-3 text-xs font-bold text-primary hover:underline">
                  View Profile
                </button>
              </div>

              {messages.length > 0 && (
                <>
                  <div className="flex justify-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                      {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                      })}
                      ,{' '}
                      {new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {messages.map((msg, index) =>
                    isCurrentUser(msg.senderId) ? (
                      <div
                        key={msg.id ?? index}
                        className="flex flex-col items-end gap-1 ml-auto max-w-[80%]"
                      >
                        <div className="bg-primary text-white p-4 rounded-2xl rounded-br-none shadow-md shadow-primary/10">
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                        </div>
                        <p className="text-[10px] text-slate-400 px-1 flex items-center gap-1">
                          {formatMessageTime(msg.timestamp)}
                          <CheckCheck
                            className={`w-3 h-3 ${
                              msg.read ? 'text-primary' : 'text-slate-400'
                            }`}
                          />
                        </p>
                      </div>
                    ) : (
                      <div
                        key={msg.id ?? index}
                        className="flex gap-3 max-w-[80%]"
                      >
                        <img
                          src={selectedContact.avatar}
                          className="w-8 h-8 rounded-full mt-auto object-cover"
                          alt={selectedContact.name}
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-1">
                          <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none">
                            <p className="text-sm leading-relaxed">
                              {msg.message}
                            </p>
                          </div>
                          <p className="text-[10px] text-slate-400 px-1">
                            {formatMessageTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </>
              )}

              {typingUsers.size > 0 && (
                <div className="flex gap-3 max-w-[80%]">
                  <img
                    src={selectedContact.avatar}
                    className="w-8 h-8 rounded-full mt-auto object-cover"
                    alt={selectedContact.name}
                    referrerPolicy="no-referrer"
                  />
                  <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none">
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <span
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <span
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <footer className="p-6">
              <form onSubmit={handleSendMessage}>
                <div className="bg-slate-200 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-2 flex items-center gap-2 ring-1 ring-slate-300 dark:ring-slate-700/50">
                  <button
                    type="button"
                    className="p-2 text-slate-500 hover:text-primary transition-colors"
                  >
                    <Smile className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    className="p-2 text-slate-500 hover:text-primary transition-colors"
                  >
                    <ImageIcon className="w-6 h-6" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleTyping}
                    placeholder={`Message ${selectedContact.name}...`}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-1 placeholder:text-slate-500"
                    disabled={!isConnected}
                  />
                  <button
                    type="button"
                    className="p-2 text-slate-500 hover:text-primary transition-colors"
                  >
                    <Mic className="w-6 h-6" />
                  </button>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || !isConnected}
                    className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
              <p className="text-[10px] text-center mt-3 text-slate-500 font-medium uppercase tracking-wider">
                Keep your{' '}
                <Flame className="w-3 h-3 inline fill-current" /> streak alive!
                Send a video to {selectedContact.name} today.
              </p>
            </footer>
          </>
        ) : (
       
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <p className="text-lg font-semibold">No conversation selected</p>
            <p className="text-sm mt-1">Pick a chat from the sidebar to get started</p>
          </div>
        )}
      </main>
    </div>
  );
}