var app = getApp()
var util = require('../../utils/util.js');
var buyallId = new Array()
var buyallUpId = new Array()
Page({

  data: {
    navbar: ['畅所欲言', '交易市场'],
    currentTab: 0,
    Sell_DataPost_arry: [],
    Sell_User_head_url_arry: [],
    Sell_Username_arry: [],
    UserId: '',//app.globalData.openid
  },

  /** 
       * 预览图片
       */
  previewImage: function (e) {
    //var current = e.target.dataset.src;
    wx.previewImage({
      //current: current, // 当前显示图片的http链接
      urls: [e.target.dataset.myimg], // 需要预览的图片http链接列表
    })
  },

  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    if (e.currentTarget.dataset.idx == 0) { this.get_DBinf(); }
    else { this.get_Sell_DBinf(); }
  },

  onLoad() {
    let that = this
    wx.getStorage({
      key: 'Userinfo',
      success(res) {
        //console.log(res.data) //userinfo
      }
    })
    //console.log(util.formatTime(new Date()));
    //this.get_DBinf();
    //this.navbarTap();
    this.get_Sell_DBinf();
  },

  Remove_Post: function (e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '请问是否删除本条树洞？',
      success: function (res) {
        if (res.confirm) {
          console.log(e.currentTarget.dataset.post_id)//事件的id
          wx.cloud.callFunction({
            name: 'Remove_Assistant_DataSheet',
            data: {
              youid: e.currentTarget.dataset.post_id,
            },
            success: function (res) {
              that.get_DBinf()
            }
          })
        }
      }
    })
  },

  onShow() {
    this.get_Sell_DBinf();
  },

  get_Sell_DBinf: function () {
    let that = this
    wx.getStorage({
      key: 'User_openid',
      success(res) {
        that.setData({
          UserId: res.data
        })
        const get_Sell_inf_db = wx.cloud.database()//{ env: 'textllinpro-5br77' }
        get_Sell_inf_db.collection('Assistant_Sell_DataSheet').where({
          _openid: res.data
        }).get({
          success: res => {
            that.setData({
              Sell_DataPost_arry: res.data
            })
            //console.log(res.data);
            Promise.all(res.data.map((item) => {
              return item._openid
            })).then(res => {
              let _ = get_Sell_inf_db.command;
              get_Sell_inf_db.collection('Assistant_User').where({
                _openid: _.in(res)
              }).get().then(res => {
                that.data.Sell_Username_arry = [];
                that.data.Sell_User_head_url_arry = [];
                for (let i = 0; i < that.data.Sell_DataPost_arry.length; i++) {
                  let openId = that.data.Sell_DataPost_arry[i]._openid;
                  for (let j = 0; j < res.data.length; j++) {
                    if (openId == res.data[j]._openid) {
                      that.data.Sell_Username_arry.push(res.data[j].Username);
                      that.data.Sell_User_head_url_arry.push(res.data[j].User_head_url);
                    }
                  }
                }
                that.setData({
                  Sell_Username_arry: that.data.Sell_Username_arry,
                  Sell_User_head_url_arry: that.data.Sell_User_head_url_arry
                });
                //console.log(that.data.Sell_Username_arry)
              })

            }).catch((ex) => {
              console.log(ex);
            })
          }
        })
      }
    })
  },
})

