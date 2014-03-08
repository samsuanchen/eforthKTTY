/** @jsx React.DOM */
var titlebar=Require("titlebar"); 
var outputarea=Require("outputarea"); 
var controlpanel=Require("controlpanel"); 
var statusbar=Require("statusbar"); 
var conn=Require("eforthKTTY/conn");
var lib=Require("eforthKTTY/lib");

// 前述 Component 的 Spec 及 Lifecycle 可參考下列網址
// http://facebook.github.io/react/docs/component-specs.html
var recieved, lastByte, lastText, log='', ok;
var HIDE_KEY=1;
var hiddenCmd='1 EMIT CR .S CR WORDS';
var bHiddenCmd, hide, hideText;
var ACK_KEY=6;
var cmd, lastCmd;
var fileName, lines, lineIndex;
var Error_00=function(j){
  log+='<error>ERROR#00</error> 328eforth commad too long\r\n';
  log+='(bytes > 80) NOTE! each Chinese (UTF8) 3 bytes\r\n';
  log+=cmd.substr(0,j-1)+'<error>'+cmd.substr(j-1)+'</error>';
  if (fileName) {
    log+='\r\nAt line '+lineIndex+' of '+fileName;
  }
  lines=[];
  this.setState({'lastText':''});
}
var connectingState = React.createClass({
  render: function() {
    var connecting=this.props.connecting;
    var s=connecting?'true':'False (please click "connect")';
    return (
      <span className={this.props.className}>{s}</span>
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
      getOk: false,
      ok: '',
      log: '',
      lastText: ''};
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
          log      ={log}
          lastText ={this.state.lastText}/>
        <controlpanel
          connecting  ={connecting}
          onClose  ={this.closePort}
          onConnect={this.connectPort}
          port     ={this.state.port}
          baud     ={this.state.baud}
          system   ={this.state.system}
          onExecute={this.sendCommand}
          onPasted ={this.sendPasted}
          onXfer   ={this.sendFile}/>
        <statusbar 
          hideText ={hideText}/>
      </div>
    );
  },
  onPortOpen:function(e) {
    if (e) {
      console.log(Date(),this.state.port,"openfailed:",e.message);
      return;
    }
    this.onPortOpened();
  },
  onPortOpened:function() {
    console.log(Date(),this.state.port,"opened");
    this.setState({'connecting':true});
    log=ok='';
    bHiddenCmd='[ '+hiddenCmd+' ]';
    recieved=new Buffer(0);
    window.onclose=this.closePort;
  },
  onPortRecievedData:function(bytes) {
    lastByte=bytes[bytes.length-1];
    console.log(Date(),this.state.port,bytes.length,"bytes recieved:",bytes);
    recieved=Buffer.concat([recieved,bytes],[2]);
    lastText=recieved.toString();
    if(lastCmd) {
      lastText=lib.markInp(lastText,lastCmd);
      var M=lastText.match(/<\/.+?>(.+)/m)
      if (M) {
        if (M[1].charCodeAt(0)===HIDE_KEY) {
          hide=true;
        }
      }
    }
    if (lastByte===ACK_KEY) {
      recieved=new Buffer(0);
      console.log(Date(),this.state.port,"lastText recieved:",lastText,'hide',hide);
      if (!log) {
        var that=this;
        setTimeout( function() {
          that.sendCommand('');
          that.state.getOk=true;
        },10);
      }
      if (!this.state.ok && this.state.getOk) {
        this.state.ok=ok=lastText;
      }
      if(ok)lastText=lib.markOk(lastText,ok);
      lastText=lastText.replace(/^(\r\n)+/,'')
               .replace(/(\r\n)+\r\x06$/,'\r\n')
               .replace(/(\r\n)+/g,'\r\n');
      if (!hide) {
        log+=lastText;
        hideText='';
      } 
      else {
        hideText=lastText;
        hide=false;
      }
      lastText='';
      if (lines&&lines!=[hiddenCmd]&&lines!=[bHiddenCmd]&&lineIndex<lines.length) {
        cmd=lines[lineIndex++];
        if (cmd!==lastCmd) {
          console.log("line",lineIndex,cmd);
          this.sendCommand(cmd);
        }
      } else if (lineIndex) {
        var file=fileName?fileName:'pasted lines';
        console.log(Date(),this.state.port,"end of",file);
        fileName='';
      }
    }
    if (!hide) this.setState({'lastText':lastText,'log':log});
  },
  onPortError:function(e) {
    console.log(Date(),this.state.port,"error",e);
  },
  onPortClosed:function() {
    console.log(Date(),this.state.port,"closed");
    this.setState({'connecting':false});
  },
// 開關 com port
  connectPort:function() {
    conn.doConnect(this.onPortOpen,this.state.port,this.state.baud,this);
  },
// 關閉 com port 
  closePort:function() {
    conn.doClosePort(this);
    fileName='';
    lines=[];
    lineIndex=0;
  },
// 寫到 com port
  sendCommand:function(cmd) {
    if ((cmd===hiddenCmd||cmd===bHiddenCmd)&&cmd===lastCmd) return
    console.log(Date(),this.state.port,"sendCommand:",cmd);
    cmd=cmd.replace(/^(\r?\n)+/,'');
    var j=lib.utf8StrTooLong(cmd);
    if (j) {
      this.Error_00(j);
      return;
    }
    this.setState({'cmd':cmd});
    if (cmd=== hiddenCmd&&ok&&!log.match(/ok>\r\n$/)) cmd=bHiddenCmd; 
    lastCmd=cmd;
    conn.doWritePort(cmd);
    if (!lines||lineIndex>=lines.length) { // undertable executing
      if (cmd=== hiddenCmd||cmd===bHiddenCmd) return;
      lines=[hiddenCmd];
      lineIndex=0;
    }
  },
  sendPasted: function (event) {
    var that=this, target=event.target;
    setTimeout(function(){
      lines=target.value.split(/\r?\n/);
      console.log(Date(),that.state.port,"sendPasted",lines.length,"line(s)");
      lineIndex=0;
      that.sendCommand(lines[lineIndex++]);
      target.value='';
    },0); // defer the handler to the next event
  },
// 寫到 com port
  sendFile:function(file) {
    console.log(Date(),this.state.port,"sendFile:",file);
    fileName=file;
    lines=conn.readFile(fileName);
    if (lines.length) {
      console.log(Date(),this.state.port,"start of",fileName);
      lineIndex=0;
      this.sendCommand(lines[lineIndex++]);
    } else {
      console.log(Date(),this.state.port,"empty",fileName);
    }
  },
  Error_00:function(j){
    log+='<error>ERROR#00</error> 328eforth commad too long\r\n';
    log+='(bytes > 80) NOTE! each Chinese (UTF8) 3 bytes\r\n';
    log+=cmd.substr(0,j-1)+'<error>'+cmd.substr(j-1)+'</error>\r\n';
    if (fileName) {
      log+='At line '+lineIndex+' of '+fileName;
    }
    log+=lib.markOk(ok,ok);
    this.setState({'lastText':''});
    lines=[];
    this.sendCommand(hiddenCmd);
  }
});
module.exports=main;