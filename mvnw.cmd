@echo off
@setlocal enabledelayedexpansion

set ERROR_CODE=0

java "-Dmaven.multiModuleProjectDirectory=%CD%" -cp ".mvn/wrapper/maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain %*
if ERRORLEVEL 1 set ERROR_CODE=%ERRORLEVEL%

cmd /C exit /B %ERROR_CODE%
