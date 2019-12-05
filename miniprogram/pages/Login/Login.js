const app = getApp()
var template = require('../../template/template.js');
var util=require('../../utils/util.js');
Page({

  data: {
    avatarUrl: '',
    userInfo: {},
  },

onLoad: function () {
 
  },

  onGetOpenid: function (e)  {
    let that=this
    wx.getUserInfo({
      success: res => {
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          userInfo: res.userInfo
        })
        wx.setStorage({
          key: "Userinfo",
          data: this.data.userInfo
        })
        // 调用云函数
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {

            console.log('[云函数] [login] user openid: ', res.result.openid)
            app.globalData.openid = res.result.openid

            wx.setStorageSync("myOpenId", res.result.openid);
            
            const db = wx.cloud.database({ env: 'textllinpro-5br77' })
            return db.collection('Assistant_User').add({ //添加人
              data: {
                Username: that.data.userInfo.nickName,
                Last_to_Reply: Date.now(),
                Last_toup_Time: Date.now(),
                User_head_url: that.data.userInfo.avatarUrl,
                Creat_user_Time: Date.now()
              }
            }).then(res => {
              console.log(res);
              wx.switchTab({
                url: '../Mine_page/Mine_page',
              })
            })  
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
            wx.showToast({
              title: '云函数:调用失败',
              icon: 'none',
              duration: 1500
            })
          }
        })


      }
    })

  }
})