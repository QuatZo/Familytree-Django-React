@echo off
cd backend
pipenv run python manage.py makemigrations
pipenv run python manage.py migrate
pause