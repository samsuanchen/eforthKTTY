eforthKTTY -- node webkit serialport 328eforth ksana tty

>>> A. starting eforthKTTY

A01. DblClick run.bat or nw.exe to start eforthKTTY.

A02. Click 'connect' to connect specified serial port.

>>> B. note:

B01. if 328eforth (or any other forth) gives '6 EMIT' to
   tell efothKTTY the port is ready to recieve next input command, eforthKTTY will send padding command lines as
   soon as possible.

>>> C. features:

C01. Colorful output.
   blue for command line input, red for error or warning, green for ok, black for other output.

C02. Hidden processing.
   After a command line input sent to 328eforth, eforthKTTY will send '1 EMIT CR .S CR WORDS'
   or '[ 1 EMIT CR .S CR WORDS ]' extra command to get the working status of 328eforth.

C03. Retrieve previous command line input.
   Previous command line input can be retrieve by using UP and DOWN keys.

C04. Sending 328eforth command file.
   Click 'sendFile' can send command lines of a specified file in '328eforth' directory.

C05. Pasteing text as command lines.
   Pasteing into empty command line input box, can send clipboard text as command lines.

>>> D. to do:

D01. "7 EMIT" as error. (in output).
D02. "6 EMIT" as ready for next command at last output, extra
hidden 328eforth .S and WORDS will be executed.
D03. "5 EMIT" as ready for next input�]last output, no Hidden command for KEY or ?KEY of 328eforth.
D04. "1 EMIT" as hidden info. (first output in recieved data)
D05. inputBox for port, baud, dir, lineDelay.
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

>>> E. report bugs:

E01. email samsuanchem@gmail.com
E02. call 0920-714-028