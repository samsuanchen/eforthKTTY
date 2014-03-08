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
  var p=RegExp('^'+inp
    .replace(/\\/g,'\\\\').replace(/\t/g," "  )
    .replace(/\|/g,'\\|' ).replace(/\'/g,"\\'")
    .replace(/\./g,'\\.' ).replace(/\?/g,'\\?')
    .replace(/\+/g,'\\+' ).replace(/\*/g,'\\*')
    .replace(/\^/g,'\\^' ).replace(/\$/g,'\\$')
    .replace(/\[/g,'\\[' ).replace(/\]/g,'\\]')
    .replace(/\(/g,'\\(' ).replace(/\)/g,'\\)')
    .replace(/\{/g,'\\{' ).replace(/\}/g,'\\}')
  );
  return text.replace(p,'<inp>'+inp+'</inp>');
};
var markOk=function(text,ok){
  var p=RegExp(ok+'$');
  return text.replace(p,' <ok>'+ok.trim().substr(0,1)+'</ok>\r\n');
};
module.exports={
	utf8StrTooLong:utf8StrTooLong,
	markInp:markInp,
	markOk:markOk}