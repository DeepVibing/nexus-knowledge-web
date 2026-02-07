# Visual Intelligence Provider Assessment

**Date:** 2026-02-06
**Purpose:** Evaluate visual intelligence models for potential integration into Nexus Knowledge API

---

## Current State: Nexus Knowledge API

| Capability | Provider | Model | Status |
|-----------|----------|-------|--------|
| Text Embeddings | Gemini | gemini-embedding-001 (768d) | Active |
| LLM/Chat/RAG | Gemini | gemini-2.5-flash | Active |
| Entity Extraction | Gemini | gemini-2.5-flash | Active |
| Vision/Image Analysis | -- | -- | **Not implemented** |

## Current State: Sibling Project (nexus-backend-api)

| Capability | Provider | Models | Status |
|-----------|----------|--------|--------|
| LLM/Chat | Gemini | gemini-2.5-flash, gemini-2.5-pro | Active |
| Embeddings | Gemini | gemini-embedding-001 | Active |
| Image Generation | fal.ai | FLUX 2 Pro/Dev/Ultra/Coco | Active |
| Video Generation | fal.ai + OpenAI | Kling V1.6/V2, Sora 2/2-Pro | Active |
| Image Upscaling | fal.ai | Recraft, Topaz, Clarity, AuraSR | Active |
| Image Segmentation | fal.ai | SAM 3 | Active |
| Visual Embeddings | fal.ai | CLIP ViT-B/32 (512d) | Active |
| Audio/TTS | ElevenLabs | eleven_v3, flash_v2.5 | Active |
| Avatar/Lip-Sync | fal.ai + HeyGen | Kling Avatar V2, HeyGen Photo Avatar V2 | Active |
| Vision/Image Analysis | Gemini | AnalyzeImageAsync, AnalyzeMultipleImagesAsync | Available |
| Local LLM | Ollama | qwen3:7b, embeddinggemma | Registered |

---

## Gemini Vision Models (Latest as of Feb 2026)

| Model | ID | Vision | Price (Input / Output per 1M tokens) | Best For |
|-------|----|--------|--------------------------------------|----------|
| **Gemini 3 Pro** | `gemini-3-pro` | Full multimodal + derendering | $2.00 / $12.00 | Complex visual reasoning, highest accuracy |
| **Gemini 3 Flash** | `gemini-3-flash` | Full + **Agentic Vision** (NEW) | $0.50 / $3.00 | Active image investigation, auto-zoom, code execution on images |
| **Gemini 2.5 Pro** | `gemini-2.5-pro` | Full multimodal | $1.25 / $10.00 | Deep reasoning + vision |
| **Gemini 2.5 Flash** | `gemini-2.5-flash` | Full multimodal | $0.30 / $2.50 | **Best price-performance** (current model) |
| **Gemini 2.5 Flash-Lite** | `gemini-2.5-flash-lite` | Full multimodal | $0.10 / $0.40 | Ultra-cheap bulk processing |

### Key Gemini Vision Capabilities

- **OCR**: 98.5% accuracy on printed text, 94% handwritten
- **Object Detection**: Bounding boxes normalized to [0, 1000] coords
- **Image Segmentation**: Contour masks as base64-encoded PNGs
- **Document Understanding**: Up to 1,000 pages
- **Chart/Diagram Interpretation**: Data extraction from graphs and flowcharts
- **Derendering** (Gemini 3 only): Reverse-engineer visuals to HTML/LaTeX/Markdown
- **Agentic Vision** (Gemini 3 Flash): Active investigation loop — writes Python to zoom, crop, annotate, and re-examine images for 5-10% accuracy boost
- **Input Methods**: Base64 inline, File API upload (48hr persistence), public URLs
- **Scale**: Up to 3,600 images per request, 1M token context window

### Image Input Token Costs

