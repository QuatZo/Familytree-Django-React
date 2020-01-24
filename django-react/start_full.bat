@echo off
call install.bat
cd ..
call migrate.bat
call start_server_only.bat