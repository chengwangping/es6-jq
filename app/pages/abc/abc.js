'use strict';
import config from '../../config/config';
import './index.scss';

class indexCtrl {
    constructor() {
        this.init();
    }
    init () {
        this.name   = 'hello webpack2';
        this.url    = 'http://www.baidu.com';
        this.toggle = () => {
            alert(20)
        };
    }
}
$('body').append("<div>eric cheng</div>")
var abc = new indexCtrl();
export default abc;