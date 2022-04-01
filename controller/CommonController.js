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
    for (let i = 0; i < interestedResponse.length; i++) {
      const klines = await axios.get(
        `https://api.binance.com/api/v1/klines?symbol=${
          interestedResponse[i].symbol
        }&interval=1h&startTime=${new Date().getTime() - 3600000}&endTime=${new Date().getTime()}`,
      )
      interestedResponse[i].dataKLine = klines.data[0]
    }
    let newMessage = ''
    newMessage += `Cap nhat gia coin dang quan tam (1h) (${dayjs().format(
      'YYYY-MM-DD HH:mm:ss',
    )}):\n`
    for (let i = 0; i < interestedResponse.length; i++) {
      newMessage += `\xF0\x9F\x92\xB0 ${
        interestedResponse[i].symbol
      }: \xF0\x9F\x92\xB2${interestedResponse[i].lastPrice.slice(0, -3)}. ${
        interestedResponse[i].priceChangePercent.includes('-')
          ? '\xF0\x9F\x93\x89'
          : '\xF0\x9F\x93\x88'
      }: ${interestedResponse[i].priceChangePercent.slice(
        0,
        -1,
      )}%. \xF0\x9F\x94\xBC ${interestedResponse[i].dataKLine[2].slice(
        0,
        -3,
      )}  \xF0\x9F\x94\xBB ${interestedResponse[i].dataKLine[3].slice(
        0,
        -3,
      )}. \xF0\x9F\x9A\x80 ${interestedResponse[i].dataKLine[1].slice(0, -3)}\n`
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
    for (let i = 0; i < interestedResponse.length; i++) {
      const klines = await axios.get(
        `https://api.binance.com/api/v1/klines?symbol=${
          interestedResponse[i].symbol
        }&interval=1h&startTime=${new Date().getTime() - 3600000}&endTime=${new Date().getTime()}`,
      )
      interestedResponse[i].dataKLine = klines.data[0]
    }
    let newMessage = ''
    newMessage += `Cap nhat gia coin dang quan tam (1h) (${dayjs().format(
      'YYYY-MM-DD HH:mm:ss',
    )}):\n`
    for (let i = 0; i < interestedResponse.length; i++) {
      newMessage += `\xF0\x9F\x92\xB0 ${
        interestedResponse[i].symbol
      }: \xF0\x9F\x92\xB2${interestedResponse[i].lastPrice.slice(0, -3)}. ${
        interestedResponse[i].priceChangePercent.includes('-')
          ? '\xF0\x9F\x93\x89'
          : '\xF0\x9F\x93\x88'
      }: ${interestedResponse[i].priceChangePercent.slice(
        0,
        -1,
      )}%. \xF0\x9F\x94\xBC ${interestedResponse[i].dataKLine[2].slice(
        0,
        -3,
      )}  \xF0\x9F\x94\xBB ${interestedResponse[i].dataKLine[3].slice(
        0,
        -3,
      )}. \xF0\x9F\x9A\x80 ${interestedResponse[i].dataKLine[1].slice(0, -3)}\n`
    }
    const responseSender = await axios.get(
      `${TELEGRAM_API}/sendMessage?chat_id=${CHAT_ID}&text=${newMessage}`,
    )
  }
  async getPriceBySymbol(message) {
    const responsePrice = await axios.get(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${message.text
        .replace('/price_spec', '')
        .toUpperCase()}`,
    )
    const klines = await axios.get(
      `https://api.binance.com/api/v1/klines?symbol=${responsePrice.symbol}&interval=1h&startTime=${
        new Date().getTime() - 3600000
      }&endTime=${new Date().getTime()}`,
    )
    responsePrice.dataKLine = klines.data[0]
    let newMessage = ''
    newMessage += `Cap nhat gia coin ${message.text
      .replace('/price_spec', '')
      .toUpperCase()} (1h) (${dayjs().format('YYYY-MM-DD HH:mm:ss')}):\n`
    newMessage += `\xF0\x9F\x92\xB0 ${
      responsePrice.symbol
    }: \xF0\x9F\x92\xB2${responsePrice.lastPrice.slice(0, -3)}. ${
      responsePrice.priceChangePercent.includes('-') ? '\xF0\x9F\x93\x89' : '\xF0\x9F\x93\x88'
    }: ${responsePrice.priceChangePercent.slice(
      0,
      -1,
    )}%. \xF0\x9F\x94\xBC ${responsePrice.dataKLine[2].slice(
      0,
      -3,
    )}  \xF0\x9F\x94\xBB ${responsePrice.dataKLine[3].slice(
      0,
      -3,
    )}. \xF0\x9F\x9A\x80 ${responsePrice.dataKLine[1].slice(0, -3)}\n`
    const responseSender = await axios.get(
      `${TELEGRAM_API}/sendMessage?chat_id=${message.chat.id}&text=${newMessage}`,
    )
  }
  async getPriceTest() {
    const responsePrice = await axios.get(`https://api.binance.com/api/v3/ticker/24hr`)
    const interestedResponse = responsePrice.data.filter((symbol) =>
      InterestedSymbols.MOSTLY.includes(symbol.symbol),
    )
    for (let i = 0; i < interestedResponse.length; i++) {
      const klines = await axios.get(
        `https://api.binance.com/api/v1/klines?symbol=${
          interestedResponse[i].symbol
        }&interval=1h&startTime=${new Date().getTime() - 3600000}&endTime=${new Date().getTime()}`,
      )
      interestedResponse[i].dataKLine = klines.data[0]
    }
    let newMessage = ''
    newMessage += `Cap nhat gia coin dang quan tam (1h) (${dayjs().format(
      'YYYY-MM-DD HH:mm:ss',
    )}):\n`
    for (let i = 0; i < interestedResponse.length; i++) {
      newMessage += `\xF0\x9F\x92\xB0 ${
        interestedResponse[i].symbol
      }: \xF0\x9F\x92\xB2${interestedResponse[i].lastPrice.slice(0, -3)}. ${
        interestedResponse[i].priceChangePercent.includes('-')
          ? '\xF0\x9F\x93\x89'
          : '\xF0\x9F\x93\x88'
      }: ${interestedResponse[i].priceChangePercent.slice(
        0,
        -1,
      )}%. \xF0\x9F\x94\xBC ${interestedResponse[i].dataKLine[2].slice(
        0,
        -3,
      )}  \xF0\x9F\x94\xBB ${interestedResponse[i].dataKLine[3].slice(
        0,
        -3,
      )}. \xF0\x9F\x9A\x80 ${interestedResponse[i].dataKLine[1].slice(0, -3)}\n`
    }
    const responseSender = await axios.get(
      `${TELEGRAM_API}/sendMessage?chat_id=${CHAT_ID}&text=${newMessage}`,
    )
  }
}

module.exports = new CommonController()
