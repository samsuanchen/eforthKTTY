/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var statusbar = React.createClass({
  getInitialState: function() {
  },
  render: function() { var stack, words, hideText, match;
  	stack='empty';
  	words='';
  	hideText=this.props.hideText;
  	if (hideText) {
	  	match=hideText.match(/inp>.\r\n (.*)&lt;sp\r\n(.*) <ok>/m);
	  	if (match) {
	  		stack=match[1];
	  		stack=stack?stack:"empty";
	  		words=match[2];
	  	};
	};
    return (
    <div className="statusbar">
      <div className="stack">
      	dataStack: <span ref="dataStack">{stack}</span>
      </div>
      <pre className="words"
       dangerouslySetInnerHTML={{__html:words}}/>
    </div>
    );
  }
});
module.exports=statusbar;