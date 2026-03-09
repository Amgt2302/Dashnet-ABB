<#
.SYNOPSIS
    Active les réponses ICMPv4 (Ping) sur l'hôte local.

.DESCRIPTION
    Automatise la configuration du Pare-feu Windows pour autoriser le trafic 
    entrant ICMPv4 (Type 8 - "Echo Request").
    Gère l'auto-élévation des privilèges administratifs si nécessaire.

.NOTES
    Date   : 07/01/2026
    Auteur : Anthony MIGNOT
    Ref    : ICMP Type 8 (Echo Request)
#>

# 1. Vérification des droits d'élévation
if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()
    ).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    
    Write-Host "[!] Admin Right required" -ForegroundColor Red
    Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

Write-Host "[+] Admin Right confirmed" -ForegroundColor Green

# 2. Configuration ICMPv4
$RuleName = "File and Printer Sharing (Echo Request - ICMPv4-In)"

Write-Host "Configuring Firewall Rule..." -ForegroundColor Yellow

# Suppression de l'ancienne règle si déja existante
Remove-NetFirewallRule -DisplayName $RuleName -ErrorAction SilentlyContinue

# Création de la règle
New-NetFirewallRule -DisplayName $RuleName `
    -Protocol ICMPv4 `
    -IcmpType 8 `
    -Direction Inbound `
    -Action Allow `
    -Profile Any 

Write-Host "`nICMPv4 ping is now enabled !" -ForegroundColor Cyan
Read-Host "Press Enter to Quit"