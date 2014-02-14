/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var statusbar = React.createClass({displayName: 'statusbar',
  getInitialState: function() {
    return {bytes: 5, cid:-1};
  },
  render: function() {
    return (
      React.DOM.div( {className:"statusbar"}, 
        React.DOM.label( {className:"labBytes"}, 
          this.state.bytes,"-byte Cmd "
        ),
        React.DOM.label( {className:"labConne"}, 
          " Connection Id ", this.state.cid
        )
      )
    );
  }
});
module.exports=statusbar;