/** @jsx React.DOM */

var connection=Require("connection"); 
var inputarea=Require("inputarea"); 
var controlpanel = React.createClass({
  getInitialState: function() {
    return {bar: "world"};
  },
  render: function() {
    return (
      <div className='controlpanel'>
        <inputarea onExecute={this.props.onExecute}/>
        <connection onConnect={this.props.onConnect}/>
      </div>
    );
  }
});
module.exports=controlpanel;