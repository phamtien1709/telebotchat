require('dotenv').config()
const axios = require('axios')
const dayjs = require('dayjs')
const InterestedSymbols = require('../lib/interestedSymbols')

const { TELEGRAM_TOKEN, CHAT_ID } = process.env
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`

class CommonController {
  async getPrice(message) {
    const responsePrice = await axios.get(`https://api.binance.com/api/v3/ticker/24hr`)
    const interestedResponse = responsePrice.data.filter((symbol) =>
      InterestedSymbols.MOSTLY.includes(symbol.symbol),
    )
    let newMessage = ''
    newMessage += `Cap nhat gia coin dang quan tam(24h) (${dayjs().format(
      'YYYY-MM-DD HH:mm:ss',
    )}):\n`
    for (let i = 0; i < interestedResponse.length; i++) {
      newMessage += `\xF0\x9F\x92\xB0 ${
        interestedResponse[i].symbol
      }: \xF0\x9F\x92\xB2${interestedResponse[i].lastPrice.slice(0, -3)}. ${
        interestedResponse[i].priceChangePercent.includes('-')
          ? '\xF0\x9F\x93\x89'
          : '\xF0\x9F\x93\x88'
      }: ${interestedResponse[i].priceChangePercent.slice(0, -1)}%. \xF0\x9F\x94\xBC ${
        interestedResponse[i].highPrice.slice(0, -3)
      }  \xF0\x9F\x94\xBB ${interestedResponse[i].lowPrice.slice(0, -3)}. \xF0\x9F\x9A\x80 ${
        interestedResponse[i].openPrice.slice(0, -3)
      }\n`
    }
    const responseSender = await axios.get(
      `${TELEGRAM_API}/sendMessage?chat_id=${message.chat.id}&text=${newMessage}`,
    )
  }
  async autoGetPrice() {
    const responsePrice = await axios.get(`https://api.binance.com/api/v3/ticker/24hr`)
    const interestedResponse = responsePrice.data.filter((symbol) =>
      InterestedSymbols.MOSTLY.includes(symbol.symbol),
    )
    let newMessage = ''
    newMessage += `Cap nhat gia coin dang quan tam(24h) (${dayjs().format(
      'YYYY-MM-DD HH:mm:ss',
    )}):\n`
    for (let i = 0; i < interestedResponse.length; i++) {
      newMessage += `\xF0\x9F\x92\xB0 ${
        interestedResponse[i].symbol
      }: \xF0\x9F\x92\xB2${interestedResponse[i].lastPrice.slice(0, -3)}. ${
        interestedResponse[i].priceChangePercent.includes('-')
          ? '\xF0\x9F\x93\x89'
          : '\xF0\x9F\x93\x88'
      }: ${interestedResponse[i].priceChangePercent.slice(0, -1)}%. \xF0\x9F\x94\xBC ${
        interestedResponse[i].highPrice.slice(0, -3)
      }  \xF0\x9F\x94\xBB ${interestedResponse[i].lowPrice.slice(0, -3)}. \xF0\x9F\x9A\x80 ${
        interestedResponse[i].openPrice.slice(0, -3)
      }\n`
    }
    const responseSender = await axios.get(
      `${TELEGRAM_API}/sendMessage?chat_id=${CHAT_ID}&text=${newMessage}`,
    )
  }
}

module.exports = new CommonController()
