require('dotenv').config('../')

export default {
    APP: {
        PORT: Number(process.env.PORT) || 4002,
        HOST: process.env.HOST || 'https://ee70-201-160-204-97.ngrok.io'
    },
    TRELLO: {
        URL: 'https://api.trello.com/1/'
<<<<<<< HEAD
=======
    },
    MATTERMOST: {
        URL: process.env.MATTERMOST_SERVER_URL || 'http://[::1]:8066',
        USE: process.env.MATTERMOST_USE === 'true'
>>>>>>> d771a157495cc8ec276aa4cafdf0b70d5a2bda72
    }
}
