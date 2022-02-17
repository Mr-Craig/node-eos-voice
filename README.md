# node-eos-voice
 
 Simple wrapper for EOS (Epic Online Services) Voice, allows you to generate Room Tokens without having to manage the EOS Access Token.
 
 Usage:
 ```
const EOSVoice = require('node-eos-voice');
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
```
 
