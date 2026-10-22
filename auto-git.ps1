
$ErrorActionPreference = "Continue"
Set-Location $PSScriptRoot

Write-Host "=================================="
Write-Host " AUTO UPLOAD GITHUB - Ucapan Nikah"
Write-Host " Tekan Ctrl+C untuk berhenti"
Write-Host "=================================="

while ($true) {
    Start-Sleep -Seconds 5

    $changes = git status --porcelain

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Gagal membaca status Git."
        continue
    }

    if ($changes) {
        Write-Host "Perubahan terdeteksi. Menunggu 8 detik..."
        Start-Sleep -Seconds 8

        $changes = git status --porcelain

        if (-not $changes) {
            continue
        }

        git add -A

        git commit -m "Auto update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

        if ($LASTEXITCODE -ne 0) {
            Write-Host "Commit gagal. Periksa terminal."
            continue
        }

        git push origin main

        if ($LASTEXITCODE -eq 0) {
            Write-Host "Berhasil upload ke GitHub!"
        } else {
            Write-Host "Upload gagal. Periksa koneksi GitHub."
        }
    }
}
