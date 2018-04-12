FROM mhart/alpine-node:9

ENV PORT 3000
EXPOSE 3000

COPY package.json package.json
RUN npm install

COPY . .

CMD ["node", "src"]