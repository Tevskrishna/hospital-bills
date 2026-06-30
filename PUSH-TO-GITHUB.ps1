# Push hospital-bills to GitHub (Tevskrishna) and enable Pages
$ErrorActionPreference = "Stop"
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Set-Location $PSScriptRoot

Write-Host "`n=== Hospital Bills -> GitHub ===" -ForegroundColor Cyan

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "Installing GitHub CLI..." -ForegroundColor Yellow
    winget install --id GitHub.cli -e --accept-source-agreements --accept-package-agreements
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

$loggedIn = $false
try { gh auth status *> $null; if ($LASTEXITCODE -eq 0) { $loggedIn = $true } } catch {}

if (-not $loggedIn) {
    Write-Host "`nLog in to GitHub in the browser window..." -ForegroundColor Yellow
    gh auth login -h github.com -p https -w
}

if (-not (Test-Path .git)) { git init }
git branch -M main 2>$null

git add -A
git status

$msg = "Hospital bills tracker: Telugu page, Google Form setup, GitHub Pages"
$committed = git diff --cached --quiet 2>$null
if ($LASTEXITCODE -ne 0) {
    git commit -m $msg
} else {
    $hasCommits = git rev-parse HEAD 2>$null
    if (-not $hasCommits) { git commit --allow-empty -m $msg }
}

$repo = "hospital-bills"
$owner = "Tevskrishna"

if (-not (gh repo view "$owner/$repo" 2>$null)) {
    Write-Host "`nCreating public repo $owner/$repo ..." -ForegroundColor Green
    gh repo create $repo --public --source=. --remote=origin --description "Mallareddy Hospital family bill tracker - Venkateswara Rao" --push
} else {
    $remote = git remote get-url origin 2>$null
    if (-not $remote) {
        git remote add origin "https://github.com/$owner/$repo.git"
    }
    git push -u origin main
}

Write-Host "`nEnabling GitHub Pages..." -ForegroundColor Green
gh api -X PUT "repos/$owner/$repo/pages" -f "build_type=workflow" 2>$null
gh workflow run pages.yml 2>$null

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "DONE!" -ForegroundColor Green
Write-Host "Repo:  https://github.com/$owner/$repo" -ForegroundColor White
Write-Host "Live:  https://$($owner.ToLower()).github.io/$repo/" -ForegroundColor Yellow
Write-Host "(Pages may take 2-3 minutes after first deploy)" -ForegroundColor Gray
Write-Host "========================================`n" -ForegroundColor Green

Start-Process "https://github.com/$owner/$repo/settings/pages"
