var firstOutputByte=function(x,inp) {
  var i=inp.length;
  var r=x.substr(0,i)===inp;
  if (r)
    r=x.charCodeAt(i);
  return r;
}
var utf8StrTooLong=function(str){
  var n=0, i, j=0;
  for (i=0;i<str.length;i++) {
    n+=str.charCodeAt(i)>0x80?3:1;
    if (n>80) {
      j=i;
      break;
    }
  }
  return j;
}
var markInp=function(text,inp){
  var n=inp.length;
  var h=text.substr(0,n);
  var t=text.substr(n);
  if (h===inp) {
    text='<inp>'+h.replace(/</g,'&lt;')+'</inp>'+t.replace(/</g,'&lt;');
  }
  return text;
};
var markOk=function(text,ok){
  var p=RegExp(ok+'$');
  return text.replace(p,' <ok>'+ok.trim().substr(0,1)+'</ok>\r\n');
};
module.exports={
  firstOutputByte:firstOutputByte,
	utf8StrTooLong:utf8StrTooLong,
	markInp:markInp,
	markOk:markOk
}