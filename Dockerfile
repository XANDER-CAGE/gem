FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install husky --save-dev --force

RUN npm install --force

COPY . .

RUN npm run build

FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install husky --save-dev  --force

RUN npm install --force

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
