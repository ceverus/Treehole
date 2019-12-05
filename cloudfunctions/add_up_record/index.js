// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("updatevote in")
  const db = cloud.database({ env: 'textllinpro-5br77' })
  const _ = db.command
  const myid = event.myid
  const youopenid = event.youopenid
  const youid = event.youid
  return db.collection('My_up').add({
    data: {
      myId: myid,
      youOpenId: youopenid,//同个人
      youId: youid//判断不同条
    },
  }).then(res => {
      console.log("updatevote out")      
      return res;
    });
}