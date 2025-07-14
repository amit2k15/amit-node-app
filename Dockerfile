# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --legacy-peer-deps
COPY . .
# Remove the build step since we're not transpiling code
# RUN npm run build  # Commented out since we don't need it

# Production stage
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src  # Copy source files instead of dist
COPY --from=builder /app/tests ./tests # Copy tests if needed

EXPOSE 3000
USER node
CMD ["npm", "start"]