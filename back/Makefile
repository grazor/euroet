test:
	DJANGO_ENV=testing py.test tests

test_pdb:
	DJANGO_ENV=testing py.test tests -s --timeout 0

run:
	./manage.py runserver

lint:
	flake8 server
	mypy server tests
	black --check server tests

format:
	isort --recursive server tests
	black server tests

clean:
	find -type d -name "__pycache__" -exec rm -rf {} \;

shell:
	./manage.py shell_plus
