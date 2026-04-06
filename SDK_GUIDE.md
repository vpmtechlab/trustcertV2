# TrustCert Developer SDK Guide

Welcome to the TrustCert Developer Program. This guide provides the technical specifications required to integrate TrustCert's identity and compliance verification engine directly into your own applications via our REST API.

---

## 1. Authentication

All API requests must be authenticated using an **API Key** passed in the `X-API-KEY` header.

> [!IMPORTANT]
> Keep your API keys secret. If an API key is compromised, revoke it immediately from the **Settings > API Keys** section of your dashboard.

```bash
# Example Header
X-API-KEY: tc_live_xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 2. Core Endpoints

### A. Initiate Verification
Start a new identity check for an individual or business.

**Endpoint:** `POST /v1/verifications`

**Payload (KYC - National ID):**
```json
{
  "serviceType": "national_id",
  "data": {
    "idNumber": "12345678",
    "firstName": "John",
    "lastName": "Doe",
    "country": "KE"
  }
}
```

**Response:**
```json
{
  "jobId": "job_987654321",
  "status": "pending",
  "message": "Verification initiated"
}
```

---

### B. Retrieve Verification Result
Fetch the detailed payload of a completed verification job.

**Endpoint:** `GET /v1/verifications/{jobId}`

**Sample Response:**
```json
{
  "jobId": "job_987654321",
  "status": "approved",
  "data": {
    "fullName": "JOHN DOE",
    "idStatus": "Valid",
    "expiryDate": "2029-12-31",
    "verificationMessage": "National ID verified successfully"
  }
}
```

---

## 3. Webhooks

TrustCert can send real-time POST notifications to your server when a verification changes status.

### Webhook Event Object
```json
{
  "event": "verification.completed",
  "timestamp": 1712431200,
  "data": {
    "jobId": "job_987654321",
    "status": "approved",
    "serviceType": "national_id"
  }
}
```

---

## 4. Sample Code

### Node.js (Axios)
```javascript
const axios = require('axios');

const client = axios.create({
  baseURL: 'https://api.trustcert.io/v1',
  headers: { 'X-API-KEY': 'your_api_key_here' }
});

async function verifyId(idNumber) {
  try {
    const response = await client.post('/verifications', {
      serviceType: 'national_id',
      data: { idNumber }
    });
    console.log('Job Created:', response.data.jobId);
  } catch (error) {
    console.error('Verification failed:', error.response.data);
  }
}
```

### Python (Requests)
```python
import requests

API_KEY = "your_api_key_here"
BASE_URL = "https://api.trustcert.io/v1"

def start_verification(id_number):
    headers = {"X-API-KEY": API_KEY}
    payload = {
        "serviceType": "national_id",
        "data": {"id_number": id_number}
    }
    
    response = requests.post(f"{BASE_URL}/verifications", json=payload, headers=headers)
    return response.json()
```

---

## 5. Error Codes

| Code | Description |
| --- | --- |
| `401` | Unauthorized (Invalid API Key) |
| `402` | Payment Required (Insufficient Balance) |
| `404` | Not Found (Invalid Job ID) |
| `422` | Unprocessable Entity (Validation Error) |
| `429` | Too Many Requests (Rate Limit Exceeded) |
