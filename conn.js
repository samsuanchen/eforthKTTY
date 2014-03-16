debugger
var platform=function() { var r
	if (typeof process != "undefined") {
		r="nodewebkit"
	} else if (typeof chrome !="undefined") {
		r="chrome"
	}
	return r
}
var platForm=platform()
if (platForm=='nodewebkit') {
	var S=nodeRequire("serialport")
	var serialport=null
	console.log('platform',platForm)
}
var doConnect_nodewebkit=function(onPortOpen,port,baud,that) {
	serialport=new S.SerialPort(port,
		{baudrate:baud},false)
	var other=that
	serialport.open(function (e) {
		other.onPortOpen(e)
		serialport.on("data",other.onPortRecievedData)
		serialport.on("close",other.onPortClosed)
		serialport.on("error",other.onPortError)
	})
}
var doWritePort_nodewebkit=function(command) {
	if (!command||command.charCodeAt(0)>=0x20)
		command+='\r'
	serialport.write(command)
}
var doClosePort_nodewebkit=function(that) {
	serialport.close()
}
var doConnect_chrome=function(onPortOpen,that) {
	openPort('COM32', 19200, onPortOpen)
//	openPort(e_port.value, parseInt(e_bitrate.value), onPortOpened)
}
var doConnect  =eval('doConnect_'  +platForm)
var doWritePort=eval('doWritePort_'+platForm)
var doClosePort=eval('doClosePort_'+platForm)
var fs=nodeRequire("fs")
var readFile=function(fileName) {
	return fs.readFileSync(fileName).toString().split('\r\n');
}
var saveState=function(state) {
	var s="module.exports="+JSON.stringify(state,undefined,' ');
	return fs.writeFileSync("settings.js",s);
}
module.exports={
	readFile:readFile,
	saveState:saveState,
	doConnect:doConnect,
	doWritePort:doWritePort,
	doClosePort:doClosePort}