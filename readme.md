# 0️⃣ 관련 시크릿 생성


# 1️⃣ 기존 MySQL 컨테이너 중지
docker stop mysql && docker rm mysql

# 2️⃣ PV, PVC 생성
kubectl apply -f mysql-pv.yaml
kubectl apply -f mysql-pvc.yaml

# 3️⃣ StatefulSet 배포
kubectl apply -f mysql.yaml

# 4️⃣ 확인
kubectl get pods
kubectl exec -it mysql-0 -- mysql -u root -p
