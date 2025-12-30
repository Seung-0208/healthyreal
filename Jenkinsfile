pipeline {
  agent any

  options {
    disableConcurrentBuilds()
    timestamps()
  }

  environment {
    DOCKERHUB_CREDENTIALS = credentials('seung-dockerhub-credentials')
    DEPLOY_USER   = "ubuntu"
    DEPLOY_SERVER = "54.180.109.10"
    DEPLOY_PATH   = "/home/ubuntu/k3s-deploy"

    FRONT_IMAGE  = "seung0208/healthyreal-front"
    SPRING_IMAGE = "seung0208/healthyreal-spring"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        sh '''
          echo "Branch: $(git rev-parse --abbrev-ref HEAD)"
          echo "Commit: $(git rev-parse --short HEAD)"
          echo "Commit message: $(git log -1 --pretty=%B)"
        '''
      }
    }

    stage('Detect Changes') {
      steps {
        script {
          // ✅ main merge 빌드 기준: 직전 커밋과 비교 (PR merge commit 기준)
          def changed = sh(script: "git diff --name-only HEAD~1..HEAD", returnStdout: true).trim()
          echo "Changed files:\n${changed}"

          env.CHANGE_FRONT  = (changed =~ /(^|\\n)front\\//) ? "true" : "false"
          env.CHANGE_SPRING = (changed =~ /(^|\\n)back\\//)  ? "true" : "false"

        }
      }
    }

    stage('Login DockerHub') {
      when { anyOf { environment name: 'CHANGE_FRONT', value: 'true'
                     environment name: 'CHANGE_SPRING', value: 'true' } }
      steps {
        sh '''
          echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u seung0208 --password-stdin
        '''
      }
    }

    stage('Build & Push Front') {
      when { environment name: 'CHANGE_FRONT', value: 'true' }
      steps {
        sh """
          docker build -t ${FRONT_IMAGE}:latest front
          docker push ${FRONT_IMAGE}:latest
        """
      }
    }

    stage('Build & Push Spring') {
      when { environment name: 'CHANGE_SPRING', value: 'true' }
      steps {
        sh """
          docker build -t ${SPRING_IMAGE}:latest back
          docker push ${SPRING_IMAGE}:latest
        """
      }
    }

    stage('Sync YAML to Server') {
      when { anyOf { environment name: 'CHANGE_FRONT', value: 'true'
                     environment name: 'CHANGE_SPRING', value: 'true' } }
      steps {
        sshagent(credentials: ['healthyreal-main']) {
          sh """
            ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} 'mkdir -p ${DEPLOY_PATH}'
          """
          // ✅ 변경된 것만 전송
          script {
            if (env.CHANGE_FRONT == "true") {
              sh """
                scp -o StrictHostKeyChecking=no front/k8s/k3s-front.yaml ${DEPLOY_USER}@${DEPLOY_SERVER}:${DEPLOY_PATH}/k3s-front.yaml
              """
            }
            if (env.CHANGE_SPRING == "true") {
              sh """
                scp -o StrictHostKeyChecking=no back/k3s-app.yaml ${DEPLOY_USER}@${DEPLOY_SERVER}:${DEPLOY_PATH}/k3s-app.yaml
              """
            }
          }
        }
      }
    }

    stage('Deploy to k3s') {
      when { anyOf { environment name: 'CHANGE_FRONT', value: 'true'
                     environment name: 'CHANGE_SPRING', value: 'true' } }
      steps {
        sshagent(credentials: ['healthyreal-main']) {
          script {
            if (env.CHANGE_FRONT == "true") {
              sh """
                ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} '
                  sudo k3s kubectl apply -f ${DEPLOY_PATH}/k3s-front.yaml
                  kubectl rollout restart deployment front
                  kubectl rollout status deployment front
                '
              """
            }
            if (env.CHANGE_SPRING == "true") {
              sh """
                ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} '
                  kubectl set image deployment/spring-app healthyreal-spring-container=${SPRING_IMAGE}:latest --record || true
                  sudo k3s kubectl apply -f ${DEPLOY_PATH}/k3s-app.yaml
                  kubectl rollout restart deployment spring-app
                  kubectl rollout status deployment spring-app
                '
              """
            }
          }
        }
      }
    }
  }

  post {
    success { echo "✅ 배포 성공!" }
    failure { echo "❌ 배포 실패. 로그를 확인하세요." }
  }
}
