
var provId; //
var cityId;
var areaId;
function initComplexArea(provControl, cityControl, areaControl, prov, city, area, provValue, cityValue, areaValue) {
    provId = provControl;
    cityId = cityControl;
    areaId = areaControl;
    var f = initComplexArea.arguments;
    var m = document.getElementById(provControl);
    var o = document.getElementById(cityControl);
    var n = document.getElementById(areaControl);
    var e = 0;
    var c = 0;
    if (prov != undefined) {
        if (provValue != undefined) {
            provValue = parseInt(provValue);
        }
        else {
            provValue = 0;
        }
        if (cityValue != undefined) {
            cityValue = parseInt(cityValue);
        }
        else {
            cityValue = 0;
        }
        if (areaValue != undefined) {
            areaValue = parseInt(areaValue);
        }
        else {
            areaValue = 0
        }
        n[0] = new Option(optionText, 0);
        o[0] = new Option(optionText, 0);
        for (e = 0; e < prov.length; e++) {
            if (prov[e] == undefined) {
                continue;
            }
            if (f[6]) {
                if (f[6] == true) {
                    if (e == 0) {
                        continue;
                    }
                }
            }
            m[c] = new Option(prov[e], e);
            if (provValue == e) {
                m[c].selected = true;
            }
            c++;
        }

        if (city[provValue] != undefined && city[provValue] != optionText) {//optionText变量在AreaData_min_cn.js中
            c = 0; for (e = 0; e < city[provValue].length; e++) {
                if (city[provValue][e] == undefined) { continue }
                if (f[7]) {
                    if ((f[7] == true) && (provValue != 71) && (provValue != 81) && (provValue != 82)) {
                        if ((e % 100) == 0) { continue; }
                    }
                }
                o[c] = new Option(city[provValue][e], e);
                if (cityValue == e) { o[c].selected = true }
                c++;
            }
        } else {
            jQuery("#" + cityControl).hide();
        }

        if (area[cityValue] != undefined && area[cityValue] != optionText) {
            c = 0; for (e = 0; e < area[cityValue].length; e++) {
                if (area[cityValue][e] == undefined) { continue }
                if (f[8]) {
                    if ((f[8] == true) && (provValue != 71) && (provValue != 81) && (provValue != 82)) {
                        if ((e % 100) == 0) { continue; }
                    }
                }
                n[c] = new Option(area[cityValue][e], e);
                if (areaValue == e) { n[c].selected = true }
                c++;
            }
        } else {
            jQuery("#" + areaControl).hide();
        }



    }
}
//三级----选择省份
//changeComplexProvince(this.value, sub_array, '9220_seachcity', '9220_seachdistrict','9220');"
function changeComplexProvince(pvalue, sub_array, provinceid, cityid, districtid, hiddenid) {
    var c = changeComplexProvince.arguments;
    var h = document.getElementById(cityid);
    var g = document.getElementById(districtid);
    var b = 0;
    var a = 0;
    removeOptions(h);
    pvalue = parseInt(pvalue);
    if (sub_array[pvalue] != undefined) {
        for (b = 0; b < sub_array[pvalue].length; b++) {
            if (sub_array[pvalue][b] == undefined) { continue }
            h[a] = new Option(sub_array[pvalue][b], b);
            a++
        }
    }
    removeOptions(g);
    g[0] = new Option(optionText, 0);
    //清空

    $("#" + hiddenid).val("");
    var pv = $("#" + provinceid).find("option:selected").val();
    if (pv != '0') {//没下一级就设省
        $("#" + hiddenid).val($("#" + provinceid).find("option:selected").val());
    }
}

