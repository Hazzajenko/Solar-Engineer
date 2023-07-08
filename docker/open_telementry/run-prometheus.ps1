$psFileDirectory = Split-Path $MyInvocation.MyCommand.Path

docker run `
    -p 9090:9090 `
    -v ${psFileDirectory}/prometheus.yml:/etc/prometheus/prometheus.yml `
    prom/prometheus
