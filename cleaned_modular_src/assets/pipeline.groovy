pipeline {
    agent any

    parameters {
        gitParameter(
            branchFilter: 'origin/(.*)',
            defaultValue: 'develop',
            name: 'BRANCH_NAME',
            type: 'PT_BRANCH',
            description: 'Select the branch to build and deploy'
        )
        choice(
            name: 'TARGET_ENV',
            choices: ['dev', 'test', 'prod'],
            description: 'Choose the environment to deploy'
        )
    }

    environment {
        DOCKER_REPO     = "sudhaaym/react-app"
        DOCKER_USERNAME = "sudhaaym"
        DEV_SSH_HOST    = "10.0.2.216"
        TEST_SSH_HOST   = "10.0.2.216"
        PROD_SSH_HOST   = "10.0.2.216"
        SSH_USER        = "ec2-user"
        REMOTE_DIR      = "/home/ec2-user/react-app"
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Debug Info') {
            steps {
                script {
                    sh "env | sort"
                    sh "whoami"
                    sh "id"
                }
            }
        }

        stage('Checkout Code') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'github-key', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                        checkout([
                            $class: 'GitSCM',
                            branches: [[name: "*/${params.BRANCH_NAME}"]],
                            userRemoteConfigs: [[
                                url: "https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/ayminfotech/phiselect-react-app.git"
                            ]]
                        ])
                    }
                }
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-key', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        def tag = "latest"
                        env.DOCKER_IMAGE = "${DOCKER_REPO}:${tag}"
                        sh "docker build -t ${DOCKER_IMAGE} ."
                        sh "echo '${DOCKER_PASSWORD}' | docker login -u '${DOCKER_USERNAME}' --password-stdin"
                        sh "docker push ${DOCKER_IMAGE}"
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    def targetHost = params.TARGET_ENV == 'dev' ? env.DEV_SSH_HOST :
                                     params.TARGET_ENV == 'test' ? env.TEST_SSH_HOST :
                                     env.PROD_SSH_HOST

                    deployReact(targetHost)
                }
            }
        }
    }
}

def deployReact(targetHost) {
    withCredentials([
        sshUserPrivateKey(credentialsId: 'ec2-key', keyFileVariable: 'SSH_KEY'),
        usernamePassword(credentialsId: 'docker-key', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')
    ]) {
        sh """
        ssh -i $SSH_KEY -o StrictHostKeyChecking=no ${env.SSH_USER}@${targetHost} << 'EOF'
            set -e
            echo "🚀 Deploying React App to ${targetHost}..."

            cd ${REMOTE_DIR} || {
              echo "⚠️ Directory not found. Cloning..."
              git clone https://github.com/ayminfotech/phiselect-react-app.git ${REMOTE_DIR}
              cd ${REMOTE_DIR}
            }

            git pull origin ${params.BRANCH_NAME}

            echo "🔽 Pulling Docker Image"
            echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
            docker pull ${env.DOCKER_IMAGE}

            echo "🧹 Stopping old container"
            docker compose down || true

            echo "🚀 Starting React App"
            docker compose up -d react-app
        EOF
        """
    }
}