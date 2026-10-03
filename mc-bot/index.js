const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// 1. WEB SERVER
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Bot is awake and running smoothly!');
});
app.listen(PORT, () => {
    console.log(`Web server listening on port ${PORT}`);
});

// 2. BOT CONFIGURATION
const botArgs = {
    host: 'gdgsmp.mineserver.uno', // Set to your server IP
    port: 25565,                   
    username: 'KeepAliveBot_26_2', 
    version: '26.2'                
};

let bot;

function createBot() {
    console.log('Connecting bot to the server...');
    bot = mineflayer.createBot(botArgs);

    // Auto-Login Implementation
    bot.on('message', (jsonMsg) => {
        const message = jsonMsg.toString();
        if (message.includes('/login') || message.includes('register')) {
            console.log('Login prompt detected. Sending credentials...');
            bot.chat('/login Ayush.10k');
        }
    });

    // Anti-AFK Kick
    bot.on('spawn', () => {
        console.log('Bot successfully joined the server!');
        setInterval(() => {
            if (bot.entity) {
                const yaw = bot.entity.yaw + (Math.random() * 0.4 - 0.2);
                bot.look(yaw, bot.entity.pitch);
                bot.swingArm('right');
            }
        }, 15000);
    });

    bot.on('death', () => {
        bot.respawn();
    });

    bot.on('end', (reason) => {
        console.log(`Disconnected: ${reason}. Reconnecting in 10s...`);
        setTimeout(createBot, 10000);
    });

    bot.on('error', (err) => {
        console.error(err);
    });
}

createBot();
