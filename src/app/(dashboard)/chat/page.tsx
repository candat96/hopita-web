"use client";

import { useState, useRef, useEffect } from "react";
import { patients } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Send, Paperclip, Image, Phone, Video, MoreVertical, Check, CheckCheck } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  patientId: string;
  patientName: string;
  status: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
  online: boolean;
}

const mockConversations: Conversation[] = [
  {
    patientId: "p1",
    patientName: "Tran Thi Mai",
    status: "active",
    lastMessage: "Dạ em cảm ơn bác sĩ, em sẽ tập đúng theo hướng dẫn ạ",
    lastMessageTime: "10:30",
    unreadCount: 0,
    online: true,
    messages: [
      { id: "m1", senderId: "u1", text: "Chào Mai, hôm nay em tập gập gối thế nào rồi?", timestamp: "09:00", read: true },
      { id: "m2", senderId: "p1", text: "Dạ chào bác sĩ, em tập được 3 set rồi ạ. Nhưng set cuối hơi đau một chút ạ", timestamp: "09:15", read: true },
      { id: "m3", senderId: "u1", text: "Đau ở vị trí nào em? Phía trước hay phía sau gối?", timestamp: "09:18", read: true },
      { id: "m4", senderId: "p1", text: "Dạ phía sau gối ạ, khi gập quá 80 độ thì đau", timestamp: "09:22", read: true },
      { id: "m5", senderId: "u1", text: "OK em, giai đoạn này thì bình thường. Em chỉ gập tới 80 độ thôi nhé, không cố ép quá. Tuần sau mình tái khám sẽ đánh giá lại ROM", timestamp: "09:25", read: true },
      { id: "m6", senderId: "p1", text: "Dạ em hiểu rồi ạ. Bác sĩ ơi, em có cần chườm đá sau khi tập không ạ?", timestamp: "10:00", read: true },
      { id: "m7", senderId: "u1", text: "Có em, sau mỗi buổi tập em chườm đá 15-20 phút nhé. Nhớ bọc khăn, không chườm trực tiếp lên da", timestamp: "10:15", read: true },
      { id: "m8", senderId: "p1", text: "Dạ em cảm ơn bác sĩ, em sẽ tập đúng theo hướng dẫn ạ", timestamp: "10:30", read: true },
    ],
  },
  {
    patientId: "p3",
    patientName: "Pham Duc Minh",
    status: "attention",
    lastMessage: "Bác sĩ ơi em bận quá nên mấy hôm không tập được",
    lastMessageTime: "Hôm qua",
    unreadCount: 2,
    online: false,
    messages: [
      { id: "m9", senderId: "u1", text: "Anh Minh ơi, hệ thống báo anh đã bỏ tập 5 ngày liên tiếp rồi. Anh có gặp vấn đề gì không?", timestamp: "08:00", read: true },
      { id: "m10", senderId: "p3", text: "Bác sĩ ơi em bận quá nên mấy hôm không tập được", timestamp: "14:30", read: false },
      { id: "m11", senderId: "p3", text: "Mà vai em cũng đau hơn mấy hôm trước", timestamp: "14:32", read: false },
    ],
  },
  {
    patientId: "p5",
    patientName: "Vo Van Tai",
    status: "active",
    lastMessage: "Em gửi video bài tập hôm nay cho bác sĩ xem ạ",
    lastMessageTime: "08:55",
    unreadCount: 1,
    online: true,
    messages: [
      { id: "m12", senderId: "p5", text: "Chào bác sĩ, em vừa tập xong bài gập gối ạ", timestamp: "08:30", read: true },
      { id: "m13", senderId: "p5", text: "Hôm nay em thấy gối linh hoạt hơn rồi ạ 💪", timestamp: "08:45", read: true },
      { id: "m14", senderId: "p5", text: "Em gửi video bài tập hôm nay cho bác sĩ xem ạ", timestamp: "08:55", read: false },
    ],
  },
  {
    patientId: "p2",
    patientName: "Le Hoang Nam",
    status: "active",
    lastMessage: "Dạ ok bác sĩ, em sẽ chú ý giữ lưng thẳng hơn",
    lastMessageTime: "Hôm qua",
    unreadCount: 0,
    online: false,
    messages: [
      { id: "m15", senderId: "u1", text: "Nam ơi, bác sĩ đã review video plank của em rồi. Tư thế khá tốt, nhưng lưng hơi võng xuống 1 chút", timestamp: "16:00", read: true },
      { id: "m16", senderId: "u1", text: "Em xem lại annotation bác sĩ ghi chú ở giây 15 nhé", timestamp: "16:02", read: true },
      { id: "m17", senderId: "p2", text: "Dạ ok bác sĩ, em sẽ chú ý giữ lưng thẳng hơn", timestamp: "16:30", read: true },
    ],
  },
  {
    patientId: "p7",
    patientName: "Dang Quoc Bao",
    status: "attention",
    lastMessage: "Em sẽ cố gắng tập lại đúng tư thế ạ",
    lastMessageTime: "3 ngày trước",
    unreadCount: 0,
    online: false,
    messages: [
      { id: "m18", senderId: "u1", text: "Bảo ơi, bác sĩ xem video căng cơ bắp chân của em. Em đang tập sai tư thế ở phần chân, chân chưa thẳng", timestamp: "15:00", read: true },
      { id: "m19", senderId: "u1", text: "Em xem lại video mẫu rồi tập lại nhé. Nếu cần bác sĩ sẽ hướng dẫn qua telehealth", timestamp: "15:05", read: true },
      { id: "m20", senderId: "p7", text: "Dạ em hiểu rồi ạ, lần trước em không để ý", timestamp: "15:30", read: true },
      { id: "m21", senderId: "p7", text: "Em sẽ cố gắng tập lại đúng tư thế ạ", timestamp: "15:32", read: true },
    ],
  },
  {
    patientId: "p8",
    patientName: "Bui Thi Thanh",
    status: "active",
    lastMessage: "Cảm ơn bác sĩ nhiều ạ 🙏",
    lastMessageTime: "2 ngày trước",
    unreadCount: 0,
    online: false,
    messages: [
      { id: "m22", senderId: "p8", text: "Bác sĩ ơi, gối em bớt sưng rồi ạ", timestamp: "10:00", read: true },
      { id: "m23", senderId: "u1", text: "Tốt quá cô Thanh! Cô tiếp tục tập đều đặn nhé. Tuần này cô tập rất đều, compliance 88% rất tốt", timestamp: "10:30", read: true },
      { id: "m24", senderId: "p8", text: "Cảm ơn bác sĩ nhiều ạ 🙏", timestamp: "10:35", read: true },
    ],
  },
  {
    patientId: "p6",
    patientName: "Hoang Thi Huong",
    status: "active",
    lastMessage: "Dạ em tập 3 lần/ngày đúng theo phác đồ ạ",
    lastMessageTime: "3 ngày trước",
    unreadCount: 0,
    online: true,
    messages: [
      { id: "m25", senderId: "u1", text: "Hương ơi, cổ tay em có còn tê không?", timestamp: "14:00", read: true },
      { id: "m26", senderId: "p6", text: "Dạ vẫn còn tê buổi sáng lúc mới ngủ dậy ạ, nhưng ít hơn trước rồi", timestamp: "14:20", read: true },
      { id: "m27", senderId: "u1", text: "Tốt, có tiến triển rồi. Em nhớ tập bài cổ tay đều đặn nhé", timestamp: "14:25", read: true },
      { id: "m28", senderId: "p6", text: "Dạ em tập 3 lần/ngày đúng theo phác đồ ạ", timestamp: "14:30", read: true },
    ],
  },
];

