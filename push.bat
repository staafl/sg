:: - push to siteground.eu/.../public_html/%currentfolder% using %currentfolder% SSH key
:: - push to github

@for %%a in (.) do @set currentfolder=%%~na

@call git add --all

@if [%1] == [] @call git -c "user.name=Velko Nikolov" -c "user.email=velko.nikolov@gmail.com" commit
@if NOT [%1] == [] @call git -c "user.name=Velko Nikolov" -c "user.email=velko.nikolov@gmail.com" commit -m %*

:: OBSOLETE: @call ssh-key %currentfolder%
@call ssh-temp %currentfolder% git push ssh://trusting@ams7.siteground.eu:18765/home/trusting/public_html/%currentfolder% master

@call git push https://github.com/staafl/currentfolder.git master