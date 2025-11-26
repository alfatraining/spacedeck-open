#!/usr/bin/env bash
set -euo pipefail

API_BASE="http://localhost:9666/api"
API_TOKEN="alfaview_api_token"

# Database connection details
DB_HOST="${SPACEDECK_DB_HOST:-localhost}"
DB_NAME="${SPACEDECK_DB_NAME:-spacedeck}"
DB_USER="${SPACEDECK_DB_USERNAME:-root}"
DB_PASS="${SPACEDECK_DB_PASSWORD:-root}"

# Helper Functions
list_users() {
  echo
  echo "=== Existing Users in Database ==="
  echo

  docker-compose exec -T mysql mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" --table \
    -e "SELECT u._id as 'User ID', u.email as 'Email', u.nickname as 'Nickname', GROUP_CONCAT(DISTINCT m.role ORDER BY m.role SEPARATOR ', ') as 'Roles', u.created_at as 'Created At' FROM users u LEFT JOIN memberships m ON u._id = m.user_id GROUP BY u._id, u.email, u.nickname, u.created_at ORDER BY u.created_at DESC;" \
    2>/dev/null || {
      echo "Error: Could not fetch users from database."
      echo "Make sure docker-compose is running and the database is accessible."
      return 1
    }
  echo
  echo "==================================="
  echo
}

slugify() {
  local input="$1"
  input="$(echo "$input" | tr '[:upper:]' '[:lower:]')"
  input="$(echo "$input" | sed 's/[^a-z0-9]\+/-/g')"
  input="$(echo "$input" | sed 's/^-*//; s/-*$//')"
  echo "${input:-space}"
}

prompt_email() {
  read -r -p "Enter user email: " email
  echo "$email"
}


prompt_space_name() {
  local name
  while true; do
    read -r -p "Enter name for the space: " name
    if [[ -z "$name" ]]; then
      echo "Space name cannot be empty."
      continue
    fi
    echo "$name"
    return
  done
}

prompt_role() {
  echo >&2
  echo "Please select a role:" >&2

  PS3="Type the number of the role and press Enter: "

  select opt in viewer editor admin; do
    if [[ -n "$opt" ]]; then
      echo "$opt"
      return
    else
      echo "Invalid choice. Please select one of the numbers above." >&2
    fi
  done
}


confirm_overview() {
  local email="$1"
  local space_name="$2"
  local slug="$3"
  local role="$4"
  local password="$5"

  echo
  echo "--------- Overview ---------"
  echo "Email:       $email"
  echo "Space name:  $space_name"
  echo "Edit slug:   $slug"
  echo "Role:        $role"
  echo "Password:    $password"
  echo "API token:   $API_TOKEN"
  echo "-----------------------------"
  while true; do
    read -r -p "Proceed with these settings? [y/N]: " ans
    ans="$(echo "$ans" | tr '[:upper:]' '[:lower:]')"
    case "$ans" in
      y|yes) return 0 ;;
      ""|n|no) return 1 ;;
      *) echo "Please answer y or n." ;;
    esac
  done
}

# curl calls
create_space() {
  local space_name="$1"
  local slug="$2"

  echo
  echo "[1/4] Creating space '$space_name' (slug: $slug)..."

  curl -sS "$API_BASE/spaces" \
    -X POST \
    -H "Content-Type: application/json" \
    -H "X-Spacedeck-API-Token: $API_TOKEN" \
    -d "{\"name\":\"$space_name\",\"edit_slug\":\"$slug\"}" >/dev/null

  echo "Space created."
}

create_user() {
  local email="$1"
  local password="$2"
  local nickname
  nickname="${email%@*}"

  echo
  echo "[2/4] Creating user '$email'..."

  curl -sS "$API_BASE/users" \
    -X POST \
    -H "Content-Type: application/json" \
    -H "X-Spacedeck-API-Token: $API_TOKEN" \
    -d "{\"email\":\"$email\",\"nickname\":\"$nickname\",\"password\":\"$password\",\"password_confirmation\":\"$password\",\"invite_code\":\"top-sekrit\"}" >/dev/null

  echo "User created (or already exists)."
}

create_membership() {
  local slug="$1"
  local email="$2"
  local role="$3"

  echo
  echo "[3/4] Creating membership for '$email' as '$role' in space '$slug'..."

  curl -sS "$API_BASE/spaces/$slug/memberships" \
    -X POST \
    -H "Content-Type: application/json" \
    -H "X-Spacedeck-API-Token: $API_TOKEN" \
    -d "{\"email_invited\":\"$email\",\"role\":\"$role\"}" >/dev/null

  echo "Membership created."
}

