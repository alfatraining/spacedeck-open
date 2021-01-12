dev-init:
	docker build . -t spacedeck
	docker-compose up --build -d

dev-start:
	docker-compose up --build -d

dev-stop:
	docker-compose down

watch-css:
	docker exec -it spacedeck-dev sh -c "cd /app && npm run dev:frontend:css"

watch-assets:
	docker exec -it spacedeck-dev sh -c "cd /app && npm run dev:frontend"

watch:
	make -j 2 watch-assets watch-css
