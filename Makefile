cert:
	./scripts/certs/create-crt-rsa-cert.ps1 ${domain}

dev:
	docker-compose -f docker-compose.dev.yml up ${args}

publish:
	./scripts/deployment/publish-and-push-docker-services.ps1


