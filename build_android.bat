@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo   Building TridentPDF Mobile - Release APK and AAB
echo ========================================================

REM Configure JDK 17 / JBR path (Drive E)
if exist "E:\android-tools\jdk-17" (
    set JAVA_HOME=E:\android-tools\jdk-17
) else if exist "E:\Android\Android Studio\Android Studio\jbr" (
    set JAVA_HOME=E:\Android\Android Studio\Android Studio\jbr
) else (
    set JAVA_HOME=E:\android-tools\jdk-17
)
if exist "E:\android-tools\android-sdk" (
    set ANDROID_HOME=E:\android-tools\android-sdk
    set ANDROID_SDK_ROOT=E:\android-tools\android-sdk
) else (
    set ANDROID_HOME=E:\Android\Sdk
    set ANDROID_SDK_ROOT=E:\Android\Sdk
)
set GRADLE_USER_HOME=E:\.gradle
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\cmdline-tools\latest\bin;%ANDROID_HOME%\platform-tools;%PATH%

if not exist "E:\tridentpdf-mobile\builds" (
    mkdir "E:\tridentpdf-mobile\builds"
)

cd /d "E:\tridentpdf-mobile\android"

echo.
echo [1/2] Building Release APK (assembleRelease)...
call gradlew.bat assembleRelease --no-daemon
if errorlevel 1 (
    echo Error building APK!
    exit /b 1
)

echo.
echo [2/2] Building Release AAB (bundleRelease)...
call gradlew.bat bundleRelease --no-daemon
if errorlevel 1 (
    echo Error building AAB!
    exit /b 1
)

echo.
echo ========================================================
echo   Copying artifacts to E:\tridentpdf-mobile\builds\
echo ========================================================

copy /y "E:\tridentpdf-mobile\android\app\build\outputs\apk\release\app-release.apk" "E:\tridentpdf-mobile\builds\TridentPDF-release.apk"
copy /y "E:\tridentpdf-mobile\android\app\build\outputs\bundle\release\app-release.aab" "E:\tridentpdf-mobile\builds\TridentPDF-release.aab"

echo.
echo Build Successful!
dir "E:\tridentpdf-mobile\builds"
