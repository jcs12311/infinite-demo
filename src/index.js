import React from 'react';
import ReactDOM from 'react-dom';


class PlaceholderComponent extends React.Component {
  render(){
    const { height } = this.props;
    const  style = {
      minHeight: height,
      width: '100%'
    };
    return <div style={style} onClick={this.props.onClick}></div>
  }
}

const ListItemWrapper = Component => {
    
    class ListItemComponent extends Component {
        constructor(props) {
            super(props);
            this.state = {
                onViewPort: false
            }
            this._update = this._update.bind(this);
            this._isOnViewPort = this._isOnViewPort.bind(this);
        }

        _isOnViewPort() {
          let el = ReactDOM.findDOMNode(this);
          let rect = el.getBoundingClientRect();
          return rect.bottom > 0 && rect.top < window.innerHeight;
        }

        _update(){
          if(this._isOnViewPort()){
            this.setState({
              onViewPort: true
            })
          }
        }

        shouldComponentUpdate(nextProps, nextState) {
          if(this.state.onViewPort !== nextState.onViewPort){
            return true;
          } else {
            return super.shouldComponentUpdate && 
              super.shouldComponentUpdate(nextProps, nextState);
          }
        }

        componentDidMount() {
          this._update();
          window.addEventListener('scroll', ()=>{
            this.lastTime = this.lastTime || Date.now();
            if(Date.now() - this.lastTime > 150) {
              this._update();
            }
          })
          super.componentDidMount && super.componentDidMount();
        }
    
        render() {
          const { onViewPort } = this.state;
          if(!onViewPort) return <PlaceholderComponent height={300} />;
          return super.render();
        }
    }
    
    ListItemComponent.propTypes = {
    }
    
    ListItemComponent.defaultProps = {
    }
    
    return ListItemComponent;
}


class ListItem extends React.Component {

  shouldComponentUpdate(nextProps){
    // just render once if item already show
    this.rendered = this.rendered || this.props.show;
    return !this.rendered && nextProps.show !== this.props.show
  }

  render() {
    /**
     * style for position
     */
    const { show, style } = this.props;
    if(!show) {
      return null;
    }
    return <div style={style}>
      { this.props.children }
    </div>
  }
}

/**
 * props.items
 *
 * height -> window.scroll -> getIndex
 * 
 * 
 */
class ListView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this._getRenderInfo = this._getRenderInfo.bind(this);
    }

    _getRenderInfo() {
      console.time('_getRenderInfo');
      let result = [];
      const { items, getItemHeight, bound } = this.props;
      let itemTop = 0, // current item top edge 
          itemBottom = 0; // current item bottom edge 
      let scrollTop = document.body.scrollTop,
          innerHeight = window.innerHeight;
      // two scroll direction
      for(let i = 0; i < items.length; i++) {
        itemTop = itemBottom;
        let el = ReactDOM.findDOMNode(this.refs[`listItem${i}`]);
        if(el){
          let rect = el.getBoundingClientRect();
          itemBottom += rect.height;
        } else {
          itemBottom += getItemHeight(i);
        }
        /** 
         * item top edge was over the viewport bottom
         * item bottom dege was below the viewport top
         * that means item in the viewport
         */
        if(itemTop < scrollTop+innerHeight+bound) {
          if(itemBottom > scrollTop-bound){
            result[i] = {
              top: itemTop
            }
          }
        }
      }
      console.timeEnd('_getRenderInfo');
      this.setState({
        renderItemsInfo: result,
        listHeight: itemBottom
      })
    }

    componentDidMount() {
      const { scrollDelay } = this.props;
      this._getRenderInfo();
      window.addEventListener('scroll', ()=>{
        this.lastTime = this.lastTime || Date.now();
        if(Date.now() - this.lastTime > scrollDelay) {
          this._getRenderInfo();
        }
      })
    }

    componentDidUpdate() {
      this._getRenderInfo();
    }

    shouldComponentUpdate(nextProps, nextState) {
      const indexChange =  JSON.stringify(nextState.renderItemsInfo) !== JSON.stringify(this.state.renderItemsInfo);
      const itemSizeChange = nextProps.items.length !== this.props.items.length;
      /* avoid dead loop for setState in componentDidUpdate */
      return indexChange || itemSizeChange;
    }

    render() {
      const { items } = this.props;
      const { renderItemsInfo, listHeight } = this.state;
      const listStyle = {
        position: 'relative',
        height: listHeight
      }
      return (
          <div className="list-view" style={listStyle}>
          {
            items.map((item, index)=>{
              let show,
                  itemStyle;

              if(index in renderItemsInfo){
                show = true;
                itemStyle = {
                  position: 'absolute',
                  top: renderItemsInfo[index].top
                }
              }

              return <ListItem key={index} show={show} 
                style={itemStyle} ref={`listItem${index}`}>
                { item }
              </ListItem>
            })
          }
          </div>
      )
    }
}

ListView.propTypes = {
}

ListView.defaultProps = {
  bound: 300, /* expand viewport top 300px and bottom 300px, will render more items */
  scrollDelay: 150, /* every 150ms update render items when scrolling */
  placeholder: true
}

export {
  ListView,
  ListItemWrapper
}

