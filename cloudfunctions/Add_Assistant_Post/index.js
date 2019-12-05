// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("updatevote in")
  const db = cloud.database({ env: 'textllinpro-5br77' })
  const _ = db.command
  const Useropenid = event.Useropenid
  const postuserid = event.postopenid
  const postid = event.postid
  const Time_s = evnet.Time_s
  return db.collection('Assistant_Up').add({
    data: {
      Useropenid: Useropenid,
      Up_Post_id: youopenid,//记录点赞的贴子id
      Up_id: postopenid,//记录点赞的贴子所属人openid
      Time: Time_s

    },
  }).then(res => {
    console.log("updatevote out")
    return res;
  });
}