// components/call/CallHistory.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Video,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Calendar,
  Clock,
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  PhoneCall,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useCall } from '@/context/CallContext';


export interface CallLog {
  id: string;
  participant: {
    id: string;
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

interface CallHistoryProps {
  calls: CallLog[];
  onCallBack?: (username: string, type: 'audio' | 'video') => void;
  onClear?: () => void;
}

export function CallHistory({ calls, onCallBack, onClear }: CallHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'missed' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCall, setSelectedCall] = useState<string | null>(null);
  const { initiateCall } = useCall();

  const filteredCalls = calls.filter(call => {
    if (filter === 'missed' && call.status !== 'missed') return false;
    if (filter === 'completed' && call.status !== 'completed') return false;
    if (searchQuery && !call.participant.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '—';
    if (seconds < 60) return `${seconds} sec`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')} min`;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const callDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (callDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (callDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getStatusIcon = (direction: string, status: string) => {
    if (status === 'missed') {
      return <PhoneMissed className="w-4 h-4 text-red-400" />;
    }
    if (status === 'rejected') {
      return <XCircle className="w-4 h-4 text-orange-400" />;
    }
    if (direction === 'incoming') {
      return <PhoneIncoming className="w-4 h-4 text-green-400" />;
    }
    return <PhoneOutgoing className="w-4 h-4 text-blue-400" />;
  };

  const getStatusText = (direction: string, status: string) => {
    if (status === 'missed') return 'Missed call';
    if (status === 'rejected') return 'Rejected';
    if (direction === 'incoming') return 'Incoming';
    return 'Outgoing';
  };

  const handleCallBack = (participant: CallLog['participant'], type: 'audio' | 'video') => {
    if (onCallBack) {
      onCallBack(participant.username, type);
    } else {
      initiateCall({
        id: participant.id,
        username: participant.username,
        fullName: participant.name,
        avatar: participant.avatar,
        email: '',
      }, type);
    }
  };

  const groupedCalls = filteredCalls.reduce((groups, call) => {
    const dateKey = formatDate(call.timestamp);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(call);
    return groups;
  }, {} as Record<string, CallLog[]>);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-green-400" />
            Call History
          </h2>
          {calls.length > 0 && onClear && (
            <button
              onClick={onClear}
              className="text-xs text-gray-500 hover:text-red-400 transition"
            >
              Clear all
            </button>
          )}
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search calls..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-400 transition"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All', color: 'from-gray-500 to-gray-600' },
            { id: 'completed', label: 'Completed', color: 'from-green-500 to-green-600' },
            { id: 'missed', label: 'Missed', color: 'from-red-500 to-red-600' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={cn(
                "flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                filter === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white`
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Call List */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {filteredCalls.length > 0 ? (
          Object.entries(groupedCalls).map(([date, dateCalls]) => (
            <div key={date}>
              {/* Date Header */}
              <div className="px-4 py-2 bg-gray-800/50">
                <span className="text-xs font-medium text-gray-400">{date}</span>
              </div>

              {/* Calls for this date */}
              {dateCalls.map((call) => (
                <motion.div
                  key={call.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative group hover:bg-gray-800/50 transition cursor-pointer"
                  onClick={() => setSelectedCall(selectedCall === call.id ? null : call.id)}
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-pink-600 p-[2px]">
                          <img
                            src={call.participant.avatar}
                            alt={call.participant.name}
                            className="w-full h-full rounded-full object-cover border-2 border-gray-900"
                          />
                        </div>
                        {call.status === 'missed' && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                            <span className="text-white text-xs">!</span>
                          </div>
                        )}
                      </div>

                      {/* Call Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white truncate">
                            {call.participant.name}
                          </span>
                          <span className="text-gray-500 text-xs">@{call.participant.username}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            {getStatusIcon(call.direction, call.status)}
                            <span className={cn(
                              "text-xs",
                              call.status === 'missed' ? "text-red-400" : "text-gray-500"
                            )}>
                              {getStatusText(call.direction, call.status)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatDuration(call.duration)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Calendar className="w-3 h-3" />
                            {call.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>

                          {/* Call Type Badge */}
                          <div className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-medium",
                            call.type === 'video' 
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-green-500/20 text-green-400"
                          )}>
                            {call.type === 'video' ? 'Video' : 'Audio'}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCallBack(call.participant, 'audio');
                          }}
                          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                          title="Call back"
                        >
                          <Phone className="w-4 h-4 text-green-400" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCallBack(call.participant, 'video');
                          }}
                          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                          title="Video call"
                        >
                          <Video className="w-4 h-4 text-purple-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-800 rounded-lg transition">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {selectedCall === call.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 pt-3 border-t border-gray-800 overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-gray-800/50 rounded-lg p-2">
                              <span className="text-gray-500">Call ID</span>
                              <p className="text-gray-300 font-mono truncate">{call.id}</p>
                            </div>
                            <div className="bg-gray-800/50 rounded-lg p-2">
                              <span className="text-gray-500">Duration</span>
                              <p className="text-gray-300">
                                {call.duration > 0 
                                  ? `${Math.floor(call.duration / 60)} min ${call.duration % 60} sec`
                                  : 'No answer'
                                }
                              </p>
                            </div>
                            <div className="bg-gray-800/50 rounded-lg p-2">
                              <span className="text-gray-500">Direction</span>
                              <p className="text-gray-300 capitalize">{call.direction}</p>
                            </div>
                            <div className="bg-gray-800/50 rounded-lg p-2">
                              <span className="text-gray-500">Status</span>
                              <p className={cn(
                                "capitalize",
                                call.status === 'completed' ? "text-green-400" : "text-red-400"
                              )}>
                                {call.status}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Phone className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-gray-500 text-sm mb-1">No call history</p>
            <p className="text-gray-600 text-xs">
              {searchQuery || filter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Start a call to see it here'}
            </p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {filteredCalls.length > 0 && (
        <div className="p-3 border-t border-gray-800 bg-gray-800/30">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              Total calls: {filteredCalls.length}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-green-400">
                <CheckCircle className="w-3 h-3" />
                {filteredCalls.filter(c => c.status === 'completed').length}
              </span>
              <span className="flex items-center gap-1 text-red-400">
                <PhoneMissed className="w-3 h-3" />
                {filteredCalls.filter(c => c.status === 'missed').length}
              </span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}