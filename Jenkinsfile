pipeline {
    agent any

    environment {
        // Docker configuration
        DOCKER_IMAGE = 'amit2k16/nodejs-app'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        CONTAINER_NAME = 'nodejs-app'
        PORT = '3000'
        
        // Node.js configuration
        NODE_ENV = 'test'
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
                sh 'ls -la' // Verify files
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }


        stage('Run Tests') {
            steps {
                script {
                    try {
                        sh 'npm test'
                        junit '**/test-results.xml' // Publish test results
                    } catch(e) {
                        error('Tests failed!')
                    }
                }
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
                    // Stop and remove old container if exists
                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"
                    
                    // Run new container
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
            echo 'Pipeline completed - cleaning up'
            sh 'docker logout || true'
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded!'
            slackSend(color: 'good', message: "Deployment successful: ${env.BUILD_URL}")
        }
        failure {
            echo 'Pipeline failed!'
            slackSend(color: 'danger', message: "Deployment failed: ${env.BUILD_URL}")
        }
    }
}