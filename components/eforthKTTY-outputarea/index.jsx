/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var outputarea = React.createClass({
  getInitialState: function() {
    return {bar: "world"};
  },
  render: function() {
    return (
      <div className="outputarea">
        {this.props.recieved?this.props.recieved.toString():''}
      </div>
    );
  }
});
module.exports=outputarea;