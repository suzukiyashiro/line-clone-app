import React, { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { auth } from "@/firebase/firebaseConfig";
import { useSelectedFriend } from "@/contexts/SelectedFriendContext";
import Message from "./Message";

const MessageList = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const { selectedFriend } = useSelectedFriend();
  const myUserId = auth.currentUser?.uid;
  const friendUserId = selectedFriend?.id;

  useEffect(() => {
    if (!myUserId || !friendUserId) return;
    const chatId = [myUserId, friendUserId].sort().join('_');
    const talksDocRef = doc(db, "talks", chatId);
    const messagesRef = collection(talksDocRef, "messages");
    const unsubscribe = onSnapshot(messagesRef, (querySnapshot) => {
      const fetchedMessages: any[] = [];
      querySnapshot.forEach((doc) => {
        const message = doc.data();
        message.id = doc.id; // メッセージのIDを保存
        message.isOwnMessage = message.from === myUserId;
        fetchedMessages.push(message);
      });
      // 日付でソート
      fetchedMessages.sort((a, b) => a.time - b.time);
      setMessages(fetchedMessages);
    });
    return () => unsubscribe();
  }, [myUserId, friendUserId]);

  return (
    <div className="p-4 overflow-y-scroll flex-1">
      <h2 className="text-xl font-bold mb-4">{selectedFriend?.name}</h2>
      <div className="space-y-4">
        {messages.map((message, index) => (
          <Message key={index} message={message} isOwnMessage={message.isOwnMessage} />
        ))}
      </div>
    </div>
  );
};

export default MessageList;
