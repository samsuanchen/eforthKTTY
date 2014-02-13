/** @jsx React.DOM */

var titlebar=Require("titlebar"); 
var outputarea=Require("outputarea"); 
var controlpanel=Require("controlpanel"); 
var statusbar=Require("statusbar"); 
var conn=Require("eforthKTTY/conn");
var main = React.createClass({
  getInitialState: function() {
    return {cmd: "WORDS"};
  },
  render: function() {
    return (
      <div>
        <titlebar/>
        <outputarea/>
        <controlpanel onConnect={this.connect} onExecute={this.execcmd}/>
        <statusbar/>
      </div>
    );
  },
  onData:function(bytes) {

  },
  onOpen:function(bytes) {

  },
  onClose:function(bytes) {

  },
  onError:function(bytes) {

  },
  write:function(bytes) {

  },
  opened:function(bytes) {
    if (typeof bytes !='undefined') {
      console.log(Date(),"COM32: openfail")
    } else {
      console.log(Date(),'COM32: opened')
    }
  },
  connect:function() {
    conn.doconnect(this.opened.bind());
  },
  execcmd:function(cmd) {
    console.log(cmd);
  }
});
module.exports=main;