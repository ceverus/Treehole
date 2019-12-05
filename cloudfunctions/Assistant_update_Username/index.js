const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({ env: 'textllinpro-5br77' })
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const Usernewname = event.Usernewname
  const User_inf_id = event.User_inf_id
  return db.collection('Assistant_User').doc(User_inf_id).update({
    data: {
      Username: Usernewname
    },
  }).then(res => {
    console.log(res)
  })
}