# DaddyRobot-MixPlay-MainPage

Welcome to the main section for talking about DaddyRobot's MixPlay Experience!

You can find the latest published experience at: https://daddyrobot.live/mixplay


### Overall Flow

This repo is for the main html part, or what Mixer would think of as the "game client."  This page will be the server for the MixPlays.
It will handle the authentication and starting of the MixPlay experiences.
The main app.js file: https://github.com/tiedyedguy/DaddyRobot-MixPlay-MainPage/blob/master/js/app.js handles that.

After that is passess it off to one of the .js files named for each experience.  So if you are looking to copy one, make sure you check out that file also.

## Experiences

Here are the current experiences and their sources:

### Chat Shooter: https://github.com/tiedyedguy/DaddyRobot-MixPlay-Chat-Shooter
- This one reads from the chat and shows the messages on screen.  This is a good one for seeing how to look at messages also how to ignore whispers and moderated messages
- It also has two way communication from this repo and itself, so good for seeing how to pass info back and forth.

### Draw On Me: https://github.com/tiedyedguy/DaddyRobot-MixPlay-Draw-On-Me
- This one puts a drawing program on top of the streamer. 

### Social Me: https://github.com/tiedyedguy/DaddyRobot-MixPlay-Social-Me
- This one pulls the user's social links out of their Mixer profile and displays them on the MixPlay.
- This is a great one to see how to get other user info.  To see that part, look at the file: https://github.com/tiedyedguy/DaddyRobot-MixPlay-MainPage/blob/master/js/social-me.js

### Test Stuff: https://github.com/tiedyedguy/DaddyRobot-MixPlay-Test-Stuff
- A place for me to play around with MixPlay stuff, I included it because, why not.
