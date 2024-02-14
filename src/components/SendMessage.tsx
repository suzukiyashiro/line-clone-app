import React, { useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp, doc } from "firebase/firestore";
import { useSelectedFriend } from "@/contexts/SelectedFriendContext";
import { auth } from "@/firebase/firebaseConfig";

const SendMessage = () => {
  const [message, setMessage] = useState("");
  const { selectedFriend } = useSelectedFriend();
  const myUserId = auth.currentUser?.uid;

  const handleSend = async () => {
    if (message === "" || !selectedFriend?.id || !myUserId) return;
  
    // IDを辞書順に並べ替えてから結合
    const chatId = [myUserId, selectedFriend.id].sort().join('_');
    const talksRef = doc(db, "talks", chatId);
    const messagesRef = collection(talksRef, "messages");
    await addDoc(messagesRef, {
      text: message,
      createdAt: serverTimestamp(),
      from: myUserId,
      to: selectedFriend.id,
    });
  
    setMessage(""); 
  };

  return (
    <div className="bg-white p-4 shadow-t">
      <div className="flex items-center">
        {/* 写真アイコン */}
        <button className="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18a2 2 0 011 3.732V19a2 2 0 01-2 2H4a2 2 0 01-2-2V10.732A2 2 0 013 7z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 3h-4v4h4V3z" />
          </svg>
        </button>
        {/* メッセージ入力欄 */}
        <input
          type="text"
          placeholder="Aa"
          className="flex-1 border-b-slate-600 p-2 rounded-2xl focus:outline-none focus:border-blue-300"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {/* 送信ボタン */}
        <button
          className="ml-2 bg-blue-500 text-white p-2 rounded-2xl"
          onClick={handleSend}
        >
          送信
        </button>
      </div>
    </div>
  );
};

export default SendMessage;
