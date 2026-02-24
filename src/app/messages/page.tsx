import React from 'react';
import { Search, Video, Phone, Info, Smile, Image as ImageIcon, Mic, Send, Flame, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const contacts = [
  { id: 1, name: 'Jane Doe', lastMsg: 'Shared a reel • 2m ago', time: 'ACTIVE', avatar: 'https://picsum.photos/seed/jane/100/100', active: true, streak: 15 },
  { id: 2, name: 'John Smith', lastMsg: 'See you there! 👋', time: '1H', avatar: 'https://picsum.photos/seed/john/100/100' },
  { id: 3, name: 'Michael Scott', lastMsg: 'Sent 1 photo', time: '4H', avatar: 'https://picsum.photos/seed/mike/100/100', unread: true },
  { id: 4, name: 'Sarah Jenkins', lastMsg: "That's hilarious haha", time: 'YESTERDAY', avatar: 'https://picsum.photos/seed/sarah/100/100' },
];

export default function Messages() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Contact List */}
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
                className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                  contact.id === 1 
                    ? "bg-primary/5 dark:bg-primary/10 border-l-4 border-primary" 
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="relative">
                  <img src={contact.avatar} className="w-12 h-12 rounded-full" alt="" referrerPolicy="no-referrer" />
                  {contact.active && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="font-bold truncate text-slate-900 dark:text-slate-100">{contact.name}</p>
                    <span className={`text-[10px] font-bold ${contact.time === 'ACTIVE' ? 'text-primary' : 'text-slate-400'}`}>
                      {contact.time}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${contact.unread ? 'font-bold text-slate-100' : 'text-slate-500'}`}>
                    {contact.lastMsg}
                  </p>
                </div>
                {contact.streak && (
                  <div className="flex items-center gap-1 bg-orange-500/10 text-orange-500 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    <Flame className="w-3 h-3 fill-current" /> {contact.streak}
                  </div>
                )}
                {contact.unread && <div className="w-2 h-2 bg-primary rounded-full" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col bg-background-light dark:bg-background-dark">
        <header className="h-20 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="https://picsum.photos/seed/jane/100/100" className="w-10 h-10 rounded-full" alt="" referrerPolicy="no-referrer" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">Jane Doe</h3>
                <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[11px] font-bold">
                  <Flame className="w-3 h-3 fill-current" /> 15
                </div>
              </div>
              <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Active 5m ago
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
            <img src="https://picsum.photos/seed/jane/200/200" className="w-20 h-20 rounded-full mb-4" alt="" referrerPolicy="no-referrer" />
            <h4 className="font-bold text-lg">Jane Doe</h4>
            <p className="text-sm">You follow each other on SocialHub</p>
            <button className="mt-3 text-xs font-bold text-primary hover:underline">View Profile</button>
          </div>

          <div className="flex justify-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Monday, 10:24 AM</span>
          </div>

          <div className="flex gap-3 max-w-[80%]">
            <img src="https://picsum.photos/seed/jane/100/100" className="w-8 h-8 rounded-full mt-auto" alt="" referrerPolicy="no-referrer" />
            <div className="space-y-1">
              <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none">
                <p className="text-sm leading-relaxed">Hey! Did you see the new design trends for this year? I think the minimalist approach is really taking over.</p>
              </div>
              <p className="text-[10px] text-slate-400 px-1">10:24 AM</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 ml-auto max-w-[80%]">
            <div className="bg-primary text-white p-4 rounded-2xl rounded-br-none shadow-md shadow-primary/10">
              <p className="text-sm leading-relaxed">Totally agree! I'm working on a dark mode interface right now that uses that exact philosophy. Check this out.</p>
            </div>
            <p className="text-[10px] text-slate-400 px-1 flex items-center gap-1">10:26 AM <CheckCheck className="w-3 h-3 text-primary" /></p>
          </div>

          <div className="flex flex-col items-end gap-2 ml-auto max-w-[60%]">
            <div className="rounded-2xl overflow-hidden border-4 border-primary/20 shadow-xl">
              <img src="https://picsum.photos/seed/design/400/300" className="w-full h-auto object-cover" alt="" referrerPolicy="no-referrer" />
            </div>
            <div className="bg-primary text-white p-4 rounded-2xl rounded-tr-none">
              <p className="text-sm">What do you think of these neon accents?</p>
            </div>
          </div>
        </div>

        <footer className="p-6">
          <div className="bg-slate-200 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-2 flex items-center gap-2 ring-1 ring-slate-300 dark:ring-slate-700/50">
            <button className="p-2 text-slate-500 hover:text-primary transition-colors"><Smile className="w-6 h-6" /></button>
            <button className="p-2 text-slate-500 hover:text-primary transition-colors"><ImageIcon className="w-6 h-6" /></button>
            <input 
              type="text" 
              placeholder="Message Jane Doe..." 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-1 placeholder:text-slate-500"
            />
            <button className="p-2 text-slate-500 hover:text-primary transition-colors"><Mic className="w-6 h-6" /></button>
            <button className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20">
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-center mt-3 text-slate-500 font-medium uppercase tracking-wider">Keep your <Flame className="w-3 h-3 inline fill-current" /> streak alive! Send a video to Jane today.</p>
        </footer>
      </main>
    </div>
  );
}
