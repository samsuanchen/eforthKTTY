eforthKTTY -- node webkit serialport 328eforth ksana tty

>>> A. starting eforthKTTY

A01. Before starting eforthKTTY,
   We need edit the file build.min.js, make sure 'port:"COMxx"'
   is replaced as 'port:"COM32"', if we communicate with 328eforth
   on chip atmega328p via COM32. (figure out the port used first)
   
A02. DblClick run.bat (or nw.exe) to start eforthKTTY.

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

C03. Retrieve previous command line input.
   Previous command line input can be retrieve bye using UP and DOWN keys.

C04. Sending 328eforth command file.
   Click 'sendFile' can send command lines of a specified file in '328eforth' directory.

C05. Pasteing text as command lines.
   Pasteing into empty command line input box, can send clipboard text as command lines.

>>> D. to do:

D01. "7 EMIT" as error. (in output).
D02. "6 EMIT" as ready for next command �]last output, Hidden command running 328eforth .S and WORDS�^.
D03. "5 EMIT" as ready for next input�]last output, no Hidden command for KEY or ?KEY of 328eforth�^.
D04. "1 EMIT" as hidden info. (first output, curren recieved data)
D05. inputBox for port, baud, system.
D06. show cmdLine UTF8 byte-length.
D07. show previous-cmdLine record-length.
D08. mark error and prevent pending lines when error during pasting or file xfering.
D09. prevent 2 oks for ESC.
D10. checkBox to show recieved bytes for debugging.
D11. unit test.
D12. listBox to select port.
D13. listBox to select file.
D14. lineDelay to wait for next command.
D15. include README.txt into zip.

>>> E. to report bigs:

E01. email samsuanchem@gmail.com
E02. call 0920-714-028 ���n