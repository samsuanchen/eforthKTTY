/** @jsx React.DOM */
//var othercomponent=Require("other"); 
var connecting = React.createClass({
  render: function() {
    return (
      <div className={this.props.className}>
        {this.props.connecting}
      </div>
    );
  }
});
module.exports=connecting;