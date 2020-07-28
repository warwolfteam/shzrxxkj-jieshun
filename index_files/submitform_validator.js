//站点目录，说明没有虚拟目录时为"",有时为"/虚拟目录名称"
if (!window.whir) window.whir = {};
var _siteAppPath = "";
var editData = [];
var loadSuccess;
// 站点相关.
whir.site = {
    // 获取应用程序路径.
    getAppPath: function () {
        if (_siteAppPath == "") {
            _siteAppPath = $("script[websiteurl]").attr("websiteurl");
        }
        return _siteAppPath;
    }
};

// 表单验证器.
whir.formvalidator = {
    ErrorItem: [],
    ErrorMessage: [],
    validate: function (obj, mode, formid) {
        var objForm;
        if (document.all)   // ie下获取表单对象
            objForm = event.srcElement.form || theForm || event.srcElement || document.aspnetForm;
        else objForm = document.aspnetForm;
        var formElement = document.getElementById(formid);
        var objSpans = formElement.getElementsByTagName("span");

        var count = objSpans.length;
        this.ErrorMessage.length = 1;
        this.ErrorItem.length = 1;
        this.ErrorItem[0] = objSpans;
        // 传入单一验证对象时, 只验证传入的对象.
        if (obj) count = 1;
        for (var i = 0; i < count; i++) {
            var objSpan = obj;
            if (!objSpan) {
                objSpan = objSpans[i];
            }
            with (objSpan) {
                //获取要验证的控件ID、Name
                var validatorfor = getAttribute("validatorfor");
                if (validatorfor == null || validatorfor == "")
                    continue;
                this.clearState(objSpan);
                var value = $("#"+formid).find("input[name='" + validatorfor + "']").val();
                if (value == null) {//处理textarea和select
                    if ($("#" + formid).find("[name^='" + validatorfor + "']").is("select")) {
                        value =  $("#" + formid).find("#" + validatorfor + " :selected").val();
                    }
                    else {
                        var textareaid = "#" + validatorfor;
                        value = $("#" + formid).find(textareaid).val();
                    }
                }
                //验证必填
                var required = getAttribute("required");
                if (value == null) {
                    continue;
                }
                value = $.trim(value);
                //判断是否为单选按钮组
                if ($("#" + formid).find("input[name^='" + validatorfor + "']").attr("type") == 'radio') {
                    value = $("#" + formid).find("input[groupname='" + validatorfor + "']:checked").val();
                }
                //判断是否为多选按钮
                else if ($("#" + formid).find("input[name='" + validatorfor + "']").attr("type") == 'checkbox') {
                    value = $("#" + formid).find("input[name='" + validatorfor + "']:checked").val();
                }

                if (required != null) {
                    if (required.toLowerCase() == "true") {
                        if (value == undefined || value.length < 1) {
                            this.addError(validatorfor, getAttribute("requiredmsg") == null ? "必填" : getAttribute("requiredmsg"));
                            continue;
                        }
                    }
                }

                //获取正则表达式
                var regExpPast = true;
                var thisRegExp = getAttribute("regexp");
                if (thisRegExp != null && thisRegExp != "") {
                    var re = new RegExp(thisRegExp);
                    if (value != "") {
                        if (re.test(value))//验证
                        {
                            // alert("验证通过");
                        }
                        else {
                            regExpPast = false;
                            var errmsg = getAttribute("errmsg");
                            if (errmsg == null || errmsg == "") {
                                errmsg = "验证失败";
                            }
                            this.addError(validatorfor, errmsg);
                        }
                    }
                }
                //ajax验证值是否唯一
                if (regExpPast) {
                    var onlyObj = $("#" + formid).find("input[name='" + validatorfor + "']");
                    if (onlyObj != null) {
                        var only = onlyObj.attr("only");
                        if (only == "true" || only == "True") {
                            ajaxPast = onlyObj.attr("ajaxpast");
                            if (ajaxPast == 0) {
                                var onlymsg = getAttribute("onlymsg");
                                if (onlymsg == null || onlymsg == "") {
                                    onlymsg = "值不唯一";
                                } else {
                                    this.addError(validatorfor, onlymsg);
                                }
                            }
                        }
                    }
                }
            }
        }
        if (this.ErrorMessage.length > 1) {
            mode = mode || 1;
            if (mode == 1) {
                var message = this.ErrorMessage.join("\r\n");
                alert(message);
            }
            return false;
        }
        return true;
    },
    clearState: function (elem) {
        with (elem) {
            if (style.color == "red")
                style.color = "";
            var lastNode = parentNode.childNodes[parentNode.childNodes.length - 1];
            if (lastNode.id == "__ErrorMessagePanel")
                parentNode.removeChild(lastNode);
        }
    },
    addError: function (obj, msg) {
        var item = $("#" + obj);
        if (item.length == 0) item = $("input[name=" + obj + "]");
        this.ErrorItem.push(item[0]);
        this.ErrorMessage[this.ErrorMessage.length] = this.ErrorMessage.length + ". " + msg;
    }
}
//表单提交操作
whir.form = {
    /*
    * 表单提交
    *
    * @formid    integer 表单名称ID
    * @columnid  integer 表单栏目ID
    * @type      integer 表单类型
    * @itemid    integer 记录ID
    *
    */
    submit: function (formid, columnid, type, itemid) {
        if (!whir.formvalidator.validate(undefined, 1, formid)) {
            //验证不通过，不作提交
            return false;
        }
        var form = $('#' + formid); //formsubmit
        //var form = $("form[res='whirform']").eq(0);
        var url = whir.site.getAppPath() + "label/ajax/formsubmit.aspx?formid=" + formid + "&columnid=" + columnid + "&type=" + type + "&submitid=" + itemid;
        var options = {
            beforeSubmit: function (formData, jqForm, options) {
                //设置提交按钮不可用
                $('.btn_submit').attr("disabled", true);
                return true;
            },  // pre-submit callback
            success: function (responseText, statusText) {
                var jsonResult = eval("(" + responseText + ")");
                var _type = jsonResult.type; //{type:'1',msg:'提交成功',returnurl:'false'}
                if (_type == "1") {
                    if (jsonResult.msg == null || jsonResult.msg == "") {
                        alert('提交成功!');
                    } else {
                        alert(jsonResult.msg);
                        if (jsonResult.returnurl == 'true')//刷新当前页
                        {
                            document.location.href = document.location.href;
                        } else if (jsonResult.returnurl == "false")//不刷新
                        {
                        }
                        else//跳转页面
                        {
                            location.href = jsonResult.returnurl;
                        }
                    }
                }
                else if (_type == "0") {
                    if (jsonResult.msg == null || jsonResult.msg == "") {
                        alert('提交失败!');
                    } else {
                        alert(jsonResult.msg);
                    }
                }
                $('#submit_' + formid).removeAttr("disabled");
                $('.imgcode').click(); //更换验证码
                $(".textcode").focus(); //清空验证码输入框
                $('.btn_submit').attr("disabled", false);
            },  // post-submit callback 
            url: url,
            type: 'post'
        };
        // bind form using 'ajaxForm'
        form.ajaxSubmit(options);
        return false;
    },
    reset: function (formid) {
        var form = $('#' + formid);
        form.resetForm();
        //清空编辑器
        try {
            form.find("textarea").each(function () {
                var textAreaId = $(this).attr("id");
                if (textAreaId != null && textAreaId.length > 0) {
                    var obj = eval("editor" + textAreaId);
                    if (obj != null) {
                        obj.html("");
                    }
                }
            });
            form.find("div[id^='uploader']").each(function () {
                var id = $(this).attr("data-key-formId");
                window["closeUploader" + id].closeUploader();
                var hidId = window["closeUploader" + id].fileUrl;
                $(hidId).val("");
            });
        } catch (e) { }
    }
}

