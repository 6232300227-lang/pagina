@echo off
REM Runs the PowerShell static file server (serve.ps1) with ExecutionPolicy bypass
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1" %*
pause
