import React, { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth } from "@/firebase/firebaseConfig";
import { useSelectedFriend } from "@/contexts/SelectedFriendContext";

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
        if (message.createdAt) {
          const createdAtDate = message.createdAt.toDate();
          // 日付と時刻のフォーマットを変更
          message.formattedDate = `${createdAtDate.getMonth() + 1}/${createdAtDate.getDate()} ${createdAtDate.getHours()}:${createdAtDate.getMinutes()}`;
        }
        fetchedMessages.push(message);
      });
      // 日付でソート
      fetchedMessages.sort((a, b) => a.createdAt - b.createdAt);
      setMessages(fetchedMessages);
    });
    return () => unsubscribe();
  }, [myUserId, friendUserId]);

  return (
    <div className="p-4 overflow-y-scroll flex-1">
      <h2 className="text-xl font-bold mb-4">{selectedFriend?.name}</h2>
      <div className="space-y-4">
        {messages.map((message, index) => {
          return (
            <div key={index} className={`flex ${message.isOwnMessage ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-center ${message.isOwnMessage ? "flex-row-reverse" : ""}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl border ${message.isOwnMessage ? "bg-green-200 border-green-500" : "bg-white border-gray-800"}`}>
                  <p className="text-gray-800">{message.text}</p>
                  <div className="flex justify-end">
                    <p className="text-gray-500 text-xs">
                      {message.formattedDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessageList;
