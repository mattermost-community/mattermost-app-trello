require('dotenv').config('../');
export const DEFAULT_PORT = 4001;

export default {
    APP: {
        PORT: Number(process.env.PORT) || DEFAULT_PORT,
        HOST: process.env.HOST || '',
        LOCAL: process.env.LOCAL || 'false',
    },
    TRELLO: {
        URL: 'https://api.trello.com/1/',
    },
};
