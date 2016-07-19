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

class ListView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderIndexes:[]
        }
        this._updateRenderIndexes = this._updateRenderIndexes.bind(this);
    }

    _updateRenderIndexes() {
      let result = [];
      const { items, getItemHeight, bound } = this.props;
      let itemTop = 0, // current item top edge 
          itemBottom = 0; // current item bottom edge 
      let scrollTop = document.body.scrollTop,
          innerHeight = window.innerHeight;
      for(let i = 0; i < items.length; i++) {
        itemTop = itemBottom;
        itemBottom += getItemHeight(i);
        /** 
         * item top edge was over the viewport bottom
         * item bottom dege was below the viewport top
         * that means item in the viewport
         */
        if(itemTop < scrollTop+innerHeight+bound) {
          if(itemBottom > scrollTop-bound){
            result.push(i);
          }
        } else {
          /**
           * this item top edge was below the viewport bottom 
           * next item top edge must below the viewport bottom too
           */
          break;
        }
      }
      this.setState({
        renderIndexes: result
      })
    }

    componentDidMount() {
      const { scrollDelay } = this.props;
      this._updateRenderIndexes();
      window.addEventListener('scroll', ()=>{
        this.lastTime = this.lastTime || Date.now();
        if(Date.now() - this.lastTime > scrollDelay) {
          this._updateRenderIndexes();
        }
      })
    }

    componentDidUpdate(){
      this._updateRenderIndexes();
    }

    shouldComponentUpdate(nextProps, nextState) {
      const indexChange =  JSON.stringify(nextState.renderIndexes) !== JSON.stringify(this.state.renderIndexes);
      const itemSizeChange = nextProps.items.length !== this.props.items.length;
      /* avoid dead loop for setState in componentDidUpdate */
      return indexChange || itemSizeChange;
    }

    render() {
      const { items } = this.props;
      const { renderIndexes } = this.state;
      const listStyle = {
        position: 'relative',
        height: items.length * 271
      }
      return (
          <div className="list-view" style={listStyle}>
          {
            items.map((item, index)=>{
              let show = renderIndexes.indexOf(index) !== -1;
              const itemStyle = {
                position: 'absolute',
                top: 271*index
              }
              return <ListItem key={index} show={show} 
                style={itemStyle}>
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
}

export {
  ListView,
  ListItemWrapper
}

