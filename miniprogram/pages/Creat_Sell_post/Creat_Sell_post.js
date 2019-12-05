const app = getApp()
var util = require('../../utils/util.js');
Page({

  data: {
    SellTypeindex: 0,
    number: 1,
    SellTypearr: ["邮寄","当面交易","自提"],
    PostType: '',
    avatarUrl: '../../images/user-unlogin.png',
    user_openid: app.globalData.openid,
    telValue: "",
    UserInfo: '',
    Price : 0
  },
  getInput: function (e) {
    this.setData({
      telValue: e.detail.value
    })
  },
  getPriceinput:function(e){
    this.setData({
      Price: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      SellTypeindex: e.detail.value
    })
  },
  clickimage: function (e) {
    var index = e.target.dataset.index
    //var current = e.target.dataset.src;
    wx.previewImage({
      //current: current, // 当前显示图片的http链接
      urls: [this.data.Filepath[index]], // 需要预览的图片http链接列表
    })
  },
  addImage: function (e) {
    var that = this
    wx.chooseImage({
      count: 6,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
      
        that.setData({
          Filepath: res.tempFilePaths,
          number: res.tempFilePaths.length + 1
        })
      }
    })
  },
  deleteImage: function (e) {
    var that = this
    var index = e.target.dataset.index
    console.log("+++++++++", index)

    var tempFilePaths = that.data.Filepath
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          tempFilePaths.splice(index, 1);
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        that.setData({
          Filepath: tempFilePaths,
          number: that.data.number - 1
        });
        console.log(that.data.Filepath);
      }
    })

  },
  upload: function () {
    
    var that = this

    let price = parseInt(this.data.Price);
    let SellTypeindex = this.data.SellTypeindex;
    if (that.data.telValue.length > 10 && price != 0 && that.data.number>1) {
      wx.showLoading({
        title: '上传中...',
      })
      Promise.all(that.data.Filepath.map((value) => {
        return wx.cloud.uploadFile({
          cloudPath: Date.now() + parseInt(Math.random() * 100) + value.match(/\.[^.]+?$/)[0],
          filePath: value,
        })
      })).then(res => {
        return res.map((res) => {
          return res.fileID
        });
      }).then(res => {

        console.log(app.globalData.openid)
        const _id = app.globalData.openid
        const db = wx.cloud.database({ env: 'textllinpro-5br77' })
        return db.collection('Assistant_Sell_DataSheet').add({ //添加帖子
          data: {
            Context: that.data.telValue,
            Photo_arr: res,
            Intention: [],
            Price: price,
            Intention_Record_num: 0,
            Deal_Type: that.data.SellTypearr[SellTypeindex],
            Time: util.formatTime(new Date()),
            Type: that.data.PostType,
          }
        }).then(res => {
          wx.hideLoading();
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000,
            success: function () {
              console.log(res)
              wx.switchTab({
                url: '../Main_page/Main_page',
              })
            }
          })
        }).catch((ex) => {
          console.log(ex);
        })
      })

    }
    else {
      wx.showToast({
        title: '请检查输入的数据是否有误！',
        duration: 1000,
        mask: true,
        icon: 'none',
      })
    }
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var that = this
    wx.getStorage({
      key: 'PostType',
      success(res) {
        that.setData({
          PostType: res.data
        })
      }
    })
    wx.getStorage({
      key: 'Userinfo',
      success(res) {
        that.setData({
          UserInfo: res
        })
      }
    })
  },

})