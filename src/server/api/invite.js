import express from 'express';
import crypto from 'crypto';
import Logger from '../../logger';
import { isValidUser } from '../../database/user';
import { addRole } from '../../database/role';
import database from '../../database/database';

let invites = [];

const removeInvite = (codes) => (invites = invites.filter((invite) => !codes.includes(invite.code)));

setInterval(() => {
	const expiredCodes = [];
	invites.forEach((invite) => {
		if (invite.expire <= Date.now()) expiredCodes.push(invite.code);
	});
	removeInvite(expiredCodes);
}, 1000);

export const generateCode = (role = 1) => {
	const code = crypto.randomBytes(24).toString('hex');
	invites.push({
		code,
		expire: Date.now() + 300000,
		role,
	});
	return code;
};

export const inviteApi = express.Router();

inviteApi.get('/:code', (request, response) => {
	if (!request.cookies || !request.cookies.account ) return response.redirect('/account/login');
	try {
		const { id, token } = JSON.parse(request.cookies.account);
		if (!isValidUser(id, token)) return response.redirect('/account/login');

		const code = request.params.code;
		const invite = invites.find((invite) => invite.code === code);
		if (invite === undefined) return response.redirect('/?error=invalidInvite');

		if (addRole(id, invite.role)) Logger.info(`User ${id} has recieved new role (${invite.role})`);
		else {
			response.redirect('/?error=auth');
			Logger.error(`User ${id} could not recieve his new role (${invite.role})`);
			return;
		}
		removeInvite([invite.code]);
		response.redirect('/admin');
	} catch (error) {
        Logger.error(`Error`, error);
		response.redirect('/?error=auth');
	}
});

setTimeout(() => {
	const statement = database.prepare('SELECT COUNT(user_id) as admins FROM roles WHERE role = 2;');
	const { admins } = statement.get();
	if (admins > 0) return;
	const code = generateCode(2);
	Logger.warn(`I found out that nobody has admin permissions here.`);
	Logger.warn(`Here is the one-time link which will grant these permissions:`);
	Logger.warn(`/invite/${code}`);
}, 3000);
