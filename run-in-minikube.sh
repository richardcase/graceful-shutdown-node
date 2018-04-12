#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

# Set docker env
eval $(minikube docker-env)

# Build image
docker build -f Dockerfile -t richardcase/gracefultestnode:0.0.0d .

# Run in minikube
#kubectl run graceful-node-test --image=richardcase/gracefultestnode:0.0.0d --image-pull-policy=Never
kubectl apply -f kubernetes/service.yaml
kubectl apply -f kubernetes/deployment.yaml

# Check that it's running
kubectl get pods
