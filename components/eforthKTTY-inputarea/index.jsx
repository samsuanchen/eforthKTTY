/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var ENTER_KEY=13, ESCAPE_KEY=27;
var inputarea = React.createClass({
  getInitialState: function() {
    return {cmd: "WORDS"};
  },
  render: function() {
    return (
      <div>
        <button onClick={this.sendcmd}>sendCmd</button>
        <input
          onKeyDown={this.handleKeyDown}
          size='80'
          ref="inputcmd"
          defaultValue={this.state.cmd}>
        </input>
      </div>
    );
  },
  handleKeyDown: function (event) {
    var key=event.keyCode;
    if (key === ENTER_KEY) {
      this.sendcmd();
    } else if (key === ESCAPE_KEY) {
      this.props.onExecute(String.fromCharCode(key));
    };
  },
  sendcmd:function() {
    var cmd=this.refs.inputcmd.getDOMNode().value.trim();
    this.props.onExecute(cmd);
  }
});
module.exports=inputarea;