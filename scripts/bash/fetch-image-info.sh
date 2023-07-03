#260

#Update: Docker has deprecated the Docker Hub v1 API. To fetch tags using the v2 API, use e.g.

wget -q -O - "https://hub.docker.com/v2/namespaces/hazzajenko/repositories/solarengineer-web-ui/tags?page_size=100" | grep -o '"name": *"[^"]*' | grep -o '[^"]*$'
#Note: The results will be limited to the newest 100 tags. To get the next 100 tags, set the URL to https://.../tags?page_size=100&page=2 etc.

#For images other than Docker Official Images, replace library with the name of the user/organization.

#The URL https://hub.docker.com/v2/repositories/{namespace}/{repository}/tags also works at the moment, however it is unclear from the API specification whether it is legal.

#(If you have jq installed, you can replace the kludgy grep commands with jq -r '.results[].name'.)

