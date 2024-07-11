const commands = {
  start: {
    value: '/start',
    description: 'Launch app',
  },
};

const messages = {
  greetings: {
    photo: 'https://i.ibb.co/MZtMGRD/Banner.png',
    caption:
      'You want to see how agile you are?\nDive into the KAKAXA world and find out!',
    keyboard: [
      [
        {
          text: 'Play 💩',
          web_app: {
            url: 'https://kkxlove.com/',
          },
        },
      ],
      [
        {
          text: 'Join community',
          url: 'https://t.me/kakaxa_coin',
        },
      ],
    ],
  },
};

export { messages, commands };
