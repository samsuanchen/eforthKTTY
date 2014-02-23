/** @jsx React.DOM */
//var othercomponent=Require("other"); 
var connection = React.createClass({
  render: function() {
    var txt=this.props.connect?'close':'connect';
    return (
      <div>
        <button onClick={this.doconnect}>{txt}</button>
      </div>
    );
  },
  doconnect:function() {
    //get port...
    this.props.onConnect(this.props.port,this.props.baud);
  }
});
module.exports=connection;