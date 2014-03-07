/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var statusbar = React.createClass({
  getInitialState: function() {
    return {bytes: 5, cid:-1};
  },
  render: function() {
    return (
      <div className="statusbar">
        <label className="labBytes">
          {this.state.bytes}-byte Cmd
        </label>
        <label className="labConne">
          Connection Id {this.state.cid}
        </label>
      </div>
    );
  }
});
module.exports=statusbar;