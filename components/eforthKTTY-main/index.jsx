/** @jsx React.DOM */

var titlebar=Require("titlebar"); 
var outputarea=Require("outputarea"); 
var controlpanel=Require("controlpanel"); 
var statusbar=Require("statusbar"); 
var conn=Require("eforthKTTY/conn");
var main = React.createClass({
  getInitialState: function() {
    return {cmd: "WORDS"};
  },
  render: function() {
    return (
      <div>
        <titlebar/>
        <outputarea/>
        <controlpanel onConnect={this.connect} onExecute={this.execcmd}/>
        <statusbar/>
      </div>
    );
  },
  connect:function() {
    conn.doconnect();
    
  },
  execcmd:function(cmd) {
    console.log(cmd);
  }

});
module.exports=main;