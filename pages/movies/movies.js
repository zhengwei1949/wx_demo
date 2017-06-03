var app = getApp();
var util = require("../../utils/util.js");

Page({
    data: {
        inTheaters: {},
        comingSoon: {},
        top250: {},
        containerShow: true,
        searchPanelShow: false,
        searchResult: {},
    },
    onLoad: function (options) {
        var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
        var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
        var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";

        this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
        this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
        this.getMovieListData(top250Url, "top250", "豆瓣Top250");
    },

    onMoreTap: function (event) {
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url: 'more-movie/more-movie?category=' + category,
        })
    },

    onMovieTap: function(event) {
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: 'movie-detail/movie-detail?id=' + movieId,
        })
    },

    onCancelImgTap: function(event) {
        console.log("onCancelImgTap");
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            searchResult: {},
        });
    },

    onBindFocus: function (event) {
        console.log("onBindFocus");    
        this.setData({
            containerShow: false,
            searchPanelShow: true,
        });
    },

    onBindConfirm: function (event) {
        console.log("onBindConfirm");            
        var text = event.detail.value;
        var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
        this.getMovieListData(searchUrl, "searchResult", "");
        wx.showNavigationBarLoading();
    },

    getMovieListData: function (url, settedKey, categoryTitle) {
        var that = this;
        wx.request({
            url: url,
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                "Content-Type": "json"
            }, // 设置请求的 header
            success: function (res) {
                // success
                // console.log(res);
                that.processDoubanData(res.data, settedKey, categoryTitle);
            },
            fail: function (error) {
                // fail
                console.log(error);
            },
            complete: function () {
                // complete
            }
        });
    },

    processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "...";
            }
            var temp = {
                stars: util.convertToStarsArray(subject.rating.stars),
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id,
            }
            movies.push(temp);
        }
        //让属性名动态赋值
        var readyData = {};
        readyData[settedKey] = {
            movies: movies,
            categoryTitle: categoryTitle,
        };
        this.setData(readyData);
        wx.hideNavigationBarLoading();
    },
})