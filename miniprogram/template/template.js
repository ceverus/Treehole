//初始化数据
function tabbarinit() {
 return [
      { 
      "current":0,
     "pagePath": "/pages/Main_page/Main_page",
      "iconPath": "/images/sys.png",
     "selectedIconPath": "/images/sy.png",
      "text": "广场"
      },
      {
        "current": 0,
        "pagePath": "/pages/news/news",
        "iconPath": "/images/Creat_Topic/fbs.Creat_Topic",
        "selectedIconPath": "/images/fb.png",
        "text": "发布"

      },
      {
        "current": 0,
        "pagePath": "/pages/index/index",
        "iconPath": "/images/mines.png",
        "selectedIconPath": "/images/mine.png",
        "text": "我的"
      }   
    ]
}

function tabbarmain(bindName = "tabdata", id, target) {
  var that = target;
  var bindData = {};
  var otabbar = tabbarinit();
  otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
  otabbar[id]['current'] = 1;
  bindData[bindName] = otabbar
  that.setData({ bindData });
}


module.exports = {
  tabbar: tabbarmain
}