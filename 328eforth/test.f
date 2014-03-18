ANEW test.f
\ 3456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789
: x * 3 .R ;
: t BASE @ DECIMAL 8
  FOR CR 9 R@ - 8
    FOR DUP 9 R@ - x
    NEXT DROP
  NEXT BASE ! ; t
: wait ( -- )
  CR ." 等按鍵繼續 (按 ESC 則 ABORT)
  KEY DUP $1B = ABORT" ESC 重啟系統" ( k ) . ; FLUSH
wait

VARIABLE V FLUSH 500 V !
$3F $23 OUTPUT \ 同時設定 0 PB 1 PB ... 5 PB 為 OUTPUT
\  5 PB OUTPUT \ 可直接用 machine code : O [ $9A25 , ] ; O
: W V @ MS ;
: H [ $9A2D , ] ; \ 用 machine code 定義 亮燈 5 PB HIGH
: L [ $982D , ] ; \ 用 machine code 定義 熄燈 5 PB LOW
: 0T [ $9A18 5 + , ] ; \ 用 machine code 定義 亮熄燈 PB5 的切換
: 1T [ $9A18 4 + , ] ; \ 用 machine code 定義 亮熄燈 PB4 的切換 
: 2T [ $9A18 3 + , ] ; \ 用 machine code 定義 亮熄燈 PB3 的切換 
: 3T [ $9A18 2 + , ] ; \ 用 machine code 定義 亮熄燈 PB2 的切換 
: 4T [ $9A18 1 + , ] ; \ 用 machine code 定義 亮熄燈 PB1 的切換 
: 5T [ $9A18 0 + , ] ; \ 用 machine code 定義 亮熄燈 PB0 的切換 
: 6T [ $9A4F 0 + , ] ; \ 用 machine code 定義 亮熄燈 PD7 的切換 
: T ( i -- ) 0
  BEGIN DUP 12 * [ ' 0T ] LITERAL +
    EXECUTE W 1+ DUP 6 >
    IF DROP 0
    THEN ?KEY
  UNTIL ;
: F ( n -- ) 2* FOR AFT 0T W THEN NEXT ; FLUSH
: .s CR DEPTH DUP ." DEPTH" . ?DUP
  IF ." --" 1-
     FOR R@ PICK .
     NEXT
  THEN ;
\ FORGET Z
: Z
  BEGIN  F ?KEY DUP
    IF          ( k true ) OVER 17 =  \ is key ^Q  quick
      IF    .s  ( k true ) V @ 2/ ."  quick as" DUP . V ! 2DROP 0
      ELSE      ( k true ) OVER 26 =  \ is key ^Z  easy
        IF  .s  ( k true ) V @ 2*  ."  easy as" DUP . V ! 2DROP 0
        ELSE    ( k true ) DROP 27 =  \ is key esc escape
        THEN    ( flag   )
      THEN
    THEN
  UNTIL
; \ Z
