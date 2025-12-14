# ============================
# 빌드 단계
# ============================
FROM node:18-alpine AS build
WORKDIR /app

COPY . .

RUN yarn install
RUN yarn run build

# ============================
# 배포 단계
# ============================
FROM nginx:stable-alpine

# 빌드 산출물 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 커스텀 nginx 템플릿 복사 (envsubst 사용)
COPY ./nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
