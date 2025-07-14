pipeline {
    agent any

    environment {
        // Application configuration
        DOCKER_IMAGE = 'your-dockerhub-username/nodejs-app'  // Update with your Docker Hub username
        DOCKER_TAG = 'latest'
        CONTAINER_NAME = 'nodejs-app'
        PORT = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/your-username/your-nodejs-repo.git',
                    branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Application') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test' // optional test stage
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'DOCKER_HUB_USER',
                        passwordVariable: 'DOCKER_HUB_TOKEN'
                    )]) {
                        // Login to Docker Hub
                        sh "echo ${DOCKER_HUB_TOKEN} | docker login -u ${DOCKER_HUB_USER} --password-stdin"
                        
                        // Push the image
                        sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                        
                        // Logout when done
                        sh 'docker logout'
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Stop and remove if container already exists
                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"
                    
                    // Run new container
                    sh """
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p ${PORT}:${PORT} \
                        ${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed - cleaning up'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