export default function ChatPage() {
  const [search, setSearch] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(mockConversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [conversations, setConversations] = useState(mockConversations);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = conversations.filter((c) =>
    !search || c.patientName.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = conversations.reduce((s, c) => s + c.unreadCount, 0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation]);

  const handleSend = () => {
    if (!messageInput.trim()) return;
    const newMsg: Message = {
      id: `m-new-${Date.now()}`,
      senderId: "u1",
      text: messageInput,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.patientId === selectedConversation.patientId
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: messageInput, lastMessageTime: newMsg.timestamp }
          : c
      )
    );
    setSelectedConversation((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
      lastMessage: messageInput,
      lastMessageTime: newMsg.timestamp,
    }));
    setMessageInput("");
  };

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    if (conv.unreadCount > 0) {
      setConversations((prev) =>
        prev.map((c) => c.patientId === conv.patientId ? { ...c, unreadCount: 0 } : c)
      );
    }
  };

  const selectedPatient = patients.find((p) => p.id === selectedConversation.patientId);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] -m-6 overflow-hidden">
      {/* Conversation list */}
      <div className="w-80 shrink-0 border-r flex flex-col bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold">Tin nhắn</h1>
            {totalUnread > 0 && (
              <Badge variant="destructive" className="rounded-full">{totalUnread}</Badge>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm bệnh nhân..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => {
            const isSelected = conv.patientId === selectedConversation.patientId;
            const initials = conv.patientName.split(" ").slice(-2).map((w) => w[0]).join("");
            return (
              <button
                key={conv.patientId}
                onClick={() => handleSelectConversation(conv)}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent",
                  isSelected && "bg-accent"
                )}
              >
                <div className="relative shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {initials}
                  </div>
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{conv.patientName}</span>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">{conv.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                    {conv.unreadCount > 0 && (
                      <Badge variant="destructive" className="rounded-full h-5 w-5 p-0 flex items-center justify-center text-[10px] shrink-0 ml-2">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                  {conv.status === "attention" && (
                    <Badge variant="destructive" className="mt-1 text-[10px] h-4">Cần chú ý</Badge>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="flex items-center justify-between px-6 py-3 border-b bg-card">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {selectedConversation.patientName.split(" ").slice(-2).map((w) => w[0]).join("")}
              </div>
              {selectedConversation.online && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{selectedConversation.patientName}</p>
              <p className="text-xs text-muted-foreground">
                {selectedConversation.online ? "Đang hoạt động" : "Không hoạt động"}
                {selectedPatient?.currentProtocolName && ` · ${selectedPatient.currentProtocolName}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Video className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-muted/30">
          {/* Date separator */}
          <div className="flex justify-center">
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">Hôm nay</span>
          </div>

          {selectedConversation.messages.map((msg) => {
            const isMe = msg.senderId === "u1";
            return (
              <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2.5 text-sm",
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card border rounded-bl-md"
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div className={cn("flex items-center gap-1 mt-1", isMe ? "justify-end" : "justify-start")}>
                    <span className={cn("text-[10px]", isMe ? "text-primary-foreground/70" : "text-muted-foreground")}>{msg.timestamp}</span>
                    {isMe && (
                      msg.read
                        ? <CheckCheck className={cn("h-3 w-3", "text-primary-foreground/70")} />
                        : <Check className={cn("h-3 w-3", "text-primary-foreground/70")} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
              <Image className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Nhập tin nhắn..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
              className="flex-1"
            />
            <Button size="icon" className="h-9 w-9 shrink-0" onClick={handleSend} disabled={!messageInput.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
