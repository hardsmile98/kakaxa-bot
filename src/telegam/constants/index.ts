const commands = {
  start: {
    value: '/start',
    description: 'Launch app',
  },
};

const messages = {
  greetings: {
    photo:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzvKzdSw_jbX9UC91HWk58RoJtwLw5Y1WotQ&s',
    caption: 'Text!',
    keyboard: [
      [
        {
          text: 'Game',
          web_app: {
            url: 'https://kkxlove.com/',
          },
        },
      ],
      [
        {
          text: 'Chat',
          url: 'https://t.me/kakaxa_coin',
        },
      ],
    ],
  },
};

export { messages, commands };
