const EOSVoice = require('./index');

EOSVoice.init({
    deploymentId: "",
    clientId: "",
    clientSecret: "",
    check_nonce: true,
    verbose: false
})

EOSVoice.getRoomCredentials({
    roomId: "Testing-Room-123",
    participants: [
        {
            "puid": "[EOS_ProductUserId]",
            "clientIp": "Used to find best server",
            "hardMuted": false
        }
    ]
}).then((data) => {
    console.log(data);
}).catch((e) => {
    console.log(error);
});
