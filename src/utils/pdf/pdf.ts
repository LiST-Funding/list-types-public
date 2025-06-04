import { PDFDocument } from "pdf-lib";

function isPdf(file: File | PDFDocument): boolean {
  return file instanceof PDFDocument || file.type.includes('pdf');
}

function fileToBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as ArrayBuffer'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

async function selectPdfPages(document: PDFDocument, start: number, end: number) {
  const newDocument = await PDFDocument.create();
  const pageNumbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  const copiedPages = await newDocument.copyPages(document, pageNumbers);
  copiedPages.forEach(p => newDocument.addPage(p));
  return newDocument;
}

async function countPdfPages(file: File | PDFDocument): Promise<number | null> {
  if (file instanceof PDFDocument) {
    return file.getPageCount();
  }
  if (!isPdf(file)) {
    return null;
  }
  const buffer = await fileToBuffer(file);
  const doc = await PDFDocument.load(buffer);
  return doc.getPageCount();
}

export async function splitPdf(file: File, chunkSizeMb: number): Promise<File[]> {
  if (!file.type.includes('pdf')) {
    throw new Error('Not a PDF file');
  }
  const buffer = await file.arrayBuffer();
  const doc = await PDFDocument.load(buffer);
  const numPages = await countPdfPages(doc);
  const subDocs: PDFDocument[] = [];

  let accumulatedBytes = 0;
  let currentIndex = -1;
  let lastPage = -1;

  for (let pageIndex = 0; pageIndex < (numPages ?? 0); pageIndex++) {
    if (subDocs.length === 0 || (accumulatedBytes >= (chunkSizeMb * 1024 * 1024))) {
      if (subDocs[currentIndex]) {
        subDocs[currentIndex].removePage(lastPage);
        pageIndex--;
      }
      subDocs.push(await PDFDocument.create());
      accumulatedBytes = 0;
      currentIndex += 1;
      lastPage = -1;
    }
    const [copiedPage] = await subDocs[currentIndex].copyPages(doc, [pageIndex]);
    subDocs[currentIndex].addPage(copiedPage);
    const buffer = await subDocs[currentIndex].save();
    accumulatedBytes = buffer.length;
    lastPage += 1;
  }

  const bufferPromises = subDocs.map(async subDoc => {
    const selectedPagesDoc = await selectPdfPages(subDoc, 0, subDoc.getPageCount() - 1)
    return selectedPagesDoc.save();
  });
  const buffers = await Promise.all(bufferPromises);
  const files = buffers.map((buffer, index) => new File([buffer], `${file.name.replace(/\.pdf/i, '')}-${index + 1}.pdf`, { type: file.type }));
  return files;
}