$baseUrl = "http://localhost:8000/api/v1"
$random = Get-Random -Maximum 100000
$email = "testuser$random@test.com"
$password = "TestPassword123"

Write-Host ""
Write-Host "TESTING SENTIMENT API ENDPOINTS" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Test 1: Signup
Write-Host ""
Write-Host "TEST 1: User Signup" -ForegroundColor Yellow

try {
    $signupRes = Invoke-WebRequest -Uri "$baseUrl/users/signup" -Method POST `
        -Headers @{'Content-Type'='application/json'} `
        -Body (ConvertTo-Json @{email=$email; password=$password; name="Test User"}) `
        -UseBasicParsing

    if ($signupRes.StatusCode -eq 200 -or $signupRes.StatusCode -eq 201) {
        Write-Host "SUCCESS (Status: $($signupRes.StatusCode))" -ForegroundColor Green
        Write-Host "Email: $email"
    }
}
catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Login
Write-Host ""
Write-Host "TEST 2: User Login" -ForegroundColor Yellow

$token = $null
try {
    $loginRes = Invoke-WebRequest -Uri "$baseUrl/users/login" -Method POST `
        -Headers @{'Content-Type'='application/json'} `
        -Body (ConvertTo-Json @{email=$email; password=$password}) `
        -UseBasicParsing

    if ($loginRes.StatusCode -eq 200) {
        $loginData = $loginRes.Content | ConvertFrom-Json
        $token = $loginData.accessToken
        Write-Host "SUCCESS (Status: $($loginRes.StatusCode))" -ForegroundColor Green
        Write-Host "Token: $($token.Substring(0,30))..."
    }
}
catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

if (-not $token) {
    Write-Host "Cannot continue without token" -ForegroundColor Red
    exit 1
}

# Test 3: POST Sentiment
Write-Host ""
Write-Host "TEST 3: Save Sentiment (POST)" -ForegroundColor Yellow

$sentimentId = $null
try {
    $saveRes = Invoke-WebRequest -Uri "$baseUrl/analysis/sentiment" -Method POST `
        -Headers @{'Content-Type'='application/json'; 'Authorization'="Bearer $token"} `
        -Body (ConvertTo-Json @{
            videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            label="positive"
            score=0.9425
        }) `
        -UseBasicParsing

    if ($saveRes.StatusCode -eq 201) {
        $saveData = $saveRes.Content | ConvertFrom-Json
        $sentimentId = $saveData.data._id
        Write-Host "SUCCESS (Status: $($saveRes.StatusCode))" -ForegroundColor Green
        Write-Host "Saved ID: $sentimentId"
        Write-Host "Sentiment: $($saveData.data.sentiment) ($($saveData.data.score))"
    }
}
catch {
    Write-Host "FAILED: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

# Test 4: GET All
Write-Host ""
Write-Host "TEST 4: Get All Sentiments (GET)" -ForegroundColor Yellow

try {
    $getAllRes = Invoke-WebRequest -Uri "$baseUrl/analysis" -Method GET `
        -Headers @{'Authorization'="Bearer $token"} `
        -UseBasicParsing

    if ($getAllRes.StatusCode -eq 200) {
        $allData = $getAllRes.Content | ConvertFrom-Json
        $count = $allData.data.Count
        Write-Host "SUCCESS (Status: $($getAllRes.StatusCode))" -ForegroundColor Green
        Write-Host "Found: $count sentiments"
    }
}
catch {
    Write-Host "FAILED: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

# Test 5: GET by Type
Write-Host ""
Write-Host "TEST 5: Filter by Type (GET /sentiment/positive)" -ForegroundColor Yellow

try {
    $filterRes = Invoke-WebRequest -Uri "$baseUrl/analysis/sentiment/positive" -Method GET `
        -Headers @{'Authorization'="Bearer $token"} `
        -UseBasicParsing

    if ($filterRes.StatusCode -eq 200) {
        $filterData = $filterRes.Content | ConvertFrom-Json
        $count = $filterData.data.Count
        Write-Host "SUCCESS (Status: $($filterRes.StatusCode))" -ForegroundColor Green
        Write-Host "Found: $count positive sentiments"
    }
}
catch {
    Write-Host "FAILED: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

# Test 6: GET Single
if ($sentimentId) {
    Write-Host ""
    Write-Host "TEST 6: Get Single Sentiment (GET /:id)" -ForegroundColor Yellow

    try {
        $singleRes = Invoke-WebRequest -Uri "$baseUrl/analysis/$sentimentId" -Method GET `
            -Headers @{'Authorization'="Bearer $token"} `
            -UseBasicParsing

        if ($singleRes.StatusCode -eq 200) {
            $singleData = $singleRes.Content | ConvertFrom-Json
            Write-Host "SUCCESS (Status: $($singleRes.StatusCode))" -ForegroundColor Green
            Write-Host "Sentiment: $($singleData.data.sentiment)"
            Write-Host "Score: $($singleData.data.score)"
        }
    }
    catch {
        Write-Host "FAILED: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

# Test 7: Stats
Write-Host ""
Write-Host "TEST 7: Get Statistics (GET /stats)" -ForegroundColor Yellow

try {
    $statsRes = Invoke-WebRequest -Uri "$baseUrl/analysis/stats" -Method GET `
        -Headers @{'Authorization'="Bearer $token"} `
        -UseBasicParsing

    if ($statsRes.StatusCode -eq 200) {
        $statsData = $statsRes.Content | ConvertFrom-Json
        Write-Host "SUCCESS (Status: $($statsRes.StatusCode))" -ForegroundColor Green
        Write-Host "Stats: $($statsData | ConvertTo-Json -Depth 2)"
    }
}
catch {
    Write-Host "FAILED: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

# Test 8: DELETE
if ($sentimentId) {
    Write-Host ""
    Write-Host "TEST 8: Delete Sentiment (DELETE /:id)" -ForegroundColor Yellow

    try {
        $deleteRes = Invoke-WebRequest -Uri "$baseUrl/analysis/$sentimentId" -Method DELETE `
            -Headers @{'Authorization'="Bearer $token"} `
            -UseBasicParsing

        if ($deleteRes.StatusCode -eq 200) {
            Write-Host "SUCCESS (Status: $($deleteRes.StatusCode))" -ForegroundColor Green
            Write-Host "Sentiment deleted"
        }
    }
    catch {
        Write-Host "FAILED: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

# Test 9: No Auth (should fail)
Write-Host ""
Write-Host "TEST 9: Missing Authorization (should get 401)" -ForegroundColor Yellow

try {
    $noAuthRes = Invoke-WebRequest -Uri "$baseUrl/analysis" -Method GET -UseBasicParsing
}
catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "SUCCESS - Correctly rejected (401)" -ForegroundColor Green
    }
    else {
        Write-Host "UNEXPECTED: Got $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "ALL TESTS COMPLETED" -ForegroundColor Green
Write-Host ""
