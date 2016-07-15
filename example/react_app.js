import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';


class News extends React.Component {
    render() {
      const { url, imgsrc, title, digest } = this.props;
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
                  const { url, imgsrc, title, digest } = news;
                  return <News key={index} url={url} imgsrc={imgsrc}
                    title={title} digest={digest} />
                })
              }
            </div>
        )
    }
}

App.propTypes = {
}

App.defaultProps = {
  pageSize: 20
}

ReactDOM.render(<App />, 
  document.getElementById('app'));

