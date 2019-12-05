// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({ env: 'textllinpro-5br77' })
const _ = db.command

exports.main = async (event, context) => {
  const chatId = event.chatId
  const time=event.time
  const telValue = event.telValue
  const type = event.type
  console.log("-----------------")
  return db.collection('Chat_Record').doc(chatId).update({
    data: {
      time: _.push(time),
      content: _.push(telValue),
      who: _.push(type)
    },
  }).then(res => {
    console.log(res)
  })

}