//唯一性是否验证通过
function validaOnly() {
    var past = true;
    $("[only='true']").each(function () {
        var ajaxpast = $(this).attr("ajaxpast");
        if (ajaxpast == 0) {
            past = false;
        }
    });
    return past;
}

$(function () {
    _siteAppPath = $("script[websiteurl]").attr("websiteurl");
    //Ajax获取选项字段内容
    if (loadSuccess == null) {
        loadOptions();
    }
    //webform置标为关联父栏目置标
    $("input[res='link']").each(function () {
        var paramname = $(this).attr("paramname");
        var bridgeid = $.query.get(paramname);
        $(this).val(bridgeid);
    });

    //验证是否唯一
    $("[only='true']").blur(function () {
        var onlyobj = $(this);
        var onlyvalue = $.trim($(this).val());
        var fieldId = $.trim($(this).attr("id"));
        var formid = $.trim($(this).attr("formid"));
        if (onlyvalue == "" || fieldId == "" || formid == "") {
            return;
        }
        $.get(_siteAppPath + "label/ajax/only.aspx?formid=" + formid + "&fieldid=" + fieldId + "&onlyvalue=" + onlyvalue + "&date=" + new Date(),
         function (data) {
             if (data == 1) {//值不唯一
                 onlyobj.css("color", "#F00");
                 onlyobj.attr("ajaxpast", 0);
             } else {
                 onlyobj.css("color", "");
                 onlyobj.attr("ajaxpast", 1);
             }
         });
    });
});

