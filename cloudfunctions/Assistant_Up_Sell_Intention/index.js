const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({ env: 'textllinpro-5br77' })
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const buypost_id = event.buypost_id
  return db.collection('Assistant_Sell_DataSheet').doc(buypost_id).update({
    data: {
      Intention_Record_num: _.inc(1)
    },
  }).then(res => {
    console.log(res)
  })
}