let Utils = {
    // 网络请求
    request : function(param){
    },
    // 统一登录处理
    doLogin : function(){
        window.location.href = './user-login.html?redirect=' + encodeURIComponent(window.location.href);
    },
    goHome : function(){
        window.location.href = './index.html';
    },
    mapQuery: function(url){
        //window.location.search
        var i,
            key,
            value,
            url = url || window.location.href,
            index = url.indexOf('?'),
            pieces = url.substring(index + 1).split('&'),
            params = {};
  
        if(index === -1){
          return {};
        }
  
        for(i=0; i<pieces.length; i++){
            index = pieces[i].indexOf('=');
            key = pieces[i].substring(0,index).toLowerCase();
            value = pieces[i].substring(index+1);
            params[key] = value;
        }
        return params;
    },
    request: function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    },
};
export default Utils;