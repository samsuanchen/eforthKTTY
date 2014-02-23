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
        <connection
          connect  ={this.props.connect}
          onClose  ={this.props.onClose  }
          onConnect={this.props.onConnect}
          port     ={this.props.port}
          baud     ={this.props.baud}/>
      </div>
    );
  }
});
module.exports=controlpanel;