/** @jsx React.DOM */
var titlebar=Require("titlebar")
var outputarea=Require("outputarea") 
var controlpanel=Require("controlpanel")
var statusbar=Require("statusbar")
var conn=Require("eforthKTTY/conn")
var lib=Require("eforthKTTY/lib")
var recieved, lastByte, lastText, log='', ok, getOk
var iLast
var HIDE_KEY=1
var hiddenCmd='1 EMIT CR .S CR WORDS'
var bHiddenCmd, hide, hideText
var waitCmd=6
var waitKey=5
var checkKey=4
var keyPressed
var timer, cmd, lastCmd, error=0
var fileName, lines, lineIndex, lineDelay
var main = React.createClass({
  getInitialState: function() {
    var state=nodeRequire('./settings.js')
    state.log='';
    state.lastText='';
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
          cmd={this.state.cmd}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
          file={this.state.file}
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
  // 前述 Component 的 Spec 及 Lifecycle 可參考下列網址
  // http://facebook.github.io/react/docs/component-specs.html 
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
    for (iLast=bytes.length-1;iLast>=0;iLast--) {
      lastByte=bytes[iLast];
      if (lastByte>=checkKey&&lastByte<=waitCmd)
        break;
    }
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
      // flag to check if last command needs to be hidden
      hide = lib.firstOutputByte(lastText,lastCmd)===HIDE_KEY;
      // use blue to color the last command
      lastText=lib.markInp(lastText,lastCmd);
    }
    if (lastByte>=checkKey&&lastByte<=waitCmd) { // ready to send next input
      recieved=bytes.slice(iLast+1);
      lastText=lastText.substr(0,lastText.length-recieved.length);
      if (!log) {
        var that=this;
        setTimeout( function() {
          that.sendCommand('');
          getOk=true;
        },4000);
      }
      if (!ok && getOk) {
        ok=lastText;
      }
      if(ok)lastText=lib.markOk(lastText,ok);
      lastText=lastText.replace(/^(\r\n)+/,'')
               .replace(/(\r\n)+\r\x06$/,'\r\n')
               .replace(/(\r\n)+/g,'\r\n');
      if (hide) {
        hideText=lastText;
        hide=false;
      } else {
        console.log(this.state.port,"text recieved:",lastText,'hide',hide);
        log+=lastText;
        hideText='';
      }
      lastText='';
      this.setState({'lastText':lastText,'log':log});
      clearTimeout(timer);
      if (lastByte===waitCmd) {
        this.sendNextCommand();
      } else if (lastByte===checkKey) {
        if (keyPressed) {
          conn.doWritePortKey(keyPressed);
          keyPressed=null;
        }
      }
    } else if (!hide) { // lastByte > waitCmd
      this.setState({'lastText':lastText});
    }
  },
  onKeyDown:function(e){
    keyPressed=e.keyCode
    if(lastByte===waitKey) {
      conn.doWritePortKey(keyPressed)
    } else if (lastByte===checkKey) {
      return true
    }
  },
  onKeyUp:function(e){
    keyPressed=null
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
    if (cmd==='      FOR COUNT DUP BL < OVER $FE > OR')
      console.log("cmd='      FOR COUNT DUP BL < OVER $FE > OR'");
    // A. ignore leading \r\n
    cmd=cmd.replace(/^(\r?\n)+/,'');
    // B. check if cmd too long
    if (j=lib.utf8StrTooLong(cmd)) {
      this.Error_00(j,cmd);
      return;
    };
    // C. if hidden cmd then adjust for compiling mode
    if (cmd=== hiddenCmd&&ok&&!log.match(/ok>\r?\n$/))
      cmd=bHiddenCmd;
    // D. current cmd processing
    conn.doWritePort(cmd);
    // E. remember current cmd
    lastCmd=cmd.replace(/\t/g,' ');
    if (cmd=== hiddenCmd||cmd===bHiddenCmd) {
      timer=setTimeout(this.sendNextCommand,500);
      return;
    }
    if (lineDelay)
      timer=setTimeout(this.sendNextCommand,lineDelay);
    if (!lines||lineIndex>=lines.length) {
    // F. hidden cmd processing
      lines=[hiddenCmd];
      lineIndex=0;
    };
  },
  sendNextCommand:function() {
    if (error               ||
        !lines              ||
        lines===[ hiddenCmd]||
        lines===[bHiddenCmd]||
        lineIndex>=lines.length)
        return;
    cmd=lines[lineIndex++];
    if (cmd!==lastCmd) {
      //console.log("line",lineIndex,cmd);
      this.sendCommand(cmd);
    };
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
  //console.log(Date(),this.state.port,"start of",fileName);
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