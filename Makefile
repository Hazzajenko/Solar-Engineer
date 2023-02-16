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