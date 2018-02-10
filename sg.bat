@for %%a in (.) do @set currentfolder=%%~na
@start "" "http://trustingwolves.com/%currentfolder%/%1"
::start "" "https://htmlpreview.github.io/?https://github.com/staafl/threejs-demos/blob/master/%1/index.html"