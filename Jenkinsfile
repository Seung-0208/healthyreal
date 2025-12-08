pipeline {
    agent any

    environment {
        REMOTE_USER = 'ubuntu'                            // 원격 서버 SSH 사용자
        REMOTE_HOST = ''                      // 원격 서버 IP
        REMOTE_PATH = '/home/ubuntu/k3s-deploy/infra-config-db'             // YAML이 저장될 경로
        REPO_URL = 'https://github.com/devops-healthyreal/infra-config-db.git' // infra-config Git repo
        SECRET_NAME = ''
        MYSQL_ROOT_PASSWORD = ''            // 실제 값
        MYSQL_USER = ''
        MYSQL_PASSWORD = ''
        MYSQL_DATABASE = ''
    }

    stages {

        stage('✅ 서버 접속 및 리포지토리 Pull') {
            steps {
                echo "Pulling latest infra-config repository from ${REPO_URL}..."
                sshagent (credentials: ['admin']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} '
                        set -e
                        if [ ! -d ${REMOTE_PATH} ]; then
                            sudo mkdir -p ${REMOTE_PATH}
                            cd /home/ubuntu/k3s-deploy
                            sudo git clone ${REPO_URL}
                        else
                            cd ${REMOTE_PATH}
                            sudo git pull origin main
                        fi
                    '
                    """
                }
            }
        }

        stage('✅ Secret 생성 (템플릿 기반)') {
            steps {
                echo "Generating mysql-secret from template..."
                sshagent (credentials: ['admin']) {
                    sh """
                    ssh ${REMOTE_USER}@${REMOTE_HOST} '
                        cd ${REMOTE_PATH}

                        # 템플릿을 복사하여 임시 파일로 만듦
                        sudo cp mysql-secret-template.yaml mysql-secret.yaml

                        # placeholder 값을 실제 값으로 치환
                        sudo sed -i "s#<MYSQL_ROOT_PASSWORD>#${MYSQL_ROOT_PASSWORD}#g" mysql-secret.yaml
                        sudo sed -i "s#<MYSQL_USER>#${MYSQL_USER}#g" mysql-secret.yaml
                        sudo sed -i "s#<MYSQL_PASSWORD>#${MYSQL_PASSWORD}#g" mysql-secret.yaml
                        sudo sed -i "s#<MYSQL_DATABASE>#${MYSQL_DATABASE}#g" mysql-secret.yaml

                        # 기존 Secret 삭제 (존재할 경우)
                        sudo kubectl delete secret ${SECRET_NAME} --ignore-not-found

                        # Secret 생성
                        sudo kubectl apply -f mysql-secret.yaml
                    '
                    """
                }
            }
        }

        stage('✅ MySQL 실행 (PV, PVC, StatefulSet, Service)') {
            steps {
                echo "Applying MySQL manifests..."
                sshagent (credentials: ['admin']) {
                    sh """
                    ssh ${REMOTE_USER}@${REMOTE_HOST} '
                        cd ${REMOTE_PATH}

                        #StatefulSet 재생성
                        if kubectl get statefulset mysql >/dev/null 2>&1; then
                            echo "StatefulSet mysql already exists — deleting safely..."
                            kubectl delete statefulset mysql --cascade=orphan
                        fi

                        sudo kubectl apply -f mysql-pv.yaml
                        sudo kubectl apply -f mysql.yaml
                    '
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ MySQL 배포가 성공적으로 완료되었습니다!'
        }
        failure {
            echo '❌ MySQL 배포 중 오류가 발생했습니다. 로그를 확인하세요.'
        }
    }
}
