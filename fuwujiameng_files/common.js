var whir = window.whir || {};
// 进度条.
whir.progressbar = {
    // 设置进度条(百分比)
    setProgressbar: function (appPath, obj) {
        var boxImage = appPath + "res/js/progressbar/images/progressbar.gif";
        var barImage = appPath + "res/js/progressbar/images/progressbg_blue.gif";
        obj.progressBar({ boxImage: boxImage, barImage: barImage });
    },

    // 设置进度条(分数比)
    setProgressbarByFraction: function (appPath, obj, max) {
        var m = 0;
        try {
            m = parseInt(max);
        } catch (e) { }
        var boxImage = appPath + "res/js/progressbar/images/progressbar.gif";
        var barImage = appPath + "res/js/progressbar/images/progressbg_blue.gif";
        obj.progressBar({ max: m, textFormat: 'fraction', boxImage: boxImage, barImage: barImage });
    }
};