//一级----省份
function changeLevel1Province(id, k, e, d, hiddenid) {
    if ($("#" + id).find("option:selected").val() != '0') {
        var name = $("#" + id).find("option:selected").val();
        $("#" + hiddenid).val(name);
    }
    else {
        $("#" + hiddenid).val("");
    }
}
//二级---省份
//changeComplexProvince(this.value, sub_array, '9220_seachcity', '9220_seachdistrict','9220');
function changeComplexProvince(pvalue, sub_array, provinceid, cityid, districtid, hiddenid) {

    var c = changeComplexProvince.arguments;
    var h = document.getElementById(cityid);
    var g = document.getElementById(districtid);
    var b = 0;
    var a = 0;
    removeOptions(h);
    pvalue = parseInt(pvalue);
    if (sub_array[pvalue] != undefined) {
        for (b = 0; b < sub_array[pvalue].length; b++) {
            if (sub_array[pvalue][b] == undefined) {
                continue
            }
            h[a] = new Option(sub_array[pvalue][b], b);
            a++
        }
    }

    removeOptions(g);
    g[0] = new Option(optionText, 0);
    //清空
    $("#" + hiddenid).val("");
    if (a == 1 && pvalue != 0) {//没下一级就设省
        $("#" + cityid).hide();
        $("#" + districtid).hide();
    } else {
        $("#" + cityid).show();
        $("#" + districtid).hide();
    }
    if (a == 0 && pvalue == 0) {
        $("#" + cityid).hide();
    }
    var pv = $("#" + provinceid).find("option:selected").val();
    if (pv == '0') {
        $("#" + hiddenid).val('');
    } else {
        $("#" + hiddenid).val(pv);
    }
    

}
//二级---市
function changeLevel2City(id, a, t, hiddenid) {
    if ($("#" + id).find("option:selected").val() != '0') {
        var name = $("#" + id).find("option:selected").val();
        $("#" + hiddenid).val(name);
    } else if ($("#" + id).find("option:selected").val() == '0') {
        $("#" + hiddenid).val($("#" + provId).find("option:selected").val());
    }
}

//三级----更换城市
function changeCity(cityValue, cityid, districtid, hiddenid) {
    $("#" + districtid).html('<option value="0" >' + optionText + '</option>');
    $("#" + districtid).unbind("change");
    cityValue = parseInt(cityValue);
    var _d = sub_arr[cityValue];
    var str = "";
    str += "<option value='0' >" + optionText + "</option>";

    if (_d!= undefined && _d.length <= 1) {
        if ($("#" + cityid).find("option:selected").val() != "0") {
            var backText = $("#" + cityid).find("option:selected").val();
            $("#" + hiddenid).val(backText);

        } else {
            $("#" + hiddenid).val('');
        }
    }
    if (_d != undefined) {
        for (var i = cityValue; i < _d.length; i++) {
            if (_d[i] == undefined) continue;
            str += "<option value='" + i + "' >" + _d[i] + "</option>";
        }

        if (_d.length > 1) {
            $("#" + districtid).show();
        } else {
            $("#" + districtid).hide();
        }
    }


    $("#" + districtid).html(str);

    //更换市处理
    var cityV = $("#" + cityId).find("option:selected").val();
    if (cityV != '0') { //市选项不为请选择
        $("#" + hiddenid).val(cityV);
    } else { //市选项为请选择，设省
        var pv = $("#" + provId).find("option:selected").val();
        if (pv != '0') {
            $("#" + hiddenid).val(pv);
        } else {
            $("#" + hiddenid).val('');
        }
    }
}

function removeOptions(c) {
    if ((c != undefined) && (c.options != undefined)) {
        var a = c.options.length;
        for (var b = 0; b < a; b++) {
            c.options[0] = null;
        }
    }
}

//设置地区进隐藏控件
function setValue(id, hiddenid) {
    //更区处理
    var areaV = $("#" + areaId).find("option:selected").val();
    if (areaV == '0') {
        var cityV = $("#" + cityId).find("option:selected").val();
        if (cityV != '0') { //市选项不为请选择
            $("#" + hiddenid).val(cityV);
        } else { //市选项为请选择，设省
            var pv = $("#" + provId).find("option:selected").val();
            if (pv != '0') {
                $("#" + hiddenid).val(pv);
            } else {
                $("#" + hiddenid).val('');
            }
        }
    } else {
        $("#" + hiddenid).val(areaV);
    }

}
