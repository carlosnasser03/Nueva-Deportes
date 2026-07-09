param(
  [Parameter(Mandatory=$true)][string]$Message,
  [string]$Branch = "main"
)

Write-Host "Staging changes..."
git add .

Write-Host "Committing: $Message"
git commit -m "$Message"

Write-Host "Pushing to origin/$Branch..."
git push origin $Branch

if ($LASTEXITCODE -ne 0) {
  Write-Error "Push failed. Check remote and authentication."
  exit $LASTEXITCODE
}

Write-Host "Done."