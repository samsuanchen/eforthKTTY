/** @jsx React.DOM */
// Component Specs and Lifecycle 須參考下列網址:
// http://facebook.github.io/react/docs/component-specs.html
var titlebar=Require("titlebar"); 
var outputarea=Require("outputarea"); 
var controlpanel=Require("controlpanel"); 
var statusbar=Require("statusbar"); 
var conn=Require("eforthKTTY/conn");
var recieved, text, log, ok, command;
var markInp=function(msg){
  return '<inp>'+msg+'</inp><br>';
};
var markOk=function(msg){
  return ' <ok>'+msg.trim().substr(0,1)+'</ok><br>\n';
};
var main = React.createClass({
  getInitialState: function() {
    return {
      cmd: "WORDS",
      port: "COM32",
      baud: 19200, 
      connect: false,
      system: "328eforth",
      command: '',
      getOk: false,
      ok: '',
      log: '',
      recieved: new Buffer(0)};
  },
  render: function() {
    return (
      <div>
        port: {this.state.port}
        baud: {this.state.baud}
        system: {this.state.system}
        connect: {this.state.connect.toString()}
        <titlebar/>
        <outputarea
          log      ={this.state.log}
          recieved ={this.state.recieved}/>
        <controlpanel
          connect  ={this.state.connect}
          onClose  ={this.  closePort}
          onConnect={this.connectPort}
          port     ={this.state.port}
          baud     ={this.state.baud}
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
    this.state.log='';
    this.state.recieved=null;
    window.onclose=this.closePort;
  },
  onPortRecievedData:function(bytes) {
    recieved=this.state.recieved || new Buffer(0);
    log=this.state.log;
    recieved=Buffer.concat([recieved,bytes],[2]);
    if (bytes[bytes.length-1]===6) {
      text=recieved.toString();
      recieved=new Buffer(0);
      console.log(Date(),this.state.port+": data recieved",text);
      if (!this.state.log) {
        recieved=new Buffer(0);
        var that=this;
        setTimeout( function() {
          that.sendCommand('');
          that.state.getOk=true;
        },10);
      }
      if (!this.state.ok && this.state.getOk) {
        this.state.ok=ok=text;
      }
      if(command)text=text.replace(RegExp('^'+command),markInp(command));
      if(ok)text=text.replace(RegExp(ok+'$'),markOk(ok));
      log=this.state.log+text;
    }
    this.setState({'recieved':recieved,'log':log});
  },
  onPortClosed:function() {
    console.log(Date(),this.state.port+": closed");
    this.setState({'connect':false});
  },
  onPortError:function(e) {
    console.log(Date(),this.state.port+": error",e);
  },
// 開關 com port
  connectPort:function() {
    if (this.state.connect)
      conn.doClosePort(this);
    else
      conn.doConnect(this.onPortOpen,this.state.port,this.state.baud,this);
  },
// 關閉 com port 
  closePort:function() {
    conn.doClosePort(this);
  },
// 寫到 com port
  sendCommand:function(cmd) {
    command=cmd;
    conn.doWritePort(cmd);
  }
});
module.exports=main;