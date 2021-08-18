const { VK } = require('vk-io')
const { HearManager } = require('@vk-io/hear')
const vk = new VK({
    token: 'token'
})
const { MongoClient } = require('mongodb')
const url = 'connection url'
const client = new MongoClient(url)
const bot = new HearManager();

vk.updates.on('message_new', bot.middleware)

client.connect()
const db = client.db('bot')
const collection = db.collection('users')

bot.hear(/привет/i, msg => {
    collection.insertOne({
        id: msg.senderId,
        balance: 5000
    })
    msg.send('Вы добавлены в базу данных')
})

bot.hear(/баланс/i, async msg => {
    const user = await collection.findOne({ id: msg.senderId })
    msg.send(user.balance)
})

bot.hear(/работа/i, async msg => {
    const user = await collection.findOne({ id: msg.senderId })
    collection.updateOne({ id: msg.senderId }, { $set: { balance: 10000 } })
})

vk.updates.start()