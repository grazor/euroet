.ONESHELL:

run:
	cd back
	./manage.py runserver

lint:
	cd back
	flake8 server
	mypy server

black:
	cd back
	black server

test:
	cd back
	DJANGO_ENV=testing py.test tests
