/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var statusbar = React.createClass({displayName: 'statusbar',
  getInitialState: function() {
  },
  render: function() {
    var s=this.props.hideText
    s=s?s.replace(/</g,'&lt;'):'';
    return (
      React.DOM.pre( {dangerouslySetInnerHTML:{__html:s}})
    );
  }
});
module.exports=statusbar;