pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'bikalp2003/room-rental-service:latest'
        FRONTEND_IMAGE = 'bikalp2003/room-rental-frontend:latest'
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
                // NOTE: The database is expected to be running on the host system and is not managed by docker-compose.
                // The backend and frontend will be exposed on ports 18080 (backend HTTP), 18443 (backend HTTPS), and 18081 (frontend).
                sshagent(['YOUR_SSH_CREDENTIALS_ID']) {
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