# JWT AUTH SERVER
json web token based authentication server & easy authentication javascript sdk.

## 0. required
>
- Node.js 6↑
- Mongodb 3.4↑
- git

## 1. installation

```
git clone https://github.com/ahribori/jwt_auth_server.git
```
```
cd jwt_auth_server
```
```
npm install
```

## 2. configuration
create file _config.yml into project root.
```yml
# Server Configuration
server:
  # Server Port -> ex) 8080
  port:
  # MongoDB URI -> ex) mongodb://localhost:27017/jwt_auth
  mongo_uri:
  # Secret Key -> ex) MySeCrEtKey!2#4%6&8(0
  secret:
  token:
    # JWT token expires -> ex) 1d or 3h or 20m...
    expiresIn:
    # JWT token issuer -> ex) your company or nickname
    issuer:
# Client configuration
client:

# SDK configuration
sdk:
  # Auth SDK global object name (not required)
  global_name:
  # your jwt auth server origin -> ex) https://account.yourJwtAuthServerDomain.com
  server_origin:
```

## 3. build
require configuration first
```
npm run build
```

## 4. start
require build first
```
npm run boot
```