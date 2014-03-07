/** @jsx React.DOM */
// Component Specs and Lifecycle 須參考下列網址:
// http://facebook.github.io/react/docs/component-specs.html
var  hiddenCommand=  '1 EMIT CR .S CR WORDS'  ;
var bHiddenCommand='[ 1 EMIT CR .S CR WORDS ]';
var titlebar=Require("titlebar"); 
var outputarea=Require("outputarea"); 
var controlpanel=Require("controlpanel"); 
var statusbar=Require("statusbar"); 
var conn=Require("eforthKTTY/conn");
var recieved, text, log, ok, cmd, command, fileName, lines, lineIndex;
var lastByte, hide, hideText;
var ACK_KEY=6;
var markInp=function(text,inp){
  var p=RegExp('^'+inp
    .replace(/\\/g,'\\\\').replace(/\t/g," ")
    .replace(/\|/g,'\\|').replace(/\'/g,"\\'")
    .replace(/\./g,'\\.').replace(/\?/g,'\\?')
    .replace(/\+/g,'\\+').replace(/\*/g,'\\*')
    .replace(/\^/g,'\\^').replace(/\$/g,'\\$')
    .replace(/\[/g,'\\[').replace(/\]/g,'\\]')
    .replace(/\(/g,'\\(').replace(/\)/g,'\\)')
    .replace(/\{/g,'\\{').replace(/\}/g,'\\}')
  );
  return text.replace(p,'<inp>'+inp+'</inp>');
};
var markOk=function(text,ok){
  var p=RegExp(ok+'$');
  return text.replace(p,' <ok>'+ok.trim().substr(0,1)+'</ok>\r\n');
};
var connectingState = React.createClass({
  render: function() {
    var msg=this.props.connecting?'true':'False (please click "connect")';
    return (
      <span className={this.props.className}>
        {msg}
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
    this.state.log=log=ok='';
    this.state.recieved=null;
    window.onclose=this.closePort;
  },
  onPortRecievedData:function(bytes) {
    lastByte=bytes[bytes.length-1];
    console.log(Date(),this.state.port,bytes.length,"bytes recieved:",bytes);
    recieved=this.state.recieved || new Buffer(0);
    log=this.state.log;
    recieved=Buffer.concat([recieved,bytes],[2]);
    text=recieved.toString();
    if(command) {
      text=markInp(text,command);
      var M=text.match(/<\/.+?>(.+)/m)
      if (M) {
        if (M[1].charCodeAt(0)===1) {
          hide=true;
        }
      }
    }
    if (lastByte===ACK_KEY) {
      recieved=new Buffer(0);
      console.log(Date(),this.state.port,"text recieved:",text,'hide',hide);
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
      if(ok)text=markOk(text,ok);
      text=text.replace(/^(\r\n)+/,'')
               .replace(/(\r\n)+\r\x06$/,'\r\n')
               .replace(/(\r\n)+/g,'\r\n');
      if (!hide) {
        log+=text;
        hideText='';
      } 
      else {
        hideText=text;
        hide=false;
      }
      text='';
      if (lines&&lines!=[hiddenCommand]&&lines!=[bHiddenCommand]&&lineIndex<lines.length) {
        cmd=lines[lineIndex++];
        if (cmd!==command) {
          console.log("line",lineIndex,cmd);
          this.sendCommand(cmd);
        }
      //  var that=this;
      //  setTimeout( function() {
      //    that.sendCommand(lines[lineIndex++]);
      //  },50);
      } else if (lineIndex) {
        var file=fileName?fileName:'pasted lines';
        console.log(Date(),this.state.port,"end of",file);
        fileName='';
      }
    }
    this.state.recieved=recieved;
    if (!hide) this.setState({'lastText':text,'log':log});
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
    if (this.state.connecting)
      conn.doClosePort(this);
    else
      conn.doConnect(this.onPortOpen,this.state.port,this.state.baud,this);
  },
// 關閉 com port 
  closePort:function() {
    conn.doClosePort(this);
    fileName='';
    lines=[];
    lineIndex=0;
  },
  onHide:function(text) {
    this.setState({hideText:text});
  },
// 寫到 com port
  sendCommand:function(cmd) {
    if (cmd===command&&(cmd===hiddenCommand||cmd===bHiddenCommand)) return
    console.log(Date(),this.state.port,"sendCommand:",cmd);
    var n=0, i, j=0;
    cmd=cmd.replace(/^(\r?\n)+/,'');
    for (i=0;i<cmd.length;i++) {
      n+=cmd.charCodeAt(i)>0x80?3:1;
      if (!j && n>80) j=i;
    }
    if (j) {
      text+='<error>ERROR!</error> 328eforth commad too long of ';
      text+=n+' bytes > 80, NOTE! each Chinese (UTF8) 3 bytes\r\n';
      text+=cmd.substr(0,j-1)+'<error>'+cmd.substr(j-1)+'</error>';
      if (fileName) {
        text+='\r\nAt line-'+(lineIndex+1)+' of '+fileName;
      }
      lines=[];
      this.setState({'lastText':text});
      return;
    }
    this.setState({'cmd':cmd});
    if (cmd=== hiddenCommand&&ok&&!log.match(/ok>\r\n$/)) cmd=bHiddenCommand; 
    command=cmd;
    conn.doWritePort(cmd);
    if (!lines||lineIndex>=lines.length) { // undertable executing
      if (cmd=== hiddenCommand||cmd===bHiddenCommand) return;
      lines=[hiddenCommand];
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
  }
});
module.exports=main;