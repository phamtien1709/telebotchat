require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const schedule = require('node-schedule')
const TrainingKeys = require('./lib/trainingKeys')
const CommonController = require('./controller/CommonController')
const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')

let job

const { TELEGRAM_TOKEN, SERVER_URL } = process.env
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`
const URI = `/webhook/${TELEGRAM_TOKEN}`
const WEBHOOK_URL = SERVER_URL + URI
const bot = new Telegraf(TELEGRAM_TOKEN)

const app = express()
app.use(bodyParser.json())

const init = async () => {
  // const response = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`)
  // console.log(response.data)
}

app.post(URI, async (req, res) => {
  const { message } = req.body
  try {
    if (message !== undefined) {
      if (message.text === TrainingKeys.COMMON_START) {
        const response = await axios.get(
          `${TELEGRAM_API}/sendMessage?chat_id=${message.chat.id}&text=${message.text}`,
        )
      }
      if (message.text === TrainingKeys.COMMON_PRICE) {
        await CommonController.getPrice(message)
      }
      if (message.text === TrainingKeys.COMMON_PRICE_1H) {
        job = schedule.scheduleJob('30 * * * * ', async () => {
          await CommonController.getPrice(message)
        })
      }
      if (message.text === TrainingKeys.COMMON_RELAX_CHECK) {
        await CommonController.getPrice(message)
      }
      if (message.text.includes(TrainingKeys.COMMON_PRICE_SPEC)) {
        await CommonController.getPriceBySymbol(message)
      }
      if (message.text === TrainingKeys.COMMON_STOP_PRICE_1H) {
        if (job) {
          job.cancel()
        }
      }
      if (message.text === TrainingKeys.COMMON_STOP) {
        const response = await axios.get(
          `${TELEGRAM_API}/sendMessage?chat_id=${message.chat.id}&text=${message.text}`,
        )
      }
    }
    res.sendStatus(200)
  } catch (error) {
    console.log('ERRORORO')
    res.sendStatus(200)
  }
})

app.get('/', async (_req, res) => {
  await CommonController.getPriceTest()
  res.send('Server OK')
})

app.get('/cron/price', async (_req, res) => {
  await CommonController.autoGetPrice()
  res.send('Cron OK')
})

app.listen(process.env.PORT || 5000, async () => {
  console.log('Server started', process.env.PORT || 5000)
  await init()
})

bot.start((ctx) =>
  ctx
    .reply('Welcome', {
      reply_to_message_id: process.env.TOPIC_ID,
    })
    .catch((error) => {}),
)
bot.help((ctx) =>
  ctx
    .reply('Send me a sticker', {
      reply_to_message_id: process.env.TOPIC_ID,
    })
    .catch((error) => {}),
)

bot.on(message('sticker'), (ctx) =>
  ctx.reply(['🖐', '🖖', '🤏', '🤞', '🤟', '👍'][Math.floor(Math.random() * 6)], {
    reply_to_message_id: process.env.TOPIC_ID,
  }),
)
bot.hears('Hi', (ctx) => {
  ctx.telegram
    .sendMessage(ctx.message.chat.id, 'OK', {
      reply_to_message_id: process.env.TOPIC_ID,
    })
    .catch((error) => {})
})
bot.hears('ID', (ctx) => {
  try {
    ctx.telegram
      .sendMessage(ctx.message.chat.id, ctx.message.chat.id.toString(), {
        reply_to_message_id: process.env.TOPIC_ID,
      })
      .catch((error) => {})
  } catch (error) {}
})

bot.launch()
