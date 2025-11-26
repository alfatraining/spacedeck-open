### Node version
- This project uses node version 14.20

### Starting the project

- Run `make dev-init` in the root folder to install dependencies, generate the alfaview components, and start up the containers
- `make dev-start` and `make dev-stop` can be used to start and stop without intalling dependencies and generating files again

- Local development: Run `make watch` to build the frontend files and watch the files under path `views/alfaview`


### Creating a space for test

- `docker-compose.yaml` passes environment variables to the `spacedeck` container for initializing an admin user for spacedeck

### Setup with script (locally)
The `setup_whiteboard.sh` script is an ease-of-life way to setup a whiteboard for local environment. It has the following options:
- Lists existing user information
- Creates a user and a whiteboard
- Creates a session for an existing user

Follow the steps displayed in the terminal after each action is completed. This alleviates the process of editing and running each curl command separately.
The script runs a mix of the manual steps (below) and direct MySQL commands under the hood.
### Manual setup (locally)

##### Create space
- Place a unique value for ```edit_slug``` -> eg: "board-name-example".
curl 'http://localhost:9666/api/spaces' -X POST -H 'Content-Type: application/json' -H 'X-Spacedeck-API-Token:alfaview_api_token' -d '{"name":"My example board", "edit_slug":"board-name-example"}' -v

##### Create a user
- curl 'http://localhost:9666/api/users' -H 'Content-type:application/json' -H 'X-Spacedeck-API-Token:alfaview_api_token' -d '{"email":"example@hotmail.com","nickname":"example", "password":"example", "password_confirmation":"example","invite_code":"top-sekrit"}' -v
###### Optional: multiple users
- You can create multiple users by using different ```user_email``` values
- curl 'http://localhost:9666/api/users' -H 'Content-type:application/json' -H 'X-Spacedeck-API-Token:alfaview_api_token' -d '{"email":"```user_email```","nickname":"example", "password":"example", "password_confirmation":"example","invite_code":"top-sekrit"}' -v


##### Create membership
- on the curl url, ```edit_slug``` section NEEDS to be the same as the one used at the "Create space" step.
- Make sure the "email_invited" holds the ```user_email``` value
- curl 'http://localhost:9666/api/spaces/```${edit_slug}```/memberships' -X POST -H 'Content-Type: application/json' -H 'X-Spacedeck-API-Token: alfaview_api_token' -d '{"email_invited":"example@hotmail.com", "role":"editor"}' -v

##### Create session
- Make sure the "email" holds the ```user_email``` value
- curl 'http://localhost:9666/api/sessions' -H 'Content-Type: application/json' -H 'X-Spacedeck-API-Token: alfaview_api_token' -X POST -d '{"email":"example@hotmail.com","password":"example"}'

Listing sessions will return an object such as
```
{
    "user_id":"...",
    "token":"<TOKEN_NEEDED_IN_NEXT_STEP>",
    "ip":"...",
    "device":"...",
    "created_at":"..."
}
```
1. Copy the token value from the returned object
2. Then build the URL as: 'http://localhost:9666/spaces/```${edit_slug}```'
3. At the "Application" tab and under [ Storage -> Cookies -> http://localhost:9666/ ] create a new entry
name: 'sdsession'
value: ```TOKEN_FROM_ABOVE```
4. Refresh the page -> you should be logged in

