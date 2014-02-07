/** @jsx React.DOM */
//var othercomponent=Require("other"); 
var connection = React.createClass({
  getInitialState: function() {
    return {bar: "world"};
  },
  render: function() {
    return (
      <div>
        <button onClick={this.doconnect}>connect</button>
      </div>
    );
  },
  doconnect:function() {
    //get port...
    this.props.onConnect();
  }
});
module.exports=connection;