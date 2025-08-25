import {Injectable} from '@angular/core';
import {Headers} from '@angular/http';
import {Http, Response, HttpModule, RequestOptions, ResponseContentType} from '@angular/http';
import {Document} from './document';
import {AppService} from '../../../../app/app.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import * as FileSaver from 'file-saver';
import { getFileNameFromResponseContentDisposition, saveFile } from '../../../file-download-helper';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

(pdfjsLib as any).GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
// Set workerSrc once globally


@Injectable()

export class DocumentService {

  aDocument: Document[] = [];
  document_id:any =null;
  document: Document = new Document;

  constructor(private http: Http, private app_service: AppService) { }
  private ocrWorker: any = null;
private ocrInitPromise: Promise<void> | null = null;

  URL = `${this.app_service.apiUrlDocument}/${this.document_id}/media`;

  get_DocumentList(): Promise<Document[]> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    return this.http.get(this.app_service.apiUrlDocument, options).toPromise()
    .then(response => response.json() as Document[]).catch(response => this.app_service.handleError(response));
  }

  get_DocumentData(document_id): Promise<Document> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const url5 = `${this.app_service.apiUrlDocument}/${document_id}`;
    return this.http.get(url5, options).toPromise()
    .then(response => response.json() as Document).catch(response => this.app_service.handleError(response));
  }

  get_ViewFaxDocument(document_id): any {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    options.responseType = ResponseContentType.Blob;
    const url = `${this.app_service.apiUrlDocument}/${document_id}/media`;
    // const url = `${this.app_service.apiUrlDocument}/${document_id}/media`;
    return url;
    // this.http.get(url, options).subscribe(res => {
    //   return res.url;
    //   // console.log(res.url);
    //   // const fileName = getFileNameFromResponseContentDisposition(res);
    //   // saveFile(res.blob(), fileName);
    // }, error => {
    //   this.app_service.downloadError(error);
    // });
  }

  get_Documentdownload(document_id, transmission_id = null): any {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    options.responseType = ResponseContentType.Blob;
    const url = `${this.app_service.apiUrlDocument}/${document_id}/media`;
    if(transmission_id){
      const url_doc = `${this.app_service.apiUrlDocument}/${document_id}/media/${transmission_id}`;
      }
    this.http.get(url, options).subscribe(res => {
      const fileName = getFileNameFromResponseContentDisposition(res);
      saveFile(res.blob(), fileName);
    }, error => {
      this.app_service.downloadError(error);
    });
  }

  add_Document(document: Document) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(document);
    const addDocumentUrl = `${this.app_service.apiUrlDocument}`;
    return this.http.post(addDocumentUrl, body, options).toPromise().then(response => response.json())
    .catch(response => this.app_service.handleError(response));
  }

  update_Document(document: Document): Promise<Document> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(document);
    const updateDocumentUrl = `${this.app_service.apiUrlDocument}/${document.document_id}`;
    return this.http.put(updateDocumentUrl, body, options).toPromise().then(response => response.json() as Document)
    .catch(response => this.app_service.handleError(response));
  }

  upload_Document(document: Document): Promise<Document> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(document);
    const uploadDocumentUrl = `${this.app_service.apiUrlDocument}/${document.document_id}/media`;
    return this.http.put(uploadDocumentUrl, body, options).toPromise().then(response => response.json() as Document)
    .catch(response => this.app_service.handleError(response));
  }

  delete_Document(document_id): Promise<any> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const deleteDocumentUrl = `${this.app_service.apiUrlDocument}/${document_id}`;
    return this.http.delete(deleteDocumentUrl, options).toPromise().then(response => response.json() as Document)
    .catch(response => this.app_service.handleError(response));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }



   async extractTextAuto(document_id: string, lang: string = 'eng'): Promise<{ rawText: string; usedOCR: boolean }> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers, responseType: ResponseContentType.Blob });

   const url = `${this.app_service.apiUrlDocument}/${document_id}/media`;
    const response: Response = await this.http.get(url, options).toPromise();
    const blob: Blob = (response as any)._body as Blob;

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

      // OCR fallback
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
    canvas.width = viewport.width as number;
    canvas.height = viewport.height as number;
    await page.render({ canvasContext: ctx!, viewport }).promise;
    return new Promise((resolve, reject) =>
      canvas.toBlob(b => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png')
    );
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

