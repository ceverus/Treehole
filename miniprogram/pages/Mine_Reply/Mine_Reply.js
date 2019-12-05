const db = wx.cloud.database({ env: 'textllinpro-5br77' })
var util = require("../../utils/util.js")
const _ = db.command
const app = getApp()
const myOpenId = wx.getStorageSync("myOpenId")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color1: "#3B49E0",
    color2: "#dbdbdb",
    size1: "40rpx",
    size2: "35rpx",
    discussList:
      [

      ]
  },
  click: function (e) {
    if (e.currentTarget.id == "v1") {
      this.discussMe()
      this.setData({
        flag: 0,
        color2: "#dbdbdb",
        color1: "#3B49E0",
        size1: "40rpx",
        size2: "35rpx",
      })
    }
    else {
      this.myDiscuss()
      this.setData({
        flag: 1,
        color1: "#dbdbdb",
        color2: "#3B49E0",
        size1: "35rpx",
        size2: "40rpx",
      })
    }
  },
  myDiscuss() {
    var that = this
    this.setData({
      discussList: []
    })
    console.log("opneid....", myOpenId)
    db.collection('My_ReplyData').where({ //我的评论
      _openid: myOpenId
    }).get({
      success: res => {

        for (let i = 0; i < res.data.length; i++) {
          let index = res.data.length - i - 1
          var discussUserId = 'discussList[' + index + '].discussUserId';
          var discussPostId = 'discussList[' + index + '].discussPostId';
          var discussTimeHour = 'discussList[' + index + '].discussTimeHour';
          var discussTimeDay = 'discussList[' + index + '].discussTimeDay';
          var time = util.formatTime(res.data[i].time)
          that.setData({
            [discussUserId]: res.data[index].PostUserId,
            [discussPostId]: res.data[index].PageId,
            [discussTimeHour]: time.substr(time.indexOf(" ") + 1, 5),
            [discussTimeDay]: time.substr(time.indexOf("-") + 1, 5),
          })
          db.collection('Assistant_User').where({
            _openid: res.data[index].PostUserId
          }).get({
            success: res => {
              console.log("----", res.data)
              var postUserName = 'discussList[' + index + '].postUserName';
              var postHeadUrl = 'discussList[' + index + '].postHeadUrl';
              that.setData({
                [postUserName]: res.data[0].Username,
                [postHeadUrl]: res.data[0].User_head_url,
              })

            }
          })
          db.collection('Assistant_DataSheet').where({
            _id: res.data[index].PageId,
          }).get({
            success: res => {
              var postContext = 'discussList[' + index + '].postContext';
              that.setData({
                [postContext]: res.data[0].Context,
              })
            }
          })
        }

      }
    })
  },
  discussMe: function () {
    var that = this
    this.setData({
      discussList: []
    })
    db.collection('My_ReplyData').where({ //别人评论我
      PostUserId: myOpenId
    }).get({
      success: res => {
        console.log(res.data)
        for (let i = 0; i < res.data.length; i++) {
          let index = res.data.length - i - 1
          var postOpenid = 'discussList[' + index + '].discussUserId';
          var discussPostId = 'discussList[' + index + '].discussPostId';
          var discussTimeHour = 'discussList[' + index + '].discussTimeHour';
          var discussTimeDay = 'discussList[' + index + '].discussTimeDay';
          var time = util.formatTime(res.data[i].time)//格式化时间
          that.setData({
            [postOpenid]: res.data[index]._openid,
            [discussPostId]: res.data[index].PageId,
            [discussTimeHour]: time.substr(time.indexOf(" ") + 1, 5),
            [discussTimeDay]: time.substr(time.indexOf("-") + 1, 5),
          })
          console.log("-------", res.data[index]._openid)
          db.collection('Assistant_User').where({
            _openid: res.data[index]._openid
          }).get({
            success: res => {
              var postUserName = 'discussList[' + index + '].postUserName';
              var postHeadUrl = 'discussList[' + index + '].postHeadUrl';
              that.setData({
                [postUserName]: res.data[0].Username,
                [postHeadUrl]: res.data[0].User_head_url,
              })

            }
          })
          db.collection('Assistant_DataSheet').where({
            _id: res.data[index].PageId,
          }).get({
            success: res => {
              var postContext = 'discussList[' + index + '].postContext';
              that.setData({
                [postContext]: res.data[0].Context,
              })
            }
          })
        }
      }
    })
  },
  gotoPost: function (e) {
    //wx.clearStorageSync("key")
    wx.setStorageSync('key', e.currentTarget.dataset)
   /* wx.setStorage({
      key: "key",
      data: e.currentTarget.dataset
    })*/
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '../Reply_page/Reply_page',
      success: function (res) { console.log("我去评论页啦！") },
      fail: function (res) { console.log("诶，我怎么还在原地？") }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.discussMe()
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