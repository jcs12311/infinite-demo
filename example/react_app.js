import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import { ListView, ListItem } from '../src/index';


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
            }} style={{minHeight: 271, display: 'block'}} >
              <img src={imgsrc} />
              <p className="title">{title}</p>
              <small className="digest">{digest}</small>
            </a>
        )
    }
}
// News = ListItem(News);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newsData: [],
            p: 1,
            loading: false
        }
    }
    componentWillMount() {
      console.time(`mount list`);
      super.componentWillMount && super.componentWillMount();
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
      console.timeEnd(`mount list`);
    }

    componentWillUpdate(nextProps, nextState){
        console.time(`update list`);
        super.componentWillUpdate && super.componentWillUpdate(nextProps, nextState);
    }

    componentDidUpdate(prevProps, prevState) {
      console.timeEnd(`update list`);
      super.componentDidUpdate && super.componentDidUpdate(prevProps, prevState);
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
      const items = newsData.map((news, index)=>{
        return <News key={index} news={news} onClick={()=>{
          this.setState({
            update: true
          })
        }} />
      })
      return (
          <div className="list">
            <ListView items={items} getItemHeight={(index)=>271} />
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

