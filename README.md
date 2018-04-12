# Kubernetes Gracefeul Shutdown - Test
An application to test graceful pod shutdown in kubernetes. Based on the sample by RisingStack [here](https://github.com/RisingStack/kubernetes-graceful-shutdown-example).

## Requires
- Minikube
- Kubectl
- [Hey](https://github.com/rakyll/hey)

# To test

Make sure minikube is running. For instance use:
```
minikube start --kubernetes-version=v1.9.0 --cpus 2  --memory 8192
```

Build and deploy test application to minikube. Run the following:
```bash
run-in-minikube.sh
```

Get the URL for the above
```bash
minikube service myapp --url
```

Open separate command prompts and run the following
```bash
kubectl get events --watch-only
kubectl logs -f -c myapp $(kubectl get pods -o json | jq -r '.items[0].metadata.name')
kubectl logs -f -c myapp $(kubectl get pods -o json | jq -r '.items[1].metadata.name')
hey -disable-keepalive -c 5 -q 1 -z 2m $(minikube service myapp --url)
```

Use kubectl to scale the deployment down to 1 instance:
```bash
kubectl scale --replicas=1 -f kubernetes/deployment.yaml
```

You can also test the other endpoint using:
```
hey -disable-keepalive -c 5 -q 1 -z 2m $(minikube service myapp --url)/alive
hey -disable-keepalive -c 5 -q 1 -z 2m $(minikube service myapp --url)/ready
```

