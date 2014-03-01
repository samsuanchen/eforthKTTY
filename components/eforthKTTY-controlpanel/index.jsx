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
        <inputarea
          system    ={this.props.system}
          onPasted  ={this.props.onPasted}
          onXfer    ={this.props.onXfer}
          onExecute ={this.props.onExecute}/>
        <connection
          connecting={this.props.connecting}
          onClose   ={this.props.onClose}
          onConnect ={this.props.onConnect}
          port      ={this.props.port}
          baud      ={this.props.baud}/>
      </div>
    );
  }
});
module.exports=controlpanel;