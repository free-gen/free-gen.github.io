# Скачивание и установка SetLuma
powershell -Command "Invoke-WebRequest -Uri 'https://github.com/free-gen/SetLuma/releases/download/1.0/SetLuma.zip' -OutFile \"$env:TEMP\SetLuma.zip\""
mkdir "%LOCALAPPDATA%\FreeGen\SetLuma"
tar -xf "%TEMP%\SetLuma.zip" -C "%LOCALAPPDATA%\FreeGen\SetLuma"
del "%TEMP%\SetLuma.zip"
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut([System.IO.Path]::Combine($env:APPDATA, 'Microsoft\Windows\Start Menu\Programs\Startup', 'SetLuma.lnk')); $Shortcut.TargetPath = '%LOCALAPPDATA%\FreeGen\SetLuma\SetLuma.exe'; $Shortcut.WorkingDirectory = '%LOCALAPPDATA%\FreeGen\SetLuma'; $Shortcut.Save()"
cd /d "%LOCALAPPDATA%\FreeGen\SetLuma"
start "" "SetLuma.exe"
cd /d "%~dp0"

# Скачивание и установка Package Installer
powershell -Command "Invoke-WebRequest -Uri 'https://free-gen.github.io/downloads/PackageInstaller.zip' -OutFile \"$env:TEMP\PackageInstaller.zip\""
mkdir "%LOCALAPPDATA%\FreeGen\PackageInstaller"
tar -xf "%TEMP%\PackageInstaller.zip" -C "%LOCALAPPDATA%\FreeGen\PackageInstaller"
del "%TEMP%\PackageInstaller.zip"
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut([System.IO.Path]::Combine($env:UserProfile, 'Desktop', 'Package Installer.lnk')); $Shortcut.TargetPath = '%LOCALAPPDATA%\FreeGen\PackageInstaller\PackageInstaller.exe'; $Shortcut.WorkingDirectory = '%LOCALAPPDATA%\FreeGen\PackageInstaller'; $Shortcut.Save()"

# Скачивание и установка NanoStat App
powershell -Command "Invoke-WebRequest -Uri 'https://free-gen.github.io/downloads/NanoStat.zip' -OutFile \"$env:TEMP\NanoStat.zip\""
mkdir "%LOCALAPPDATA%\FreeGen\NanoStat"
tar -xf "%TEMP%\NanoStat.zip" -C "%LOCALAPPDATA%\FreeGen\NanoStat"
del "%TEMP%\NanoStat.zip"
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $StartupPath = [System.IO.Path]::Combine($env:APPDATA, 'Microsoft\Windows\Start Menu\Programs\Startup', 'NanoStat.lnk'); $Shortcut = $WshShell.CreateShortcut($StartupPath); $Shortcut.TargetPath = '%LOCALAPPDATA%\FreeGen\NanoStat\NanoStat.exe'; $Shortcut.Arguments = '--min'; $Shortcut.WorkingDirectory = '%LOCALAPPDATA%\FreeGen\NanoStat'; $Shortcut.Save()"
cd /d "%LOCALAPPDATA%\FreeGen\NanoStat"
start "" "NanoStat.exe" --min
cd /d "%~dp0"

# Добавление папки FreeGen в список исключений Защитника Windows
powershell -Command "Add-MpPreference -ExclusionPath '%LOCALAPPDATA%\FreeGen'"