import { readdir, readFile, stat, writeFile } from 'fs/promises';
import { PDFDocument } from "pdf-lib";
import { compress } from 'compress-pdf';

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

async function toBufferIfNot(
  file: File | ArrayBuffer,
  name?: string,
  type?: string
): Promise<{ buffer: ArrayBuffer, name: string, type: string }> {
  if (!(file instanceof File) && typeof file === 'object') {
    return {
      buffer: file,
      name: name ?? '',
      type: type ?? ''
    };
  }
  if (!file.type.includes('pdf')) {
    throw new Error('Not a PDF file');
  }
  return {
    buffer: await file.arrayBuffer(),
    name: file.name,
    type: file.type,
  }
}

export async function splitPdf(
  file: File | ArrayBuffer,
  chunkSizeMb: number,
  fallbackName?: string,
  fallbackType?: string
): Promise<File[]> {
  const { buffer, name, type } = await toBufferIfNot(file, fallbackName, fallbackType);
  const doc = await PDFDocument.load(buffer);
  const numPages = await countPdfPages(doc);
  const subDocs: PDFDocument[] = [];

  let accumulatedBytes = 0;
  let currentIndex = -1;
  let lastPage = -1;
  let accumulatedPages = 0;

  for (let pageIndex = 0; pageIndex < (numPages ?? 0); pageIndex++) {
    if (subDocs.length === 0 || (accumulatedBytes >= (chunkSizeMb * 1024 * 1024))) {
      if (subDocs[currentIndex]) {
        if (accumulatedPages <= 1) {
          throw new Error('Cannot split PDF. Single page is greater than permitted chunk size.');
        }
        subDocs[currentIndex].removePage(lastPage);
        pageIndex--;
      }
      subDocs.push(await PDFDocument.create());
      accumulatedBytes = 0;
      currentIndex += 1;
      lastPage = -1;
      accumulatedPages = 0;
    }
    const [copiedPage] = await subDocs[currentIndex].copyPages(doc, [pageIndex]);
    subDocs[currentIndex].addPage(copiedPage);
    const buffer = await subDocs[currentIndex].save();
    accumulatedBytes = buffer.length;
    lastPage += 1;
    accumulatedPages += 1;
  }

  const bufferPromises = subDocs.map(async subDoc => {
    const selectedPagesDoc = await selectPdfPages(subDoc, 0, subDoc.getPageCount() - 1)
    return selectedPagesDoc.save();
  });
  const buffers = await Promise.all(bufferPromises);
  const files = buffers.map((buffer, index) => new File([buffer], `${name.replace(/\.pdf/i, '')}-${index + 1}.pdf`, { type }));
  return files;
}

interface SplitPdfsFromFsPathsResult {
  original: {
    path: string;
    size?: string;
    error?: string;
  };
  output: {
    path: string;
    size: string;
  }[];
}

interface SplitPdfsFromFsPathsParams {
  paths: string[];
  maxSizeMb: number;
  outputDirPath?: string;
}

export async function splitPdfsFromFsPaths(
  { paths, maxSizeMb, outputDirPath }: SplitPdfsFromFsPathsParams
): Promise<SplitPdfsFromFsPathsResult[]> {
  const result: SplitPdfsFromFsPathsResult[] = [];
  for (let i = 0; i < paths.length; i++) {
    const fileStat = await stat(paths[i]);
    if (fileStat.isFile()) {
      try {
        console.log(`Starting: split file #${i} -  ${paths[i]}`);

        const path = paths[i];
        const pathParts = path.split('/');
        const fileName = pathParts?.[pathParts.length - 1];
        const content = await readFile(paths[i]);
        const outputFiles = await splitPdf(content, maxSizeMb - 0.5, fileName, 'pdf');

        let savePath = outputDirPath ?? pathParts.slice(0, -1).join('/');
        if (savePath.endsWith('/')) {
          savePath = savePath.slice(0, -1);
        }

        console.log(`${fileName} - split`);

        const output: SplitPdfsFromFsPathsResult['output'] = [];
        for (let j = 0; j < outputFiles.length; j++) {
          const file = outputFiles[j];
          const buffer = await file.arrayBuffer();
          const writePath = `${savePath}/${file.name}`;
          output.push({
            path: writePath,
            size: (buffer.byteLength / (1024 * 1024)).toFixed(2),
          });
          writeFile(writePath, Buffer.from(buffer));
        }
        result.push({
          original: {
            path,
            size: (content.length / (1024 * 1024)).toFixed(2),
          },
          output,
        });
      } catch (error) {
        console.error(`${paths[i]} - ERROR: could not be split.`);
        result.push({
          original: {
            path: paths[i],
            error: error instanceof Error ? error.message : String(error),
          },
          output: [],
        });
      }
    }
  }
  return result;
}

// requires the `ghostscript` package to be installed on the OS
export async function compressPdf(uncompressedPdf: ArrayBuffer): Promise<Buffer> {
  return compress(Buffer.from(uncompressedPdf));
}
