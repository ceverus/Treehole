const app=getApp()
Page({
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.cloud) {
      wx.showToast({
        title: '尚未登录',
        icon: 'none',
        duration: 1500
      })
      return
    }
    // 判断是否授权
    wx.getSetting({
      success: res => {
        //console.log(res.authSetting);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              //console.log('[云函数] [login] user openid: ', res.result.openid)
              app.globalData.openid = res.result.openid
              wx.setStorageSync("myOpenId", res.result.openid);
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
                  wx.setStorage({
                    key: "User_openid",
                    data: app.globalData.openid
                  })
                  
                  wx.switchTab({
                    url: '../Main_page/Main_page',
                  })
                }
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
        else{
          wx.redirectTo({
            url: '../Login/Login',
          })
        }
      }
    })

  },
})