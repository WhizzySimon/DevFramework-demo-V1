# Code Verification Script for DevFramework-demo-V1
# SPFx project verification
#
# Usage: npm run verify (add to package.json)
# Output: scripts/verify-code-output.txt

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
Set-Location $projectRoot

$outputFile = Join-Path $projectRoot "scripts/verify-code-output.txt"

# Clear previous output
"" | Out-File -FilePath $outputFile -Encoding utf8

# Header
"=== DevFramework-demo-V1 Code Verification ===" | Out-File -FilePath $outputFile -Append -Encoding utf8
"Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Out-File -FilePath $outputFile -Append -Encoding utf8
"" | Out-File -FilePath $outputFile -Append -Encoding utf8

$allPassed = $true

# Step 0.5: Validate naming conventions (uses DevFramework script)
"--- Step 0.5: Validate naming conventions ---" | Out-File -FilePath $outputFile -Append -Encoding utf8
$namingOutput = node ../DevFramework/Scripts/build/validate-naming.js 2>&1 | Out-String
$namingOutput | Out-File -FilePath $outputFile -Append -Encoding utf8
if ($LASTEXITCODE -ne 0) { $allPassed = $false }
"" | Out-File -FilePath $outputFile -Append -Encoding utf8

# Step 1: SPFx Build (includes TypeScript check and linting)
"--- Step 1: gulp bundle ---" | Out-File -FilePath $outputFile -Append -Encoding utf8
$buildOutput = gulp bundle 2>&1 | Out-String
$buildOutput | Out-File -FilePath $outputFile -Append -Encoding utf8
if ($LASTEXITCODE -ne 0) { $allPassed = $false }
"" | Out-File -FilePath $outputFile -Append -Encoding utf8

# Final status
if ($allPassed) {
    "STATUS: ALL PASSED" | Out-File -FilePath $outputFile -Append -Encoding utf8
    Write-Host "Verification complete: ALL PASSED"
    exit 0
} else {
    "STATUS: FAILED" | Out-File -FilePath $outputFile -Append -Encoding utf8
    Write-Host "Verification complete: FAILED (see scripts/verify-code-output.txt)"
    exit 1
}
