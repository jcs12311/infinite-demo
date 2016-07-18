/**
 * solve react render long list very slow
 *
 * only render when item on viewport
 * 1.using placeholder instead outside viewport element
 * shortage: 
 *   a.need to specify element height
 *   b.it still render slow even if using blank div as palceholder(maybe can 
 *   combine to one)
 *
 * 2.react canvas
 * shortage:
 *   a.must use inline style, spectify height etc
 *   b.scroll not smooth on mobile
 *   c.same origin policy
 *
 * 3.batch render - split big list to little list, render sequentially
 * shortage:
 *   a.can't record scroll position
 *   
 * 4.two direct scroll listview
 * shortage:
 *   a.
 * 
 */

import React from 'react';
import ReactDOM from 'react-dom';

class PlaceholderComponent extends React.Component {
  render(){
    const { height } = this.props;
    const  style = {
      height,
      width: '100%'
    };
    return <div style={style}></div>
  }
}

const ListItem = Component => {
    
    class ListItemComponent extends Component {
        constructor(props) {
            super(props);
            this.state = {
                
            }
            window.count = window.count !== undefined ? window.count +1 : 0;
            this.id = window.count;
        }

        componentDidMount() {
          let a = ReactDOM.findDOMNode(this);
        }
    
        render() {
          // if(this.id > 10) return <PlaceholderComponent height={300} />;
          return super.render();
        }
    }
    
    ListItemComponent.propTypes = {
    }
    
    ListItemComponent.defaultProps = {
    }
    
    return ListItemComponent;
}

export default ListItem;