//加载选项字段
function loadOptions() {
    $("span[res='option']").each(function () {
        var formid = $(this).attr("formid");
        var fieldid = $(this).next("span[validatorfor]").attr("validatorfor");
        var firstoption = $(this).attr("firstoption");
        var isShowFirstOption = true;
        if (firstoption == null) {
            isShowFirstOption = false;
        }
        else {
            firstoption = escape(firstoption);
        }
        var obj = this;
        $.get(_siteAppPath + "label/ajax/GetOptions.aspx?formid=" + formid + "&isShowFirstOption=" + isShowFirstOption + "&firstoption=" + firstoption + "&date=" + new Date(),
         function (data) {
             var item = eval("[" + data + "]")[0];
             $(obj).after(item.Value);
             $(obj).remove();
             for (var i = 0; i < editData.length; i++) {
                 if (editData[i].Key == fieldid) {
                     switch (item.Key) {
                         case "1": //下拉列表
                             $("#" + fieldid).find("option[value='" + editData[i].Value + "']").attr("selected", true);
                             break;
                         case "2": //单选按钮
                             $("[name='" + fieldid + "'][value='" + editData[i].Value + "']").attr("checked", true);
                             break;
                         case "3": //多选
                             var values = editData[i].Value.split(',');
                             for (var cc = 0; cc < values.length; cc++) {
                                 $("[name='" + fieldid + "'][value='" + values[cc] + "']").attr("checked", true);
                             }
                             break;
                         default:
                             break;
                     }
                     break;
                 }
             }
         });
    });
}

//设置地区选项
function setArea() {
    $("input:hidden[res='area']").each(function () {
        var fieldid = $(this).attr("name");
        var regionid = $(this).val();
        var obj = $(this);
        if (regionid != 0) {
            //选择地区
            $.ajax({
                url: _siteAppPath + 'label/member/getAreaParentPath.aspx?id=' + $(this).val(),
                type: 'GET',
                success: function (data) {
                    var items = data.split(',');
                    if (items.length < 3) {
                        return;
                    }
                    if (items.length == 3) { //省
                        $("#" + fieldid + "_seachprov option[value='" + regionid + "']").attr("selected", true);
                        $("#" + fieldid + "_seachprov").trigger("change");
                    } else if (items.length == 4) {//市
                        $("#" + fieldid + "_seachprov option[value='" + items[2] + "']").attr("selected", true);
                        $("#" + fieldid + "_seachprov").trigger("change");
                        $("#" + fieldid + "_seachcity option[value='" + regionid + "']").attr("selected", true);
                        $("#" + fieldid + "_seachcity").trigger("change");
                    } else if (items.length == 5) { //区
                        $("#" + fieldid + "_seachprov option[value='" + items[2] + "']").attr("selected", true);
                        $("#" + fieldid + "_seachprov").trigger("change");
                        $("#" + fieldid + "_seachcity option[value='" + items[3] + "']").attr("selected", true);
                        $("#" + fieldid + "_seachcity").trigger("change");
                        $("#" + fieldid + "_seachdistrict option[value='" + regionid + "']").attr("selected", true);
                    }
                }
            });
        }
    });
}

