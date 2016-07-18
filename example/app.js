import $ from 'jquery';
let template = require('lodash.template');
window.$ = $;


function App(){

  this.loading = false;
  this.p = 1;
  this.pageSize = 100;

  let getList = () => {
    if(!this.loading){
      console.log('get');
      this.loading = true;
      $.ajax({
        url: "http://3g.163.com/touch/article/list/BBM54PGAwangning"+
          `/${this.p}-${this.pageSize}.html`,
        dataType: 'jsonp'
      });

      let cb = (data)=>{
        let $tmlItem = $('.template'),
        $list = $('.list');
        let news = data.BBM54PGAwangning;
        fillList($list, $tmlItem, news);
        this.loading = false;
        this.p += this.pageSize;
      }
      window.artiList = cb;
    }
  }

  let fillList = ($list, $tmlItem, data) => {
    console.time(`render ${this.pageSize} list`);
    for(let i = 0; i < data.length; i++) {
      let compiled = template($tmlItem.html());
      let text = compiled(data[i]);
      $list.append($(text));
    }
    console.timeEnd(`render ${this.pageSize} list`);
  }

  getList();

  $(window).on('scroll', function(event){
    let bufferPx = 200;
    let oh = document.body.offsetHeight;
    if(( oh > window.innerHeight ) && ( window.scrollY + window.innerHeight + bufferPx >= oh )){
      getList();
    }
  })
}

window.App = App;
