Here’s a comprehensive cheat sheet of **common Docker commands**, organized by use case:

---

## **1. Docker Info & Status**

```bash
docker --version           # Check Docker version
docker info                # Detailed info about Docker installation
docker ps                  # List running containers
docker ps -a               # List all containers (running + stopped)
docker images              # List all images
docker volume ls           # List volumes
docker network ls          # List networks
```

---

## **2. Running Containers**

```bash
docker run hello-world                     # Test Docker
docker run -it ubuntu /bin/bash           # Run Ubuntu interactively
docker run -d -p 8080:80 nginx             # Run Nginx detached, map host 8080 -> container 80
docker run --name mycontainer -d nginx    # Name the container
docker run --rm alpine echo "Hello"       # Temporary container
```

**Key Flags:**

-   `-d` → detached mode (background)
-   `-it` → interactive terminal
-   `--name` → assign a name
-   `-p hostPort:containerPort` → port mapping
-   `--rm` → remove container after exit

---

## **3. Managing Containers**

```bash
docker start <container_id>      # Start a stopped container
docker stop <container_id>       # Stop a running container
docker restart <container_id>    # Restart container
docker exec -it <container_id> /bin/bash  # Enter a running container
docker logs <container_id>       # View container logs
docker rm <container_id>         # Remove container
docker rm $(docker ps -a -q)     # Remove all containers
```

---

## **4. Managing Images**

```bash
docker build -t myimage:tag .   # Build image from Dockerfile
docker pull nginx               # Pull image from Docker Hub
docker push myrepo/myimage:tag # Push image to registry
docker rmi <image_id>           # Remove image
docker rmi $(docker images -q)  # Remove all images
```

---

## **5. Volumes & Data**

```bash
docker volume create myvolume           # Create a volume
docker run -v myvolume:/data ubuntu    # Mount volume
docker volume inspect myvolume          # Inspect volume
docker volume rm myvolume               # Remove volume
```

---

## **6. Networks**

```bash
docker network create mynet           # Create a network
docker network ls                     # List networks
docker network inspect mynet          # Inspect network
docker network rm mynet               # Remove network
docker run --network mynet ...        # Run container on a network
```

---

## **7. Cleaning Up**

```bash
docker system prune                  # Remove unused containers, networks, images
docker system prune -a               # Remove everything unused
docker container prune               # Remove stopped containers
docker image prune                   # Remove dangling images
docker volume prune                  # Remove unused volumes
```

---

## **8. Docker Compose**

```bash
docker-compose up                    # Start services from docker-compose.yml
docker-compose up -d                 # Start in detached mode
docker-compose down                  # Stop and remove containers
docker-compose build                 # Build images from docker-compose.yml
docker-compose logs                  # View logs
```

---

If you want, I can make a **one-page “Docker commands cheat sheet”** that’s **super easy to remember and use** for day-to-day work.

Do you want me to do that?

## rahulshah10/pma_frontend_2025:latest
