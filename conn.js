debugger
var platform=function() { var r
	if (typeof process != "undefined") {
		r="nodewebkit"
	} else if (typeof chrome !="undefined") {
		r="chrome"
	}
	console.log('platform',r)
	return r
}
if (platform()=='nodewebkit') {
	var S=nodeRequire("serialport")
	var serialport=null
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
var doConnect  =eval('doConnect_'  +platform())
var doWritePort=eval('doWritePort_'+platform())
module.exports={doConnect:doConnect,doWritePort:doWritePort}