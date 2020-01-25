@echo off
pipenv run python manage.py makemigrations
pipenv run python manage.py migrate