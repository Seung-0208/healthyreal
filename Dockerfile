# ============================
# 빌드 단계
# ============================
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

# ============================
# 배포 단계
# ============================
FROM nginx:stable-alpine

# ✅ envsubst 명령어 설치
RUN apk add --no-cache gettext

# 빌드 산출물 복사
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 템플릿 복사
COPY ./nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80

# ✅ 환경변수 치환 후 Nginx 실행
CMD ["sh", "-c", "envsubst < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
