var postsData = require('../../../data/post-data.js'); //只能用相对路径
var app = getApp();     //获取全局变量
Page({
    data: {
        isPlayingMusic: false,
    },
    onLoad: function (option) {
        var postId = option.id;
        this.setData({
            currentPostId: postId
        });

        var postData = postsData.postList[postId];
        this.setData(postData);

        var postsCollected = wx.getStorageSync('posts_Collected');
        var resave = false;
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            if (postCollected) {
                this.setData({
                    collected: postCollected
                });
            } else {
                resave = true;
            }
        } else {
            var postsCollected = {};
            resave = true;
        }
        if (resave) {
            postsCollected[postId] = false;
            wx.setStorageSync('posts_Collected', postsCollected);
        }
        
        if(app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
            this.setData({
                isPlayingMusic: true,
            });
        }
        this.setAudioMonitor();
    },

    setAudioMonitor: function() {
        var that = this;
        wx.onBackgroundAudioPlay(function() {
            that.setData({
                isPlayingMusic: true,
            });
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentMusicPostId = that.data.currentPostId;
        });

        wx.onBackgroundAudioPause(function() {
            that.setData({
                isPlayingMusic: false,
            });
            app.globalData.g_isPlayingMusic = false;    
            app.globalData.g_currentMusicPostId = null;                    
        });

        wx.onBackgroundAudioStop(function() {
            that.setData({
                isPlayingMusic: false,
            });
            app.globalData.g_isPlayingMusic = false;    
            app.globalData.g_currentMusicPostId = null; 
        });
    },

    onCollectionTap: function (event) {
        this.getPostsCollectedAsy();
        // this.getpostsCollectedSyc();
    },

    getPostsCollectedAsy: function() {
        var that = this;
        wx.getStorage({
            key: "posts_Collected",
            success: function (res) {
                var postsCollected = res.data;
                var postCollected = postsCollected[that.data.currentPostId];
                // 收藏变成未收藏，未收藏变成收藏
                postCollected = !postCollected;
                postsCollected[that.data.currentPostId] = postCollected;
                that.showToast(postsCollected, postCollected);
            }
        });
    },

    getpostsCollectedSyc: function() {
        var postsCollected = wx.getStorageSync('posts_Collected');
        var postCollected = postsCollected[this.data.currentPostId];
        // 收藏变成未收藏，未收藏变成收藏
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        // this.showModal(postsCollected, postCollected);
        this.showToast(postsCollected, postCollected);
    },

    onShareTap: function (event) {
        this.showActionSheet();
    },

    showActionSheet: function () {
        wx.showActionSheet({
            itemList: [
                "分享给微信好友",
                "分享到朋友圈",
                "分享到到QQ",
                "分享到微博"
            ],
            itemColor: "#40580f",
            success: function (res) {
                if (res.tapIndex !== undefined) {
                    console.log(res.tapIndex);
                }
                if (res.cancel) {
                    console.log(res.cancel);
                }
            }
        });
    },

    showModal: function (postsCollected, postCollected) {
        var that = this;
        wx.showModal({
            title: "收藏",
            content: postCollected ? "收藏该文章？" : "取消收藏该文章？",
            showCancle: "true",
            cancelText: "取消",
            cancelColor: "#333",
            confirmText: "确认",
            confirmColor: "#405f80",
            success: function (res) {
                if (res.confirm) {
                    // 更新文章是否收藏的缓存值
                    wx.setStorageSync('posts_Collected', postsCollected);
                    // 更新数据绑定变量，实现图片切换
                    that.setData({
                        collected: postCollected
                    });
                }
            },

        })
    },

    showToast: function (postsCollected, postCollected) {
        // 更新文章是否收藏的缓存值
        wx.setStorageSync('posts_Collected', postsCollected);
        // 更新数据绑定变量，实现图片切换
        this.setData({
            collected: postCollected
        });
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功",
            icon: "success",
            duration: 1000
        })
    },

    onMusciTap: function(event) {
        if(this.data.isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false,
            });
        } else {
            wx.playBackgroundAudio({
                dataUrl: this.data.music.url,
                title: this.data.music.title,
                coverImgUrl: this.data.music.coverImg,
            });
            this.setData({
                isPlayingMusic: true,
            });       
        }
    },

})