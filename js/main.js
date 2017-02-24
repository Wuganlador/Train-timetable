    // var urlPre = "http://www.corsproxy.com/"; //跨域中转
    //http远程代理
    //  var urlPre = "http://cors.itxti.net/?";
    //https远程代理
    var urlPre = "https://bird.ioliu.cn/v1/?url=";
    
    // 提供站点，查询 站点
    var url1 = "ws.webxml.com.cn/WebServices/TrainTimeWebService.asmx/getStationAndTimeByStationName?UserID=";

    // 提供车号，查询 站点 时间 
    var url2 = "ws.webxml.com.cn/WebServices/TrainTimeWebService.asmx/getStationAndTimeDataSetByLikeTrainCode?UserID=";

    // 提供车号，查询详情
    var url3 = "ws.webxml.com.cn/WebServices/TrainTimeWebService.asmx/getDetailInfoByTrainCode?UserID=";
    
    var isbind = 0;

    var isAjax=false;


    // pageshow事件，页面显示。
    $(document).on("pageshow", "#index", function () {
        if (isbind) return
        isbind = 1;
        bindEvent();
    });

    //绑定事件
    var bindEvent = function () {

         //获取车次列表
        $("#search-submit").on("click", getTrainList);

        //获取详情
        $("#list").on("click", "a", getInfoByTrainCode);
    };

    

    //获取车次列表
    var getTrainList = function () {

        //数据校验
        //列车查询逻辑，要么输入查询车次，要么输入起始站和终点站
        if ($("#search-no").val() || ($("#search-begin").val() && $("#search-end").val())) {

            var searchButton = $(this);
            searchButton.button("option", "disabled", true);

            // 显示加载提示滚动的小圆圈
            $.mobile.loading("show");

            var _data = {};
            var _url = url1;

            if (!$("#search-no").val()) {
                _data.StartStation = $("#search-begin").val();
                _data.ArriveStation = $("#search-end").val();
            } else {
                _data.TrainCode = $("#search-no").val();
                _url = url2;
            }

            $.get(urlPre + _url, _data,
                    function (data) {
                        $("#list").html("");
                        var list = $("#list");
                        var timeTables = $(data).find("TimeTable");

                        var _arr = [];
                        timeTables.each(function (index, obj) {
                            var i = index;
                            if (i > 10) return false; //只载入前10条

                            var that = $(this);
                            if (that.find("FirstStation").text() == "数据没有被发现") {
                                alert("数据没有被发现！");
                                return false;
                            }

                            _arr.push('<li><a href="#" data-no="' + that.find("TrainCode").text() + '">' +
                                    '<h2>' + that.find("TrainCode").text() + '次</h2>' +
                                    '<p>' + that.find("FirstStation").text() + ' - ' + that.find("LastStation").text() + '</p>' +
                                    '<p>用时：' + that.find("UseDate").text() + '</p>' +
                                    '<p class="ui-li-aside">' + that.find("StartTime").text() + ' 开</p>' +
                                    '</a></li>');

                        });

                        if (_arr.length > 0) {
                            list.html(_arr.join(""));
                            list.listview("refresh");
                        }

                        // 不显示加载提示滚动的小圆圈
                        $.mobile.loading("hide");

                        searchButton.button("option", "disabled", false);
                    }
                );
        } else {
            alert("请输入发车站和终点站\n或输入车次！");
        }
    };

    




    //获取详情
    var getInfoByTrainCode = function () {

        // 显示加载提示滚动的小圆圈
        $.mobile.loading("show");

        // attr() 方法设置或返回被选元素的属性值。根据该方法不同的参数，其工作方式也有所差异。
        var trainCode = $(this).attr("data-no");
        
        if(isAjax) return;
        isAjax=true;

        $.get(urlPre + url3,
                {
                    TrainCode: trainCode
                },
                function (data) {
                    isAjax=false;
                    $("#detail").find(".ui-content h2").html(trainCode + "次");

                    var tbody = $("#detail").find(".ui-content tbody");
                    tbody.html("");

                    $(data).find("TrainDetailInfo").each(function (index, obj) {
                        var tr = $("<tr></tr>");
                        var that = $(this);
                        tr.html('<td>' + that.find("TrainStation").text() + '</td>' +
                                '<td>' + that.find("ArriveTime").text() + '</td>' +
                                '<td>' + that.find("StartTime").text() + '</td>');
                        tbody.append(tr);
                    });

                    // 不显示加载提示滚动的小圆圈
                    $.mobile.loading("hide");

                    $.mobile.changePage("#detail");
                });

    };
