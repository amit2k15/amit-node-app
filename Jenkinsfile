pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'amit2k16/nodejs-app'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        CONTAINER_NAME = 'nodejs-app'
        PORT = '3000'
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

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
                sh 'npm install --legacy-peer-deps --no-audit'
                sh 'npm install --package-lock-only'
            }
        }

       
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}", "--no-cache --build-arg NPM_CONFIG_LEGACY_PEER_DEPS=true .")
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhubid',
                        usernameVariable: 'DOCKER_HUB_USER',
                        passwordVariable: 'DOCKER_HUB_TOKEN'
                    )]) {
                        sh "echo ${DOCKER_HUB_TOKEN} | docker login -u ${DOCKER_HUB_USER} --password-stdin"
                        sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                        sh 'docker logout'
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"
                    sh """
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p ${PORT}:${PORT} \
                        -e NODE_ENV=production \
                        ${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed'
            sh 'docker logout || true'
        }
    }
}