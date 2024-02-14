export interface IMessage {
  id: number;
  text: string;
  sender: string;
  time: string;
  isOwnMessage: boolean;
}

export interface IMessageProps {
  message: IMessage;
  isOwnMessage: boolean; 
}