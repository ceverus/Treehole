// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({ env: 'textllinpro-5br77' })
// 云函数入口函数
exports.main = async (event, context) => {
  const Post_id = event.youid
  return db.collection('Assistant_Sell_DataSheet').doc(Post_id).remove({
  }).then(res => {
    console.log(res);
  })
}