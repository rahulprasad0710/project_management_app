# docker build -t rahulshah10/pma_backend_2025:v1 --platform linux/amd64 .

# docker image ls

docker build -t rahulshah10/pma_backend_2025:v1 .

# docker login

# A new user is created in ubuntu to user and do things for docker.

# create a user with username dockeruser

sudo useradd -m -s /bin/bash dockeruser

# create a password with username dockeruser

sudo passwd dockeruser : rahul99docker

# Install docker

# create docker hello-world

# To check docker working fine: docker run hello-world

# When docker is installed a new user group is created with name: docker .

# And to all usergroup check it. : cat /etc/group

# to add dockeruser into the docker usergroup. : sudo usermod -aG docker dockeruser

+-----------------+ push +-----------------+
| Developer | -----------------> | GitHub Repo |
+-----------------+ +-----------------+
|
| triggers GitHub Action
v
+----------------------+
| GitHub Runner |
| (build, test, docker |
| push to ECR, etc.) |
+----------------------+
|
| deploy using AWS CLI / SSH / ECS
v
+----------------------+
| AWS Infrastructure |
| (EC2 / ECS / EKS) |
+----------------------+
