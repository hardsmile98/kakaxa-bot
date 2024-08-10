type Message = {
  update_id: number;
  message: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username: string;
      language_code: string;
    };
    chat: {
      id: number;
      first_name: string;
      username: string;
      type: string;
    };
    date: number;
    text: string;
  };
};

type SendToBot = {
  ids: Array<number>;
  action: 'sendMessage' | 'sendPhoto';
  data: {
    message?: string;
    photo?: string;
    caption?: string;
    keyboard?: Array<unknown>;
  };
};

export type { Message, SendToBot };
