var platform=function() {
	if (typeof process != "undefined") {
		return "nodewebkit"
	} else if (typeof chrome !="undefined") {
		return "chrome"
	}
}
var serialport=null,timer=null;
var doconnect_nw=function(onPortOpened) {
	serialport.open(onPortOpened)
//	openPort(e_port.value, parseInt(e_bitrate.value), onPortOpened)
}
var doconnect_chrome=function(onPortOpened) {
	openPort('COM32', 19200, onPortOpened)
//	openPort(e_port.value, parseInt(e_bitrate.value), onPortOpened)
}
var opened=function(bytes) {
    if (typeof bytes !='undefined') {
      console.log(Date(),"COM32: openfail")
    } else {
      console.log(Date(),'COM32: opened')
    }
  }
var doconnect=null;

if (typeof chrome !="undefined") { // chrome
	doconnect=doconnect_chrome
} 
else if (typeof process != "undefined") { // nodewebkit
	debugger
	var S=nodeRequire("serialport")
	console.log("nodewebkit",S)
	serialport=new S.SerialPort('COM32',{baudrate:19200},false)
    doconnect=doconnect_nw
}

//this.timer=setInterval(doconnect, 1000)
//timer=setTimeout(doconnect,1000)
module.exports={doconnect:doconnect}