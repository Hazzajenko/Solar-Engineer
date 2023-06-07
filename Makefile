convert:
	kompose convert

convert-file:
	kompose --file docker-voting.yml convert

run-kube:
	kubectl apply -f frontend-tcp-service.yaml,redis-master-service.yaml,redis-slave-service.yaml,frontend-deployment.yaml,redis-master-deployment.yaml,redis-slave-deployment.yaml

describe:
	kubectl describe svc frontend

clean-up:
	kubectl delete -f frontend-tcp-service.yaml,redis-master-service.yaml,redis-slave-service.yaml,frontend-deployment.yaml,redis-master-deployment.yaml,redis-slave-deployment.yaml

new-cert:
	openssl req -x509 -subj /CN=${domain} -days 365 -set_serial 2 -newkey rsa:4096 -keyout ${domain}.key -nodes -out ${domain}.pem


docker-run:
	docker run --name ${container} -it -p 4200:80 ${image}

docker-tag:
	docker image tag ${image} hazzajenko/${image}

docker-push:
	docker image push ${image}