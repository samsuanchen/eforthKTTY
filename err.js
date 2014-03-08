var Error_00=function(j){
  log+='<error>ERROR#00</error> 328eforth commad too long\r\n';
  log+='(bytes > 80) NOTE! each Chinese (UTF8) 3 bytes\r\n';
  log+=cmd.substr(0,j-1)+'<error>'+cmd.substr(j-1)+'</error>';
  if (fileName) {
    log+='\r\nAt line '+lineIndex+' of '+fileName;
  }
  lines=[];
  this.setState({'lastText':''});
}
module.exports={
	Error_00:Error_00}