"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, collection, getDoc, getDocs, query, where } from "firebase/firestore";

const Page = () => {
  const router = useRouter();
  const [friendUserId, setFriendUserId] = useState("");
  const [userId, setUserId] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user === null) {
        router.push("/auth");
      } else {
        setUserId(user.uid); // ユーザーIDを設定
      }
    });
    return unsubscribe;
  }, []);

  const searchFriend = async () => {
    if (!friendUserId) return;
    if (friendUserId === userId) {
      alert("自分自身を追加することはできません");
      return;
    }
    const userRef = doc(db, "users", friendUserId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      setDisplayName(userSnap.data().displayName);
    } else {
      alert("ユーザーが見つかりません");
      setDisplayName("");
    }
  };

  const addFriend = async () => {
    if (!friendUserId || !displayName) return;
    if (friendUserId === userId) {
      alert("自分自身を追加することはできません");
      return;
    }
    const user = auth.currentUser;
    if (user) {
      const friendRef = collection(db, "users", user.uid, "friends");
      const q = query(friendRef, where("userId", "==", friendUserId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        alert("このユーザーはすでに友達です");
        return;
      }
      // 自分の友達リストに追加
      await setDoc(doc(friendRef, friendUserId), {
        userId: friendUserId,
        displayName: displayName,
      });
      // 友達の友達リストに自分を追加
      const friendFriendRef = collection(db, "users", friendUserId, "friends");
      await setDoc(doc(friendFriendRef, user.uid), {
        userId: user.uid,
        displayName: user.displayName || "",
      })
        .then(() => {
          alert(`${displayName}を友達に追加しました`);
          setFriendUserId("");
          setDisplayName("");
        })
        .catch((error) => {
          console.error("友達の追加に失敗しました: ", error);
        });
    }
  };

  const copyUserId = () => {
    navigator.clipboard
      .writeText(userId)
      .then(() => {
        alert("ユーザーIDをコピーしました");
      })
      .catch((error) => {
        console.error("ユーザーIDのコピーに失敗しました: ", error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="p-10 bg-white shadow-xl rounded-lg w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex items-center justify-between">
            <p>あなたのユーザーID: {userId}</p>
            <button
              onClick={copyUserId}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
            >
              コピー
            </button>
          </div>
          <input
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="友達のユーザーID"
            value={friendUserId}
            onChange={(e) => setFriendUserId(e.target.value)}
          />
          <button
            onClick={searchFriend}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            友達を検索
          </button>
          {displayName && (
            <div className="mt-4">
              <p className="text-lg">{`ユーザー名: ${displayName}`}</p>
              <button
                onClick={addFriend}
                className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                友達に追加
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
