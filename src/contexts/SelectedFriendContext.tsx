import React, { createContext, useContext, useState } from 'react';

interface Friend {
  id: string;
  name?: string;
}

interface SelectedFriendContextType {
  selectedFriend: Friend | null;
  setSelectedFriend: React.Dispatch<React.SetStateAction<Friend | null>>;
}

const SelectedFriendContext = createContext<SelectedFriendContextType | undefined>(undefined);

export const SelectedFriendProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  return (
    <SelectedFriendContext.Provider value={{ selectedFriend, setSelectedFriend }}>
      {children}
    </SelectedFriendContext.Provider>
  );
};

export const useSelectedFriend = () => {
  const context = useContext(SelectedFriendContext);
  if (context === undefined) {
    throw new Error('useSelectedFriend must be used within a SelectedFriendProvider');
  }
  return context;
};