"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const RegisterPage = () => {
  const [displayName, setDisplayName] = useState("");
  const [confirmDisplayName, setConfirmDisplayName] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user === null) {
        router.push("/auth");
      }
    });
    return unsubscribe;
  }, []);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!displayName || displayName !== confirmDisplayName) {
      setError("表示名が一致しません。");
      return;
    }
    const user = auth.currentUser;
    if (user) {
      await updateProfile(user, {
        displayName: displayName,
      })
        .then(async () => {
          await setDoc(doc(db, "users", user.uid), {
            displayName: displayName,
          })
            .then(() => {
              router.push("/");
            })
            .catch((error) => {
              setError(`ユーザー情報の保存に失敗しました: ${error.message}`);
            });
        })
        .catch((error) => {
          setError(`プロフィールの更新に失敗しました: ${error.message}`);
        });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="p-10 bg-white shadow-xl rounded-lg w-full max-w-md">
        <div className="flex flex-col items-center">
          <form className="w-full" onSubmit={handleRegister}>
            <h1 className="text-2xl font-bold mb-4 text-center py-1">
              プロフィール設定
            </h1>
            <div className="mb-4">
              <input
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="displayName"
                type="text"
                placeholder="表示名"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="confirmDisplayName"
                type="text"
                placeholder="確認用表示名"
                value={confirmDisplayName}
                onChange={(e) => setConfirmDisplayName(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="flex flex-col space-y-4">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
              >
                更新
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
