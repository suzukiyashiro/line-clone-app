import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { collection, query, getDocs } from "firebase/firestore";
import { useSelectedFriend } from '@/contexts/SelectedFriendContext';

const Sidebar = () => {
  const [friends, setFriends] = useState<{ id: string; name?: string }[]>([]);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState(""); // ユーザー名を保存するための状態

  const { setSelectedFriend } = useSelectedFriend();

  const handleSelectFriend = (friend: any) => {
    setSelectedFriend(friend);
  };

  useEffect(() => {
    const fetchFriends = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          setUserName(user.displayName || "匿名ユーザー"); // ユーザー名を設定
          const q = query(collection(db, "users", user.uid, "friends"));
          const querySnapshot = await getDocs(q);
          const friendsData: { id: string; name?: string }[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            friendsData.push({
              id: doc.id,
              name: data.displayName,
            });
          });
          if (friendsData.length > 0) {
            setFriends(friendsData);
          } else {
            setError("友達が誰もいません。");
          }
        } else {
          setError("ユーザーIDが見つかりません。");
        }
      });
    };
    fetchFriends();
  }, []);


  return (
    <div className="flex flex-col cursor-pointer relative h-full">
      {/* ユーザー名の表示 */}
      <div className="p-4">
        <h2 className="text-lg font-semibold">ログイン:</h2>
        <h2 className="text-lg font-semibold">{userName}</h2>
      </div>
      {/* エラーメッセージ */}
      {error && <p className="text-red-500">{error}</p>}
      {/* チャットリスト */}
      <div className="overflow-auto">
        {friends.map((friend) => (
          <div key={friend.id} onClick={() => handleSelectFriend(friend)} className="p-2 my-1 hover:bg-gray-100 flex items-center cursor-pointer">
            {/* アイコン */}
            <img
              src={`https://source.unsplash.com/collection/1346951/1000x500?sig=${Math.floor(Math.random() * 100)}`}
              alt="friend icon"
              className="w-10 h-10 rounded-full object-cover align-middle mr-4"
            />
            {/* チャット情報 */}
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-left">{friend.name}</h3>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 w-full p-4 bg-white">
        {/* 友達追加ボタン */}
        <button className="mb-2 w-full p-2 flex items-center justify-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          <Link href="/add-friend">友達追加</Link>
        </button>
        {/* ログアウトボタン */}
        <button
          onClick={() => signOut(auth)}
          className="w-full p-2 flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          ログアウト
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
