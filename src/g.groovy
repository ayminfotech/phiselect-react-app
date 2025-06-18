pipeline {
    agent any

    parameters {
        gitParameter(
            branchFilter: 'origin/(.*)',
            defaultValue: 'develop',
            name: 'BRANCH_NAME',
            type: 'PT_BRANCH',
            description: 'Select branch to build and deploy'
        )
        choice(
            name: 'TARGET_ENV',
            choices: ['dev', 'test', 'prod'],
            description: 'Deployment environment'
        )
    }

    environment {
        DOCKER_REPO     = 'sudhaaym/react-app'
        DOCKER_USERNAME = 'sudhaaym'

        DEV_SSH_HOST    = 'web-test.phiselect.com'
        TEST_SSH_HOST   = 'web-test.phiselect.com'
        PROD_SSH_HOST   = 'web-test.phiselect.com'
        SSH_USER        = 'ubuntu'

        DEV_REMOTE_DIR  = '/home/ubuntu/phiselect-react-dev'
        TEST_REMOTE_DIR = '/home/ubuntu/phiselect-react-test'
        PROD_REMOTE_DIR = '/home/ubuntu/phiselect-react-prod'
    }

    stages {
        stage('Checkout Code') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'github-key', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                    checkout([$class: 'GitSCM',
                        branches: [[name: "*/${params.BRANCH_NAME}"]],
                        userRemoteConfigs: [[
                            url: "https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/ayminfotech/phiselect-react-app.git",
                            credentialsId: 'github-key'
                        ]]
                    ])
                }
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                script {
                    env.IMAGE_TAG = params.BRANCH_NAME == 'main' ? 'latest' : "${params.BRANCH_NAME}-${env.BUILD_NUMBER}".replaceAll('/', '-')
                    env.DOCKER_IMAGE = "${env.DOCKER_REPO}:${env.IMAGE_TAG}"

                    sh """
                        docker build --no-cache -t ${env.DOCKER_IMAGE} \
                        --build-arg REACT_APP_ENV=${params.TARGET_ENV} \
                        -f Dockerfile-nginx .
                    """

                    withCredentials([usernamePassword(credentialsId: 'docker-key', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh """
                            echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                            docker push ${env.DOCKER_IMAGE}
                        """
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    def host = params.TARGET_ENV == 'dev' ? env.DEV_SSH_HOST : params.TARGET_ENV == 'test' ? env.TEST_SSH_HOST : env.PROD_SSH_HOST
                    def dir  = params.TARGET_ENV == 'dev' ? env.DEV_REMOTE_DIR : params.TARGET_ENV == 'test' ? env.TEST_REMOTE_DIR : env.PROD_REMOTE_DIR
                    deployToEC2(host, dir, env.DOCKER_IMAGE, params.TARGET_ENV)
                }
            }
        }
    }
}

def deployToEC2(String host, String remoteDir, String dockerImage, String targetEnv) {
    withCredentials([
        usernamePassword(credentialsId: 'docker-key', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD'),
        sshUserPrivateKey(credentialsId: 'ec2-key', keyFileVariable: 'SSH_KEY')
    ]) {
        sh """
        echo "🔑 SSH to ${host}"
        ssh -i \$SSH_KEY -o StrictHostKeyChecking=no ${env.SSH_USER}@${host} bash -s <<EOF
set -e

REMOTE_DIR="${remoteDir}"
IMAGE="${dockerImage}"
TARGET_ENV="${targetEnv}"

echo "📁 Creating directory \$REMOTE_DIR"
mkdir -p \$REMOTE_DIR
cd \$REMOTE_DIR

echo "🔐 Docker login"
echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin

echo "📥 Pulling image \$IMAGE"
docker pull \$IMAGE

echo "📝 Creating docker-compose.yml"
cat > docker-compose.yml <<YML
version: '3.8'
services:
  reactapp:
    image: \$IMAGE
    container_name: reactapp-\${TARGET_ENV}
    restart: always
    ports:
      - "80:80"
    networks:
      - frontend_net
networks:
  frontend_net:
    external: true
    name: ats-frontend-net
YML

echo "🌐 Ensuring network exists"
docker network inspect ats-frontend-net >/dev/null 2>&1 || docker network create --driver bridge ats-frontend-net

echo "🚀 Starting container"
docker compose up -d
EOF
        """
    }
}