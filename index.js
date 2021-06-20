const botApi = require('node-telegram-bot-api');

const token = '1803099855:AAF4I1eOEIDsZ6oowvVSJ-QuZdpr0REH5KA';
const { gameOption, restartGame } = require('./options')
const bot = new botApi(token, { polling: true });

const startBot = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Приветствие с пользователем/' },
        { command: '/info', description: 'Показ информации об имени бота и имени с фамилией пользователя/' },
        { command: '/game', description: 'Игра "угадай число".' },
        { command: '/restart', description: 'Заново запускает игру".' },
        { command: '/help', description: 'список и  описание доступных команд.' },
    ])

    const game = {}

    const startGame = async (chatID) => {
        await bot.sendMessage(chatID,
            `Отлично.Давай поиграем в угадай число.Выбери любое число от 1 до 10.`);
        const rundomNumber = Math.floor(Math.random() * 10) + 1;
        game[chatID] = rundomNumber;
        game['count'] = 2;
        await bot.sendMessage(chatID, `Попыток: ${game['count'] + 1} `, gameOption);
    }

    bot.on('message', async msg => {

        const text = msg.text;
        const chatID = msg.chat.id;
        try {
            if (text === '/start') {
                await bot.sendSticker(chatID, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
                await bot.sendMessage(chatID, `${msg.from.first_name},добро пожаловать в телеграм бота.`);
            }
            else if (text === '/info') {
                await bot.sendMessage(chatID, `Меня зовут SoraBot,а твоё имя ${msg.from.first_name} и фамилия ${msg.from.last_name}.`);
            }

            else if (text === '/game' || text === '/restart') {
                startGame(chatID);
            }
            else if (text === '/help') {
                return bot.sendMessage(chatID,
                    `/start - Приветственное окно.\n/info - Показывает имя бота и имя с фамилией пользователя.\n/game - Игра угадай число.\n/help - Показывает доступные команды и их описание.`);
            }
            else if (text === 'привет') {
                return bot.sendMessage(chatID,
                    `Приветствую вас,${msg.from.first_name}.`);
            }
            else {
                return bot.sendMessage(chatID, `Ничего не понял :) Введи /help для получения информации о доступных командах.`);
            }

        }
        catch (err) {
            return bot.sendSticker(chatID, 'Упс.Произошла какая-то ошибка.')
        }

    })
    bot.on('callback_query', async msg => {

        const data = msg.data;
        const chatID = msg.message.chat.id;

        if (game['count'] == 0 || data === '/restart') {
            if (data === '/restart') {
                return startGame(chatID);
            }
            if (game['count'] == 0) {
                return await bot.sendMessage(chatID, `Ты потерял все жизни:( Пробуй заново.Нажми на кнопку или напиши /restart`, restartGame);
            }
        }
        if (data == game[chatID]) {
            return await bot.sendMessage(chatID, `Браво,молодец,ты угадал число ${game['count']}`, restartGame);
        }
        else {
            game['count']--;
            return await bot.sendMessage(chatID, `Не-а,угадывай дальше,у тебя всё получится :) HP: ${game['count'] + 1} .`)
        }

    })
}

startBot();