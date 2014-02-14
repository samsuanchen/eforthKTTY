var platform=function() { var r
	if (typeof process != "undefined") {
		r="nodewebkit"
	} else if (typeof chrome !="undefined") {
		r="chrome"
	}
	console.log('platform',r)
	return r
}
var S=nodeRequire("serialport")
var serialport=null
var doconnect_nodewebkit=function(onPortOpen,that) {
	serialport=new S.SerialPort(that.port,{baudrate:that.baud},false)
	serialport.open(function (e) {
		that.onOpen(e)
		serialport.on("data",that.onData)
		serialport.on("close",that.onClose)
		serialport.on("error",that.onError)
	})
}
var doconnect_chrome=function(onPortOpen,that) {
	openPort('COM32', 19200, onPortOpen)
//	openPort(e_port.value, parseInt(e_bitrate.value), onPortOpened)
}
var doconnect=eval('doconnect_'+platform())
debugger
module.exports={doconnect:doconnect}