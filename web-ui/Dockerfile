# Stage 1: Build the Vue.js application
FROM node:20-alpine AS builder

WORKDIR /app

# Disable TLS verification for corporate proxy
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

COPY package*.json ./

RUN npm config set strict-ssl false
RUN npm install
RUN npm config set strict-ssl true

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine AS nginx

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config from builder context
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
