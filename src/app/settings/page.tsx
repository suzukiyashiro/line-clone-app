"use client";

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { auth } from "@/firebase/firebaseConfig";
import { updateProfile, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

const SettingsPage = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if(auth.currentUser) {
      setUserName(auth.currentUser.displayName || '');
    }
  }, []);

  const handleUserNameChange = (e: any) => {
    setUserName(e.target.value);
  };

  const updateUserName = () => {
    if(auth.currentUser) {
      updateProfile(auth.currentUser, {
        displayName: userName,
      }).then(() => {
        alert("ユーザー名が更新されました。");
      }).catch((error) => {
        alert(`ユーザー名の更新に失敗しました。${error}`);
      });
    }
  };

  const reauthenticate = (password: string) => {
    if(auth.currentUser && auth.currentUser.email) {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );
      return reauthenticateWithCredential(auth.currentUser, credential);
    }
    return Promise.reject(new Error("再認証のための情報が不足しています。"));
  };

  const handleDeleteAccount = () => {
    const password = prompt("アカウントの削除を続行するには、パスワードを入力してください:");
    if (!password) {
      alert("パスワードが入力されていません。");
      return;
    }
    reauthenticate(password).then(() => {
      if(auth.currentUser) {
        deleteUser(auth.currentUser).then(() => {
          alert("アカウントが削除されました。");
          router.push('/auth')
        }).catch((error) => {
          alert(`アカウントの削除に失敗しました。${error}`);
        });
      }
    }).catch((error) => {
      alert(`再認証に失敗しました。${error}`);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-10 bg-white shadow-xl rounded-lg space-y-8">
        <div className="updateUserName space-y-4">
          <p className="text-2xl font-semibold text-gray-800">表示名：<span className="text-blue-500">{userName}</span></p>
          <input type="text" value={userName} onChange={handleUserNameChange} placeholder="新しいユーザー名" className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 mr-4"/>
          <button onClick={updateUserName} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105">更新</button>
        </div>
        <div className="deleteAccount mt-8 flex justify-center">
          <button onClick={handleDeleteAccount} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105">アカウントを削除</button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
