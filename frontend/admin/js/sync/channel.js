export const handleChannel = (channel) => {
	document.querySelector('#channel-username').value = channel.username;
	document.querySelector('#channel-latency').value = channel.latency;
	document.querySelector('#channel-sync').checked = channel.sync;
	document.querySelector('#channel-autoplay').checked = channel.autoplay;
	document.querySelector('#channel-request').checked = channel.mediaRequest;
	document.querySelector('#channel-platform').value = channel.platform;
	if (channel.latencyMode === 'auto') document.querySelector('#channel-latency-mode').checked = true;
};
