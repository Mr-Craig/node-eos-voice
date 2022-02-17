const request = require('request');
const uniqid = require('uniqid');

const EOSVoice = {};

EOSVoice.EOSTokenBody = {};
EOSVoice.options = {
    deploymentId: "",
    clientId: "",
    clientSecret: "",
    check_nonce: true,
    verbose: false
}

EOSVoice.init = async (data) => {
    EOSVoice.options = { ...EOSVoice.options, ...data};

    EOSVoice.getConnectToken().catch((e) => {
        console.log(e);
    });
};

// Get EOS access token
EOSVoice.getConnectToken = async () => {
    return new Promise((resolve, reject) => {
        const basicToken = Buffer.from(`${EOSVoice.options.clientId}:${EOSVoice.options.clientSecret}`).toString('base64');
        console.log(basicToken);
        const nonce = uniqid('eos-');
        request.post({
            url: 'https://api.epicgames.dev/auth/v1/oauth/token',
            form: {
                "grant_type": "client_credentials",
                "nonce": nonce,
                "deployment_id": EOSVoice.options.deploymentId
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
                "Authorization": `Basic ${basicToken}`
            }
        }, function(error, response, body) {
            if(error) {
                reject(error);
                return;
            }

            if(response.statusCode == 200) {
                try
                {
                    EOSVoice.EOSTokenBody = JSON.parse(body);
                    if(EOSVoice.options.check_nonce) {
                        if(EOSVoice.EOSTokenBody.nonce !== nonce) {
                            EOSVoice.EOSTokenBody = {};
                            reject(`Nonce mismatch, recieved: ${EOSVoice.EOSTokenBody.nonce} but it should be ${nonce} !`);
                            return;
                        }
                    }
                    let dateAs = new Date(body.expires_at);
                    EOSVoice.EOSTokenBody.expires_at = dateAs.getTime();
                    console.log(EOSVoice.EOSTokenBody);
                    resolve(true);
                } catch(e) {
                    reject(e);
                    return;
                }
            } else {
                console.log(body);
                reject(`HTTP Code ${response.statusCode}`);
            }
        })
    });
};

EOSVoice.getRoomCredentials = async (data) => {
    return new Promise(async (resolve, reject) => {
        if(EOSVoice.EOSTokenBody.expires_at < new Date().getTime()) {
            let success = true;
            const newToken = EOSVoice.getConnectToken().catch((e) => {
                console.log(e);
                success = false;
            });
            if(!success) {
                reject("Unable to regenerate token.");
                return;
            }
        }

        request.post({
            url: `https://api.epicgames.dev/rtc/v1/${EOSVoice.EOSTokenBody.deployment_id}/room/${data.roomId}`,
            headers: {
                "Authorization": `Bearer ${EOSVoice.EOSTokenBody.access_token}`
            },
            json: true,
            body: {
                "participants": data.participants
            }
        }, function(error, response, body) {
            if(error) {
                reject(error);
                return;
            }

            resolve(body);
        })

    });
}

module.exports = EOSVoice;