export interface IChatMessage {
  from: string;
  message: string;
}

export interface IMessage {
  sent?: boolean;
  message: string;
}

export interface IContact {
  lastMessage: string;
  count: number;
}
