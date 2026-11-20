FROM docker.io/nginxinc/nginx-unprivileged:1.27-alpine AS runtime
COPY . /usr/share/nginx/html
COPY .containerize/nginx-spa.conf.template /etc/nginx/templates/default.conf.template
ENV PORT=8080
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --retries=3 CMD ["sh", "-c", "wget -q -O /dev/null http://127.0.0.1:${PORT}/ || exit 1"]