create_session() {
  local email="$1"
  local password="$2"

  echo >&2
  echo "[4/4] Creating session for '$email'..." >&2

  local response
  response="$(curl -sS "$API_BASE/sessions" \
    -X POST \
    -H "Content-Type: application/json" \
    -H "X-Spacedeck-API-Token: $API_TOKEN" \
    -d "{\"email\":\"$email\",\"password\":\"$password\"}")"

  echo "Session created." >&2

  # Try to extract the token without jq (very simple JSON parser)
  local compact token
  compact="$(echo "$response" | tr -d '\n' | tr -d '\r')"
  token="$(echo "$compact" | sed -n 's/.*"token"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')"

  # Return the token so it can be used in the main script (this goes to stdout)
  echo "$token"
}

# Main
echo "=== Local Whiteboard Setup CLI (Bash) ==="
echo
echo "Please select an option:"
echo "1) Create new space with user"
echo "2) Create session for existing user"
echo "3) List all users in database"
echo

while true; do
  read -r -p "Enter your choice [1/2/3]: " main_choice
  case "$main_choice" in
    1)
      # Continue with normal flow
      break
      ;;
    2)
      # Create session for existing user
      echo
      read -r -p "Enter user email: " EMAIL
      PASSWORD="example"

      # Get user's spaces from database
      echo
      echo "Fetching spaces for '$EMAIL'..."
      SPACES_OUTPUT=$(docker-compose exec -T mysql mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" --table \
        -e "SELECT s.name as 'Space Name', s.edit_slug as 'Edit Slug', m.role as 'Role' FROM spaces s JOIN memberships m ON s._id = m.space_id JOIN users u ON m.user_id = u._id WHERE u.email = '$EMAIL' ORDER BY s.created_at DESC;" \
        2>/dev/null)

      if [[ -n "$SPACES_OUTPUT" ]]; then
        echo
        echo "=== User's Spaces ==="
        echo "$SPACES_OUTPUT"
        echo "====================="
      fi

      echo
      echo "Creating session for '$EMAIL'..."
      SESSION_TOKEN="$(create_session "$EMAIL" "$PASSWORD")"

      if [[ -z "$SESSION_TOKEN" ]]; then
        echo "Error: Failed to create session. Please check the email and password."
        exit 1
      fi

      echo
      echo "========================================"
      echo " Session Created!"
      echo "========================================"
      echo
      echo "To access the whiteboard:"
      echo
      echo "1. Open your browser and go to:"
      echo "   http://localhost:9666/spaces/<edit_slug>"
      echo "   (Use the 'Edit Slug' from the table above)"
      echo
      echo "2. Open Developer Tools (F12 or Cmd+Option+I)"
      echo "   - Go to the 'Application' tab"
      echo "   - Navigate to: Storage -> Cookies -> http://localhost:9666/"
      echo
      echo "3. Create a new cookie entry:"
      echo "   Name:  sdsession"
      echo "   Value: $SESSION_TOKEN"
      echo
      echo "4. Refresh the page"
      echo
      echo "========================================"
      exit 0
      ;;
    3)
      list_users
      exit 0
      ;;
    *)
      echo "Invalid choice. Please enter 1, 2, or 3."
      ;;
  esac
done

echo

EMAIL="$(prompt_email)"
SPACE_NAME="$(prompt_space_name)"
EDIT_SLUG="$(slugify "$SPACE_NAME")"
ROLE="$(prompt_role)"
PASSWORD="example"

if ! confirm_overview "$EMAIL" "$SPACE_NAME" "$EDIT_SLUG" "$ROLE" "$PASSWORD"; then
  echo "Aborted."
  exit 0
fi

create_space "$SPACE_NAME" "$EDIT_SLUG"
create_user "$EMAIL" "$PASSWORD"
create_membership "$EDIT_SLUG" "$EMAIL" "$ROLE"
SESSION_TOKEN="$(create_session "$EMAIL" "$PASSWORD")"

echo
echo "========================================"
echo " Setup Complete!"
echo "========================================"
echo
echo "To access your whiteboard, follow these steps:"
echo
echo "1. Open your browser and go to:"
echo "   http://localhost:9666/spaces/$EDIT_SLUG"
echo
echo "2. Open Developer Tools (F12 or Cmd+Option+I)"
echo "   - Go to the 'Application' tab"
echo "   - Navigate to: Storage -> Cookies -> http://localhost:9666/"
echo
echo "3. Create a new cookie entry:"
echo "   Name:  sdsession"
echo "   Value: $SESSION_TOKEN"
echo
echo "4. Refresh the page"
echo
echo "========================================"
