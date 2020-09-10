//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    BleNumber: 'KC0520070065',
    machineNumber:''
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 查询全部
  doSelectAll: function () {
    var that = this
    wx.request({
      url: 'https://dev.xinashu.com/kckj/getMessage', //填写发送验证码接口
      method: "GET",
      data: {
        BleNumber: "KC0520030001"
      },
      //header: {'content-type': 'application/x-www-form-urlencoded'},
      success: function (res) {
        console.log(res.data)
        console.log(res.data.data.machineNumber)
        that.setData({
          machineNumber: res.data.data.machineNumber
        })
       
      }
    })
 
      
  },
  doSelectOne: function () {
    var that = this
    wx.request({
      url: 'https://192.168.2.167/kckj/adminLogin',
      method: 'POST',
      data:{
        BleNumber: 'KC0820040001',
        Password: '123456'
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function(res){
        
        if (res.data.code == false) {
          console.log(res.data)
        }

      }
    })
 
      
  }

})
