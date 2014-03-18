ANEW dot.f \ 20140319 陳爽 
: . ( n -- )
  BASE @ $A =                 \ 檢視是否 十進制
  IF SPACE                    \ 若是 十進制
    DUP 0 <                   \   檢視是否 n 小於 0
    IF                        \   若是 n 小於 0
      [ CHAR - ] LITERAL EMIT \     前置負號
      ABS                     \     取 n 的絕對值
    THEN <# #S #>             \   轉換 十進制位數
    TYPE                      \   印出 十進制位數
  ELSE U.                     \ 否則 以 U. 直接印出
  THEN ;