'use strict';
import config from '../../config/config';
import './index.scss';
import { login } from '../../action/index';

class indexCtrl {
    constructor() {
        this.init();
    }
    init () {
        login({user:100,name:200},function(data){
            console.log(1,data)
        });
    }
};
let index = new indexCtrl;
export default index;