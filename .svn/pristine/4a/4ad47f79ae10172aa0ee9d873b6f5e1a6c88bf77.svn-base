@ECHO off

CD..

IF NOT EXIST release MD release

TYPE package\declare.js>release\upload.js
ECHO.>>release\upload.js

FOR /F "eol=# tokens=* delims= " %%i IN (package\all.js) DO (
	TYPE %%i>>release\upload.js
	ECHO.>>release\upload.js
)

java -jar package\compiler.jar --js release\upload.js --js_output_file release\tmp.js
rem java -jar package\yuic.jar release\upload.js -o release\tmp.js

TYPE package\declare.js>release\upload.min.js
ECHO.>>release\upload.min.js
TYPE release\tmp.js>>release\upload.min.js

DEL release\tmp.js




TYPE package\declare.js>release\upload.i.js
ECHO.>>release\upload.i.js

FOR /F "eol=# tokens=* delims= " %%i IN (package\iframe.js) DO (
	TYPE %%i>>release\upload.i.js
	ECHO.>>release\upload.i.js
)

java -jar package\compiler.jar --js release\upload.i.js --js_output_file release\tmp.js
rem java -jar package\yuic.jar release\upload.i.js -o release\tmp.js

TYPE package\declare.js>release\upload.i.min.js
ECHO.>>release\upload.i.min.js
TYPE release\tmp.js>>release\upload.i.min.js

DEL release\tmp.js





TYPE package\declare.js>release\upload.fi.js
ECHO.>>release\upload.fi.js

FOR /F "eol=# tokens=* delims= " %%i IN (package\fi.js) DO (
	TYPE %%i>>release\upload.fi.js
	ECHO.>>release\upload.fi.js
)

java -jar package\compiler.jar --js release\upload.fi.js --js_output_file release\tmp.js
rem java -jar package\yuic.jar release\upload.fi.js -o release\tmp.js

TYPE package\declare.js>release\upload.fi.min.js
ECHO.>>release\upload.fi.min.js
TYPE release\tmp.js>>release\upload.fi.min.js

DEL release\tmp.js

rem xcopy swf

ECHO done.
pause

START release