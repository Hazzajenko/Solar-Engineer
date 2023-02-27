build:
	docker build -t nginxserver .

build-nocache:
	docker build -t nginxserver . --no-cache

run:
	docker run -it --rm -d -p 80:80 --name nginxserver nginxserver

stop:
	docker stop nginxserver

kill:
	docker kill nginxserver

gen:
	./generate-crt.ps1