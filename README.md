# DaddyRobot-MixPlay-MainPage

Welcome to the main section for talking about DaddyRobot's MixPlay Experience!

You can find the latest published experience at: https://daddyrobot.live/mixplays/

### Overall Flow

This repo is for the main html part, or what Mixer would think of as the "game client." This page will be the server for the MixPlays.
It will handle the authentication and starting of the MixPlay experiences.
The main app.js file: https://github.com/tiedyedguy/DaddyRobot-MixPlay-MainPage/blob/master/js/app.js handles that.

After that is passes it off to one of the .js files named for each experience. So if you are looking to copy one, make sure you check out that file also.

## Experiences

Here are the current experiences and their sources:

### Destiny 2: https://github.com/tiedyedguy/DaddyRobot-MixPlay-Destiny2

- Pulls from the Bungie API for a Destiny2 character and displays them.
- Based on the official twitch extension for Destiny2.
- Biggest Backend for a MixPlay with lots of custom JS in the ./js/destiny2.js and ./js/destiny2helper.js

### Chat Shooter: https://github.com/tiedyedguy/DaddyRobot-MixPlay-Chat-Shooter

- This one reads from the chat and shows the messages on screen. This is a good one for seeing how to look at messages also how to ignore whispers and moderated messages
- It also has two way communication from this repo and itself, so good for seeing how to pass info back and forth.

### Draw On Me: https://github.com/tiedyedguy/DaddyRobot-MixPlay-Draw-On-Me

- This one puts a drawing program on top of the streamer.

### Social Me: https://github.com/tiedyedguy/DaddyRobot-MixPlay-Social-Me

- This one pulls the user's social links out of their Mixer profile and displays them on the MixPlay.
- This is a great one to see how to get other user info. To see that part, look at the file: https://github.com/tiedyedguy/DaddyRobot-MixPlay-MainPage/blob/master/js/social-me.js

### Team Viewer: https://github.com/tiedyedguy/DaddyRobot-MixPlay-Team-Viewer

- This pulls your teams and allows you to display info about them and other team members on a mixplay!
- You can also type in any team's token name (It is a shortened name you see on their URL).
- This one shows you how to interact with team data on mixer! To see that part, look at the file: https://github.com/tiedyedguy/DaddyRobot-MixPlay-MainPage/blob/master/js/team-viewer.js

### Blockrain: https://github.com/tiedyedguy/DaddyRobot-MixPlay-Blockrain

- Runs Blockrain on your Mixplay: https://aerolab.github.io/blockrain.js/
- Keeps a high score.

### Test Stuff: https://github.com/tiedyedguy/DaddyRobot-MixPlay-Test-Stuff

- A place for me to play around with MixPlay stuff, I included it because, why not.
