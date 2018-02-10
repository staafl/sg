@for %%a in (.) do @set currentfolder=%%~na
::call ssh.exe trusting@ams7.siteground.eu  -p 18765
@call ssh-key sg
@call ssh.exe trusting@ams7.siteground.eu  -p 18765 -t  "cd /home/trusting/public_html/%currentfolder%; bash"