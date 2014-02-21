/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var inputarea = React.createClass({
  getInitialState: function() {
    return {cmd: "WORDS"};
  },
  render: function() {
    return (
      <div>
        <button onClick={this.sendcmd}>sendCmd</button>
        <input size='80' ref="inputcmd" defaultValue={this.state.cmd}></input>
      </div>
    );
  },
  sendcmd:function() {
    var cmd=this.refs.inputcmd.getDOMNode().value;
    this.props.onExecute(cmd);
  }
});
module.exports=inputarea;