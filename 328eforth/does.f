ANEW does.f
\ todo:
\ 1. 分析指令定義編碼 例如 9800 c8A5b3: CBI ( A b -- )
\ done:
\ 1. 換顆 atmega328p 就 ok

\ does.f 20130920 20131107
\ 定義了: doTABLE TABLE DOES NOP DEFER IS 
\ 定義了: c8A5b3: SBI CBI CODE END-CODE
\ 定義了: OU HI LO
\ 定義了: c4k4d4k4: ANDI CPI LDI ORI SBCI SUBI
\ : i! $1FF 2* EXECUTE ;
: doTABLE R> 2* ; \ FORGET TABLE
: TABLE TOKEN $,n OVERT [ ' doTABLE 2/ ] LITERAL call, FLUSH ;
\ FORGET DOES
: DOES R> LAST @ NAME> 2+ i! FLUSH ;
\ : CONSTANT TABLE , DOES R> 2* I@ ;
\ 2 CONSTANT TWO
: NOP [ $940C , $55 , ] ; \ FORGET DEFER
: DEFER TABLE [ ' NOP ] LITERAL , DOES R> 2* I@ EXECUTE ;
\ DEFER XXX
: IS ( cfa <defer> -- ) ' 2+ 2+ i! FLUSH ;
\ FORGET XXX1
\ : XXX1 ;
\ ' XXX1 IS XXX
\ : XXX2 ." XXX2" ;
\ ' XXX2 IS XXX
\ FORGET c8A5b3:
: c8A5b3:   ( c <ins> -- ) TABLE , DOES ( A b -- )
  SWAP $1F AND $08 * OR
  R> 2* I@ OR , ;
\ : SBI ( A b -- ) SWAP 8 * OR $9A00 OR , ;
$9A00 c8A5b3: SBI ( A b -- ) 
\ : CBI ( A b -- ) SWAP 8 * OR $9800 OR , ;
$9800 c8A5b3: CBI ( A b -- )
: CODE TOKEN $,n OVERT ; \ FORGET END-CODE
: END-CODE $940C , $55 , FLUSH ; \ JMP INT_HANDLER
\ FORGET OU
CODE OU ( a b -- ) $24 5 SBI END-CODE
CODE HI ( a b -- ) $25 5 SBI END-CODE
CODE LO ( a b -- ) $25 5 CBI END-CODE
\ OU HI 1000 MS LO
: c4k4d4k4: ( c <ins> -- ) TABLE , DOES ( k d -- )
  $0F AND 16 * OVER $0F
  AND OR SWAP $F0
  16 * OR
  R> 2* I@ OR , ;
$7000 c4k4d4k4: ANDI ( k d -- )
$3000 c4k4d4k4: CPI  ( k d -- )
$E000 c4k4d4k4: LDI  ( k d -- )
$6000 c4k4d4k4: ORI  ( k d -- )
$4000 c4k4d4k4: SBCI ( k d -- )
$5000 c4k4d4k4: SUBI ( k d -- )
CODE DROP_1 ( x -- 1 ) 1 $18 LDI
END-CODE
$2C00 c6r1d5r4: MOV ( r d -- )
: COM [ $9580 , $9590 , ] ; \ CODE COM $18 COM $19 COM END-CODE
\ $1234 COM HEX . ---> EDCB
: DROP_0 [ 01C1 , ] ;
\ : 2/  [ 9595 , 9587 , ] ; \ CODE 2/ $19 ASR $18 ROR END-CODE
\ : 2*  [ 0F88 , 1F99 , ] ; \ CODE 2* $18 LSL $19 ROL END-CODE

FORGET c6r1d5r4:
: c6r1d5r4: ( c -- ) TABLE , DOES ( r d -- c nfa )
  R> 2* DUP I@ SWAP 2- I@ 2* $C - >NAME ;
$1C00 c6r1d5r4: ADC ( r d -- ) \ $1C00 $190 $201 $1F91
\ $11 $19 ( r d ) ADC ==> 編碼 ==> $1F91
\ R@ 2* DUP I@ ROT ROT 
\ $1C00 $11 $19 ( c r d )
\ R> 2- I@ 2* $C -
\ $1C00 $11 $19 $3942 ( c r d nfa )
\ CREATE MASK 4 ALLOT
\ CREATE BITS 2 ALLOT
\ CREATE TAGS 4 ALLOT
\ 0 TAGS !
\ FORGET NotInTags
: InTags ( tag -- flag ) 0 SWAP
  TAGS COUNT ( 0 tag adr tags )
  FOR AFT ( 0 tag adr ) OVER >R COUNT
          ( 0 tag adr byt ) ROT =
          IF   ( 0 adr ) OR R> R> 0 >R
          ELSE ( 0 adr ) R> SWAP ( 0 tag adr )
          THEN
      THEN
  NEXT 2DROP ;
: AppendTags ( tag -- ) TAGS COUNT ( tag a n )
  DUP 1+ >R ( tag a n )
  + C! R> TAGS C! ;
\ FORGET PATN
: VALUE ( n <name> -- ) CONSTANT ;
' c6r1d5r4: >NAME 3 + VALUE PATN
: COMPILE ( -- ) \ compile next calling addr
  R> 2* DUP I@ , 
  2+ DUP I@ , 
  2+ 2/ >R ;
: TO ( n <constant> -- )
  ' 2+ DUP I@ $344 != ABORT"  CANNOT STORE TO"
  2+ ( n pfa )
  'EVAL @ [ ' $COMPILE ] LITERAL =
  IF [COMPILE] LITERAL COMPILE 
  THEN i! ; IMMEDIATE
: GetNumber ( a -- a' n ) 0 SWAP
  BEGIN ICOUNT BASE @ DIGIT? ( n a d f )
  WHILE ( n a d )
    ROT BASE @ * + SWAP
  REPEAT DROP SWAP ;
\ ' c6r1d5r4: >NAME 3 + VALUE PATN
\ : ANALYSIS ( a -- )
\   BEGIN ( a )
\     ICOUNT ( a byt ) DUP CHAR : !=
\   WHILE    ( a byt ) DUP CHAR c !=
\     IF     ( a byt ) AppendTags
\     THEN
\   REPEAT ;
\ : INS, ( c r d p -- ) 0 TO TAGS 3 + DUP TO PATN \ ignore n 'c' '6'
\   ANALYSIS 
\   BEGIN ( c r d a )
\     ICOUNT ( c r d a byt ) DUP CHAR : <>
\   WHILE    ( c r d a byt ) DUP CHAR c <>
\     IF R>  ( c r d a byt m ) DUP
\       IF   ( c r d a byt m ) OVER R@ $100 / $FF AND =
\         IF ( c r d a byt m ) >R 
\       ELSE ( c r d a byt 0 )
\       THEN
\     ELSE   
\     THEN
\     ICOUNT ( 'r' ) R> 1+ SWAP >R >R ICOUNT ( '1' ) DROP ICOUNT ( 'd' )
\   REPEAT   ( c r d a byt ) 2DROP R> ( c r d 2 )
\   BEGIN ?DUP
\   WHILE 1- SWAP ( c r 1 d ) OVER 2* MASK + @ ( c r 1 d m )
\   REPEAT
\ ;
\ $1C00 $11 $19 $3942 
\ $1F91 ==> 解碼 ==> $11 $19 ADC
\ $0C00 c6r1d5r4: ADD ( r d -- )
\ $11 $19 ADC ( r d -- $1C00 $3942 ) CR SWAP . DUP . .ID
\ CODE + ( a b -- ) $18 0 MOVW Y+ $18 LDD Y+ $19 LDD $10 $18 ADD $11 $19 ADC
\ END-CODE