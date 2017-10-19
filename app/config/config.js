var baseUrl = {
   apiPath: '' 
};
var setVisit = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
if (setVisit == "http://10.99.2.140:8080") {
    //baseUrl.apiPath = 'http://10.99.2.140:8080/egg-operate-web/';
} else {
    //本地环境
    baseUrl.apiPath = "http://172.16.9.28:8090";
};
baseUrl.imgPath = '';
baseUrl.filePath = '';
export default baseUrl;