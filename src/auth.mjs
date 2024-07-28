import fetch from "node-fetch";

export const authentication = async (clientId, clientSecret, environment) => {
    const params = new URLSearchParams();
	params.append('grant_type', 'client_credentials');
	const response = await fetch(`https://login.${environment}/oauth/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Basic ${Buffer.from(clientId + ':' + clientSecret).toString('base64')}`
		},
		body: params
	})
    const data = await response.json();
    return data.access_token;
}