- Images <= 384px both dimensions: 258 tokens
- Larger images: tiled into 768x768 tiles, each 258 tokens
- Approximate cost per image: ~$0.0011 (at Gemini 2.5 Flash rates)
- Free tier: 1,000 daily requests

### Deprecation Notices

- `gemini-2.0-flash` and `gemini-2.0-flash-lite`: shutdown **March 31, 2026**
- `gemini-2.5-flash-image-preview`: already shut down (Jan 15, 2026), replaced by stable `gemini-2.5-flash-image`

---

## fal.ai Vision/Analysis Models

### Image Understanding & Analysis

| Model | Endpoint | Price | Key Capabilities |
|-------|----------|-------|-----------------|
| **Florence-2 Large** | `fal-ai/florence-2-large` | ~compute | 12+ tasks: captioning (3 levels), OCR, OCR+regions, object detection, open-vocab detection, segmentation, dense captions |
| **Bagel** (ByteDance) | `fal-ai/bagel/understand` | $0.05/req | 7B multimodal VLM, image VQA, structured JSON output, outperforms Qwen2.5-VL |
| **Isaac 0.1** (Perceptron) | `perceptron/isaac-01` | ~compute | 2B model, "conversational pointing" (cites visually), small text reading, few-shot visual learning |
| **Moondream 3** | `fal-ai/moondream3-preview` | ~compute | 9B MoE (2B active), 5 endpoints: detect, point, query, caption, segment |
| **Sa2VA** | `fal-ai/sa2va/4b/image` | ~compute | VQA + dense segmentation interleaved with text |
| **SAM 3** | `fal-ai/sam-3/image` | $0.005/req | Unified detect+segment+track, text/point/box/mask prompts, 32 masks/image |
| **Video Understanding** | `fal-ai/video-understanding` | $0.01/5s | Video content analysis and Q&A |
| **CLIP Score** | `clip-score` | Free | Image-text similarity score (scalar only, not embeddings) |
| **AI Detector** | `half-moon-ai/ai-detector/detect-image` | ~compute | Detect AI-generated images |

### Florence-2 Large Detail

Microsoft's unified vision foundation model with 12+ task endpoints:
- `/caption`, `/detailed-caption`, `/more-detailed-caption` — Image descriptions at 3 detail levels
- `/ocr`, `/ocr-with-region` — Text extraction with optional bounding boxes
- `/object-detection` — Identify and locate objects
- `/open-vocabulary-detection` — Detect user-specified objects by text
- `/referring-expression-segmentation` — Segment based on text descriptions
- `/region-to-category`, `/region-to-description`, `/region-to-segmentation` — Analyze specified regions
- `/dense-region-caption` — Caption multiple image regions
- `/caption-to-phrase-grounding` — Locate phrases within images

### SAM 3 Detail

Meta's Segment Anything Model 3:
- Unified detection + segmentation + tracking in a single inference call
- Four prompt types: text, point coordinates, bounding boxes, reference masks (combinable)
- Up to 32 masks per image, native 1024x1024 resolution
- Output: JPEG, PNG, WebP with optional confidence scores
- Video segmentation: $0.005/16 frames
- Commercial use permitted

### Image Generation Models (Reference)

| Model | Price | Notes |
|-------|-------|-------|
| FLUX.2 Pro | ~$0.05/img | Zero-config quality, HEX color control, multi-ref editing |
| FLUX.2 Dev Turbo | $0.008/img | fal's distilled version, 8 steps, 6x faster |
| FLUX.2 Flex | ~$0.025/img | Adjustable inference steps and guidance |
| Google Imagen 4 | varies | Highest quality generation |
| GPT Image 1/1.5 | varies | OpenAI models on fal |
| Qwen Image | $0.02/MP | Text rendering and image editing |

---

## Capability Matrix

