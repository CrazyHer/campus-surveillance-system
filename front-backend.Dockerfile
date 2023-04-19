FROM node:lts-buster-slim

COPY ./frontend/dist /usr/share/campus-surveillance-system/frontend/dist
COPY ./backend /usr/share/campus-surveillance-system/backend

WORKDIR /usr/share/campus-surveillance-system/backend

RUN npm i -g pnpm && pnpm i && \
  apt-get update && apt-get install -y nginx && \
  rm -f /etc/nginx/nginx.conf

COPY ./backend/nginx.conf /etc/nginx/nginx.conf

CMD service nginx start && pnpm run start:prod