# IoT-server

## Prerequisites
* node.js
* globally installed terraform
* globally installed nestjs
* docker

### Steps to start the project

1. cd secrets
2. openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
3. create local.env file in src/common/envs folder and update env variables according to .env file
4. cd ../
5. You can start project in two ways: npm run start or start using Dockerfile

### How to deploy project

1. cd deployment
2. create variables.tf file and update it according to variables.example.tf file. Delete variables.example.tf
3. terraform plan -out=planName
4. terraform apply planName
5. check your IP in amazon ECS task definitions
6. ACCOUNT_ID=$(aws sts get-caller-identity | jq -r ".Account")                                      
   aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.eu-central-1.amazonaws.com"
7. Create docker image using Dockerfile (update NODE_ENV to "DEVELOPMENT")
8. Create development.env and update it according to .env file (HOSTNAME should be you server IP)
9. docker tag <docker image tag name> <AMAZON ECR URI>:latest
10. docker push <AMAZON ECR URI>:latest

P.S. you can find postman collection (IoT-server.postman_collection.json) in the root folder of the project