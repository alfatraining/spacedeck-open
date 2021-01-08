dev-init:
	docker run -v $(shell pwd):/app -w /app node:12.18-alpine3.12 sh -c "npm install --global gulp-cli && npm install && npm run build:css && npm run build:frontend"
	docker-compose up --build -d

dev-start:
	docker-compose up -d

dev-stop:
	docker-compose down
