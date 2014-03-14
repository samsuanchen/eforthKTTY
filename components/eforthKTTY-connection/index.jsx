/** @jsx React.DOM */
//var othercomponent=Require("other"); 
var connection = React.createClass({
  render: function() { var connecting, className, flg, txt, act, sta;
    connecting=this.props.connecting;
    className=connecting?'ready':'notReady';
    flg=connecting?'warning':'normal';
    txt=connecting?'close':'connect';
    act=connecting?this.doclose:this.doconnect;
    sta=connecting?this.props.port:'none (please click "connect")';
    return (
      <div className="connection">
        port <input className="portBox"
          onChange={this.portChange}
          defaultValue={this.props.port}>
        </input>
        baud <input className="baudBox"
          onChange={this.baudChange}
          defaultValue={this.props.baud}>
        </input>
        <button className={flg} onClick={act}>{txt}</button>
        <span className={className}>{sta}</span>
      </div>
    );
  },
  doconnect:function() {
    this.props.onConnect(this.props.port,this.props.baud);
  },
  doclose:function() {
    this.props.onClose();
  },
  portChange:function(e) {
    this.props.onPortChange(e.target.value.trim());
  },
  baudChange:function(e) {
    this.props.onBaudChange(e.target.value.trim());
  }
});
module.exports=connection;