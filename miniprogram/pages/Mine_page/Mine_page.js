const db = wx.cloud.database({ env: 'textllinpro-5br77' })
const _ = db.command
Page({

  data: {
    replyNumber: 0,
    toupNumber: 0,
    chatNumber: 0,
    hiddenmodalput: true,
    Username:'',
    Join_Time:'',
    User_head_url:'',
    U_id:'',
    Oldname:''

  },
  //点击按钮
  modalinput: function () {
    this.setData({
      Oldname: this.data.Username,
      hiddenmodalput: !this.data.hiddenmodalput
    })
    console.log(this.data.Oldname)
  },
  //取消按钮
  cancel: function () {
    let that=this
    that.setData({
      hiddenmodalput: true
    });
    if (that.data.Oldname != that.data.Username){
      that.setData({
        Username:that.data.Oldname
      });
    }
  },
  //确认修改名字
  confirm: function (e) {
    let that=this
    this.setData({
      hiddenmodalput: true
    })
    if(this.data.Oldname!=this.data.Username){
      wx.cloud.callFunction({
        name: 'Assistant_update_Username',
        data: {
          Usernewname: that.data.Username,
          User_inf_id: that.data.U_id
        },
        success: function (res) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1500
          })
        },
        fail: err => {
          console.log('error:', err)
        }
      })
    }

  },
  ChangeName: function(e){
    this.setData({
      Username: e.detail.value
    })
  },
  discussbutton: function () {
    var data = new Date()
    wx.cloud.callFunction({
      name: 'upDateDiscuss',
      data: {
        youid: wx.getStorageSync("myOpenId"),
        time: data.getTime()
      },
      success: function (res) {
        console.log(res, "++++++++++++++")
      }
    })
    this.setData({
      replyNumber: 0
    })
    wx.navigateTo({
      url: '../Mine_Reply/Mine_Reply',
    })
  },
 
  upbutton: function () {
    var data = new Date()
    console.log(wx.getStorageSync("myOpenId"), "--------", data)
    wx.cloud.callFunction({
      name: 'upDateUp',
      data: {
        youid: wx.getStorageSync("myOpenId"),
        time: data.getTime()
      },
      success: function (res) {
        console.log(res, "-------------")
      }
    })
    this.setData({
      toupNumber: 0
    })
    wx.navigateTo({
      url: '../Up_Invitation/Up_Invitation',
    })

  },
  chatbutton: function () {
    /*
    var data = new Date()
    console.log(wx.getStorageSync("myOpenId"), "--------", data)
    wx.cloud.callFunction({
      name: 'upDateChat',
      data: {
        youid: wx.getStorageSync("myOpenId"),
        time: data.getTime()
      },
      success: function (res) {
        console.log(res, "-------------")
      }
    })
    */
    this.setData({
      chatNumber: 0
    })
  wx.navigateTo({
      url: '../Mine_message/Mine_message',
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.hideTabBarRedDot({
      index: 1,
    })
    let Nowtime=Date.now();
    db.collection('Assistant_User').where({
      _openid: wx.getStorageSync("myOpenId"),
    }).get({
      success: res => {
       // console.log(res);
        if (86400000>(Nowtime - res.data[0].Creat_user_Time))
        {
          Nowtime=1;
        }
        else{
          Nowtime=parseInt((Nowtime - res.data[0].Creat_user_Time) / 86400000)+1
        }
        console.log(Nowtime)
        that.setData({
          Username:res.data[0].Username,
          User_head_url:res.data[0].User_head_url,
          Last_to_Reply: res.data[0].Last_to_Reply,
          Last_toup_Time: res.data[0].Last_toup_Time,
          U_id:res.data[0]._id,
          Join_Time: Nowtime
        })
        db.collection('Assistant_Up').where({
          Up_id: wx.getStorageSync("myOpenId"),
        }).get({
          success: res => {
            for (var i = 0; i < res.data.length; i++) {
             // console.log("#######", res.data[i].Time_s)
              if (res.data[i].Time_s > that.data.Last_toup_Time) {
                that.setData({
                  toupNumber: that.data.toupNumber + 1
                })

              }
            }
          }
        })
        db.collection('My_ReplyData').where({
          PostUserId: wx.getStorageSync("myOpenId"),
        }).get({
          success: res => {
           // console.log(res.data)
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].time > that.data.Last_toup_Time) {
                that.setData({
                  replyNumber: that.data.replyNumber + 1
                })
              }
            }
          }
        })
        db.collection('Assistant_Sell_Intention').where({
          buypostopenid: wx.getStorageSync("myOpenId"),
        }).get({
          success: res => {
            console.log("-------", res.data)
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].Time_s > that.data.Last_toup_Time) {//改成最后进入聊天的时间
                that.setData({
                  chatNumber: that.data.chatNumber + 1
                })
              }
            }
          }
        })
      }
    })
  },

  uploadhead:function(){
    let that=this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
          Promise.all(res.tempFilePaths.map((value) => {
            return wx.cloud.uploadFile({
              cloudPath: Date.now() + parseInt(Math.random() * 100) + value.match(/\.[^.]+?$/)[0],
              filePath: value,
            })
          })).then(res => {
            return res.map((res) => {
              return res.fileID
            });
          }).then(res => {
            that.setData({
              User_head_url:res[0]
            })
            wx.cloud.callFunction({
              name: 'Assistant_Up_Userhead',
              data: {
                User_head: res[0],
                User_inf_id:that.data.U_id
              },
              success: function (res) {
                wx.showToast({
                  title: '修改成功',
                  icon: 'success',
                  duration: 1500
                })
              },
              fail: err => {
                console.log('error:', err)
              }
            })
          }).catch((exp) => {
            console.log(exp);
          })

      }
    });

  }, ShowAboutus:function()
  {
        wx.showToast({
         title: '没有名字组.',
          image: '../../images/zhichi.png',
          duration: 3000
        })
  },
  toMinemypost:function(){
    wx.navigateTo({
      url: '../Mine_Mypost/Mine_Mypost',
    })
  },
  toMineMySell:function(){
    wx.navigateTo({
      url: '../Mine_MySell/Mine_MySell',
    })
  },
})