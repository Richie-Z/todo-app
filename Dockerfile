FROM docker.io/nginxinc/nginx-unprivileged:1.27-alpine AS runtime
COPY . /usr/share/nginx/html
COPY .containerize/nginx-spa.conf.template /etc/nginx/templates/default.conf.template
ENV PORT=8080
EXPOSE 8080
