"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // エラーメッセージ用のstateを追加

  const router = useRouter()

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(password !== confirmPassword) {
      setError("パスワードが一致しません。"); // エラーメッセージを設定
      return;
    }
    try {
      await setPersistence(auth, browserSessionPersistence);
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/auth/register/set-user-info')
    } catch (error: any) {
      setError(`新規登録に失敗しました。${error.message}`); // エラーメッセージを設定
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="p-10 bg-white shadow-xl rounded-lg w-full max-w-md">
        <div className="flex flex-col items-center">
          <form className="w-full" onSubmit={handleRegister}>
            <h1 className="text-2xl font-bold mb-4 text-center py-1">新規登録</h1>
            <div className="mb-4">
              <input
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="mb-6">
              <input
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="mb-6">
              <input
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="confirmPassword"
                type="password"
                placeholder="確認用パスワード"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {error && <p className="text-red-500 text-center">{error}</p>} {/* エラーメッセージを表示 */}
            </div>
            <div className="flex flex-col space-y-4">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
              >
                新規登録
              </button>
              <Link href="/auth/login">
                <button className="text-center bg-transparent text-green-500 hover:text-green-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full border border-green-500">
                  ログインはこちらから
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
