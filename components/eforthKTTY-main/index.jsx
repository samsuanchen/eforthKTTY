/** @jsx React.DOM */

var titlebar=Require("titlebar"); 
var outputarea=Require("outputarea"); 
var controlpanel=Require("controlpanel"); 
var statusbar=Require("statusbar"); 
var conn=Require("eforthKTTY/conn");
var main = React.createClass({
  getInitialState: function() {
    return {cmd: "WORDS", connect: false};
  },
  render: function() {
    return (
      <div>
        <titlebar/>
        <outputarea/>
        <controlpanel
          onClose  ={this.  closePort}
          onConnect={this.connectPort}
          onExecute={this.sendCommand}/>
        <statusbar/>
      </div>
    );
  },
  port: 'COM32',
  baud: 19200,
  system: '328eforth',
  onPortOpen:function(e) {
    if (e) {
      console.log(Date(),"COM32: openfail",e.message)
      return
    }
    this.onPortOpened()
  },
  onPortOpened:function() {
    console.log(Date(),"COM32: opened")
    this.setState({'connect':true})
  },
  onPortRecievedData:function(bytes) {
    console.log(Date(),"COM32: data recieved",bytes)
  },
  onPortClosed:function() {
    console.log(Date(),"COM32: closed")
    this.setState({'connect':false})
  },
  onPortError:function(e) {
    console.log(Date(),"COM32: error",e)
  },
  connectPort:function() {
    if (this.state.connect) {
      this.closePort()
    }
    else {
      conn.doConnect(this.onPortOpen,this)
    }
  },
  closePort:function() {
    conn.doClosePort();
  },
  sendCommand:function(cmd) {
    conn.doWritePort(cmd)
  }
});
module.exports=main;