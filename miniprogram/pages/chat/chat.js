const db = wx.cloud.database({ env: 'textllinpro-5br77' })
var util = require("../../utils/util.js")
const _ = db.command
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myName:"",
    heName: "",
    myUrl: "",
    heUrl: "",
    chatId:"",
    chatMyOpenid: "",
    chatYouOpenid: "",
    type:"",
    telValue:"",
    chatList:[]
  },
  getInput: function (e) {
    this.setData({
      telValue: e.detail.value
    })
  },
  sendInf:function()//发送按钮
  {
    var that=this
    console.log("------------", this.data.chatId)
    if (this.data.telValue.length > 0 && this.data.telValue!=" ")
    {
      var time = JSON.stringify(util.formatTime(new Date())).replace(/"/g, "")
      var chatId = this.data.chatId
      var telValue=this.data.telValue
      var type = this.data.type
      console.log("-----", time, "-----", "-----", telValue, chatId, type )
      wx.cloud.callFunction({
        name: 'sendInf',
        data: {
          chatId: chatId,
          time: time,
          telValue: telValue,
          type: type
        },
        success: res => {
          console.log(res)
          this.iChatyou()
          this.youChatMe()
          that.setData({
            telValue: ""
          })
        }
      })
    }
    else
    {
      wx.showToast({
        title: '消息为空',
        icon: 'none',
        duration: 500,
        mask: true
      })
    }
    
  },
iChatyou:function()
{
  var that = this
  console.log("myOpenId      ",wx.getStorageSync("myOpenId"))
  console.log("chatOpenid      ", wx.getStorageSync("chatOpenid"))
  db.collection('Chat_Record').where({ //获取符合两个id的表
    _openid: wx.getStorageSync("myOpenId"),
    youOpenid: wx.getStorageSync("chatOpenid"),
  }).get({
    success: res => {
      console.log("uuuuuuuuuuuuuu", res.data)
      if (res.data.length != 0) {
        that.setData({
          type: 0,
          chatId: res.data[0]._id,
          chatMyOpenid: res.data[0]._openid,
          chatYouOpenid: res.data[0].youOpenid,
        })
        for (let i = 0; i < res.data[0].content.length; i++) {
          var content = 'chatList[' + i + '].content';
          var time = 'chatList[' + i + '].time';
          var who = 'chatList[' + i + '].who';
          that.setData({
            [content]: res.data[0].content[i],
            [time]: res.data[0].time[i],
            [who]: res.data[0].who[i],
          })
        }
      }
    }
  })
},
youChatMe:function()
{
  var that = this
  db.collection('Chat_Record').where({ //获取符合两个id的表
    _openid: wx.getStorageSync("chatOpenid"),
    youOpenid: wx.getStorageSync("myOpenId"),
  }).get({
    success: res => {
      console.log("xxxxxxxxxxxxxxx", res.data)
      if (res.data.length != 0) {
        that.setData({
          type: 1,
          chatId: res.data[0]._id,
          chatMyOpenid: res.data[0]._openid,
          chatYouOpenid: res.data[0].youOpenid,
        })
        for (let i = 0; i < res.data[0].content.length; i++) {
          var content = 'chatList[' + i + '].content';
          var time = 'chatList[' + i + '].time';
          var who = 'chatList[' + i + '].who';
          that.setData({
            [content]: res.data[0].content[i],
            [time]: res.data[0].time[i],
            [who]: res.data[0].who[i],
          })
        }
      }
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    this.iChatyou()
    this.youChatMe()
  
    db.collection('Assistant_User').where({
      _openid: wx.getStorageSync("myOpenId")//我的用户表
    }).get({
      success: res => {
        that.setData({
          myUrl: res.data[0].User_head_url,
          myName: res.data[0].Username,
        })
      }
    })
    db.collection('Assistant_User').where({
      _openid: wx.getStorageSync("chatOpenid")//他的用户表
    }).get({
      success: res => {
        that.setData({
          heUrl: res.data[0].User_head_url,
          heName: res.data[0].Username,
        })
      }
    })
   
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