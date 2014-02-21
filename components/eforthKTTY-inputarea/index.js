/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var inputarea = React.createClass({displayName: 'inputarea',
  getInitialState: function() {
    return {cmd: "WORDS"};
  },
  render: function() {
    return (
      React.DOM.div(null, 
        React.DOM.button( {onClick:this.sendcmd}, "sendCmd"),
        React.DOM.input( {size:"80", ref:"inputcmd", defaultValue:this.state.cmd})
      )
    );
  },
  sendcmd:function() {
    var cmd=this.refs.inputcmd.getDOMNode().value;
    this.props.onExecute(cmd);
  }
});
module.exports=inputarea;