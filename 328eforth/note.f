  ANEW note.f \ 20121029 修訂20131205 陳爽 電腦唱歌基本指令集
\ 在 arduino 328eforth DeLin v0.7 用 hyperterminal 經 USB 連線

\ 音律頻率參考 http://www.doc88.com/p-643605689426.html
\ 低八度12音律
\ 0220  A 0232 #A 0247 B 0262  C 0277 #C 0294  D
\ 0311 #D 0330  E 0349 F 0370 #F 0392  G 0415 #G
\ 中八度12音律
\ 0440  A 0466 #A 0494 B 0523  C 0554 #C 0587  D
\ 0622 #D 0659  E 0698 F 0740 #F 0784  G 0831 #G
\ 高八度12音律
\ 0880  A 0932 #A 0988 B 1046  C 1109 #C 1175  D
\ 1245 #D 1318  E 1397 F 1480 #F 1568  G 1661 #G

\ 頻率 = 2 ^ (音階/12) x 220
\ 音階 = -24 (A1), -12 (A2), 0 (A3), 12 (A4), 24 (A5)
\ 此公式可計算符合十二平均律樂器的所有音階頻率.

更多内容 http://rickmidi.blogspot.com/2008/06/blog-post_28.html#ixzz2meecz7hH

: doTABLE R> 2* ;  : 十進制 DECIMAL ;  : 十六進制 HEX ;
: TABLE CREATE -4 CP +! [ ' doTABLE 2/ ] LITERAL , FLUSH ;

十進制

TABLE 音律 \ 低八度 中八度 高八度 共 36 音律 的音頻陣列
  0220 , 0232 , 0247 , 0262 , 0277 , 0294 ,
  0311 , 0330 , 0349 , 0370 , 0392 , 0415 ,
  0440 , 0466 , 0494 , 0523 , 0554 , 0587 ,
  0622 , 0659 , 0698 , 0740 , 0784 , 0831 ,
  0880 , 0932 , 0988 , 1046 , 1109 , 1175 ,
  1245 , 1318 , 1397 , 1480 , 1568 , 1661 , FLUSH
: [CHAR] ( <CHR> -- ) BL WORD 1+ C@ [COMPILE] LITERAL ; IMMEDIATE
\ : CTR ( <CHR> -- CODE ) BL WORD 1+ C@ $4F AND $40 - COMPILING
\   IF [COMPILE] LITERAL
\   THEN ; IMMEDIATE

1 PB OUTPUT \ 設定 328 晶片 PB1 為 輸出 pin (arduino NANO pin D9)
: 關喇叭 00 PB1_TONE_IO ;
: 開喇叭 01 PB1_TONE_IO ;
: 設頻率 HZ TONE_SET ;

\ FORGET x
\ 按 + 或 - 鍵, 逐一發音, 直到按 ESC 結束
: x 1 PB OUTPUT 開喇叭 -1
  BEGIN KEY DUP $1B XOR
  WHILE [CHAR] - =
     IF 1- ELSE 1+ THEN CR DUP .
     DUP 0 <       IF DUP 36 + 2* 音律 + I@ 8 /
     ELSE DUP 35 > IF DUP 36 - 2* 音律 + I@ 8 *
     ELSE             DUP      2* 音律 + I@
     THEN THEN DUP . 設頻率
  REPEAT 2DROP 關喇叭 ;
\ x

\ FORGET y
\ 按 0 1 ... 7 鍵, 逐一發音, 直到按 其他鍵 結束
: y 1 PB OUTPUT 開喇叭
  BEGIN KEY  DUP $30 = IF EMIT 000 0
        ELSE DUP $31 = IF EMIT 440 0
        ELSE DUP $32 = IF EMIT 494 0
        ELSE DUP $33 = IF EMIT 554 0
        ELSE DUP $34 = IF EMIT 587 0
        ELSE DUP $35 = IF EMIT 659 0
        ELSE DUP $36 = IF EMIT 740 0
        ELSE DUP $37 = IF EMIT 831 0
        ELSE              EMIT 000 1
        THEN THEN THEN THEN THEN THEN THEN THEN
        SWAP CR .S 設頻率
  UNTIL 關喇叭 ;
\ y
  $180 DP !
  VARIABLE 起始音  12 起始音 !  VARIABLE 半音 00 半音 !
  TABLE 基音 $0402 , $0705 , $0B09 , FLUSH
\ FORGET z
\ 按 0 1 ... 7 H L 鍵, 逐一發音, 直到按 其他鍵 結束
: z 01 PB OUTPUT 開喇叭 12 起始音 ! 00 半音 !
  BEGIN KEY  CR DUP EMIT $2F OVER < OVER [CHAR] 8 < AND
        IF   .S ." 音符" DUP [CHAR] 0 = IF EMIT 000 00
             ELSE DUP EMIT [CHAR] 1 - DUP
                  IF 1- 基音 + IC@
                  THEN 起始音 @ + 半音 @ + 2* 音律 + I@ 00
             THEN
             SWAP 設頻率 00 半音 !
        ELSE      DUP $5F AND DUP [CHAR] H = IF EMIT DROP  12 起始音 +! 00
        ELSE DROP DUP $5F AND DUP [CHAR] L = IF EMIT DROP -12 起始音 +! 00
        ELSE DROP DUP [CHAR] # = IF  EMIT 01 半音 ! 00
        ELSE      DUP [CHAR] b = IF  EMIT -1 半音 ! 00
        ELSE DROP 01
        THEN THEN THEN THEN THEN
  UNTIL 關喇叭 ;
\ z

VARIABLE 延遲 666 延遲 ! \ 預設 1 拍 延遲 666 MS 可調整改速度
: 速度 ( n -- ) \ 指定每分鐘的拍數, 預設每分鐘 60 拍
  60 1000 ROT */ 延遲 ! ;
  90 速度

VARIABLE 音長 16 音長 ! \ 以 1/16 拍長為單位, 預設 16 表示 1 拍
\ 儲值範圍  0 <  音長 < 240  \ 240 表示 15 拍

VARIABLE 音頻    112 音頻 !  \ 預設為 中八度 C 調 do 的序號
\ 儲值範圍 72 <= 音頻 < 180  \ 0 表示 靜音
\ 發音頻率範圍 28 (低三個八度 A) ~ 13288 (高六個八度 #G)

\ FORGET 發音
VARIABLE 放棄      0 放棄 !  \ 放棄唱歌
\ FORGET 發音
: 發音 ( 音長 音頻 -- ) 關喇叭 02 MS
  CR ." 音頻碼" DUP . DUP \ 音頻 = 0 表示 靜音
  IF 72 MAX 179 MIN       \ 72 <= 音頻 < 180
     108 - DUP 0<         \ 音頻 108 對應到 音律 TABLE 起首
     IF       36 + 2* 音律 + I@ 08 / ."  降三個八度"
     ELSE DUP 36 >
          IF  36 - 2* 音律 + I@ 08 * ."  昇三個八度"
          ELSE     2* 音律 + I@  \ 直接取中間三個八度的音律
          THEN
     THEN
     DUP 設頻率 開喇叭
  THEN ."  頻率" .
  ( 音長 )
  ."  音長碼" DUP . 
  延遲 @ $10 */
  ."  延遲" DUP . MS ?KEY IF 1 放棄 ! 關喇叭 R> DROP THEN ;

\ FORGET test1
: test1 1 PB OUTPUT
  16 124 發音            16 126 發音 16 128 發音 16 124 發音
  16 124 發音            16 126 發音 16 128 發音 16 124 發音
  16 128 發音            16 129 發音 32 131 發音
  16 128 發音            16 129 發音 32 131 發音
   8 131 發音  8 133 發音 8 131 發音 8 129 發音
  16 128 發音 16 124 發音
   8 131 發音  8 133 發音 8 131 發音 8 129 發音
  16 128 發音 16 124 發音
  16 126 發音            16  95 發音 32 124 發音
  16 126 發音            16  95 發音 32 124 發音 0 0 發音 ;
\ test1

VARIABLE 音調 108 音調 !  \ 預設 中八度 C 調
: 定調 ( 音調序號 -- ) 108 + 音調 ! ;
:  A 00 定調 ; : #A 01 定調 ; :  B 02 定調 ; : bB 01 定調 ;
:  C 03 定調 ; : #C 04 定調 ; :  D 05 定調 ; : bD 04 定調 ;
: #D 06 定調 ; :  E 07 定調 ; :  F 08 定調 ; : bE 06 定調 ;
: #F 09 定調 ; :  G 10 定調 ; : #G 11 定調 ; : bG 09 定調 ;
: bA 11 定調 ;

VARIABLE 高低  00 高低 ! \ 選用 中八度 \ FORGET H
: H  12 高低 +! ;        \ 音階 升八度
: L -12 高低 +! ;        \ 音階 降八度

VARIABLE 拍長 16 拍長 !

\ 歌譜 TABLE 首 16位元 發音數 接 每音 8位元 音頻 8位元 音長
\            當 音頻 音長 皆為 0 表示結束
VARIABLE 發音數 00 發音數 !
\ FORGET 歌譜
: 歌譜 ( <歌名> -- ) TABLE 00 , 16 拍長 ! 00 發音數 ! ;
: 編碼結束 發音數 @ 00 =
  IF EXIT \ 尚未編碼 無需處理
  THEN 00 , 
  發音數 @ LAST @ NAME> 04 + ( n a ) i!
  0 發音數 ! FLUSH ;

\ FORGET 編碼
: 編碼 ( 音長碼 音頻碼 -- ) 1 發音數 +!
  CR 發音數 @ . .S DUP
  IF DUP 72 <
     IF CR ."  音律序號不得小於 72"  R> R> 2DROP THEN
     DUP 179 > 
     IF CR ."  音律序號不得大於 179" R> R> 2DROP THEN
  THEN
  SWAP $100 * OR , 
\ KEY $1B = IF CR ."  跳出歌譜編碼"  R> R> 2DROP THEN
  ;
: 定音 ( 音律序號 -- )
  拍長 @ SWAP 高低 @ + 音調 @ + 編碼 ;

\ 注意!! 下面幾列將數字 0 到 7 重新定義為簡譜音符了
: 0 拍長 @ 00 編碼 ;
: 1 00 定音 ; : #1 01 定音 ; : b2 01 定音 ;
: 2 02 定音 ; : #2 03 定音 ; : b3 03 定音 ;
: 3 04 定音 ;
: 4 05 定音 ; : #4 06 定音 ; : b5 06 定音 ;
: 5 07 定音 ; : #5 08 定音 ; : b6 08 定音 ;
: 6 09 定音 ; : #6 10 定音 ; : b7 10 定音 ;
: 7 11 定音 ;

\ FORGET 加音長
: 加音長 ( n -- )
  -2 CP +! \ 指回前一個音的編碼位址
  CP @ I@ DUP $100 / ROT
  + ."  編碼改為" DUP . $100 *
  SWAP $FF AND OR , ;

: - 拍長 @ 加音長 ;
: . 拍長 @ 2/ 加音長 ;

: q 拍長 @ 2/ 拍長 ! ; \ 加倍速度
: s 拍長 @ 2* 拍長 ! ; \ 減半速度

\ FORGET (唱)
: 起唱設定 01 PB OUTPUT 666 延遲 ! ;
: (唱) ( 歌譜位址 -- ) 起唱設定
  DUP 2+ SWAP I@ ( a+2 n ) \ 取得 發音數
  FOR ICOUNT SWAP ICOUNT ROT 發音
  NEXT ;
\ FORGET 唱
: 唱 ( <歌譜> -- )
  ' EXECUTE ( a ) \ 取得 歌譜 位址
  (唱) ;
  REMEMBER
\ 按 0 1 ... 7 鍵, 逐一發音, 直到按 其他鍵 結束