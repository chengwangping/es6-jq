import api from '../action/ajax.js';
//获取商品列表
export const login = (data,callback) => {
    api.post({
        url: '/accountManager/getCertStauts',
        data:data,
        success: function(rsp){
            callback(rsp);
        }
    })
}