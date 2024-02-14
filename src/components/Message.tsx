import { IMessage } from "@/types";
import React from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Image from "next/image";

const Message: React.FC<{ message: IMessage; isOwnMessage: boolean }> = ({
  message,
  isOwnMessage,
}) => {
  const icon = "https://source.unsplash.com/collection/1346951/1000x500?sig=1";
  let formattedTime = "";
  if (message.time) {
    try {
      const timestamp = message.time;
      const date = new Date(parseInt(timestamp) * 1000);
      if (isNaN(date.getTime())) {
        throw new Error("無効な日付");
      }
      console.log(date);
      formattedTime = format(date, "PPpp", { locale: ja });
    } catch (error) {
      console.error("日付の形式が無効です。", error);
    }
  }
  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div
        key={message.id}
        className={`flex items-center ${
          isOwnMessage ? "flex-row-reverse" : ""
        }`}
      >
        <Image
          src={icon}
          alt="アバター"
          width={40} // この行を追加
          height={40} // この行を追加
          className={`rounded-full ${
            isOwnMessage ? "ml-2" : "mr-2"
          } cursor-pointer`}
        />
        <div
          className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl border ${
            isOwnMessage
              ? "bg-green-200 border-green-500"
              : "bg-white border-gray-800"
          }`}
        >
          <p className="text-gray-800">{message.text}</p>
          <p
            className={`text-gray-500 text-xs mt-1 ${
              isOwnMessage ? "text-right" : ""
            }`}
          >
            {formattedTime}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Message;
