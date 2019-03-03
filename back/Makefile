run:
	./manage.py runserver

lint:
	flake8 server
	mypy server
	black --check server

black:
	black server

test:
	DJANGO_ENV=testing py.test tests

clean:
	find -type d -name "__pycache__" -exec rm -rf {} \;
