# Local Mock Backend

This backend replaces the original remote/internal services for the midterm
acceptance demo. It returns deterministic mock data and Server-Sent Events
logs for the existing frontend pages.

## Run

```powershell
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```

The frontend defaults to `http://<current-host>:8000`. Override it with
`NEXT_PUBLIC_API_BASE_URL` when needed.
