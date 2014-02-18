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
var doConnect_nodewebkit=function(onPortOpen,that) {
	serialport=new S.SerialPort(that.port,{baudrate:that.baud},false)
	var other=that
	serialport.open(function (e) {
		other.onPortOpen(e)
		serialport.on("data",other.onPortRecievedData)
		serialport.on("close",other.onPortClosed)
		serialport.on("error",other.onPortError)
	})
}
var doWritePort_nodewebkit=function(command) {
	serialport.write(command+'\r')
}
var doClosePort_nodewebkit=function() {
	serialport.close()
}
var doConnect_chrome=function(onPortOpen,that) {
	openPort('COM32', 19200, onPortOpen)
//	openPort(e_port.value, parseInt(e_bitrate.value), onPortOpened)
}
var doConnect  =eval('doConnect_'  +platForm)
var doWritePort=eval('doWritePort_'+platForm)
var doClosePort=eval('doClosePort_'+platForm)
module.exports={
	doConnect:doConnect,
	doWritePort:doWritePort,
	doClosePort:doClosePort}