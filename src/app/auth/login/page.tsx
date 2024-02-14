"use client"

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error: any) {
      setError(`ログインに失敗しました。${error.message}`); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="p-10 bg-white shadow-xl rounded-lg w-full max-w-md">
        <div className="flex flex-col items-center">
          <form className="w-full" onSubmit={handleLogin}>
            <h1 className="text-2xl font-bold mb-4 text-center">ログイン</h1>
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
            {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* エラーメッセージを表示 */}
            <div className="flex flex-col space-y-4">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
              >
                ログイン
              </button>
              <Link href="/auth/register">
                <button className="text-center bg-transparent text-green-500 hover:text-green-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full border border-green-500">
                  新規登録はこちら
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
