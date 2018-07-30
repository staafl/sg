@for %%a in (.) do @set currentfolder=%%~na
@set HOME=%userprofile%

@call git add --all

@if [%1] == [] @call git -c "user.name=Velko Nikolov" -c "user.email=velko.nikolov@gmail.com" commit
@if NOT [%1] == [] @call git -c "user.name=Velko Nikolov" -c "user.email=velko.nikolov@gmail.com" commit -m %*

:: @call ssh-key sg
@call ssh-temp sg git push ssh://trusting@ams7.siteground.eu:18765/home/trusting/public_html/%currentfolder% master

@call git push https://github.com/staafl/sg.git master