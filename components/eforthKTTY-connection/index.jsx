/** @jsx React.DOM */
//var othercomponent=Require("other"); 
var connection = React.createClass({
  render: function() { var connecting, txt, flg, act;
    connecting=this.props.connecting;
    flg=connecting?'warning':'normal';
    txt=connecting?'close':'connect';
    act=connecting?this.doclose:this.doconnect;
    return (
      <div>
        <button className={flg} onClick={act}>{txt}</button>
      </div>
    );
  },
  doconnect:function() {
    this.props.onConnect(this.props.port,this.props.baud);
  },
  doclose:function() {
    this.props.onClose();
  }
});
module.exports=connection;