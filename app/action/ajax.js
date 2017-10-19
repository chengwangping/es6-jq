import config from '../config/config';

let api = {
    setting: function () {
        let token = localStorage.getItem('AUTH_TOKEN') || '';
        $.ajaxSetup({
            global: true,
            //aysnc: true, // 默认同步加载
            dataType: 'json',
            //type: "POST" , // 默认使用POST方式
            //crossDomain: true,
            headers: { // 默认添加请求头
                'X-Requested-With': 'XMLHttpRequest',
                "Content-Type": 'application/json; charset=utf-8'
            },
            xhrFields: {
                withCredentials: true
            },
            beforeSend: function (xhr) {
                console.log(xhr);
                xhr.setRequestHeader('token',token);
            }
        });
    },
    ajax: function(option){
        $.support.cors = true;
        $.ajax({
            url: config.apiPath + option.url,
            type: option.type,
            data: option.data,
            success: function(data){
                if(data.code === 1000) {
                    localStorage.setItem('AUTH_TOKEN',data.code);
                    option.success(data);
                }else if(data.code === 1001) {
                    
                }
                
                // var result = text;
                // if(typeof text == 'string'){
                //   result = window.JSON.parse(text);
                // }
                // var status = result.status;
                // var data = result.data;
                // if (status == 200) {
                //     if(!!data || data===null){
                //       option.success(data);
                //     }else{
                //       option.success(result);
                //     }
                // }else{
                // }
            },
            error: function(jqXHR, textStatus, errorMsg){ // 出错时默认的处理函数
                console.log(jqXHR,textStatus,errorMsg);
                // jqXHR 是经过jQuery封装的XMLHttpRequest对象
                // textStatus 可能为： null、"timeout"、"error"、"abort"或"parsererror"
                // errorMsg 可能为： "Not Found"、"Internal Server Error"等
                // 提示形如：发送AJAX请求到"/index.html"时出错[404]：Not Found
                //alert( errorMsg );        
            },
        });
    },
    post: function(option){
        api.setting();
        option.type = 'post';
        api.ajax(option);
    }
};
export default api;