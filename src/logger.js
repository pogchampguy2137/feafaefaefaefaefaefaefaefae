import colors from 'cli-color';

const prefixes = {
	log: colors.yellow('  LOG'),
	debug: colors.yellow('DEBUG'),
	info: colors.green(' INFO'),
	warn: colors.yellowBright(' WARN'),
	error: colors.red('ERROR'),
};

const log = (...data) => sendLog('log', ...data);
const debug = (...data) => sendLog('debug', ...data);
const info = (...data) => sendLog('info', ...data);
const warn = (...data) => sendLog('warn', ...data);
const error = (...data) => sendLog('error', ...data);

const sendLog = (type, ...data) =>
	console.info(`${colors.magenta(`[${new Date().toLocaleTimeString()}] `)}${prefixes[type]} |`, ...data);

const Logger = { log, debug, info, warn, error };

export default Logger;
