# Desafio K8s

O desafio consiste em algumas tarefas, o link para o desafio está aqui: [Desafio: Implantação de uma API e Banco de Dados no Kubernetes](https://efficient-sloth-d85.notion.site/Desafio-Implanta-o-de-uma-API-e-Banco-de-Dados-no-Kubernetes-6a0bde055fc24fb99a3daedab56eec5a?pvs=143)

## Pré-requisitos

- [Docker](https://docs.docker.com/engine/install/)
- [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Node.js](https://nodejs.org/)

## Passo a passo do que fiz

**1** — Utilizei a cli do nestjs para criar uma estrutura mínima para uma API, após isso criei a pasta cluster e criei os declarativos para criar o cluster k8s utilizando o Kind.

**2** — A pasta db foi criada para ter os declarativos relacionados ao banco de dados

Para desenvolver a API localmente, sem depender do cluster, subo um postgres:16 no docker. Ele não é necessário para o cluster funcionar, o Kubernetes baixa a imagem por conta própria.

```bash
docker run -d --name postgresql-k8s \
  -e POSTGRES_USER=desafiok8s \
  -e POSTGRES_PASSWORD=desafiok8s \
  -e POSTGRES_DB=desafiok8s \
  -p 5433:5432 \
  postgres:16
```

**3** — Criando o cluster com kind

```bash
kind create cluster --config cluster/kind-config.yml
```

**4** — Criando o arquivo `.env`

As credenciais do banco ficam em `cluster/db/.env`, que não é versionado. Antes de criar os objetos é necessário copiar o `.env.example` e preencher os valores, pois o Kustomize usa esse arquivo para gerar o Secret.

```bash
cp cluster/db/.env.example cluster/db/.env
```

**5** — Endpoints de health na API

A pasta `api` foi criada para ter os declarativos relacionados à API. Criei três endpoints (`/health-startup`, `/health-readiness` e `/health-liveness`), um para cada probe do Deployment. A startup dá tempo da aplicação subir antes das outras duas começarem, a readiness controla se o pod recebe tráfego e a liveness verifica se o processo continua respondendo.

**6** — Gerando a imagem da API

O Dockerfile fica dentro de `api`, junto do código, e usa multi-stage para a imagem final levar apenas o `dist` e as dependências de produção.

```bash
docker build -t [seu-usuario-docker]/challenge-k8s-api:[tag] ./api
```

**7** — Publicando a imagem

Os nós do Kind têm o próprio containerd e não enxergam as imagens do Docker da máquina. Publicando no Docker Hub, o Kubernetes baixa a imagem sozinho na hora de criar o pod. É necessário estar autenticado com `docker login`.

```bash
docker push [seu-usuario-docker]/challenge-k8s-api:[tag]
```

A tag precisa ser nova a cada alteração. Como o `imagePullPolicy` é `IfNotPresent`, o nó não busca de novo uma tag que já tem.

**8** — Criando os objetos

```bash
kubectl apply -k cluster/
```

**9** — Verificando

```bash
kubectl get pods,svc -n desafio-api
```

```bash
kubectl get pods,svc -n desafio-db
```

Para testar os endpoints da API pelo host, é necessário fazer o port-forward, já que o Service é do tipo ClusterIP e só é acessível de dentro do cluster.

```bash
kubectl port-forward -n desafio-api svc/api-k8s-service 3000:80
```
