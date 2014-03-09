/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var $=Require("jquery");
var $outputarea;
var outputarea = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
	  var s=this.props.log+this.props.lastText;
    s=s.replace(/(\r\n)+(ERROR#\d+)/mg,function(M){
      return '<error>'+M+'<\/error>';
    });
    return (
      <pre ref="outputarea" className="outputarea"
  		dangerouslySetInnerHTML={{__html:s}}/>
    );
  },
  componentDidUpdate:function() {
  	$outputarea=$outputarea||$(this.refs.outputarea.getDOMNode());
  	$outputarea.scrollTop($outputarea[0].scrollHeight);
  }
});
module.exports=outputarea;