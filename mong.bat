@echo off
::http://stackoverflow.com/questions/10315307/how-to-check-whether-the-port-80-is-available-using-a-batch-file-in-windows-xp
netstat -o -n -a | findstr 3333 | findstr /v TIME_WAIT > nul
set datapath=%~d0%~p0
@IF %datapath:~-1%==\ @SET datapath=%datapath:~0,-1%
if %ERRORLEVEL% neq 0 (start "" mongoose -listening_port 3333 -start_browser no -document_root %datapath%)
