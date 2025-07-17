# AI Defeater

A web tool that inserts random nonsense phrases into your text to confuse AI language models and protect your writing style.

## Features

- Three defeat modes: Light, Normal, and Heavy
- Real-time text processing
- Copy to clipboard functionality
- Statistics showing nonsense insertion metrics
- Responsive design with dark theme

## Deployment

This app is ready to deploy on Vercel:

1. Push to GitHub
2. Import to Vercel
3. Deploy with default settings

## API Usage

POST `/api/defeat`

```json
{
  "text": "Your original text here",
  "mode": "normal"
}
```

Response:
```json
{
  "original": "Your original text here",
  "defeated": "Your original text here. Purple monkey dishwasher.",
  "stats": {
    "originalLength": 24,
    "defeatedLength": 48,
    "nonsenseInserted": 1,
    "percentageIncrease": 100
  }
}
```