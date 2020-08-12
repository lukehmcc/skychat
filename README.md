# Skychat

Skychat is a chat application that runs on top of [Skynet](https://github.com/NebulousLabs/skynet-webportal) and [SiaNameService](https://github.com/geo-gs/sia-name-service).

With Skychat, anyone will be able to use any public SNS node (or your own private SNS node) to watch/read the chat channel in real time. So in that anspect, Skychat is perfectly decentrialized.

The cost to submit a comment to a chat channel is minimal when submitting it through same public SNS node that the chat channel's SNS domain was registered. However, if you try to submit a comment to the chat channel through a private SNS node you will need to pay the fully secured SNS domain fee (which could be into the hundreds of thousands of SiaCoins). Thus, private SNS nodes and other public SNS nodes should just proxy the comment submission to the public SNS node that registered the chat channel. So in this aspect Skychat is imperfectly decentrialized. But at least it is on the spectrum of decentrialization. Chat channels are quick to spin up so this should not be a major concern.

You can donate siacoin to help fund this project at: 176865262b61a961f107b1148782b0c59d4877b365f98a589e945438572b3e16ace15a2cac86
