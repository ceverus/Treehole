// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({ env: 'textllinpro-5br77' })
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const { Name, Fixed_phone, Profession, Address, Company, Main_Business, Telephone, Website, Mailbox,
    Weixin_number, Backgroup_type, Head_url, Id } = event;
  console.log(event)
  console.log(Id)
  return db.collection('Record_my_card').doc(Id).update({
    data: {
      Name: Name,
      Fixed_phone: Fixed_phone,
      Profession: Profession,
      Address: Address,
      Company: Company,
      Main_Business: Main_Business,
      Telephone: Telephone,
      Website: Website,
      Mailbox: Mailbox,
      Weixin_number: Weixin_number,
      Backgroup_type: Backgroup_type,
      Head_url: Head_url
    },
  }).then(res => {
    console.log("out test")
    console.log(res)
  })
}
