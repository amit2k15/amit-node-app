pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'amit2k16/nodejs-app'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        CONTAINER_NAME = 'nodejs-app'
        PORT = '3000'
        NODE_ENV = 'test'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git(
                    url: 'https://github.com/amit2k15/amit-node-app.git',
                    branch: 'main',
                    poll: true
                )
                sh 'ls -la'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Try normal install first
                    try {
                        if (fileExists('package-lock.json')) {
                            sh 'npm ci --no-audit'
                        } else {
                            sh 'npm install --no-audit'
                        }
                    } catch (e) {
                        // Fallback to legacy peer deps if normal install fails
                        echo 'Standard install failed, trying with legacy peer deps'
                        if (fileExists('package-lock.json')) {
                            sh 'npm ci --no-audit --legacy-peer-deps'
                        } else {
                            sh 'npm install --no-audit --legacy-peer-deps'
                        }
                    }
                }
            }
        }

        // Rest of your pipeline...
        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }
    }
}