// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({ env: 'textllinpro-5br77' })
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log("in test")
  const select_record = event.youid
  return db.collection('Record_picture').doc(select_record).update({
    data: {
      Vote: _.inc(1)
    },
  }).then(res => {
    console.log("out test")
    console.log(res)
  })
}
