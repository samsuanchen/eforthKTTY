avrdude -q -c stk500v1 -P\\.\COM18 -b 57600 -p atmega328p -U flash:w:328eForthDEV0.76allInOneWithoutBootloader(utf8).hex:i
pause