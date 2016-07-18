import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';


class News extends React.Component {

    shouldComponentUpdate(nextProps) {
      const shouldUpdate =  JSON.stringify(nextProps.news) !== JSON.stringify(this.props.news);
      return shouldUpdate;
    }

    render() {
      const { url, imgsrc, title, digest } = this.props.news;
        return (
            <a className="news" href={url}>
              <img src={imgsrc} />
              <p className="title">{title}</p>
              <small className="digest">{digest}</small>
            </a>
        )
    }
}

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
      this.getList();
      $(window).on('scroll', ()=>{
        let bufferPx = 200;
        let oh = document.body.offsetHeight;
        if(( oh > window.innerHeight ) && ( window.scrollY + window.innerHeight + bufferPx >= oh )){
          this.getList();
        }
      })
    }

    componentWillUpdate(nextProps, nextState){
      if(nextState.newsData.length > this.state.newsData.length) {
        console.time(`render ${this.props.pageSize} list`);
      }
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

          this.setState({
              loading: false,
              p: p + pageSize,
              newsData: newsData.concat(news)
          });
        }
        window.artiList = cb;
      }
    }

    render() {
      const { newsData } = this.state;
        return (
            <div className="list">
              {
                newsData.map((news, index)=>{
                  return <News key={index} news={news} />
                })
              }
            </div>
        )
    }
}

App.propTypes = {
}

App.defaultProps = {
  pageSize: 100
}

ReactDOM.render(<App />, 
  document.getElementById('app'));

