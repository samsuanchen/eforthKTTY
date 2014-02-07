var platform=function() {
	if (typeof process != "undefined") {
		return "nodewebkit"
	} else if (typeof chrome !="undefined") {
		return "chrome"
	}
}
var serialport=null;
var doconnect_nw=function(onPortOpened) {
	var S=new nodeRequire("serialport")
	this.serialport=S.SerialPort(
        'COM32',
        {baudrate:19200},false
    )
	this.serialport.open(onPortOpened)
//	openPort(e_port.value, parseInt(e_bitrate.value), onPortOpened)
}
var onPortOpened=function(){
	console.log(Date(),'onPortOpened')
}
var doconnect_chrome=function(onPortOpened) {
	openPort('COM32', 19200, onPortOpened)
//	openPort(e_port.value, parseInt(e_bitrate.value), onPortOpened)
}
var doconnect
if (typeof chrome !="undefined") { // chrome
	doconnect=doconnect_chrome
} 
else if (typeof process != "undefined") { // nodewebkit
    doconnect=doconnect_nw
}
this.timer=setInterval(doconnect, 1000)
module.exports={doconnect:doconnect}