var app = getApp();
Page({
    data: {
        hasUserInfo: false,
        userInfo: {},
    },
    onLoad: function () {
        this.setData({
            hasLogin: app.globalData.hasLogin
        });
        if (app.globalData.hasLogin) {
            this.getUserInfo();
        } else {
            this.login();
        };
        app.getUserOpenId(function (err, openid) {
            if (!err) {
                console.log(openid);
            } else {
                console.log('err:', err)
                self.setData({
                    loading: false
                })
            }
        })
    },
    onTap: function (event) {
        wx.switchTab({
            url: '/pages/post/post',
        })
    },
    login: function () {
        var that = this;
        wx.login({
            success: function (res) {
                app.globalData.hasLogin = true;
                that.setData({
                    hasLogin: true
                })
                that.getUserInfo();
                console.log(res);
            }
        })
    },
    getUserInfo: function () {
        var that = this;
        wx.getUserInfo({
            success: function (res) {
                that.setData({
                    hasUserInfo: true,
                    userInfo: res.userInfo
                })
                console.log(that.data);
                console.log(res);
            }
        })
    },
})