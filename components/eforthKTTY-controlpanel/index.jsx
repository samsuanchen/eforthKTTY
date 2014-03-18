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
          connecting={this.props.connecting}
          system    ={this.props.system}
          onPasted  ={this.props.onPasted}
          onXfer    ={this.props.onXfer}
          lineDelay ={this.props.lineDelay}
          onChangeLineDelay={this.props.onChangeLineDelay}
          onChangeDir={this.props.onChangeDir}
          onExecute ={this.props.onExecute}/>
        <connection
          connecting={this.props.connecting}
          onClose   ={this.props.onClose}
          onConnect ={this.props.onConnect}
          onPortChange={this.props.onPortChange}
          onBaudChange={this.props.onBaudChange}
          port      ={this.props.port}
          baud      ={this.props.baud}/>
      </div>
    );
  }
});
module.exports=controlpanel;