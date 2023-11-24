to start the server: 
```bash 
node app.js
```

to call the server and make the POST: 
```ps1
Invoke-Expression -Command (Get-Content -Raw -Path ".\ps.ps1")
```

or:
```bash 
$headers = @{
    "Content-Type" = "application/json"
}
$body = Get-Content -Raw -Path ".\request.json" | ConvertFrom-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/echo" -Method POST -Headers $headers -Body ($body | ConvertTo-Json)

# Save the response to a JSON file
$response | ConvertTo-Json | Out-File -FilePath ".\response.json"
```