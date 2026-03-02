# setup-android-env.ps1
# This script sets the ANDROID_HOME environment variable and updates the PATH for the current user.

$sdkPath = "$env:LOCALAPPDATA\Android\Sdk"

if (Test-Path $sdkPath) {
    Write-Host "Found Android SDK at: $sdkPath" -ForegroundColor Green
    
    # Set ANDROID_HOME for the current user
    [Environment]::SetEnvironmentVariable("ANDROID_HOME", $sdkPath, "User")
    $env:ANDROID_HOME = $sdkPath
    Write-Host "Set ANDROID_HOME to $sdkPath" -ForegroundColor Cyan

    # Update Path for the current user to include platform-tools
    $platformTools = Join-Path $sdkPath "platform-tools"
    $emulatorPath = Join-Path $sdkPath "emulator"
    
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    $pathsToAdd = @($platformTools, $emulatorPath)
    
    foreach ($path in $pathsToAdd) {
        if ($userPath -notlike "*$path*") {
            $userPath = "$userPath;$path"
            Write-Host "Adding $path to User Path" -ForegroundColor Cyan
        } else {
            Write-Host "$path is already in User Path" -ForegroundColor Yellow
        }
    }
    
    [Environment]::SetEnvironmentVariable("Path", $userPath, "User")
    Write-Host "Environment variables updated! Please restart your terminal/IDE for changes to take effect." -ForegroundColor Green
} else {
    Write-Host "Could not find Android SDK at $sdkPath. Please ensure Android Studio is installed and the SDK is in the default location." -ForegroundColor Red
}
