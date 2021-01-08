### Starting the project

- Run `make dev-init` in the root folder to install dependencies, generate the alfaview components, and start up the containers
- `make dev-start` and `make dev-stop` can be used to start and stop without intalling dependencies and generating files again
- Additionally `yarn dev:frontend` can be used to watch the files under `views/alfaview`


### Creating a space for test

- `docker-compose.yaml` passes environment variables to the `spacedeck` container for initializing an admin user for spacedeck
- A space can be created using the API endpoint: 
    - `curl 'http://localhost:9666/api/spaces' -X POST -H 'Content-Type: application/json' -H 'X-Spacedeck-API-Token: alfaview_api_token' -d '{"name":"My Test Board", "edit_slug":"board-name"}' -v`
    - Then build the URL as: `http://localhost:9666/spaces/${_id}?spaceAuth=${edit_hash}`
