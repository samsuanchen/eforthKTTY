
>>> A. starting eforthKTTY

A01. Before starting eforthKTTY,
   We need edit the file build.min.js, make sure 'port:"COMxx"'
   is replaced as 'port:"COM32"', if we communicate with 328eforth
   on chip atmega328p via COM32. (figure out the port used first)
   
A02. Click run.bat (or nw.exe) to start eforthKTTY.

A03. Click 'connect' to connect serial port.

>>> B. note:

B01. 328eforth (or any other forth) needs give '6 EMIT' to
   tell efothKTTY the port is ready to recieve next input command.

>>> C. features:

C01. Colorful output.
   blue for command line input, red for error or warning, green for ok, black for other output.

C02. Hidden processing.
   After a command line input sent to 328eforth, eforthKTTY will send '1 EMIT CR .S CR WORDS'
   or '[ 1 EMIT CR .S CR WORDS ]' extra command to get the working status of 328eforth.

>>> D. to do:

D01. Make input boxes for port, baud, system.

D02. Prevent Hidden processing for KEY or ?KEY of 328eforth.

>>> E. to report bigs:

E01. Email to samsuanchem@gmail.com or call 0920-714-028 ³¯²n