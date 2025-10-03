# Target directory

$DEST_DIR = "C:\zyrtworks\p138-client-webV4\src\api"
# $ZIP_URL = "https://p138-business-api.shenz.dev/docs/ts.zip"
# Target directory

$ZIP_URL = "http://192.168.31.249:8888/docs/ts.zip"
# 强制跳过缓存
$RandomQueryParam = "?nocache=" + [guid]::NewGuid().ToString()
$FullZipUrl = $ZIP_URL + $RandomQueryParam

Write-Host "Starting ZIP file download..."
Invoke-WebRequest -Uri $FullZipUrl -OutFile ./tmpfile.zip

if (-not $?) {
    Write-Host "Download failed."
    Read-Host "Press any key to continue..."
    exit 1
}

Write-Host "Download successful. Cleaning target directory for 'interface' and 'schema' folders..."

# Remove specific folders from the target directory
$foldersToReplace = @("interface", "schema")
foreach ($folder in $foldersToReplace) {
    $folderPath = Join-Path $DEST_DIR $folder
    if (Test-Path $folderPath) {
        Remove-Item -Recurse -Force $folderPath
        Write-Host "Removed folder: $folder"
    } else {
        Write-Host "Folder $folder does not exist. Skipping..."
    }
}

# Ensure the target directory exists
if (-not (Test-Path $DEST_DIR)) {
    New-Item -ItemType Directory -Path $DEST_DIR | Out-Null
}

Write-Host "Unzipping the downloaded ZIP file..."
Expand-Archive -Path ./tmpfile.zip -DestinationPath ./temp_unzip -Force

# Check the extraction result
if (-not $?) {
    if (Get-ChildItem -Path "./temp_unzip/*" -ErrorAction SilentlyContinue) {
        Write-Host "Unzipping completed with warnings but was successful."
    } else {
        Write-Host "Unzipping failed."
        Read-Host "Press any key to continue..."
        exit 1
    }
}

# Copy specific folders to the target directory
foreach ($folder in $foldersToReplace) {
    $sourcePath = Join-Path "./temp_unzip" $folder
    $destPath = Join-Path $DEST_DIR $folder
    if (Test-Path $sourcePath) {
        Copy-Item -Recurse -Force -Path $sourcePath -Destination $destPath
        Write-Host "Copied folder: $folder to the target directory."
    } else {
        Write-Host "Folder $folder not found in the extracted ZIP. Skipping..."
    }
}

# Clean up temporary files and folders
Write-Host "Cleaning up temporary files..."
Remove-Item -Force ./tmpfile.zip
Remove-Item -Recurse -Force ./temp_unzip

if (-not $?) {
    Write-Host "Failed to clean up temporary files."
    Read-Host "Press any key to continue..."
    exit 1
}

Write-Host "All operations completed successfully. Please verify the target directory." -ForegroundColor Green

# Pause before exiting
Read-Host "Press any key to exit..."
