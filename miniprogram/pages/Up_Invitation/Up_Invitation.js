//index.js
//获取应用实例
const db = wx.cloud.database({ env: 'textllinpro-5br77' })
var util = require("../../utils/util.js")
const _ = db.command
const app = getApp()

const myOpenId = wx.getStorageSync("myOpenId")
Page({
  data: {
    color1: "#3B49E0",
    color2: "#dbdbdb",
    size1: "40rpx",
    size2: "35rpx",
    flag: 0,
    upList: [

    ],

  },


  click: function (e) {
    if (e.currentTarget.id == "v1") {
      this.searchAssistantUp()
      this.setData({
        flag: 0,
        color2: "#dbdbdb",
        color1: "#3B49E0",
        size1: "40rpx",
        size2: "35rpx",
      })
    }
    else {
      this.someUpAssistant()
      this.setData({
        flag: 1,
        color1: "#dbdbdb",
        color2: "#3B49E0",
        size1: "35rpx",
        size2: "40rpx",
      })
    }
  },

  someUpAssistant: function ()//我点赞别人
  {
    var that = this
    this.setData({
      upList: []
    })
    db.collection('Assistant_Up').where({ //点赞列表有自己说明有人点赞
      _openid: myOpenId
    }).get({
      success: res => {
        for (var j = 0; j < res.data.length; j++) {
          let index = res.data.length - j - 1
          var upUserTimeHour = 'upList[' + index + '].upUserTimeHour';
          var upUserTimeDay = 'upList[' + index + '].upUserTimeDay';
          var upUserId = 'upList[' + index + '].upUserId';
          var upPostId = 'upList[' + index + '].upPostId';
          var time = util.formatTime(res.data[j].Time_s)//格式化时间
          console.log(time)
          that.setData({
            [upUserTimeHour]: time.substr(time.indexOf(" ") + 1, 5),//时
            [upUserTimeDay]: time.substr(time.indexOf("-") + 1, 5), //分
            [upUserId]: res.data[index].Up_id,  //点赞谁的id
            [upPostId]: res.data[index].Up_Post_id,//谁点赞的帖子id
          })

          db.collection('Assistant_DataSheet').where({
            _id: res.data[index].Up_Post_id
          }).get({
            success: res => {
              var context = 'upList[' + index + '].context';//获取帖子内容
              that.setData({
                [context]: res.data[0].Context
              })
            }
          })
          db.collection('Assistant_User').where({
            _openid: res.data[index].Up_id
          }).get({
            success: res => {
              let headUrl = 'upList[' + index + '].headUrl';//获取头像
              let userName = 'upList[' + index + '].userName';//获取名字
              that.setData({
                [headUrl]: res.data[0].User_head_url,
                [userName]: res.data[0].Username
              })
            }
          })
        }
      }
    })
  },

  searchAssistantUp: function ()//别人点赞我
  {
    var that = this
    this.setData({
      upList: []
    })
    db.collection('Assistant_Up').where({ //点赞列表有自己说明有人点赞
      Up_id: myOpenId
    }).get({
      success: res => {
        for (var j = 0; j < res.data.length; j++) {

          let index = res.data.length - j - 1
          var upUserTimeHour = 'upList[' + index + '].upUserTimeHour';
          var upUserTimeDay = 'upList[' + index + '].upUserTimeDay';
          var upUserId = 'upList[' + index + '].upUserId';
          var upPostId = 'upList[' + index + '].upPostId';
          var upOpenId = 'upList[' + index + '].upOpenId';
          var time = util.formatTime(res.data[j].Time_s)//格式化时间

          that.setData({
            [upUserTimeHour]: time.substr(time.indexOf(" ") + 1, 5),//时
            [upUserTimeDay]: time.substr(time.indexOf("-") + 1, 5), //分
            [upUserId]: res.data[index].Up_id,  //点赞谁的id
            [upPostId]: res.data[index].Up_Post_id,//谁点赞的帖子id
            [upOpenId]: res.data[index]._openid,//是谁点赞id
          })

          db.collection('Assistant_DataSheet').where({
            _id: res.data[index].Up_Post_id
          }).get({
            success: res => {
              var context = 'upList[' + index + '].context';//获取帖子内容
              that.setData({
                [context]: res.data[0].Context
              })
            }
          })
          db.collection('Assistant_User').where({
            _openid: res.data[index]._openid
          }).get({
            success: res => {
              let headUrl = 'upList[' + index + '].headUrl';//获取头像
              let userName = 'upList[' + index + '].userName';//获取名字
              that.setData({
                [headUrl]: res.data[0].User_head_url,
                [userName]: res.data[0].Username
              })
            }
          })
        }

      },

    })

  },
  gotoPost: function (e) {
    //wx.clearStorageSync("key")
    wx.setStorageSync('key', e.currentTarget.dataset)
    /*wx.setStorage({
      key: "key",
      data: 
    })*/
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '../Reply_page/Reply_page',
      success: function (res) { console.log("我去评论页啦！") },
      fail: function (res) { console.log("诶，我怎么还在原地？") }
    })
  },
  onLoad: function () {
    this.searchAssistantUp()
  },

})
