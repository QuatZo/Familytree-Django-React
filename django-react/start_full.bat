@echo off
call install.bat
cd ..
call build.bat
cd ..
call collectstatic.bat
call migrate.bat
call start_server_only.bat