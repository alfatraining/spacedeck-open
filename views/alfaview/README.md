### Starting the project

- Run `make dev-init` in the root folder to install dependencies, generate the alfaview components, and start up the containers
- `make dev-start` and `make dev-stop` can be used to start and stop without intalling dependencies and generating files again
- Additionally `make watch` can be used to watch the files under `views/alfaview`


### Creating a space for test

- `docker-compose.yaml` passes environment variables to the `spacedeck` container for initializing an admin user for spacedeck

### Steps to Run

##### Create space
- Place a unique value for ```edit_slug```.
curl 'http://localhost:9666/api/spaces' -X POST -H 'Content-Type: application/json' -H 'X-Spacedeck-API-Token:alfaview_api_token' -d '{"name":"My example board", "edit_slug":"board-name-example"}' -v

##### Create user
- curl 'http://localhost:9666/api/users' -H 'Content-type:application/json' -H 'X-Spacedeck-API-Token:alfaview_api_token' -d '{"email":"example@hotmail.com","nickname":"example", "password":"example", "password_confirmation":"example","invite_code":"top-sekrit"}' -v 

##### Create membership
- on the curl url, edit_slug section NEEDS to be the same as the one used at the "Create space" step.
- curl 'http://localhost:9666/api/spaces/${edit_slug}/memberships' -X POST -H 'Content-Type: application/json' -H 'X-Spacedeck-API-Token: alfaview_api_token' -d '{"email_invited":"example@hotmail.com", "role":"editor"}' -v 


##### Create session
- curl 'http://localhost:9666/api/sessions' -H 'Content-Type: application/json' -X POST -d '{"email":"example@hotmail.com","password":"example"}' 

##### List sessions
- curl 'http://localhost:9666/api/sessions' -H 'Content-Type: application/json' -H 'X-Spacedeck-API-Token: alfaview_api_token' -X POST -d '{"email":"example@hotmail.com","password":"example"}'

Listing sessions will return an object such as 
```
{
    "user_id":"...",
    "token":"....",
    "ip":"...",
    "device":"...",
    "created_at":"..."
}
```
1. Copy the token value from the returned object
2. Then build the URL as: `http://localhost:9666/spaces/${edit_slug}`
3. At the "Application" tab and under [ Storage -> Cookies -> http://localhost:9666/ ] create a new entry 
name: 'sdsession'
value: ${token_value_copied_from_step_1}

