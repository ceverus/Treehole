var app = getApp()
var util = require('../../utils/util.js');
var template = require('../../template/template.js');
var allId = new Array()
var allUpId = new Array()
Page({

  data: {
    currentTab: 0,
    DataPost_arry: [],
    User_head_url_arry: [],
    Up_array: [],
    Username_arry: [],
    UserId: '',//app.globalData.openid
    replyData: []
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
  },

  upclickbutton: function (e) {
    var that = this
    var ind = e.currentTarget.dataset.nowindex
    //console.log("Post_id:" + e.currentTarget.dataset.post_id)
    const postuserid = e.currentTarget.dataset.postopenid

    //console.log(this.data.Up_array[ind] == 0)

    if (this.data.Up_array[ind] == 0)//说明没点赞过
    {

      var nowup = 'Up_array[' + ind + ']'//设置为点赞过
      this.setData({
        [nowup]: 1
      })
      const db = wx.cloud.database({ env: 'textllinpro-5br77' })
      return db.collection('Assistant_Up').add({ //添加帖子
        data: {
          Up_Post_id: e.currentTarget.dataset.post_id,
          Up_id: e.currentTarget.dataset.postopenid,
          Time_s: Date.now()
        }
      }).then(res => {
        console.log("Assistant_Up OK!");
        console.log("Pick the post_id:" + e.currentTarget.dataset.post_id);
        wx.cloud.callFunction({
          name: 'Up_Assistant_Post',
          data: {
            Post_id: e.currentTarget.dataset.post_id,
          },
          success: function (res) {
            console.log("Up_Assistant_Post OK!");
            that.get_DBinf()
            wx.showToast({
              title: '已点赞',
              image: '../../images/Up_heart.png',
              duration: 2000
            })
          },
          fail: err => {
            console.log('error:', err)
          }
        })
      })
    }
    else {
      wx.showToast({
        title: '已点赞过',
        image: '../../images/Up_heart2.png',
        duration: 2000
      })
    }
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

  to_Reply: function (e) {
    let that = this
    console.log(e.currentTarget.dataset.post_id);//事件的id
    console.log(e.currentTarget.dataset.postopenid);//创建表的用户openid
    //console.log(e.currentTarget.dataset)
    that.setData({
      replyData: e.currentTarget.dataset
    })
    console.log(that.data.replyData)
    wx.setStorage({
      key: "key",
      data: that.data.replyData
    })
    wx.navigateTo({

      url: '../Reply_page/Reply_page',
      success: function (res) { console.log("我去评论页啦！") },
      fail: function (res) { console.log("诶，我怎么还在原地？") }
    })
  },

  onShow() {
    this.get_DBinf();
  },

  get_DBinf: function () {
    let that = this
    wx.getStorage({
      key: 'User_openid',
      success(res) {
        that.setData({
          UserId: res.data
        })
        ////
        var db = wx.cloud.database()//{ env: 'textllinpro-5br77' }
        let userid = res.data;
        console.log("My openid:" + res.data);
        db.collection('Assistant_Up').where({//获取自己的点赞列表
          _openid: userid
        }).get({
          success: res => {


            for (var i = 0; i < res.data.length; i++) {
              allUpId[i] = res.data[i].Up_Post_id//点赞列表赋给allUpId
            }

            db.collection('Assistant_DataSheet').get({
              success: res => {
                //console.log("Assistant_DataSheet Res"+res);
                that.setData({
                  alldata: res.data//所有的用户列表数据
                })
                for (var i = 0; i < res.data.length; i++) {
                  allId[i] = res.data[i]._id  //所有的用户列表_id
                  if (allUpId.indexOf(allId[i]) == -1) {
                    var item = 'Up_array[' + i + ']'
                    that.setData({
                      [item]: 0
                    })
                  }
                  else {
                    var item = 'Up_array[' + i + ']'
                    that.setData({
                      [item]: 1
                    })
                  }
                }
                //console.log(that.data.Up_array)
              }
            })
          },
        })
        const get_inf_db = wx.cloud.database()//{ env: 'textllinpro-5br77' }
        get_inf_db.collection('Assistant_DataSheet').where({
          _openid: res.data
        }).get({
          success: res => {
            that.setData({
              DataPost_arry: res.data
            })
            Promise.all(res.data.map((item) => {
              return item._openid
            })).then(res => {
              let _ = get_inf_db.command;
              get_inf_db.collection('Assistant_User').where({
                _openid: _.in(res)
              }).get().then(res => {
                that.data.Username_arry = [];
                that.data.User_head_url_arry = [];
                for (let i = 0; i < that.data.DataPost_arry.length; i++) {
                  let openId = that.data.DataPost_arry[i]._openid;
                  for (let j = 0; j < res.data.length; j++) {
                    if (openId == res.data[j]._openid) {
                      that.data.Username_arry.push(res.data[j].Username);
                      that.data.User_head_url_arry.push(res.data[j].User_head_url);
                    }
                  }
                }
                that.setData({
                  Username_arry: that.data.Username_arry,
                  User_head_url_arry: that.data.User_head_url_arry
                });
                //console.log(that.data.Username_arry)
              })

            }).catch((ex) => {
              console.log(ex);
            })

          }
        })

      }
    })

  },
  /*get_DBinf: function () {
    let that = this
    wx.getStorage({
      key: 'User_openid',
      success(res) {
        that.setData({
          UserId: res.data
        })
        console.log(res.data);
        const get_inf_db = wx.cloud.database()//{ env: 'textllinpro-5br77' }
        get_inf_db.collection('Assistant_DataSheet').where({
          _openid: res.data
        }).get({
          success: res => {
            that.setData({
              DataPost_arry: res.data
            })
            Promise.all(res.data.map((item) => {
              return item._openid
            })).then(res => {
              let _ = get_inf_db.command;
              get_inf_db.collection('Assistant_User').where({
                _openid: _.in(res)
              }).get().then(res => {
                that.data.Username_arry = [];
                that.data.User_head_url_arry = [];
                for (let i = 0; i < that.data.DataPost_arry.length; i++) {
                  let openId = that.data.DataPost_arry[i]._openid;
                  for (let j = 0; j < res.data.length; j++) {
                    if (openId == res.data[j]._openid) {
                      that.data.Username_arry.push(res.data[j].Username);
                      that.data.User_head_url_arry.push(res.data[j].User_head_url);
                    }
                  }
                }
                that.setData({
                  Username_arry: that.data.Username_arry,
                  User_head_url_arry: that.data.User_head_url_arry
                });
              })

            }).catch((ex) => {
              console.log(ex);
            })

          }
        })



      },

    })

  },*/
})
