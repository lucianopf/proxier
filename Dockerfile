FROM mhart/alpine-node:10 as base
WORKDIR /usr/src
COPY package.json /usr/src/
RUN NODE_ENV=production npm install
COPY . .

FROM mhart/alpine-node:base-10
WORKDIR /usr/src
ENV NODE_ENV="production"
COPY --from=base /usr/src .
EXPOSE 3000
CMD ["node", "index.js"]