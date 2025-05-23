<img src="https://github.com/igorovh/streamplus/assets/37638480/a89ad258-9c45-4932-83d2-5a63731fd123" style="width: 100%">

![streamplus preview](https://github.com/igorovh/streamplus/assets/37638480/4b8608cc-c739-45f2-acdb-5cd80dadde63) 
 
## Features
- Various type of platforms supported:
  - YouTube
  - Streamable
  - TikTok
  - Raw video file (e.g. videos from discord)
- Avaiable for streamers:
  - Twitch
  - ~~Kick~~
  - ~~YouTube~~

# Installation
Clone this repo to and run `npm install` to install all the dependencies.  
You might want to look into config.json to make change the port and some other options, which are described [here](#config).  
  
After this just run `npm run start` and go to `localhost:3002`.

### Config
```json
{
	"port": 3002,
	"frontendPath": "absolute path to frontend directory",
	"adminToken": "veryLongRandomString",
	"discord": {
		"clientId": "id",
		"clientSecret": "secret",
		"clientRedirectUri": "redirect"
	}
}
```

## Admin
On first launch you will have this message in the console:
```
[00:00:00]  WARN | I found out that nobody has admin permissions here.
[00:00:00]  WARN | Here is the one-time link which will grant these permissions:
[00:00:00]  WARN | /invite/[code]
```
Entering `localhost:3002/invite/[code]` will grant you Owner role.  
After that you can go visit `localhost:3002/admin` to generate more invite links for your moderators.  

Remember, that **Owner** can add and remove roles from users so give it only to people you trust.