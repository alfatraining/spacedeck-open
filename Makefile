dev-init:
	docker build . -t spacedeck
	docker-compose up --build -d

dev-start:
	docker-compose up --build -d

dev-stop:
	docker-compose down

watch-gulp:
	docker exec -it spacedeck-dev sh -c "cd /app && npm run dev:frontend:gulp"

watch-webpack:
	docker exec -it spacedeck-dev sh -c "cd /app && npm run dev:frontend"

watch:
	make -j watch-gulp watch-webpack
