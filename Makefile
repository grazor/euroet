run:
	./manage.py runserver

lint:
	flake8 server
	mypy server

black:
	black server

test:
	DJANGO_ENV=testing py.test tests
