/** @jsx React.DOM */
var titlebar = React.createClass({displayName: 'titlebar',
  render: function() {
    return (
      React.DOM.div( {className:"titlebar"}, "eForth KTTY")
    );
  }
});
module.exports=titlebar;