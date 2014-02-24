/** @jsx React.DOM */
//var othercomponent=Require("other"); 
var connection = React.createClass({
  render: function() { var txt, flg;
    if (this.props.connecting) {
      txt='close';
      flg='warning';
    } else {
      txt='connect';
      flg='normal';
    }
    var txt=this.props.connecting?'close':'connect';
    return (
      <div>
        <button className={flg} onClick={this.doconnect}>{txt}</button>
      </div>
    );
  },
  doconnect:function() {
    //get port...
    this.props.onConnect(this.props.port,this.props.baud);
  }
});
module.exports=connection;