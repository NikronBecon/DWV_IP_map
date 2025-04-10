FROM node:20

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Use a simple web server to serve dist
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "5173"]
