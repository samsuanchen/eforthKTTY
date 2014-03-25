\ _all_in_one(utf8)forDEV0.76.f 20131125
\ 20140305 改 FORGET A.
\ 20140102 改 FORGET Forget
\ 20131230 增 NOOP
\ 20131210 增 BIG5 UTF8 改 ANEW
\ 增 variables .hex .HEAD .BODY
\ 改 words (SEE)
\ --------------------------------------------------- 328eForthDEV0.76x01
: NOOP ;     FLUSH
' NOOP 2/  ' ERR_HANDLING 2+ I!  \ 注意! 修改 ERR_HANDLING
' NOOP 2/  ' ALLOW_BOOT   2+ I!  \ 注意! 修改 ALLOW_BOOT
\ 使 .OK 回應 BIG5 "好" 或 UTF8 "好"
: BIG5  $118E I@ $6EA6 = IF EXIT THEN
  $6EA6 $118E I! $2000 $1190 I! FLUSH ; \ FLUSH BIG5
: UTF8  $118E I@ $A5E5 = IF EXIT THEN
  $A5E5 $118E I! $20BD $1190 I! FLUSH ; 
  FLUSH
\ ===================================================
\ 以下為毛翔先生2012/8/23於德霖技術學院202實驗室創作
: REMEMBER
  $100 ERASE $100 $100 WRITE
  $180 ERASE $180 $180 WRITE ; FLUSH $120 DP ! REMEMBER
: STOP CR ." 請按 ESC 繼續 "
  BEGIN KEY DUP $0D =
    IF $2E EMIT $07 EMIT \ 每列印出一點並發聲警訊
    THEN $1B = \ 直至 ESC 鍵 為止
  UNTIL ;
: VARIABLE VARIABLE  FLUSH ; FLUSH
  VARIABLE DEPTH_CHECK
