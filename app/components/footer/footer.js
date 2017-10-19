'use strict';
class Footer {
  constructor (){
    this.listArr();
  }
  listArr(){
    let copyright = $('.copyright');
    copyright.click(function(){
        alert('执行footer方法')
    })
  }
}

export default Footer;
