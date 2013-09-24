@ECHO off

cd..

IF NOT EXIST release MD release

TYPE package\declare.js>release\class.js
ECHO.>>release\class.js

FOR /F "eol=# tokens=* delims= " %%i IN (package\build.js) DO (
	TYPE %%i>>release\class.js
	ECHO.>>release\class.js
)

rem java -jar package\yuic.jar release\class.js -o release\tmp.js
java -jar package\compiler.jar --js release\class.js --js_output_file release\tmp.js

TYPE package\declare.js>release\class.min.js
ECHO.>>release\class.min.js
TYPE release\tmp.js>>release\class.min.js

DEL release\tmp.js

ECHO done.
pause

start release