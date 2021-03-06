/**
 * Created by huangfeng on 2015/12/17.
 */

//消息主题列表


var authorization="Bearer "+$.cookie('accessToken');
var pageSize= 10,listMark=["0"],listsearchMark=["0"];

function goPage(mark){
    $.ajax({
        url: "/api/topic?pageSize="+pageSize+"&mark="+mark,
        dataType:"json",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", authorization);
        },
        success: function(data){
            if(data.list==0) {
                if(listMark.length==1){
                    $("#page").hide();
                }else{
                    $("#page").show();
                    utils.alertMsgTip("没有下一页了")
                }
                return;
            };
            var buff = [], list = data.list, length = list.length;
            var len = listMark.length;
            for (var l = 0; l < len; l++) {
                if (listMark[l] == data.mark) {
                    listMark = listMark.slice(0,l+1);
                    break;
                } else {
                    if (l == (listMark.length - 1)) {
                        listMark.push(data.mark);
                    }
                }
            }
            var previous=0;
            if(listMark.length - 3<0){
                previous=0
            }else{
                previous=listMark.length - 3;
            }
            $("#previous").html('<a href="javascript:goPage(\'' + listMark[previous] + '\')">上一页</a>')
            $("#next").html('<a href="javascript:goPage(\'' + data.mark + '\')">下一页</a>');
            $("#currentPage").html('当前第'+(listMark.length-1)+'页')
            $("#page").show();

            for (var i = 0; i < length; i++) {
                buff.push('<tr><td>' + list[i].topic + '</td><td>' + list[i].count + '</td><td>' + formatDate(list[i].lastEvent, 'yyyy-MM-dd') + '</td>' +
                    '<td><a href="data-topic-live.html?topic='+list[i].topic+'" class="btn-link btn-delete">实时数据</a>' +
                    '<a href="data-topic-statistic.html?topic='+list[i].topic+'" class="btn-link btn-edit">概况</a></td></tr>')
            }

            $("#list").html(buff.join(''));
        },
        error:function(xhr,textStatus,errorThrown){
            var response = eval("("+xhr.responseText+")");
            utils.alertMsgTip(response._message)
        }
    })

}

goPage(listMark[0])


//搜索消息主题

$("#btn-search").on("click",function(){
    var keyword = $.trim($("input[name='keyword']").val());
    if(keyword.length==0){
        utils.alertMsgTip("关键字不能为空");
        return;
    }
   // searchPage(keyword,0)
})


function searchPage(keyword,mark){
    $.ajax({
        url: "/api/device/search?keyword="+encodeURIComponent(keyword)+"&pageSize="+pageSize+"&mark="+mark,
        dataType:"json",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", authorization);
        },
        success: function(data){
            $("#searchTip").show()
            if(data.list==0) {
                if(listsearchMark.length==1){
                    $("#list").html('<tr><td colspan="6" class="text-center">没有找到</td></tr>');
                    $("#page").hide();
                }else{
                    $("#page").show();
                    utils.alertMsgTip("没有下一页了")
                }
                return;
            };
            var buff = [], list = data.list, length = list.length;
            var len = listsearchMark.length;
            for (var l = 0; l < len; l++) {
                if (listsearchMark[l] == data.mark) {
                    listMark = listsearchMark.slice(0,l+1);
                    break;
                } else {
                    if (l == (listsearchMark.length - 1)) {
                        listsearchMark.push(data.mark);
                    }
                }
            }
            //console.log(listMark)
            var previous=0;
            if(listsearchMark.length - 3<0){
                previous=0
            }else{
                previous=listsearchMark.length - 3;
            }
            $("#previous").html('<a href="javascript:searchPage(\''+keyword+'\',' + listsearchMark[previous] + ')">上一页</a>')
            $("#next").html('<a href="javascript:searchPage(\''+keyword+'\',' + data.mark + ')">下一页</a>');
            $("#currentPage").html('当前第'+(listsearchMark.length-1)+'页')
            $("#page").show();
            for (var i = 0; i < length; i++) {
                buff.push('<tr><td>' + list[i].deviceId + '</td><td>' + list[i].name + '</td><td>' + list[i].status + '</td>' +
                    '<td>' + list[i].desc + '</td><td>' + list[i].created.substring(0, 10) + '</td><td><a href="device-view-detail.html?id=' + list[i].id + '" class="btn-link">进入</a></td></tr>')
            }
            $("#list").html(buff.join(''));
        },
        error:function(xhr,textStatus,errorThrown){
            var response = eval("("+xhr.responseText+")");
            utils.alertMsgTip(response._message)
        }
    })
}