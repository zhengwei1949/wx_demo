import { Movie } from 'class/Movie.js';

var app = getApp();
// ES6 module, class,promise, =>函数
Page({
  data: {
    movie: {},
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var movieId = options.id;
    var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
    console.log(url);
    var movie = new Movie(url);
    // var movieData = movie.getMovieData();  如果是同步用这个，异步用callback
    // var that = this;
    // movie.getMovieData(function (movie) {
    //   that.setData({
    //     movie: movie
    //   });
    // });
    // 第一个括号定于参数，然后箭头=>
    movie.getMovieData((movie) => {
      this.setData({
        movie: movie
      })
    });
  },

  /* 查看图片 */
  viewMoviePostImg: function (event) {
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接，不填则默认为 urls 的第一张
      urls: [src], // 需要预览的图片http链接列表
    });
  }
})