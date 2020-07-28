
$.fn.UploadRun = function (opt) {
    //语言版本
    languageOpt = {
        cn: {
            unSupportMsg: '该上传插件不支持您的浏览器！如果您使用的是IE浏览器，请尝试升级 flash 播放器',
            browseMsg: '点击选择文件',
            keepAddMsg: '继续添加',
            allowTypeMsg: '支持格式：',
            delMsg: '删除',
            rightMsg: '向右旋转',
            leftMsg: '向左旋转',
            overMaxMsg: '文件大小超出',
            pauseMsg: '上传暂停',
            failedMsg: '上传失败，请重试',
            previewMsg: '预览中',
            notPreviewMsg: '不能预览',
            selectedMsg: '选中@0个文件，共@1。',
            successmsg: '已成功上传@0，上传失败@1',
            countMsg: '共@0张（@1），已上传@2张',
            failedCountMsg: '，失败@0张',
            stopMsg: '暂停上传',
            continueMsg: '继续上传',
            startMsg: '开始上传',
            q_TYPE_DENIED: opt.fileExtMsg || "请选择支持的文件格式！",
            q_EXCEED_NUM_LIMIT: "单次只能上传50个文件！",
            q_EXCEED_SIZE_LIMIT: "单次上传的文件总量不能超过 @0KB！",
            q_EXCEED_SIZE: opt.maxSizeMsg || "单个文件容量过大,最大 @0KB！",
            q_DUPLICATE: "选择了重复文件！",

        },
        en: {
            unSupportMsg: 'WebUploader does not support the browser you are using.',
            browseMsg: 'Browse',
            keepAddMsg: 'Keep adding',
            allowTypeMsg: 'Allow upload format:',
            delMsg: 'Delete',
            rightMsg: 'Rotate right',
            leftMsg: 'Rotate left',
            overMaxMsg: 'File size exceeds maximum',
            pauseMsg: 'Pause',
            failedMsg: 'Upload failed,please try agains',
            previewMsg: 'Preview',
            notPreviewMsg: "Can't preview",
            selectedMsg: 'Selected @0 files，Total @1.',
            successmsg: 'Success @0，fail@1',
            countMsg: 'Total @0(@1)，Success @',
            failedCountMsg: '，fail @0',
            stopMsg: 'Pause',
            continueMsg: 'Continue',
            startMsg: 'Start',
            q_TYPE_DENIED: opt.fileExtMsg || "Please select a supported file format!",
            q_EXCEED_NUM_LIMIT: "Only 50 files can be uploaded at a single time!",
            q_EXCEED_SIZE_LIMIT: "Total file uploads cannot exceed @0KB！",
            q_EXCEED_SIZE: opt.maxSizeMsg || "The file is too large,maximum @0KB!",
            q_DUPLICATE: "Duplicate file selected!",

        }
    };

    var $ = jQuery,

        $wrap = $(opt.fileId),

        swfUrl = window.location.protocol + '//' + window.location.host + $("script[websiteurl]").attr("websiteurl") + 'Res/webuploader/Uploader.swf',

        uploadUrl = window.location.protocol + '//' + window.location.host + $("script[websiteurl]").attr("websiteurl") + 'Ajax/WhirUpload.aspx?formId=' + opt.formId + '&isPic=' + (opt.isPic ? '1' : '0'),

        // 图片容器
        $queue = $('<ul class="filelist"></ul>')
            .appendTo($wrap.find('.queueList')),

        // 状态栏，包括进度和控制按钮
        $statusBar = $wrap.find('.statusBar'),

        // 文件总体选择信息。
        $info = $statusBar.find('.info'),

        // 上传按钮
        $upload = $wrap.find('.uploadBtn'),

        // 没选择文件之前的内容。
        $placeHolder = $wrap.find('.placeholder'),

        // 总体进度条
        $progress = $statusBar.find('.progress').hide(),

        // 添加的文件数量
        fileCount = 0,

        // 添加的文件总大小
        fileSize = 0,

        //语言版本 cn-中文，en-英文
        lang = opt.lang || "cn",

        // 优化retina, 在retina下这个值是2
        ratio = window.devicePixelRatio || 1,

        // 缩略图大小
        thumbnailWidth = 110 * ratio,
        thumbnailHeight = 110 * ratio,

        // 可能有pedding, ready, uploading, confirm, done.
        state = 'pedding',

        // 所有文件的进度信息，key为file id
        percentages = {},

        supportTransition = (function () {
            var s = document.createElement('p').style,
                r = 'transition' in s ||
                    'WebkitTransition' in s ||
                    'MozTransition' in s ||
                    'msTransition' in s ||
                    'OTransition' in s;
            s = null;
            return r;
        })(),

        // WebUploader实例
        uploader;

    if (!WebUploader.Uploader.support()) {
        alert(languageOpt[lang]['unSupportMsg']);
        throw new Error(languageOpt[lang]['unSupportMsg']);
    }

    // 实例化
    uploader = WebUploader.create({
        pick: {
            id: opt.filePicker,
            label: languageOpt[lang]['browseMsg'],
            multiple: opt.isMulti
        },
        dnd: opt.fileId + ' .queueList',
        paste: document.body,
        //上传类型
        accept: {
            title: 'Images',
            extensions: opt.fileExt ? opt.fileExt : 'gif,jpg,jpeg,bmp,png',
            mimeTypes: opt.isPic ? 'image/*' : ''
        },

        // swf文件路径
        swf: swfUrl,
        //是否允许拖拽
        disableGlobalDnd: true,
        //分片上传
        chunked: true,
        //上传文件接收地址
        server: uploadUrl,
        //最多选择文件数量
        fileNumLimit: 50,
        //总文件大小
        fileSizeLimit: opt.size ? opt.size * 20 * 1024 : 200 * 1024 * 1024,    // 200 M   文件大小限制
        //单个文件大小                               
        fileSingleSizeLimit: opt.size ? opt.size * 1024 : 5 * 1024 * 1024    // 5 M  单文件大小限制
    });

    // 添加“添加文件”的按钮，
    uploader.addButton({
        id: opt.filePicker2,
        label: languageOpt[lang]['keepAddMsg']
    });

    $placeHolder.append("<div>" + languageOpt[lang]['allowTypeMsg'] + opt.fileExt + "</div>");


    // 当有文件添加进来时执行，负责view的创建
    function addFile(file) {
        var $li = $('<li id="' + file.id + '">' +
            '<p class="title">' + file.name + '</p>' +
            '<p class="imgWrap"></p>' +
            '<p class="progress"><span></span></p>' +
            '</li>'),

            $btns = $('<div class="file-panel">' +
                '<span class="cancel">' + languageOpt[lang]['delMsg'] + '</span>' +
                '<span class="rotateRight">' + languageOpt[lang]['rightMsg'] + '</span>' +
                '<span class="rotateLeft">' + languageOpt[lang]['leftMsg'] + '</span></div>').appendTo($li),
            $prgress = $li.find('p.progress span'),
            $wrap = $li.find('p.imgWrap'),
            $info = $('<p class="error"></p>'),

            showError = function (code) {
                switch (code) {
                    case 'exceed_size':
                        text = languageOpt[lang]['overMaxMsg'];
                        break;

                    case 'interrupt':
                        text = languageOpt[lang]['pauseMsg'];
                        break;

                    default:
                        text = languageOpt[lang]['failedMsg'];
                        break;
                }

                $info.text(text).appendTo($li);
            };

        if (file.getStatus() === 'invalid') {
            showError(file.statusText);
        } else {
            // @todo lazyload
            $wrap.text(languageOpt[lang]['previewMsg']);
            uploader.makeThumb(file, function (error, src) {
                if (error) {
                    $wrap.text(languageOpt[lang]['notPreviewMsg']);
                    return;
                }

                var img = $('<img src="' + src + '">');
                $wrap.empty().append(img);
            }, thumbnailWidth, thumbnailHeight);

            percentages[file.id] = [file.size, 0];
            file.rotation = 0;
            $upload.removeClass("disabled");
        }

        file.on('statuschange', function (cur, prev) {
            if (prev === 'progress') {
                $prgress.hide().width(0);
            } else if (prev === 'queued') {
                $li.off('mouseenter mouseleave');
                $btns.remove();
            }

            // 成功
            if (cur === 'error' || cur === 'invalid') {
                console.log(file.statusText);
                showError(file.statusText);
                percentages[file.id][1] = 1;
            } else if (cur === 'interrupt') {
                showError('interrupt');
            } else if (cur === 'queued') {
                percentages[file.id][1] = 0;
            } else if (cur === 'progress') {
                $info.remove();
                $prgress.css('display', 'block');
            } else if (cur === 'complete') {
                $li.append('<span class="success"></span>');
            }

            $li.removeClass('state-' + prev).addClass('state-' + cur);
        });

        $li.on('mouseenter', function () {
            $btns.stop().animate({ height: 30 });
        });

        $li.on('mouseleave', function () {
            $btns.stop().animate({ height: 0 });
        });

        $btns.on('click', 'span', function () {
            var index = $(this).index(),deg;

            switch (index) {
                case 0:
                    uploader.removeFile(file);
                    return;

                case 1:
                    file.rotation += 90;
                    break;

                case 2:
                    file.rotation -= 90;
                    break;
            }

            if (supportTransition) {
                deg = 'rotate(' + file.rotation + 'deg)';
                $wrap.css({
                    '-webkit-transform': deg,
                    '-mos-transform': deg,
                    '-o-transform': deg,
                    'transform': deg
                });
            } else {
                $wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');
            }
        });

        $li.appendTo($queue);
    }

    // 负责view的销毁
    function removeFile(file) {
        var $li = $('#' + file.id);

        delete percentages[file.id];
        updateTotalProgress();
        $li.off().find('.file-panel').off().end().remove();
    }

    function updateTotalProgress() {
        var loaded = 0,
            total = 0,
            spans = $progress.children(),
            percent;

        $.each(percentages, function (k, v) {
            total += v[0];
            loaded += v[0] * v[1];
        });

        percent = total ? loaded / total : 0;

        spans.eq(0).text(Math.round(percent * 100) + '%');
        spans.eq(1).css('width', Math.round(percent * 100) + '%');
        updateStatus();
    }

    function updateStatus() {
        var text = '', stats;

        if (state === 'ready') {
            text = languageOpt[lang]['selectedMsg'].replace("@0", fileCount).replace("@1", WebUploader.formatSize(fileSize));
        } else if (state === 'confirm') {
            stats = uploader.getStats();
            if (stats.uploadFailNum) {
                text = languageOpt[lang]['successmsg'].replace("@0", stats.successNum).replace("@1", stats.uploadFailNum);
            }

        } else {
            stats = uploader.getStats();
            text = languageOpt[lang]['countMsg'].replace("@0", fileCount).replace("@1", WebUploader.formatSize(fileSize)).replace("@2", stats.successNum);

            if (stats.uploadFailNum) {
                text = languageOpt[lang]['failedCountMsg'].replace("@0", stats.uploadFailNum);
            }
        }

        $info.html(text);
    }

    function setState(val) {
        var file, stats;

        if (val === state) {
            return;
        }

        $upload.removeClass('state-' + state);
        $upload.addClass('state-' + val);
        state = val;

        switch (state) {
            case 'pedding':
                $placeHolder.removeClass('element-invisible');
                $queue.parent().removeClass('filled');
                $queue.hide();
                $statusBar.addClass('element-invisible');
                uploader.refresh();
                break;

            case 'ready':
                $placeHolder.addClass('element-invisible');
                $(opt.filePicker2).removeClass('element-invisible');
                $queue.parent().addClass('filled');
                $queue.show();
                $statusBar.removeClass('element-invisible');
                uploader.refresh();
                break;

            case 'uploading':
                $(opt.filePicker2).addClass('element-invisible');
                $progress.show();
                $upload.text(languageOpt[lang]['stopMsg']);
                break;

            case 'paused':
                $progress.show();
                $upload.text(languageOpt[lang]['continueMsg']); startMsg
                break;

            case 'confirm':
                $progress.hide();
                $upload.text(languageOpt[lang]['startMsg']).addClass('disabled');

                stats = uploader.getStats();
                if (stats.successNum && !stats.uploadFailNum) {
                    setState('finish');
                    return;
                }
                break;
            case 'finish':
                $(opt.filePicker2).removeClass('element-invisible');
                stats = uploader.getStats();
                if (stats.successNum) {

                    //alert('上传成功');
                } else {
                    // 没有成功的图片，重设
                    state = 'done';
                    location.reload();
                }
                break;
        }

        updateStatus();
    }

    uploader.onUploadProgress = function (file, percentage) {
        var $li = $('#' + file.id),
            $percent = $li.find('.progress span');

        $percent.css('width', percentage * 100 + '%');
        percentages[file.id][1] = percentage;
        updateTotalProgress();
    };

    uploader.onFileQueued = function (file) {
        fileCount++;
        fileSize += file.size;

        if (fileCount === 1) {
            $placeHolder.addClass('element-invisible');
            $statusBar.show();
        }

        addFile(file);
        setState('ready');
        updateTotalProgress();
    };

    uploader.onFileDequeued = function (file) {
        fileCount--;
        fileSize -= file.size;

        if (!fileCount) {
            setState('pedding');
        }

        removeFile(file);
        updateTotalProgress();

    };
    // 文件上传成功
    uploader.on('uploadSuccess', function (file, response) {
        if (response.Result) {
            // 上传成功
            if (opt.isMulti)
                $(opt.fileUrl).val($(opt.fileUrl).val() + "*" + response.Msg);
            else
                $(opt.fileUrl).val(response.Msg);
        } else {
            // 上传错误或失败
            var $file = $("#" + file.id);
            $error = $('<p class="error"></p>');
            $error.text(response.Msg).appendTo($file);
            $file.find(".success").remove();
        }
    });

    uploader.on('all', function (type) {
        var stats;
        switch (type) {
            case 'uploadFinished':
                setState('confirm');
                break;
            case 'startUpload':
                setState('uploading');
                break;

            case 'stopUpload':
                setState('paused');
                break;
        }
    });

    uploader.onError = function (code) {
        switch (code) {
            case 'Q_TYPE_DENIED':
                alert(languageOpt[lang]['q_TYPE_DENIED']);
                break;
            case 'Q_EXCEED_NUM_LIMIT':
                alert(languageOpt[lang]['q_EXCEED_NUM_LIMIT']);
                break;
            case 'Q_EXCEED_SIZE_LIMIT':
                alert(languageOpt[lang]['q_EXCEED_SIZE_LIMIT'].replace("@0", opt.size ? opt.size * 20 : 200));
                break;
            case 'F_EXCEED_SIZE':
                alert(languageOpt[lang]['q_EXCEED_SIZE'].replace("@0", opt.size ? opt.size : 5));
                break;
            case 'F_DUPLICATE':
                alert(languageOpt[lang]['q_DUPLICATE']);
                break;
        }
    };

    $upload.on('click', function () {
        if ($(this).hasClass('disabled')) {
            return false;
        }

        if (state === 'ready') {
            uploader.upload();
        } else if (state === 'paused') {
            uploader.upload();
        } else if (state === 'uploading') {
            uploader.stop();
        }
    });

    $info.on('click', '.retry', function () {
        uploader.retry();
    });

    $info.on('click', '.ignore', function () {
        alert('todo');
    });

    $upload.addClass('state-' + state);

    updateTotalProgress();

    /*关闭上传框窗口后恢复上传框初始状态*/
    function closeUploader() {
        // 移除所有缩略图并将上传文件移出上传序列
        for (var i = 0; i < uploader.getFiles().length; i++) {
            // 将图片从上传序列移除
            uploader.removeFile(uploader.getFiles()[i]);

            // 将图片从缩略图容器移除
            var $li = $('#' + uploader.getFiles()[i].id);
            $li.off().remove();
        }
        setState('pedding');
        // 重置文件总个数和总大小
        fileCount = 0;
        fileSize = 0;
        // 重置uploader，目前只重置了文件队列
        uploader.reset();
        // 更新状态等，重新计算文件总个数和总大小
        updateStatus();

    }
    return {
        closeUploader: closeUploader,
        fileUrl: opt.fileUrl
    }
}

