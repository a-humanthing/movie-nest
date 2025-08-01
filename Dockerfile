# ---------- Build Stage ----------
  FROM node:18-alpine as builder

  WORKDIR /app
  
  # Install dependencies
  COPY package*.json ./
  RUN npm ci
  
  # Copy source and build
  COPY . .
  RUN npm run build
  
  
  # ---------- Production Stage ----------
  FROM node:18-alpine
  
  WORKDIR /app
  
  # Create non-root user
  RUN addgroup -S appgroup && adduser -S appuser -G appgroup
  
  # Install only production dependencies
  COPY package*.json ./
  RUN npm ci --only=production && npm cache clean --force
  
  # Copy built app from build stage
  COPY --from=builder /app/dist ./dist
  
  # Use non-root user
  USER appuser
  
  EXPOSE 4000
  CMD ["node", "dist/main"]
  