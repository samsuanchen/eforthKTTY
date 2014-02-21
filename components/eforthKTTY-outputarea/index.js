/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var $=Require("jquery");
var outputarea = React.createClass({displayName: 'outputarea',
  getInitialState: function() {
    return {};
  },
  render: function() {
	var s=this.props.log+(this.props.recieved?this.props.recieved.toString():'');
    return (
    React.DOM.div( {ref:"outputarea", className:"outputarea",
		dangerouslySetInnerHTML:{__html:s}})
    //</div>
    /*
      <div ref="outputarea" className="outputarea">
		{this.props.log+(this.props.recieved?this.props.recieved.toString():'')}
      </div>
      */
    );
  },
  componentDidUpdate:function() {
	$outputarea=$(this.refs.outputarea.getDOMNode());
	$outputarea.scrollTop($outputarea[0].scrollHeight);
  }
});
module.exports=outputarea;