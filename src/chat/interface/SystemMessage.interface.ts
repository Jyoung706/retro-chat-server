export interface SystemMessage {
  id: string;
  roomId: string;
  type: 'join' | 'leave';
  sender_id: string;
  nickname: string;
  message: string;
  isSystem: boolean;
}
