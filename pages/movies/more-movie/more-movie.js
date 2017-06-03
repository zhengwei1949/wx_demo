// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require('../../../utils/util.js');

Page({
  data: {
    navigateTitle: "",
    requestUrl: "",
    movies: {},
    totalCount: 0,
    isEmpty: true,
    isAll: false, // 用于判断是否已经拉取到最后的数据，不能再拉取数据了
    isRequesting: false,  //用于判断是否已在请求数据
  },

  onLoad: function (options) {
    var category = options.category;
    this.setData({
      navigateTitle: category
    });
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.setData({
      requestUrl: dataUrl
    });
    util.http(dataUrl, this.processDoubanData);
  },

  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId,
    })
  },

  processDoubanData: function (moviesDouban) {
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

    // 如果要绑定新加载的数据，需要将旧有数据整合
    var totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      this.data.isEmpty = false;
      totalMovies = movies;
    }
    this.setData({
      movies: totalMovies,
    });
    if (movies.length > 0) {
      this.data.totalCount += movies.length;
    } else {
      this.data.isAll = true;
      wx.showToast({
        title: "已经没有新数据了",
        icon: "success",
        duration: 2000
      })
    }
    this.data.isRequesting = false;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
    wx.showNavigationBarLoading();
  },

  // onScrollLower: function (event) {
  //   var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
  //   util.http(nextUrl, this.processDoubanData);
  //   wx.showNavigationBarLoading();
  // },

  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    if (!this.data.isAll) {
      if (!this.data.isRequesting) {
        this.data.isRequesting = true;
        util.http(nextUrl, this.processDoubanData);
        wx.showNavigationBarLoading();
      }
    } else {
      wx.showToast({
        title: "已经没有新数据了",
        icon: "success",
        duration: 2000
      })
    }
  },

  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    this.data.isAll = false;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId,
    })
  },
})