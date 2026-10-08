@echo off
echo ========================================================
echo   TridentPDF Mobile - Fast Install to Connected Phone
echo ========================================================
echo.

set ADB=E:\Android\Sdk\platform-tools\adb.exe

echo Checking for connected Android phone via ADB...
"%ADB%" devices

echo.
echo Waiting for device to be connected and authorized...
"%ADB%" wait-for-device

echo.
echo Installing updated Release APK...
if exist "E:\tridentpdf-mobile\builds\TridentPDF-release.apk" (
    "%ADB%" install -r "E:\tridentpdf-mobile\builds\TridentPDF-release.apk"
) else (
    echo Builds not found at E:\tridentpdf-mobile\builds\TridentPDF-release.apk! Run build_android.bat first.
    exit /b 1
)
if errorlevel 1 (
    echo.
    echo Installation failed! Please ensure:
    echo 1. USB Debugging is ON in Developer Options
    echo 2. "Install via USB" is toggled ON if prompted on your phone
    pause
    exit /b 1
)

echo.
echo Launching TridentPDF...
"%ADB%" shell monkey -p com.tridentpdf.app -c android.intent.category.LAUNCHER 1

echo.
echo Taking verification screenshot...
timeout /t 2 >nul
"%ADB%" exec-out screencap -p > "E:\tridentpdf-mobile\phone_screenshot_latest.png"

echo.
echo Done! TridentPDF is running on your phone.
pause
