/** @jsx React.DOM */
//var othercomponent=Require("other"); 
var connection = React.createClass({
  getInitialState: function() {
    return {connect: false};
  },
  render: function() {
    if (this.state.connect) return (
      <div>
        <button onClick={this.doconnect}>close</button>
      </div>
    );
    else return (
      <div>
        <button onClick={this.doconnect}>connect</button>
      </div>
    );
  },
  doconnect:function() {
    //get port...
    this.props.onConnect(this.props.port,this.props.baud);
  }
});
module.exports=connection;