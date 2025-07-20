pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'room-rental-app-1'
        FRONTEND_IMAGE = 'room-rental-frontend-1'
    }

    stages {
        stage('Build') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}")
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'mac7314890', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh "docker push ${DOCKER_IMAGE}"
                }
            }
        }
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install --legacy-peer-deps'
                    sh 'npm run build'
                }
            }
        }
        stage('Build Frontend Docker Image') {
            steps {
                script {
                    dir('frontend') {
                        docker.build(env.FRONTEND_IMAGE, '.')
                    }
                }
            }
        }
        stage('Push Frontend Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'mac7314890', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh "docker push ${FRONTEND_IMAGE}"
                }
            }
        }
        stage('Deploy') {
            steps {
                sshagent(['My_SSH_CREDENTIALS_ID']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no user@your.server.ip "
                        cd /path/to/your/project &&
                        git pull &&
                        docker-compose pull &&
                        docker-compose up -d
                    "
                    '''
                }
            }
        }
    }
} 