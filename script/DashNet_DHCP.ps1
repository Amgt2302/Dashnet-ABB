<#
.SYNOPSIS
    Exporte les baux DHCP actifs vers une API REST distante.

.DESCRIPTION
    Ce script récupère les baux DHCPv4 (IP, Nom, MAC) d'une étendue spécifique,
    les convertit au format JSON et les transmet via une requête HTTP POST
    à un serveur d'API pour inventaire ou surveillance.
    
.NOTES
    Date   : 07/01/2026
    Auteur : Amgt2302
    Ref    : DHCPv4 / REST API
#>

$ScopeId      = "xx.xx.xx.xx"
$ComputerName = "Win-Server"
$IPNode       = "xx.xx.xx.xx"
$Port         = "3333"
$Url          = "http://$($IPNode):$Port/api/DHCP"


# 1. Récupération des baux DHCP
Write-Host "Recovery of DHCP leases on $ComputerName ($ScopeId)..." -ForegroundColor Yellow
try {
    $dhcpLeases = Get-DhcpServerv4Lease -ScopeId $ScopeId -ComputerName $ComputerName
    Write-Host " > $($dhcpLeases.Count) leases found." -ForegroundColor Green
} catch {
    Write-Error "Critical error while retrieving leases : $_"
    exit 1
}

# 2. Construction de l'objet (Filtre uniquement les données utiles)
$filteredLeases = $dhcpLeases | ForEach-Object {
    [PSCustomObject]@{
        IPAddress  = $_.IPAddress.IPAddressToString
        HostName   = $_.HostName
        MACAddress = $_.ClientId
    }
}

# 3. Conversion en JSON
$jsonBody = $filteredLeases | ConvertTo-Json -Depth 3

# 4. Envoi de la requête HTTP POST
Write-Host "Sending data to the API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri $Url -Method Post -Body $jsonBody -ContentType 'application/json'
    Write-Host "Success ! Server response : $response" -ForegroundColor Cyan
} catch {
    Write-Error "HTTP POST request failed : $_"
    exit 1
}