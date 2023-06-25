convert:
	kompose convert

convert-file:
	kompose --file ${composeFile} convert

run-kube:
	kubectl apply -f ${service1},${service2}

describe:
	kubectl describe svc ${service}

clean-up:
	kubectl delete -f ${service1},${service2}

new-cert:
	openssl req -x509 -subj /CN=${domain} -days 365 -set_serial 2 -newkey rsa:4096 -keyout ${domain}.key -nodes -out ${domain}.pem


docker-run:
	docker run --name ${container} -it -p 4200:80 ${image}

docker-tag:
	docker image tag ${image} hazzajenko/${image}

docker-push:
	docker image push ${image}

config:
	docker-compose --env-file .\production.env config

nginx-config:
	docker-compose --project-directory ./nginx-v2 --env-file .\production.env config

nginx-up:
	docker-compose --project-directory ./nginx-v2 --env-file .\production.env up -d
