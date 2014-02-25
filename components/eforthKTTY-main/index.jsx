/** @jsx React.DOM */
// Component Specs and Lifecycle 須參考下列網址:
// http://facebook.github.io/react/docs/component-specs.html
var fs=nodeRequire("fs"); 
var titlebar=Require("titlebar"); 
var outputarea=Require("outputarea"); 
var controlpanel=Require("controlpanel"); 
var statusbar=Require("statusbar"); 
var conn=Require("eforthKTTY/conn");
var recieved, text, log, ok, command;
var markInp=function(msg){
  return '<inp>'+msg+'</inp>';
};
var markOk=function(msg){
  return ' <ok>'+msg.trim().substr(0,1)+'</ok><br>\n';
};
var connectingState = React.createClass({
  render: function() {
    return (
      <span className={this.props.className}>
        {this.props.connecting.toString()}
      </span>
    );
  }
});
var main = React.createClass({
  getInitialState: function() {
    return {
      cmd: "WORDS",
      port: "COM32",
      baud: 19200, 
      connecting: false,
      system: "328eforth",
      command: '',
      getOk: false,
      ok: '',
      log: '',
      lastText: '',
      recieved: new Buffer(0)};
  },
  render: function() {
    var connecting=this.state.connecting;
    var className=connecting?'ready':'notReady';
    return (
      <div>
        port: {this.state.port}
        baud: {this.state.baud}
        system: {this.state.system}
        connecting: <connectingState
                      className={className}
                      connecting={connecting}/>
        <titlebar/>
        <outputarea
          log      ={this.state.log}
          lastText ={this.state.lastText}
          recieved ={this.state.recieved}/>
        <controlpanel
          connecting  ={connecting}
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
    this.setState({'connecting':true});
    this.state.log='';
    this.state.recieved=null;
    window.onclose=this.closePort;
  },
  onPortRecievedData:function(bytes) {
    recieved=this.state.recieved || new Buffer(0);
    log=this.state.log;
    recieved=Buffer.concat([recieved,bytes],[2]);
    text=recieved.toString();
    if (bytes[bytes.length-1]===6) {
      recieved=new Buffer(0);
      console.log(Date(),this.state.port+": data recieved",text);
      if (!this.state.log) {
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
      if(log)
        text=text.replace(/(\r\n)+/g,'<br>');
      else
        text=text.replace(/^(\r\n){2,}/,'<br>');
      log+=text;
      text='';
    }
    this.setState({'lastText':text,'log':log, 'recieved':recieved});
  },
  onPortError:function(e) {
    console.log(Date(),this.state.port+": error",e);
  },
  onPortClosed:function() {
    console.log(Date(),this.state.port+": closed");
    this.setState({'connecting':false});
  },
// 開關 com port
  connectPort:function() {
    if (this.state.connecting)
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