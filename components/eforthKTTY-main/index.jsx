/** @jsx React.DOM */

var titlebar=Require("titlebar"); 
var outputarea=Require("outputarea"); 
var controlpanel=Require("controlpanel"); 
var statusbar=Require("statusbar"); 
var conn=Require("eforthKTTY/conn");
var recieved;
var main = React.createClass({
  getInitialState: function() {
    return {
      cmd: "WORDS",
      port: "COM32",
      baud: 19200, 
      connect: false,
      system: "328eforth",
      recieved:new Buffer(0)};
  },
  render: function() {
    return (
      <div>
        port: {this.state.port}
        baud: {this.state.baud}
        system: {this.state.system}
        connect: {JSON.stringify(this.state.connect)}
        <titlebar/>
        <outputarea
          recieved ={this.state.recieved}/>
        <controlpanel
          onClose  ={this.  closePort}
          onConnect={this.connectPort}
          port={this.state.port}
          baud={this.state.baud}
          onExecute={this.sendCommand}/>
        <statusbar/>
      </div>
    );
  },
  onPortOpen:function(e) {
    if (e) {
      console.log(Date(),this.state.port+": openfail",e.message);
      return;
    }
    this.onPortOpened();
  },
  onPortOpened:function() {
    console.log(Date(),this.state.port+": opened");
    this.setState({'connect':true});
  },
  onPortRecievedData:function(bytes) {
    console.log(Date(),this.state.port+": data recieved",bytes);
    recieved=Buffer.concat([this.state.recieved,bytes],[2]);
    this.setState({'recieved':recieved});
  },
  onPortClosed:function() {
    console.log(Date(),this.state.port+": closed");
    this.setState({'connect':false});
  },
  onPortError:function(e) {
    console.log(Date(),this.state.port+": error",e);
  },
  connectPort:function() {
    if (this.state.connect) {
      this.closePort();
    }
    else {
      conn.doConnect(this.onPortOpen,this.state.port,this.state.baud,this);
    }
  },
  closePort:function() {
    conn.doClosePort(this);
  },
  sendCommand:function(cmd) {
    conn.doWritePort(cmd);
  }
});
module.exports=main;