: : : DEPTH DEPTH_CHECK ! ;  FLUSH
: ; DEPTH DEPTH_CHECK @ - 
  IF CR ." ERROR#01 : 程式結構不對稱!" STOP
  THEN $940C , $55 , [COMPILE] [ OVERT FLUSH ; IMMEDIATE FLUSH
\ --------------------------------------------------- 328eForthDEV0.76x02
: (forget) ( nfa -- ) ?DUP
  IF 2-		( lfa )
     DUP CP  !	( lfa )
     I@		( nfa' )
     DUP        ( nfa' nfa' )
     CONTEXT !	( nfa' )
     LAST    !
  THEN ;
: Forget ( <name> -- )
  'CN  ( cfa nfa ) (forget) ( cfa ) DROP ; REMEMBER
: doTABLE ( -- a ) R> 2* ;
: ANEW ( <name> -- ) TOKEN ( a ) NAME? ?DUP
  IF ( cfa nfa ) DUP LAST ! CONTEXT ! ( cfa )
     4 + DUP I@ DP ! 2+ CP !
  ELSE ( a ) $,n OVERT
     [ ' doTABLE 2/ ] LITERAL call, DP @ , FLUSH
  THEN ;
: IDUMP ( a -- )
  BASE @ SWAP HEX
  CR ." idump " DUP $F
  FOR DUP $F AND 3 U.R 1+
  NEXT DROP 7
  FOR CR DUP 5 U.R SPACE $F
      FOR ICOUNT 3 U.R
      NEXT SPACE DUP $10 - $F
\ --------------------------------------------------- 328eForthDEV0.76x03
      FOR ICOUNT DUP BL < OVER $FE > OR
          IF DROP [ CHAR _ ] LITERAL
          THEN EMIT
      NEXT DROP
  NEXT DROP BASE ! ;
: DUMP ( a -- )
  BASE @ SWAP HEX
  CR ."  dump " DUP $F
  FOR DUP $F AND 3 U.R 1+
  NEXT DROP 7
  FOR CR DUP 5 U.R SPACE $F
      FOR COUNT 3 U.R
      NEXT SPACE DUP $10 - $F
      FOR COUNT DUP BL < OVER $FE > OR
          IF DROP [ CHAR _ ] LITERAL
          THEN EMIT
      NEXT DROP
  NEXT DROP BASE ! ; REMEMBER
:  KEY $06 EMIT  KEY ; \ 送出 ACN 碼 以受理 按鍵輸入
: ?KEY $06 EMIT ?KEY ; \ 送出 ACN 碼 以受理 按鍵輸入
: CONSTANT CONSTANT  FLUSH ;
\ ===================================================
\ 以下為毛翔先生2012/8/23於德霖技術學院202實驗室創作
\ 遇未定義指令又無法譯為數值時，忽視後續文字，直至 ESC
\ 此乃防止後續不當執行導致嚴重系統損壞 (以前常發生)
: ERROR#02
  CR ." ERROR#02 : 遇未定義指令!" STOP ;
\ --------------------------------------------------- 328eForthDEV0.76x04
\ 允許使用者開機 3 秒內，按 ESC 直接進符式系統直譯模式
\ 此乃為從 TURNKEY 系統取回操控權
: WAIT
  CR ." 3 秒內按 ESC 鍵可進入符式系統 " 3
  FOR R@ .                             \ 印出倒數秒數
      $1F4 FOR $2FF FOR NEXT NEXT ?KEY \ 等一秒檢視是否按鍵
      IF CR DROP QUIT                  \ 進符式系統直譯模式
      THEN $08 EMIT $08 EMIT           \ 退格消去倒數秒數
  NEXT ;
' ERROR#02 2/  ' ERR_HANDLING 2+ I!  \ 注意! 修改 ERR_HANDLING
' WAIT     2/  ' ALLOW_BOOT   2+ I!  \ 注意! 修改 ALLOW_BOOT
  FLUSH REMEMBER
\ ===================================================
HEX
: legal_name ( nfa -- nfa flg ) DUP 1 AND
  IF 0 EXIT
  THEN DUP ICOUNT $1F AND ( nfa a n ) ?DUP
  IF ( nfa a n ) 1-
     FOR ( nfa a ) ICOUNT $21 <
         IF ( nfa a ) R> 2DROP 0 EXIT
         THEN
     NEXT
  ELSE ( nfa a ) DROP 0
  THEN ;
: >name ( cfa -- nfa | 0 ) \ at least 10 times faster than >NAME
  DUP $20 - ( cfa a )
\ --------------------------------------------------- 328eForthDEV0.76x05
  BEGIN 2DUP NAME> =
    IF ( cfa nfa ) legal_name
       IF SWAP DROP EXIT
       THEN
    THEN 2+ 2DUP =
  UNTIL XOR ; 
\ : X1 $300 FOR [ ' DUP ] LITERAL >NAME DROP NEXT ; X1
\ : x1 $300 FOR [ ' DUP ] LITERAL >name DROP NEXT ; x1
  VARIABLE #OUT
 -1 #OUT ! \ 注意！ 若負值, 就不計數
: 0_#OUT_! #OUT @ 0< IF EXIT THEN 0 #OUT ! ;
: CR 0_#OUT_! CR ; 
: #OUT_+! ( n -- ) 
  #OUT @ 0< IF DROP EXIT THEN
  $48 OVER #OUT @ + <
  IF CR
  THEN #OUT +! ;
: 1_#OUT_+! 1 #OUT_+! ; 
: DUP_#OUT_+! DUP #OUT_+! ; 
: TYPE DUP_#OUT_+! TYPE ; 
: ITYPE DUP_#OUT_+! ITYPE ; 
: SPACE 1_#OUT_+! SPACE ; 
: . <# #S #> SPACE TYPE ; 
: $TYPE ( a -- ) ICOUNT ITYPE ; 
: .ID ( nfa -- ) \ show name
\ --------------------------------------------------- 328eForthDEV0.76x06
  ICOUNT ( nfa+1 {nfa} )
  1F AND SPACE ITYPE ; 
: >LINK ( nfa -- lfa ) 2- ; 
  VARIABLE LIMIT 
: DUP_2+_SWAP_I@ ( a -- a+2 [a] )
  DUP 2+ SWAP I@ ; 
$940E CONSTANT INS_CALL 
$940C CONSTANT INS_JUMP 
$9508 CONSTANT INS_RET
' doLIT   CONSTANT (LIT)
' next    CONSTANT (NEXT)
' ?branch CONSTANT (ZBRAN)
'  branch CONSTANT (BRAN)
' abort"  CONSTANT (ABORT")
' $"|     CONSTANT ($")
' ."|     CONSTANT (.") 
' doVAR   CONSTANT (CON)
: H. ( v -- ) <# #S #> TYPE ; 
: A. ( a -- ) DUP <# # # # # # # #>
  TYPE SPACE 2/
  <# # # # # # # #> TYPE ;
: H.R ( v n -- ) >R <# #S #> R> OVER - SPACES TYPE ;
: Q $22 EMIT ;
: .STR ( a -- a' )
  6 SPACES ." .DB" ICOUNT DUP . ." ,'" 2DUP ITYPE ." '" + ALIGNED ; 
\ --------------------------------------------------- 328eForthDEV0.76x07
: .BRAN ( a -- a+2 )
  CR DUP A. DUP_2+_SWAP_I@ ( a+2 [a] )
  DUP 5 H.R LIMIT @ MAX LIMIT ! ; \ Forget .NAME
: .NAME ( a cfa -- a' ) DUP >NAME ( a+4 cfa nfa ) ?DUP
  IF DUP IC@ ( [a] a+4 cfa nfa {nfa} )
   $80 AND
   IF ."  [COMPILE]"
   THEN ( [a] a+4 cfa nfa )
   .ID SPACE ( [a] a+4 cfa )
  THEN ( [a] a+4 cfa ) DUP (LIT) =
   IF DROP ( [a] a+4 )
    CR DUP A. DUP_2+_SWAP_I@ 5 H.R ( [a] a+6 )
   ELSE ( [a] a+4 cfa )
    DUP (.") =
    OVER (ABORT") = OR
    OVER ($") = OR
    IF DROP DUP DUP IC@ ( [a] a+4 a+4 n ) 2+ 2/ 1- ( [a] a+4 a+4 c )
       FOR CR DUP A. DUP_2+_SWAP_I@ 5 H.R
       NEXT DROP ( [a] a+4 )
       .STR ( [a] a' )
    ELSE ( [a] a+4 cfa ) DUP (ZBRAN) =
     IF DROP .BRAN
     ELSE ( [a] a+4 cfa ) DUP (BRAN) =
\ --------------------------------------------------- 328eForthDEV0.76x08
      IF DROP .BRAN
      ELSE ( [a] a+4 cfa ) DUP (NEXT) =
       IF DROP .BRAN
       ELSE DROP ( [a] a+4 )
       THEN
      THEN
     THEN
    THEN
   THEN ( [a] a' )
  ;
: CALL? ( [a] -- f ) INS_CALL = ; 
: JMP? ( [a] -- f ) INS_JUMP = ; 
: ADR> ( [a] -- cfa )  2* ;
: RCALL? ( [a] -- f ) $F000 AND $D000 = ; 
: RJMP? ( [a] -- f ) $F000 AND $C000 = ; 
: RET? ( [a] -- f ) INS_RET = ; 
: RADR> ( a+2 [a] -- a+2 cfa ) $FFF AND DUP $800 AND
   IF $F000 OR 
   THEN 2* OVER + ; 
: .INS ( a -- a' f )
  DUP CR A. ( a )
  DUP_2+_SWAP_I@ ( a+2 [a] )
  DUP 5 H.R ( a+2 [a] )
\ --------------------------------------------------- 328eForthDEV0.76x09
  DUP CALL? DUP
  IF ( a+2 [a] CALL? ) 2 PICK I@ 5 H.R ."  CALL"
  THEN OVER JMP? DUP
  IF ( a+2 [a] CALL? JMP? ) 3 PICK I@ 5 H.R ."  JMP"
  THEN OR
  IF ( a+2 [a] )
     SWAP DUP_2+_SWAP_I@ ( [a] a+4 [a+2] ) DUP 5 H.R
     ADR> ( [a] a+4 cfa ) DUP (CON) =
     IF DROP DUP_2+_SWAP_I@ DUP 5 H.R ( [a] a+6 [a+4] )
        ."  (CON)" . SWAP EXIT ( a+6 [a] )
     THEN .NAME ( [a] a' )
     SWAP JMP? ( a' f )
  ELSE ( a+2 [a] ) DUP RCALL? DUP
     IF 6 SPACES ." RCALL"
     THEN OVER RJMP? DUP
     IF 6 SPACES ." RJMP"
     THEN OR
     IF ( a+2 [a] )
        SWAP OVER ( [a] a+2 [a] )
        RADR> ( [a] a+2 cfa ) DUP (CON) =
        IF DROP DUP_2+_SWAP_I@ 2DUP RADR> \ fixed 20131203
           5 H.R 5 H.R ( [a] a+6 [a+4] )
           ."  (CON)" . SWAP EXIT ( a+6 [a] )
\ --------------------------------------------------- 328eForthDEV0.76x10
        THEN ( [a] a+2 cfa ) DUP 2/ . .NAME ( [a] a' ) SWAP RJMP?
     ELSE ( a+2 [a] ) RET? DUP
        IF 6 SPACES ." RET"
        THEN
     THEN
  THEN ; 
: .HEAD ( nfa -- )
  DUP >LINK ( cfa nfa lfa ) CR
  DUP A. I@ DUP 5 H.R
  6 SPACES ." link " 2/ H. ( cfa nfa )
  DUP DUP IC@ 1F AND 2/
  FOR CR DUP A. DUP_2+_SWAP_I@ 5 H.R
  NEXT DROP ( cfa nfa )
  6 SPACES ." CODE " ICOUNT DUP $80 AND
  IF ." IMEDD+"
  THEN DUP $40 AND
  IF ." COMPO+"
  THEN 1F AND DUP DECIMAL
  <# #S #> TYPE HEX
  ." ,'" ITYPE ." '" ;
: .BODY ( cfa -- )
  DUP 2/ LIMIT !
  BEGIN .INS ( a f )
\ --------------------------------------------------- 328eForthDEV0.76x11
    IF LIMIT @ OVER 2/ <
    ELSE 0
    THEN
  \ ?KEY
  \ IF 1B = OR
  \ THEN
  UNTIL CR A. ; 
: (SEE) ( cfa -- ) BASE @ SWAP HEX
 DUP >NAME ?DUP
 IF .HEAD
 THEN DUP 2/ LIMIT !
 .BODY BASE ! ; 
: SEE ' DUP >NAME IC@ DUP C0 AND
  IF CR
  THEN DUP $40 AND
  IF ."  compile-only"
  THEN $80 AND
  IF ."  immediate"
  THEN (SEE) ; 
: $EQ ( flsAdr flsNch ramAdr ramNch -- True | False )
  ROT OVER =
  IF ( flsAdr ramAdr ramNch )
     FOR AFT ( flsAdr ramAdr ) OVER IC@ OVER C@ XOR
\ --------------------------------------------------- 328eForthDEV0.76x12
             IF R> 2DROP 0 DUP >R 1- SWAP
             THEN SWAP 1+ SWAP 1+
	 THEN
     NEXT
  ELSE 2DROP DUP XOR
  THEN ;
: MATCH ( $s a0 -- 0 | a ) \ check if substring $s at a0
  SWAP COUNT ?DUP
  IF ( flsAdr ramAdr ramNch )
     FOR AFT ( a0 a1 )
             OVER IC@ OVER C@ XOR
             IF R> 2DROP 0 DUP >R 1- SWAP
             THEN SWAP 1+ SWAP 1+
         THEN
     NEXT
  THEN DROP ;
\ : TEST1 BL WORD $" abcde" ICOUNT DROP MATCH . ; TEST1 abc
\ : TEST2 BL WORD $" abXde" ICOUNT DROP MATCH . ; TEST2 abc
\ : TEST3 BL WORD $" abcde" ICOUNT DROP MATCH . ; TEST3 aDb
\ : TEST4 BL WORD $" X"     ICOUNT DROP MATCH . ; TEST4 abc
  HEX
: INSTR ( $s $a -- flag ) \ check if ram substring $s in flash name $a
  ICOUNT 3F AND ROT ( a0 n0 $s )
\ --------------------------------------------------- 328eForthDEV0.76x13
  SWAP OVER ( a0 $s n0 $s ) C@ - ( a0 $s n0-n1 ) DUP 0<
  IF 2DROP DROP 0 EXIT
  THEN ( a0 $s n0-n1 ) >R >R >R 0 R> R> ( 0 a0 $s )
  SWAP R> ( 0 $s a0 n0-n1 )
  FOR ( 0 $s a ) 2DUP MATCH 
      IF ROT R> SWAP >R 
      THEN 1+ 
  NEXT 2DROP ;
\ : TEST1 BL WORD $" abcde" INSTR . ; TEST1 abc
\ : TEST2 BL WORD $" abcde" INSTR . ; TEST2 de
\ : TEST3 BL WORD $" abcde" INSTR . ; TEST3 aDb
\ : TEST4 BL WORD $" X"     INSTR . ; TEST4 abc
: words BL WORD
  CONTEXT @
  BEGIN ?DUP
  WHILE \ CR .S CR OVER COUNT TYPE DUP .ID 
     2DUP INSTR
     IF DUP DUP CR 4 .R DUP 2/ . DUP IC@ 3 .R .ID
     THEN >LINK I@
  REPEAT DROP ; 
HEX
: PIN>BITM ( PIN -- BITM ) 1 SWAP FOR AFT 2* THEN NEXT ;
: PB ( PIN -- BITM ADDR ) PIN>BITM $23 ;
\ --------------------------------------------------- 328eForthDEV0.76x14
: PC ( PIN -- BITM ADDR ) PIN>BITM $26 ;
: PD ( PIN -- BITM ADDR ) PIN>BITM $29 ;
: DIGITALREAD ( BITM ADDR -- flag ) C@ AND ; 
: SET_BITS ( BITM ADDR -- ) >R        R@ C@  OR R> C! ;
: CLR_BITS ( BITS ADDR -- ) >R INVERT R@ C@ AND R> C! ;
: INPUT  ( BITM ADDR -- ) 1+ CLR_BITS ;   \ 輸入模式
: OUTPUT ( BITM ADDR -- ) 1+ SET_BITS ;   \ 輸出模式
: HIGH   ( BITM ADDR -- ) 2+ SET_BITS ;   \ 高電位
: LOW    ( BITM ADDR -- ) 2+ CLR_BITS ;   \ 低電位
$44 CONSTANT TCCR0A \ Timer/Counter Control Register A
$45 CONSTANT TCCR0B \ Timer/Counter Control Register B
$47 CONSTANT OCR0A  \ Output Compare Register A
$48 CONSTANT OCR0B  \ Output Compare Register B
: MS ( 毫秒數 -- ) ?DUP IF FOR AFT $1CB FOR NEXT THEN NEXT THEN ;
: PD6_PWM ( 輸出量 -- ) OCR0A C! TCCR0A C@ $83  OR TCCR0A C! 3 TCCR0B C! ;
\ 0 <= 輸出量 <= 255
: PD5_PWM ( 輸出量 -- ) OCR0B C! TCCR0A C@ $23  OR TCCR0A C! 3 TCCR0B C! ;
\ 0 <= 輸出量 <= 255
: PWM_CLOCK_SELECT ( n -- ) TCCR0B C! ; \ 1-5 CLOCK LEVEL
: PD6_PWM_IO ( FLAG -- )
  IF TCCR0A C@ $83 OR TCCR0A C! ELSE TCCR0A C@ $7F AND TCCR0A C! THEN ; 
\ PWM 開關 ( FLAG=TRUE 開 80 COM0A 模式 03 FAST PWM, FLAG=FALSE 關 80 )
: PD5_PWM_IO ( FLAG -- )
\ --------------------------------------------------- 328eForthDEV0.76x15
  IF TCCR0A C@ $23 OR TCCR0A C! ELSE TCCR0A C@ $DF AND TCCR0A C! THEN ;
\ PWM 開關 ( FLAG=TRUE 開 20 COM0B 模式 03 FAST PWM, FLAG=FALSE 關 20 )
: AREFOFF   $00 OR ;
: AFRAVCC   $40 OR ;
       : RESERVED  $80 OR ;
       : INTERNAL  $C0 OR ;
: ADMUXSET  $7C C! ;
: ADEN      $80 OR ;
: ADSC      $40 OR ;
       : ADATE     $20 OR ;
       : ADIF      $10 OR ;
       : ADIE      $08 OR ;
       : ADPS2         1 ;
       : ADPS4         2 ;
: ADPS8         3 ;
       : ADPS16        4 ;
       : ADPS32        5 ;
       : ADPS64        6 ;
       : ADPS128       7 ;
: ADCSRA        $7A C! ; 
: ADHIGHBYTE    $78 @  ;
       : ADLOWBYTE     $79 @  ;
: ANALOGREAD ( pc?--n ) 
\ --------------------------------------------------- 328eForthDEV0.76x16
   AFRAVCC   ADMUXSET \ 以電源作參考
   ADPS8     ADEN  ADSC ADCSRA \ 開啟AD開始轉換
   BEGIN $7A  C@ $10 AND  UNTIL \ 等待轉換完成
   ADHIGHBYTE ; \ 讀取單 pin 類比訊號
: != = IF 0 ELSE $FFFF THEN ; 
: PULSEIN  
0 = IF 1 ELSE 0 THEN  ROT ROT  
  0 >R 
BEGIN  2DUP DIGITALREAD 3 PICK !=  UNTIL 
 BEGIN 2DUP 
 R> 1+ >R 
 DIGITALREAD 3 PICK = UNTIL 2DROP DROP R>  $1B *   ; 
: PULSEOUT  DUP  2 / $A - SWAP $50 / 4 * -  
 ROT ROT  2DUP 2DUP LOW HIGH 2 PICK   
FOR NEXT LOW DROP ; 
: TONE_SET ( N1 N2 --  ) \ 頻率震動
 ( N1 N2 相乘換算後送入計數器 產生該頻率震盪 )
 0  0 $84 C! $85 C!
 $A  $81 C! 
 M* F M/MOD SWAP DROP >R $7FFF 2 M*  R> 
      M/MOD DUP  $8A   !  $88   ! DROP  ;
: KHZ ( -- 1000 ) $3E8   ; 
: HZ ( -- 1 ) 1 ; 
\ --------------------------------------------------- 328eForthDEV0.76x17
: PB1_TONE_IO ( flag --  ) \ 0 關閉 非0 開啟 TONE 
  IF TCCR0A C@ $23 OR TCCR0A C!
  ELSE TCCR0A C@ $DF AND TCCR0A C!
  THEN ;
: PB2_TONE_IO ( flag --  )
 IF      $80 @ $10 OR  $80 C! 
 ELSE $80 @ $E0 AND $80 C!  
 THEN ; 
REMEMBER
DECIMAL

HEX
: HH ( N -- ) <# # # #> TYPE ;
: .HEX ( adr n -- ) BASE @ >R HEX
  BEGIN 2DUP $10 MIN
    CR ." :" DUP HH
    OVER $100 /MOD DUP HH OVER 
    HH + OVER + ROT ROT 0 HH
    FOR ( sum adr )
         AFT ICOUNT DUP HH ROT + SWAP
         THEN
    NEXT DROP NEGATE $FF AND HH
    DUP $10 >
\ --------------------------------------------------- 328eForthDEV0.76x19
  WHILE $10 - SWAP $10 + SWAP
  REPEAT 2DROP R> BASE ! ;
: .hex ( addr n -- ) BASE @ >R HEX
  BEGIN 2DUP $20 MIN
    CR ." :" DUP HH
    OVER $100 /MOD DUP
    HH OVER 
    HH + OVER + ROT
    ROT 0 HH
    FOR ( sum adr )
         AFT ICOUNT DUP HH
         ROT + SWAP
         THEN
    NEXT DROP NEGATE $FF AND HH
    DUP $20 >
  WHILE $20 - SWAP
  $20 + SWAP
  REPEAT CR ." :00000001FF" CR
  2DROP R> BASE ! ;
\ : RADR> ( a+2 [a] -- a+2 cfa ) $FFF AND DUP $800 AND
\   IF $F000 OR 
\   THEN 2* OVER + ; FLUSH
: variables BASE @ HEX BL WORD ( b a )
\ --------------------------------------------------- 328eForthDEV0.76x20
  CONTEXT @ ( b a nfa )
  BEGIN   ( b a nfa ) ?DUP
  WHILE   ( b a nfa )
     DUP NAME> DUP 2+ SWAP I@ ( b a nfa cfa+2 [cfa] )
     DUP $F000 AND $D000 =
     IF   ( b a nfa cfa+2 [cfa] ) RADR> ( b a nfa cfa+2 cfa' )
     ELSE ( b a nfa cfa+2 [cfa] ) $940E =
        IF   ( b a nfa cfa+2 ) DUP 2+ SWAP I@ 2* ( b a nfa cfa+4 cfa' )
        ELSE ( b a nfa cfa+2 ) 0
        THEN 
     THEN DUP
     IF ( b a nfa a' cfa' )
        DUP [ ' doVAR ] LITERAL =
        IF ( b a nfa a' cfa' ) CR 2 PICK DUP . DUP 2/ . DUP IC@ . SPACE .ID
           OVER I@ .
        THEN
     THEN ( b a nfa a' n' ) 2DROP 2- ( b a lfa ) I@ ( b a nfa )
  REPEAT  ( b a ) DROP BASE ! 
; FLUSH REMEMBER
: i! ( v fa -- ) I! ;  \ 不檢查直接存 v 到 flash memory 指定位址 fa
\ ===================================================
\ 此處為毛翔先生2012/8/23於德霖技術學院202實驗室修改
: I! ( n addr -- ) 
  CP @ 1- $200 WITHIN \ MAO SECOND DUP AND 1+ WILL BE CHANGE 
  IF I!
\ --------------------------------------------------- 328eForthDEV0.76x21
  ELSE CR ." ERROR#03 : 系統區域禁止寫入!" STOP
  THEN ;
: FORGET ( <name> -- ) 'CN
  DUP $FFFF $200 WITHIN   \ FFFF will be replaced by SEALED
  IF 2- DUP CP ! I@ DUP CONTEXT ! LAST !
     'BOOT @ CONTEXT @ NAME>   >  
     IF 'BOOT @ [ ' hi ] LITERAL = 
        IF DROP 
        ELSE CR ." 提醒! 已自動取消 TURNKEY " [ ' hi ] LITERAL 'BOOT !
        THEN 
     THEN REMEMBER
   ELSE DROP CR \ MAO  TO BE CHANGE
 THEN ; REMEMBER
: SEALED CR ." ERROR#04 : 禁止移除系統字!" STOP  ; REMEMBER \ MAO
' SEALED 1+ ' FORGET $0C + i! \ MAO CHANGE $FFFF TO  SEALED ADDRESS
' SEALED 2/ ' FORGET $CE + i! \ MAO SHOW SEALED MESSAGE CHANGE CR
DECIMAL FLUSH REMEMBER
\  === END === 
