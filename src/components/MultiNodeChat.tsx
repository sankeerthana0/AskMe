import React, { useState } from 'react';
import { Send, CheckCheck, Check, Clock, Server, Terminal, User, ShieldCheck, Zap, MessageSquare } from 'lucide-react';
import { ChatMessage, ClientUser, DeliveryStatus } from '../types';

interface MultiNodeChatProps {
  messages: ChatMessage[];
  users: ClientUser[];
  onSendMessage: (senderId: string, recipientId: string, text: string) => void;
  onMarkRead: (messageId: string) => void;
}

export const MultiNodeChat: React.FC<MultiNodeChatProps> = ({
  messages,
  users,
  onSendMessage,
  onMarkRead,
}) => {
  const [activeUserTab, setActiveUserTab] = useState<string>('alice');
  const [inputText, setInputText] = useState<string>('');
  const [targetUser, setTargetUser] = useState<string>('bob');

  const activeUser = users.find((u) => u.id === activeUserTab) || users[0];

  const filteredMessages = messages.filter(
    (m) =>
      (m.senderId === activeUserTab && m.recipientId === targetUser) ||
      (m.senderId === targetUser && m.recipientId === activeUserTab)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(activeUserTab, targetUser, inputText.trim());
    setInputText('');
  };

  const getStatusIcon = (status: DeliveryStatus) => {
    switch (status) {
      case 'SENT':
        return <Clock className="w-3 h-3 text-slate-500" />;
      case 'ACK_SERVER':
        return <Check className="w-3.5 h-3.5 text-slate-400" />;
      case 'DELIVERED':
        return <CheckCheck className="w-3.5 h-3.5 text-slate-400" />;
      case 'READ':
        return <CheckCheck className="w-3.5 h-3.5 text-amber-400" />;
      case 'PERSISTED_DB':
        return <CheckCheck className="w-3.5 h-3.5 text-emerald-400 font-bold" />;
    }
  };

  const getStatusLabel = (status: DeliveryStatus) => {
    switch (status) {
      case 'SENT': return 'Sent to Netty';
      case 'ACK_SERVER': return 'Acked by Netty Node';
      case 'DELIVERED': return 'Delivered Cross-Node';
      case 'READ': return 'Read by Recipient';
      case 'PERSISTED_DB': return 'Persisted in PostgreSQL';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Client Selector & Connection Specs */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Simulated WebSocket Clients</span>
            <span className="text-emerald-400 text-[10px]">3 Netty Connections</span>
          </h3>

          <div className="space-y-2">
            {users.map((user) => {
              const isSelected = activeUserTab === user.id;
              return (
                <button
                  key={user.id}
                  onClick={() => {
                    setActiveUserTab(user.id);
                    if (user.id === targetUser) {
                      const other = users.find((u) => u.id !== user.id);
                      if (other) setTargetUser(other.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition text-left ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/40 text-slate-100 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-200 text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-200">{user.name}</h4>
                      <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Server className="w-3 h-3 text-amber-400" />
                        <span>Connected to Node-{user.appServerId.replace('server-', '')}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    WS Active
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Connection Telemetry */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
          <h4 className="font-bold text-slate-300 text-xs mb-3 flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>Netty Channel Socket Info</span>
          </h4>

          <div className="space-y-2 text-slate-400">
            <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
              <span>Channel ID:</span>
              <span className="text-slate-200 font-bold">0x{activeUser.id.toUpperCase()}F82A</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
              <span>App Server Host:</span>
              <span className="text-amber-400 font-bold">askme-app-{activeUser.appServerId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
              <span>Transport Protocol:</span>
              <span className="text-cyan-400">RFC-6455 WebSocket</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
              <span>Redis Route Hash:</span>
              <span className="text-emerald-400">askme:routes:{activeUser.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Frame Encapsulation:</span>
              <span className="text-slate-200">TextWebSocketFrame</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Chat Box & WebSocket Inspector */}
      <div className="lg:col-span-8 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[520px] shadow-xl overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                {activeUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <span>Chatting as {activeUser.name}</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Node: {activeUser.appServerId}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Recipient:{' '}
                  <select
                    value={targetUser}
                    onChange={(e) => setTargetUser(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-amber-300 rounded px-2 py-0.5 text-xs font-bold"
                  >
                    {users
                      .filter((u) => u.id !== activeUserTab)
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.appServerId})
                        </option>
                      ))}
                  </select>
                </p>
              </div>
            </div>

            <div className="text-right text-xs font-mono text-slate-400">
              <span className="inline-flex items-center space-x-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>WS Socket Open</span>
              </span>
            </div>
          </div>

          {/* Chat Message Window */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
            {filteredMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
                <MessageSquare className="w-8 h-8 text-slate-700 mb-2" />
                <p>No messages exchanged yet between {activeUser.name} and {users.find(u => u.id === targetUser)?.name}.</p>
                <p className="text-[11px] text-slate-600 mt-1">Send a message below to witness real-time Redis cross-server routing!</p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isMine = msg.senderId === activeUserTab;

                return (
                  <div
                    key={msg.id}
                    onClick={() => !isMine && onMarkRead(msg.id)}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-2xl text-xs space-y-1 shadow-md ${
                        isMine
                          ? 'bg-amber-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>

                      <div className="flex items-center justify-between text-[10px] opacity-80 pt-1 font-mono gap-3 border-t border-white/10">
                        <span>{msg.timestamp}</span>
                        <div className="flex items-center space-x-1">
                          <span>{getStatusLabel(msg.status)}</span>
                          {getStatusIcon(msg.status)}
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono text-slate-500 mt-1">
                      Route: {msg.originServerId} -&gt; {msg.targetServerId}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Send Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Send message to ${users.find((u) => u.id === targetUser)?.name}...`}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs flex items-center space-x-2 transition shadow-md"
            >
              <span>Dispatch Frame</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
