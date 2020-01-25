release: sh -c 'cd ./django-react/ && exec python manage.py migrate'
web: gunicorn --pythonpath django-react backend.wsgi