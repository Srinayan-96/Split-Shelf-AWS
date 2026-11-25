pipeline {
  agent any
  environment {
    AWS_REGION = 'us-east-1'
    // Stored as a Secret text credential named 'aws-account-id' in Jenkins
    AWS_ACCOUNT_ID = credentials('aws-account-id')
    // Stored as a Secret text credential named 'swarm-manager-ip' in Jenkins
    SWARM_MANAGER_IP = credentials('swarm-manager-ip')
    ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    TAG = "${BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Build Images') {
      steps {
        sh "docker build -t ${ECR_REGISTRY}/splitshelf-backend:${TAG} -t ${ECR_REGISTRY}/splitshelf-backend:latest ./server"
        sh "docker build -t ${ECR_REGISTRY}/splitshelf-frontend:${TAG} -t ${ECR_REGISTRY}/splitshelf-frontend:latest ./client"
      }
    }
    stage('Push Images to ECR') {
      steps {
        sh """
          aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
          docker push ${ECR_REGISTRY}/splitshelf-backend:${TAG}
          docker push ${ECR_REGISTRY}/splitshelf-backend:latest
          docker push ${ECR_REGISTRY}/splitshelf-frontend:${TAG}
          docker push ${ECR_REGISTRY}/splitshelf-frontend:latest
        """
      }
    }
    stage('Deploy to Swarm') {
      steps {
        sshagent(['swarm-manager-ssh-key']) {
          sh """
            scp -o StrictHostKeyChecking=no docker-stack.yml ubuntu@${SWARM_MANAGER_IP}:~/docker-stack.yml
            ssh -o StrictHostKeyChecking=no ubuntu@${SWARM_MANAGER_IP} "
              aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY} &&
              export AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID} &&
              set -a && [ -f ~/stack.env ] && . ~/stack.env && set +a &&
              docker stack deploy --with-registry-auth -c ~/docker-stack.yml splitshelf
            "
          """
        }
      }
    }
  }
}
