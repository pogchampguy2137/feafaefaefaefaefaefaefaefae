import fs from 'fs';

const Config = {
	port: process.env.PORT ?? '8080',
	discord: {
		clientId: process.env.DISCORD_CLIENT_ID ?? '',
		clientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
		clientRedirectUri: process.env.DISCORD_CLIENT_REDIRECT_URI ?? '',
	},
};
export default Config;
