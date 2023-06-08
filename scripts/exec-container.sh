#!/bin/bash

runningContainers=$(docker ps --filter "status=running" --format '{{.Names}}')
containerArray=($runningContainers)

for i in "${!containerArray[@]}"; do
    echo "Running container: ${containerArray[$i]}"
done

options=("${containerArray[@]}")

echo -e "\e[30;107mOPTIONS:\e[0m"
for i in "${!options[@]}"; do
    echo "$i: ${options[$i]}"
done

read -r -p "ENTER THE NUMBER of the container you wish to exec into or Q to quit: " selection

if [[ "$selection" =~ ^[Qq]$ ]]; then
    exit 0
fi

containerName=${options[$selection]}
containerId=$(docker ps --filter "name=${containerName}" --format '{{.ID}}')

echo "Container ID: $containerId"

docker exec -it "$containerId" /bin/bash
