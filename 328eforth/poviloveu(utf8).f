\ poviloveyou(utf8).f 20131229 陳爽 參考 Japanino POV by Musashinodenpa

\ 摘要:

\ 採 視覺暫留原理 以 7 個 led 排燈 以及 1 個 觸動開關
\ 從PC個人電腦 serial port eforth-ide 串流終端機 載入
\ 這 poviloveyou.f 符式程序檔 自動編譯執行 展示我愛你
\ 藉手搖轉盤 使圓周齒輪 單向帶動 排燈連桿一端扇狀齒輪
\ 每當 排燈連桿 碰到 觸動開關 就 開始依照 2 進位 圖樣
\ 控制 7 個 led 排燈亮熄 產生 7 弧線軌道視覺暫留 效果
\ 展現 "I love you" (我愛你 的 視覺暫留 扇面圖樣)

  DECIMAL 			   \ 以下數字皆為 十進制

: doTABLE ( -- adr ) R> 2* ; 	   \ 回應 TABLE 位址
: TABLE TOKEN $,n OVERT            \ 定義 TABLE 指令
  [ ' doTABLE 2/ ] LITERAL call, ; \ 呼叫 doTABLE
: w, 256 * OR , ;		   \ 併成 2-byte 編碼

  TABLE 圖樣	2 BASE !	   \ 以下數字 皆為 二進制 編碼 圖樣

  00000000	\ ......... \	   \ 以 . 取代 0 或許 比較 容易看出
  01000001 w,	\ .1.....1. \
  01111111	\ .1111111. \
  01000001 w,	\ .1.....1. \
  00000000	\ ......... \

  00000000 w,	\ ......... \
  00001110	\ ....111.. \
  00011111 w,	\ ...11111. \
  00111111	\ ..111111. \
  01111110 w,	\ .111111.. \
  00111111	\ ..111111. \
  00011111 w,	\ ...11111. \
  00001110	\ ....111.. \
  00000000 w,	\ ......... \

  00000000	\ ......... \
  00111111 w,	\ ..111111. \
  01000000	\ .1....... \
  01000000 w,	\ .1....... \
  00111111	\ ..111111. \
  10000000 w,	\ 1........ \

  DECIMAL 			   \ 以下數字皆為 十進制

: 輸入輸出設定
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \
\ 觸動開關設定			\
\ 6 PD INPUT 6 PD HIGH		\
\ 燈號輸出設定			\
\ 5 PB OUTPUT \ LED 0 (最上)	\
\ 4 PB OUTPUT \ LED 1		\
\ 3 PB OUTPUT \ LED 2		\
\ 2 PB OUTPUT \ LED 3		\
\ 1 PB OUTPUT \ LED 4		\
\ 0 PB OUTPUT \ LED 5		\
\ 7 PD OUTPUT \ LED 6 (最下)	\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \
\ direction register 每 bit 對應一 pin 腳, set 1 則 OUTPUT
 $3F $24 C! \ 5~0 PB OUTPUT             (7~6 PB INPUT)
 $80 $2A C! \ 7   PD OUTPUT  6 PD INPUT (5~0 PD INPUT)
\ output register 每 bit 對應一 pin 腳, set 0 則 LOW, 1 則 HIGH
 $40 $29 C! \   6 PD HIGH
;

\ toggle output register 每 bit 對應一 pin 腳, set 1 則 toggle
\ PB $25  PD $2B
: 0T [ $9A18 5 + , ] ; \ 以編碼 toggle PB5 輸出 \ $25 5 sbi
: 1T [ $9A18 4 + , ] ; \ 以編碼 toggle PB4 輸出 \ $25 4 sbi
: 2T [ $9A18 3 + , ] ; \ 以編碼 toggle PB3 輸出 \ $25 3 sbi
: 3T [ $9A18 2 + , ] ; \ 以編碼 toggle PB2 輸出 \ $25 2 sbi
: 4T [ $9A18 1 + , ] ; \ 以編碼 toggle PB1 輸出 \ $25 1 sbi
: 5T [ $9A18 0 + , ] ; \ 以編碼 toggle PB0 輸出 \ $25 0 sbi
: 6T [ $9A4F 0 + , ] ; \ 以編碼 toggle PD7 輸出 \ $2B 7 sbi

: T ( i -- ) $C * [ ' 0T ] LITERAL + EXECUTE ;
\ 0 T 相當於 0T,  1 T 相當於 1T,  2 T 相當於 2T,  ... 餘類推

: 顯示燈號 ( pat -- ) $40 6
  FOR ( pat m ) 2DUP AND \ 檢視圖樣對應 pin 腳輸出是否要 toggle
     IF R@ T		 \ 若要, 就 toggle 其輸出
     THEN 2/		 \ 準備檢視下一 pin 腳
  NEXT ( pat m ) 2DROP ;

: 熄所有燈號 0 $25 C! $2B C@ $7F AND $2B C! ;

: 檢視觸動開關 ( -- flag )
  6 PD DIGITALREAD ;

: 顯示圖樣 ( -- )
  6 MS　 \ 延遲 6 毫秒
  0      ( 0 ) \ 燈號顯示參照 從 圖樣 TABLE 位址 0 開始
  BEGIN  ( i ) DUP 圖樣 + ( i adr ) IC@ ( i pat ) DUP $80 <
  WHILE  ( i pat ) 顯示燈號 ( i ) 1+ 1 MS 熄所有燈號
  REPEAT ( i pat ) 2DROP ;

: 檢視按鍵否 ( -- false | key true )
  ?KEY ;

: 丟棄 ( key -- ) DROP ;

: 展示我愛你 輸入輸出設定
  CR ." 手搖轉盤 展示 I " 3 EMIT ."  U 扇面圖樣"
  CR ." 按任意鍵 結束 "
  BEGIN 檢視觸動開關
    IF ELSE 顯示圖樣
    THEN  檢視按鍵否
  UNTIL ( key ) 丟棄 ; REMEMBER
  展示我愛你 \ I 