const db = wx.cloud.database({ env: 'textllinpro-5br77' })
const _ = db.command
var util = require("../../utils/util.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wantList: [
    ],
    wantListYou: [],
  },
  gotoChat: function (e) {
    console.log(e.currentTarget.dataset.heopenid)
    wx.setStorageSync("chatOpenid", e.currentTarget.dataset.heopenid)
    wx.navigateTo({
      url: '../chat/chat',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  youWant: function ()//别人想要我的
  {
    var that = this
    db.collection('Assistant_Sell_Intention').where({
      buypostopenid: wx.getStorageSync("myOpenId"),//我的openid== 被购买的openid
    }).get({
      success: res => {
        console.log("xxxxxxxxxx", res.data)
        for (let i = 0; i < res.data.length; i++) {
          let index = res.data.length - i - 1
          var wantOpenid = 'wantList[' + index + '].wantOpenid';
          var wantUserTimeDay = 'wantList[' + index + '].wantUserTimeDay';
          var wantMyGoodsId = 'wantList[' + index + '].wantMyGoodsId';
          var time = util.formatTime(res.data[i].Time_s)//格式化时间
          that.setData({
            [wantUserTimeDay]: time, //时间
            [wantMyGoodsId]: res.data[i].buy_Post_id,//他买东西_id
            [wantOpenid]: res.data[i]._openid,//他的 openid
          })

          db.collection('Assistant_User').where({
            _openid: res.data[i]._openid,
          }).get({
            success: res => {
              var headUrl = 'wantList[' + index + '].headUrl';//获取头像
              var userName = 'wantList[' + index + '].userName';//获取名字
              that.setData({
                [headUrl]: res.data[0].User_head_url,
                [userName]: res.data[0].Username
              })
            }
          })
          db.collection('Assistant_Sell_DataSheet').where({
            _id: res.data[i].buy_Post_id
          }).get({
            success: res => {
              console.log(res.data[0].Type)
              var saleType = 'wantList[' + index + '].saleType';//获取类型
              that.setData({
                [saleType]: res.data[0].Type,
              })
            }
          })
        }
      }
    })
  },
  iWant: function () {
    var that = this
    console.log("============", wx.getStorageSync("myOpenId"))
    db.collection('Assistant_Sell_Intention').where({
      _openid: wx.getStorageSync("myOpenId"),
    }).get({
      success: res => {
        console.log("aaaaaaaaaaa", res.data)
        for (let i = 0; i < res.data.length; i++) {
          let index = res.data.length - i - 1
          console.log("-----", index)
          var wantOpenid = 'wantListYou[' + index + '].wantOpenid';
          var wantUserTimeDay = 'wantListYou[' + index + '].wantUserTimeDay';
          var wantMyGoodsId = 'wantListYou[' + index + '].wantMyGoodsId';
          var time = util.formatTime(res.data[i].Time_s)//格式化时间
          that.setData({
            [wantUserTimeDay]: time, //时间
            [wantMyGoodsId]: res.data[i].buy_Post_id,//我购买的东西_id
            [wantOpenid]: res.data[i].buypostopenid,//我想要他的openid
          })

          db.collection('Assistant_User').where({
            _openid: res.data[i].buypostopenid,
          }).get({
            success: res => {
              var headUrl = 'wantListYou[' + index + '].headUrl';//获取头像
              var userName = 'wantListYou[' + index + '].userName';//获取名字
              that.setData({
                [headUrl]: res.data[0].User_head_url,
                [userName]: res.data[0].Username
              })
            }
          })
          console.log("******", res.data[i].buy_Post_id)
          db.collection('Assistant_Sell_DataSheet').where({
            _id: res.data[i].buy_Post_id
          }).get({
            success: res => {
              console.log(res.data[0].Type)
              var saleType = 'wantListYou[' + index + '].saleType';//获取类型
              that.setData({
                [saleType]: res.data[0].Type,
              })
            }
          })
        }
      }
    })
  },
  onLoad: function (options) {//Assistant_Sell_Intention
    this.iWant()
    this.youWant()

  },
  show: function () {
    console.log(this.data.wantList)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})