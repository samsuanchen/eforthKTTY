/** @jsx React.DOM */

var titlebar=Require("titlebar"); 
var outputarea=Require("outputarea"); 
var controlpanel=Require("controlpanel"); 
var statusbar=Require("statusbar"); 
var conn=Require("eforthKTTY/conn");
var main = React.createClass({displayName: 'main',
  getInitialState: function() {
    return {cmd: "WORDS"};
  },
  render: function() {
    return (
      React.DOM.div(null, 
        titlebar(null),
        outputarea(null),
        controlpanel( {onConnect:this.connect, onExecute:this.execcmd}),
        statusbar(null)
      )
    );
  },
  port: 'COM32',
  baud: 19200,
  system: '328eforth',
  onOpen:function(e) {
    if (e) {
      console.log(Date(),"COM32: openfail",e.message)
      return
    }
    this.opened()
  },
  onOpened:function() {
    console.log(Date(),"COM32: opened")
  },
  onData:function(bytes) {
    console.log(Date(),"COM32: data read",bytes)
  },
  onClose:function() {
    console.log(Date(),"COM32: close")
  },
  onError:function(e) {
    console.log(Date(),"COM32: error",e)
  },
  write:function(bytes) {
    console.log(Date(),"COM32: write",bytes)
  },
  connect:function() {
    conn.doconnect(this.onOpen,this);
  },
  execcmd:function(cmd) {
    console.log(cmd);
  }
});
module.exports=main;