for %%a in (.) do set currentfolder=%%~na
:: explicit user.name etc necessary because HOME is changed and git can't find its .gitconfig
@call ssh-temp siteground git -c "user.name=Velko Nikolov" -c "user.email=velko.nikolov@gmail.com" pull ssh://trusting@ams7.siteground.eu:18765/home/trusting/public_html/%currentfolder%