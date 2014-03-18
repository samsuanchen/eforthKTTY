/** @jsx React.DOM */
var titlebar=Require("titlebar"); 
var outputarea=Require("outputarea"); 
var controlpanel=Require("controlpanel"); 
var statusbar=Require("statusbar");
// 前述 Component 的 Spec 及 Lifecycle 可參考下列網址
// http://facebook.github.io/react/docs/component-specs.html 
var conn=Require("eforthKTTY/conn");
var lib=Require("eforthKTTY/lib");
var recieved, lastByte, lastText, log='', ok, getOk;
var HIDE_KEY=1;
var hiddenCmd='1 EMIT CR .S CR WORDS';
var bHiddenCmd, hide, hideText;
var ACK_KEY=6;
var timer, cmd, lastCmd, error=0;
var fileName, lines, lineIndex, lineDelay;
var main = React.createClass({
  getInitialState: function() {
    var state=nodeRequire('./settings.js');
    state.connecting=false;
    return state;  
  }, 
  render: function() {
    var connecting=this.state.connecting;
    var className=connecting?'ready':'notReady';
    return (
      <div className="main">
        <titlebar/>
        <outputarea
          log       ={log}
          lastText  ={this.state.lastText}/>
        <controlpanel
          connecting={connecting}
          onClose   ={this.closePort}
          onConnect ={this.connectPort}
          onPortChange={this.onPortChange}
          onBaudChange={this.onBaudChange}
          onChangeDir={this.onChangeDir}
          onChangeLineDelay={this.onChangeLineDelay}
          port      ={this.state.port}
          baud      ={this.state.baud}
          onExecute ={this.sendCommand}
          onPasted  ={this.sendPasted}
          onXfer    ={this.sendFile}
          system    ={this.state.system}
          lineDelay ={this.state.lineDelay}/>
        <statusbar 
          hideText  ={hideText}/>
      </div>
    );
  },
  onPortChange:function(port) {
    if (this.state.connecting)
      this.closePort();
    this.state.port=port;
    conn.saveState(this.state);
  },
  onBaudChange:function(baud) {
    if (this.state.connecting)
      this.closePort();
    this.state.baud=baud;
    conn.saveState(this.state);
  },
  onChangeDir:function(dir) {
    this.state.system=dir;
    conn.saveState(this.state);
  },
  onChangeLineDelay:function(delay) {
    this.state.lineDelay=lineDelay=delay;
    conn.saveState(this.state);
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
    hide=getOk=false;
    recieved=new Buffer(0);
    lineDelay=this.state.lineDelay;
    window.onclose=this.closePort;
  },
  onPortRecievedData:function(bytes) {
    lastByte=bytes[bytes.length-1];
  //console.log(Date(),this.state.port,bytes.length,"bytes recieved:",bytes);
    recieved=Buffer.concat([recieved,bytes],[2]);
    error=0;
    lastText=recieved.toString()
        .replace(/(\r?\n)+(ERROR#\d+)/mg,function(M){
          error++;
          lines=[];
          lineIndex=0;
          return '<error>'+M+'<\/error>';
        });;
    if(lastCmd) {
      // check if last command needs to be hidden
      if (lib.firstOutputByte(lastText,lastCmd)===HIDE_KEY)
        hide=true;
      // use blue to color the last command
      lastText=lib.markInp(lastText,lastCmd);
    }
    if (lastByte===ACK_KEY) { // ready to send next command
      recieved=new Buffer(0);
      console.log(Date(),this.state.port,"text recieved:",lastText,'hide',hide);
      if (!log) {
        var that=this;
        setTimeout( function() {
          that.sendCommand('');
          getOk=true;
        },10);
      }
      if (!ok && getOk) {
        ok=lastText;
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
      clearTimeout(timer);
      this.sendNextCommand();
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
  sendCommand:function(cmd) { var j;
    console.log(Date(),this.state.port,"sendCommand:\r\n",cmd);
    // A. ignore leading \r\n
    cmd=cmd.replace(/^(\r?\n)+/,'');
    // B. check if cmd too long
    if (j=lib.utf8StrTooLong(cmd)) {
      this.Error_00(j,cmd);
      return;
    }
    this.setState({'cmd':cmd});
    // C. if hidden cmd then adjust for compiling mode
    if (cmd=== hiddenCmd&&ok&&!log.match(/ok>\r\n$/))
      cmd=bHiddenCmd;
    // D. current cmd processing
    conn.doWritePort(cmd);
    // E. remember current cmd
    lastCmd=cmd;
    if (lineDelay)
      timer=setTimeout(this.sendNextCommand,lineDelay);
    // F. hidden cmd processing
    if (cmd=== hiddenCmd||cmd===bHiddenCmd) return;
    if (!lines||lineIndex>=lines.length) {
      lines=[hiddenCmd];
      lineIndex=0;
    }
  },
  sendNextCommand:function() {
    if (error) {
        lines = [];
        return;
    }
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
  },
  sendPasted: function (event) {
    var target=event.target;
    if (target.value) return; // do nothing if command box not empty
    var that=this;
    setTimeout(function(){ // defer to next event to get pasted lines
      lines=target.value.split(/\r?\n/);
      console.log(Date(),that.state.port,"sendPasted",lines.length,"line(s)");
      lineIndex=0;
      that.sendCommand(lines[lineIndex++]); // send the first line
      target.value='';
    },0);
  },
// 寫到 com port
  sendFile:function(file) {
    console.log(Date(),this.state.port,"sendFile:",file);
    fileName=file;
    lines=conn.readFile(fileName);
    console.log(Date(),this.state.port,"start of",fileName);
    lineIndex=0;
    this.sendCommand(lines[lineIndex++]);
  },
  Error_00:function(j,cmd){
    log+='ERROR#00 : command too long\r\n';
    log+='(bytes > 80) NOTE! each Chinese (UTF8) 3 bytes\r\n';
    log+=cmd.substr(0,j-1)+'<error>'+cmd.substr(j-1)+'</error>\r\n';
    if (fileName) {
      log+='At line '+lineIndex+' of '+fileName;
    }
    log+=lib.markOk(ok,ok);
    this.setState({'lastText':''});
    lines = [];
    lineIndex=0;
    this.sendCommand(hiddenCmd);
  }
});
module.exports = main;