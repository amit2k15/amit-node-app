pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'amit2k15/amit-node-app'
        DOCKER_CREDENTIALS_ID = 'dockerhub'
    }

    tools {
        nodejs "Node 18"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/amit2k15/amit-node-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test || echo "No tests defined"'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:latest")
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                script {
                    docker.withRegistry('', "${DOCKER_CREDENTIALS_ID}") {
                        docker.image("${DOCKER_IMAGE}:latest").push()
                    }
                }
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                docker rm -f amit-node-app || true
                docker run -d --name amit-node-app -p 3000:3000 ${DOCKER_IMAGE}:latest
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Application deployed successfully!'
        }
        failure {
            echo '❌ Build or deployment failed!'
        }
    }
}
