@echo off
cd /d "%~dp0"
set "PATH=%~dp0.cache\node-v22.23.3-win-x64;%PATH%"
set "ASTRO_TELEMETRY_DISABLED=1"
set "DO_NOT_TRACK=1"
call npm.cmd run build:site
if errorlevel 1 (
  echo.
  echo Rebuild failed. Keep this window open and copy the error message.
) else (
  echo.
  echo Panelraid rebuilt successfully. Refresh http://panelraid.test/
)
pause
