This is the regulatory customer pilot webapp.
It requires a signify extension to provide signed headers.
When run in developer mode it uses hardcoded data.
Otherwise it should be run with the reg-pilot-server and reg-pilot-verifier (see the docker-compose)

# Local development
## Build
from the my-app directory:
```npm install```
## Run
from the my-app directory:
```npm start```

# Docker
## Build docker images
```docker-compose build --no-cache```
## Start the docker containers
```docker-compose down```
```docker-compose up deps```

## Seed test data
```cd data/signify```
```npm install```
```SIGNIFY_SECRETS="CIsYzCGKpY6FcA1dSnjEje,AHfiDXoQ1zy_UyLhwisFwX,DB5HHvV1HJU7cJWgMUJMnU,CGbMVe0SzH_aor_TmUweIN" npx jest singlesig-vlei-issuance.test.ts```

## Configure the extension for docker
* agent url is `http://localhost:3901`
* boot url is `http://localhost:3903`
* <img src="image.png" width="300">

## Use the last SIGNIFY_SECRET we specified as your passcode for the 'role' sign in
```CGbMVe0SzH_aor_TmUweIN```
* <img src="image-3.png" width="300">

## Choosing the ECR credential
* Note: that the ECR authorization credential won't work!
* Select the Engagement Context Role (ECR) credential
    * <img src="image-1.png" width="300">
* In order to avoid having to reselect the ECR credential, enable auto-sign in
    * <img src="image-2.png" width="300">