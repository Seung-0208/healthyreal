pipeline {
    agent any

    environment {
        REMOTE_USER = 'ubuntu'                            // 원격 서버 SSH 사용자
        REMOTE_HOST = ''                      // 원격 서버 IP
        REMOTE_PATH = '/home/ubuntu/k3s-deploy/mysql'             // YAML이 저장될 경로
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
                            cd /opt
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
                sshagent (credentials: ['your-jenkins-ssh-key-id']) {
                    sh """
                    ssh ${REMOTE_USER}@${REMOTE_HOST} '
                        cd ${REMOTE_PATH}

                        # 템플릿을 복사하여 임시 파일로 만듦
                        cp mysql-secret-template.yaml mysql-secret.yaml

                        # placeholder 값을 실제 값으로 치환
                        sed -i "s#<MYSQL_ROOT_PASSWORD>#${MYSQL_ROOT_PASSWORD}#g" mysql-secret.yaml
                        sed -i "s#<MYSQL_USER>#${MYSQL_USER}#g" mysql-secret.yaml
                        sed -i "s#<MYSQL_PASSWORD>#${MYSQL_PASSWORD}#g" mysql-secret.yaml
                        sed -i "s#<MYSQL_DATABASE>#${MYSQL_DATABASE}#g" mysql-secret.yaml

                        # 기존 Secret 삭제 (존재할 경우)
                        kubectl delete secret ${SECRET_NAME} --ignore-not-found

                        # Secret 생성
                        kubectl apply -f mysql-secret.yaml
                    '
                    """
                }
            }
        }

        stage('✅ MySQL 실행 (PV, PVC, StatefulSet, Service)') {
            steps {
                echo "Applying MySQL manifests..."
                sshagent (credentials: ['your-jenkins-ssh-key-id']) {
                    sh """
                    ssh ${REMOTE_USER}@${REMOTE_HOST} '
                        cd ${REMOTE_PATH}
                        kubectl apply -f mysql-pv.yaml
                        kubectl apply -f mysql-pvc.yaml
                        kubectl apply -f mysql-statefulset.yaml
                        kubectl apply -f mysql-service.yaml
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
