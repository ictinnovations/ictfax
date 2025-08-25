import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createWorker } from 'tesseract.js';
import { getDocument } from 'pdfjs-dist';
import { AppService } from '../../../../app/app.service';
import * as pdfjsLib from 'pdfjs-dist';

// ✅ Use CDN worker for Angular 13
(pdfjsLib as any).GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

@Injectable({
  providedIn: 'root'
})
export class OcrService {
  private ocrWorker: any = null;
  private ocrInitPromise: Promise<void> | null = null;

  constructor(
    private http: HttpClient,
    private app_service: AppService
  ) { }

  // ✅ Same name as old service
  async extractTextAuto(document_id: string, lang: string = 'eng'): Promise<{ rawText: string; usedOCR: boolean }> {
    const url = `${this.app_service.apiUrlDocument}/${document_id}/media`;
    const blob = await this.http.get(url, { responseType: 'blob' }).toPromise();
    return this.extractTextFromBlob(blob!, lang);
  }

  // ✅ Internal helper, same purpose as old blob handler
  private async extractTextFromBlob(blob: Blob, lang: string = 'eng'): Promise<{ rawText: string; usedOCR: boolean }> {
    let rawText = '';
    let usedOCR = false;

    if (blob.type.startsWith('image/')) {
      rawText = await this.ocrImage(blob, lang);
      usedOCR = true;
    } else {
      const arrayBuffer = await this.blobToArrayBuffer(blob);
      const pdf = await getDocument({ data: new Uint8Array(arrayBuffer) }).promise;

      let collectedText: string[] = [];
      let hasSelectableText = false;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const strings = (textContent.items || []).map((it: any) => (it.str || '').trim()).filter(Boolean);
        if (strings.length) hasSelectableText = true;
        if (strings.length) collectedText.push(strings.join(' '));
      }

      rawText = collectedText.join('\n\n');

      // ✅ OCR fallback
      if (!hasSelectableText || rawText.length < 20) {
        usedOCR = true;
        const ocrChunks: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const imgBlob = await this.pageToPngBlob(page, 2);
          const text = await this.ocrImage(imgBlob, lang);
          ocrChunks.push(text);
        }
        rawText = ocrChunks.join('\n\n');
      }
    }

    return { rawText, usedOCR };
  }

private async initOcr(lang: string = 'eng') {
  if (this.ocrInitPromise) return this.ocrInitPromise;
  this.ocrWorker = await createWorker();
  // Old style: don't chain load(), loadLanguage(), initialize()
  this.ocrInitPromise = Promise.resolve();
  await this.ocrInitPromise;
}

  private async ocrImage(blob: Blob, lang: string = 'eng'): Promise<string> {
    await this.initOcr(lang);
    if (!this.ocrWorker) throw new Error('OCR Worker not initialized');
    try {
      const { data } = await this.ocrWorker.recognize(blob);
      return data?.text ?? '';
    } finally {
      await this.ocrWorker.terminate();
      this.ocrWorker = null;
      this.ocrInitPromise = null;
    }
  }

  private async pageToPngBlob(page: any, scale = 2): Promise<Blob> {
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx!, viewport }).promise;

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('toBlob failed')),
        'image/png'
      );
    });
  }

  private blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }
}