| Capability | Gemini (Native) | fal.ai | Notes |
|------------|:---------------:|:------:|-------|
| **Image Captioning** | Yes (all models) | Florence-2, Bagel, Moondream 3 | Gemini simpler (single API), fal.ai more specialized |
| **OCR** | Yes (98.5% accuracy) | Florence-2 (OCR+regions) | Gemini excellent for general OCR; Florence-2 adds bounding boxes |
| **Visual Q&A** | Yes (all models) | Bagel ($0.05), Moondream 3, Isaac 0.1 | Gemini best for cost; Bagel best for structured JSON |
| **Document Understanding** | Yes (up to 1000 pages) | Partial (OCR-based only) | **Gemini clearly wins** — native document understanding |
| **Chart/Diagram Analysis** | Yes (data extraction) | No dedicated model | Gemini only |
| **Object Detection** | Yes (bounding boxes) | Florence-2, Moondream 3, SAM 3 | fal.ai more specialized |
| **Image Segmentation** | Yes (Gemini 2.5+) | SAM 3 ($0.005), Sa2VA, Moondream 3 | SAM 3 is gold standard |
| **Visual Grounding** | Yes (Gemini 3) | Isaac 0.1 (conversational pointing) | Both strong, different approaches |
| **Derendering** | Yes (Gemini 3 only) | No | Unique to Gemini 3 |
| **Image Generation** | Gemini 3 Pro Image | FLUX 2, Imagen 4, etc. | **fal.ai clearly wins** — wider selection, better quality |
| **Visual Embeddings** | Gemini embedding (text only) | CLIP Score (scalar only) | Neither offers raw visual embeddings for vector search |
| **Video Analysis** | Yes (all models) | Video Understanding | Both capable |

---

## Recommendations for Nexus Knowledge API

### Tier 1 — Immediate Wins (Zero New Dependencies)

**Gemini 2.5 Flash Vision** — your current model already supports image input. Add image-based source ingestion (upload image → extract text/entities via Gemini vision) by extending `GeminiLlmService` to accept image parts alongside text.

- Cost: ~$0.0011/image (already paying for the API key)
- Effort: Add `InlineData` parts to the Gemini API request DTOs
- Value: Process scanned documents, screenshots, whiteboards, diagrams

### Tier 2 — Specialized Document Processing

**Florence-2 Large** (fal.ai) — best for bulk OCR with bounding boxes, document region analysis, and dense captioning. Ideal for processing scanned PDFs or image-based documents where PdfPig can't extract text.

**SAM 3** (fal.ai, $0.005/req) — useful for segmenting diagrams, charts, or visual elements from documents before processing them individually.

### Tier 3 — Model Upgrade Path

**Gemini 3 Flash** (`gemini-3-flash`) — natural upgrade from 2.5 Flash. Agentic Vision is a game-changer for fine-grained document analysis (auto-zooms into small text, reads gauges, interprets complex diagrams). 67% more expensive than 2.5 Flash but 5-10% more accurate on vision tasks.

**Bagel Understand** (fal.ai, $0.05/req) — strong VQA with structured JSON output, good for asking specific questions about uploaded images.

### Not Recommended for This Use Case

- **fal.ai image generation models** (FLUX, Imagen, etc.) — knowledge base, not creative studio
- **CLIP on fal.ai** — only returns scalar scores, not embeddings; Gemini embeddings cover vector search needs
- **Gemini 3 Pro** — 4x more expensive than 3 Flash; overkill for document processing unless precision-critical

---

## Integration Architecture (If Implementing)

```
IVisualIntelligenceService (Application layer)
├── GeminiVisionService (Infrastructure) — image analysis, OCR, document understanding
│   └── Uses existing GeminiLlmService with image parts
└── FalAIVisionService (Infrastructure) — specialized tasks
    ├── Florence-2 endpoint — OCR with regions, object detection
    ├── SAM 3 endpoint — segmentation
    └── Bagel endpoint — structured VQA
```

Pattern follows existing `IConnectorProvider` / `IStorageProvider` abstractions.

---

**Last Updated:** 2026-02-06
**Author:** Claude Code (AI-assisted assessment)
