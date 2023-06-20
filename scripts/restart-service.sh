#!/bin/bash

options=("web-ui" "identity-api" "projects-api" "rabbitmq" "redis")

echo -e "\e[30;107mOPTIONS:\e[0m"
for i in "${!options[@]}"; do
  echo "$i: ${options[$i]}"
done

echo -n "ENTER THE NUMBER of the option(s) or Q to quit: "
read -r selection

# If selection is Q or q, then exit.
if [[ "$selection" =~ ^[Qq]$ ]]; then
  exit 0
fi

IFS=', ' read -r -a selection_array <<< "$selection"

for index in "${selection_array[@]}"; do
    service=${options[$index]}
    echo "Restarting $service"
    docker-compose up -d --no-deps --build "$service"
done
