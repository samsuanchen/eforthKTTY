/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var ENTER_KEY=13, ESCAPE_KEY=27, CONTROL_Q_KEY=17, CONTROL_Z_KEY=26;
var CONTROL_KEY=[CONTROL_Q_KEY, CONTROL_Z_KEY];
var UP_KEY=38, DOWN_KEY=40
var $inputcmd, $inputfile, cmd, cmdLine=[], lineIndex=0;
var inputarea = React.createClass({
  getInitialState: function() {
    return {cmd: "SEE WORDS", file: "test.f"};
  },
  render: function() {
    return (
      <div>
        <button className="sendCmdBtn"
          onClick={this.sendcmd}>sendCmd</button>
        <textarea className="inputCmdBox"
          onKeyDown={this.cmdKeyDown}
          onPaste={this.props.onPasted}
          cols='80'
          rows='1'
          ref="inputcmd"
          defaultValue={this.state.cmd}/><br/>
        <button className="sendFileBtn"
          onClick={this.sendfile}>send File</button>
        <input className="inputFileBox"
          onKeyDown={this.fileKeyDown}
          size='60'
          ref="inputfile"
          defaultValue={this.state.file}>
        </input>
        dir <input className="systemBox"
          onChange={this.changeDir}
          defaultValue={this.props.system}>
        </input>
        lineDelay <input className="lineDelayBox"
          onChange={this.changeLineDelay}
          defaultValue={this.props.lineDelay}>
        </input>
      </div>
    );
  },
  componentDidUpdate:function() {
    $inputcmd=$inputcmd||this.refs.inputcmd.getDOMNode();
    $inputcmd.focus();
  },
  changeLineDelay: function (e) {
    this.props.onChangeLineDelay(e.target.value.trim());
  },
  changeDir: function (e) {
    this.props.onChangeDir(e.target.value.trim());
  },
  prevLine: function () {
    if (lineIndex) {
      $inputcmd=$inputcmd||this.refs.inputcmd.getDOMNode();
      if (lineIndex===cmdLine.length) cmd=$inputcmd.value;
      $inputcmd.value=cmdLine[--lineIndex];
    }
  },
  nextLine: function () {
    var c;
    if (lineIndex<cmdLine.length) {
      ++lineIndex;
      $inputcmd=$inputcmd||this.refs.inputcmd.getDOMNode();
      c= lineIndex===cmdLine.length?cmd:cmdLine[lineIndex];
      $inputcmd.value=c;
    }
  },
  cmdKeyDown: function (event) {
    var key=event.keyCode, ctrl=event.ctrlKey;
    if (key===16||key===17) return;
    if (key===UP_KEY) {
      this.prevLine();
      return;
    }
    if (key===DOWN_KEY) {
      this.nextLine();
      return;
    }
    if (ctrl) {
      key-=0x40;
    }
    if (key === ENTER_KEY) {
      this.sendcmd();
    } else if (key === ESCAPE_KEY) {
      this.props.onExecute(String.fromCharCode(key));
    } else if (CONTROL_KEY.indexOf(key)>=0) {
      this.props.onExecute(String.fromCharCode(key));
    };
  },
  fileKeyDown: function (event) {
    var key=event.keyCode;
    if (key === ENTER_KEY) {
      this.sendfile();
    };
  },
  sendcmd:function() {
    $inputcmd=$inputcmd||this.refs.inputcmd.getDOMNode();
    cmd=$inputcmd.value;
    if (cmdLine.length && (lineIndex=cmdLine.indexOf(cmd))>=0) {
      cmdLine=cmdLine.slice(0,lineIndex).concat(cmdLine.slice(lineIndex+1))
    }
    cmdLine.push(cmd);
    lineIndex=cmdLine.length;
    this.props.onExecute(cmd);
    this.setState({cmd:''});
    $inputcmd.value='';
  },
  sendfile:function() {
    $inputfile=$inputfile||this.refs.inputfile.getDOMNode();
    var file=this.props.system+'/'+$inputfile.value.trim();
    this.props.onXfer(file);
  }
});
module.exports=inputarea;