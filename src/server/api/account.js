import Config from '../../config';
import express from 'express';
import crypto from 'crypto';
import Logger from '../../logger';
import { addUser } from '../../database/user';

import DiscordOauth2 from 'discord-oauth2';
const oAuth = new DiscordOauth2({
	clientId: Config.discord.clientId,
	clientSecret: Config.discord.clientSecret,
	redirectUri: Config.clientRedirectUri,
});
const discordAuthUrl = oAuth.generateAuthUrl({
	scope: ['identify'],
	state: crypto.randomBytes(16).toString('hex'),
});

export const accountApi = express.Router();

accountApi.get('/login', (request, response) => response.redirect(discordAuthUrl));
accountApi.get('/logout', (request, response) => {
	response.clearCookie('account');
	response.redirect('/?successLogout');
});
accountApi.get('/authorize', (request, response) => {
	const code = request.query.code;
	if (!code) {
		response.redirect(authURL);
		return;
	}
	oAuth
		.tokenRequest({
			code: code,
			scope: 'identify',
			grantType: 'authorization_code',
		})
		.then((token) => {
			const accessToken = token.access_token;
			oAuth
				.getUser(accessToken)
				.then((user) => {
					const token = crypto.randomBytes(64).toString('hex');
					const expire = Date.now() + 2592000000; // 30 Days

					const status = addUser(user, token, expire);
					if (status) {
						response.cookie('account', JSON.stringify({ id: user.id, token }), {
							expires: new Date(expire),
						});
						response.redirect('/?successLogin');
					} else {
						Logger.error(`[LOGIN] Something went wrong with: ${user.username} (${user.id})`);
						response.redirect('/?error=auth');
					}
				})
				.catch((error) => {
					Logger.error(error);
					response.redirect('/?error=auth');
				});
		})
		.catch((error) => {
			Logger.error(error);
			response.redirect('/?error=auth');
		});
});
