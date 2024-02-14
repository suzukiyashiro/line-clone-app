import React from "react";
import SendMessage from "./SendMessage";
import Message from "./MessageList";
import { useSelectedFriend } from "@/contexts/SelectedFriendContext";

const Talk = () => {
  const { selectedFriend } = useSelectedFriend();

  return (
    <div>
      {selectedFriend ? (
        <div className="flex flex-col bg-blue-100 h-screen">
          <Message />
          <SendMessage />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-slate-100 h-screen text-center text-2xl">
          友人を選択してください。
        </div>
      )}
    </div>
  );
};

export default Talk;
