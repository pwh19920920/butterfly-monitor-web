FROM circleci/node:latest-browsers as builder

USER root
RUN mkdir -p /usr/src/app/
RUN chown root /usr/src/app/
WORKDIR /usr/src/app/

COPY package.json ./
#RUN yarn config set registry https://registry.npm.taobao.org
RUN yarn

COPY ./ ./
RUN ["yarn", "build"]


FROM nginx:1.19.6-alpine
WORKDIR /usr/share/nginx/html/
RUN mkdir /etc/nginx/templates
COPY ./default.conf.template /etc/nginx/templates
COPY --from=builder /usr/src/app/dist  /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
