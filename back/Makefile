test:
	DJANGO_ENV=testing py.test tests

run:
	./manage.py runserver

lint:
	flake8 server
	mypy server
	black --check server

format:
	isort --recursive server
	black server

clean:
	find -type d -name "__pycache__" -exec rm -rf {} \;

shell:
	./manage.py shell_plus
