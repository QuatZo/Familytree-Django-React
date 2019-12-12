@echo off
call install.bat
cd ..
call migrate.bat
cd ..
start backend.bat
frontend.bat