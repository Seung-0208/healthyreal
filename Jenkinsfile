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
            def changedRaw = sh(script: "git diff --name-only HEAD~1..HEAD", returnStdout: true)
            echo "Changed files:\n${changedRaw}"

            def files = changedRaw.readLines()   // ✅ \r\n, \n 모두 안전하게 처리

            // 1) “back/**면 spring 변경”으로 볼 거면 이렇게
            def springChanged = files.any { it.startsWith('back/') }
            def frontChanged  = files.any { it.startsWith('front/') }

            // 2) 만약 back/.github 같은 건 배포 트리거에서 제외하고 싶으면(추천)
            // def springChanged = files.any { it.startsWith('back/') && !it.startsWith('back/.github/') }

            env.CHANGE_FRONT  = frontChanged  ? "true" : "false"
            env.CHANGE_SPRING = springChanged ? "true" : "false"

            echo "CHANGE_FRONT=${env.CHANGE_FRONT}, CHANGE_SPRING=${env.CHANGE_SPRING}"
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
