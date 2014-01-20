var platform=function() {
	if (typeof process != "undefined") {
		return "nodewebkit"
	} else if (typeof chrome !="undefined") {
		return "chrome";
	}
}
var serialport=null;
var doconnect_nw=function(onPortOpened) {
	serialopen.open('com32',19200);
	//openPort('COM32', 19200, onPortOpened)
//	openPort(e_port.value, parseInt(e_bitrate.value), onPortOpened)
}

var doconnect_chrome=function(onPortOpened) {
	openPort('COM32', 19200, onPortOpened)
//	openPort(e_port.value, parseInt(e_bitrate.value), onPortOpened)
}
if (platform()=="chrome") {
	module.exports={doconnect:doconnect_chrome}
} else if (platform()=="nodewebkit") {
	serialport=new require("serialport")();
	module.exports={doconnect:doconnect_nw}
}