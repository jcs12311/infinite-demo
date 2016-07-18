import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import ListItem from '../src/index';


class News extends React.Component {

    shouldComponentUpdate(nextProps) {
      const shouldUpdate =  JSON.stringify(nextProps.news) !== JSON.stringify(this.props.news);
      return shouldUpdate;
    }

    render() {
      const { url, imgsrc, title, digest } = this.props.news;
        return (
            <a className="news" href={url} onClick={(event)=>{
              event.preventDefault();
              this.props.onClick(event);
            }}>
              <img src={imgsrc} />
              <p className="title">{title}</p>
              <small className="digest">{digest}</small>
            </a>
        )
    }
}
News = ListItem(News);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newsData: [],
            p: 1,
            loading: false
        }
    }

    componentDidMount() {
      this.getLocalList();
      // this.getList();
      // $(window).on('scroll', ()=>{
      //   let bufferPx = 200;
      //   let oh = document.body.offsetHeight;
      //   if(( oh > window.innerHeight ) && ( window.scrollY + window.innerHeight + bufferPx >= oh )){
      //     this.getList();
      //   }
      // })
    }

    componentWillUpdate(nextProps, nextState){
      // if(nextState.newsData.length > this.state.newsData.length) {
        console.time(`render ${this.props.pageSize} list`);
      // }
    }

    componentDidUpdate(nextProps) {
      console.timeEnd(`render ${this.props.pageSize} list`);
    }

    getList() {
      if(!this.state.loading) {
        const { newsData, p } = this.state;
        const { pageSize } = this.props;
        this.setState({
          loading: true
        });
        $.ajax({
          url: "http://3g.163.com/touch/article/list/BBM54PGAwangning"+
            `/${p}-${pageSize}.html`,
          dataType: 'jsonp'
        });

        let cb = data => {
          let news = data.BBM54PGAwangning;
          localStorage['newsData'] = JSON.stringify(news);
          this.setState({
              loading: false,
              p: p + pageSize,
              newsData: newsData.concat(news)
          });
        }
        window.artiList = cb;
      }
    }

    getLocalList(){
      let news = JSON.parse(localStorage['newsData']);
      this.setState({
        newsData: [].concat(news)
      })
    }

    render() {
      const { newsData } = this.state;
        return (
            <div className="list">
              {
                newsData.map((news, index)=>{
                  return <News key={index} news={news} onClick={()=>{
                    console.log('click');
                    this.setState({
                      update: true
                    })
                  }} />
                })
              }
            </div>
        )
    }
}

App.propTypes = {
}

App.defaultProps = {
  pageSize: 200
}

ReactDOM.render(<App />, 
  document.getElementById('app'));

