"use client"

import React from 'react';
import Link  from 'next/link';
import { BsYoutube } from 'react-icons/bs';

const LoginPage = () => {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-10 bg-white shadow-xl rounded-lg">
        <div className="flex flex-col items-center">
          {/* タイトル */}
          <h1 className="text-2xl font-bold mb-4">LINEへようこそ</h1>
          <p className="mb-8 text-gray-700">無料のメールや音声・ビデオ通話を楽しもう！</p>
          {/* ログインフォーム */}
          <div className="w-full max-w-sm flex flex-col items-center justify-center">
            <Link href="/auth/login">
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4 w-full text-center">
                ログイン
              </button>
            </Link>
            <Link href="/auth/register">
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4 w-full text-center">
                新規登録
              </button>
            </Link>
            {/* Youtubeリンク */}
            <Link href="https://www.youtube.com/watch?v=vvYm1Ub8_B0" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-center mt-4 flex items-center">
              <BsYoutube className="mr-2 text-lg"/>アプリ解説動画を見る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
