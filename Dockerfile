FROM node:14
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 3000
EXPOSE 443
RUN npm --global config set user root && \
    npm --global install @nestjs/cli
ENV NODE_ENV="development"
CMD [ "nest", "start" ]