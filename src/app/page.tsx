"use client"

import Sidebar from "@/components/Sidebar";
import Talk from "@/components/Talk";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { SelectedFriendProvider } from '@/contexts/SelectedFriendContext';

export default function Home() {

  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user === null) {
        router.push('/auth')
      }
    });
    return unsubscribe;
  }, []);

  return (
    <SelectedFriendProvider>
    <div className="flex">
      <div className="hidden md:block w-2/12 h-screen border-r-2 border-gray-300">
        <Sidebar />
      </div>
      <div className="flex-1 w-full md:w-10/12 h-screen">
        <Talk />
      </div>
    </div>
    </SelectedFriendProvider>
  );
}
