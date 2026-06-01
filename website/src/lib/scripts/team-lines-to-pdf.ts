import { $typst } from '@myriaddreamin/typst.ts';
import compilerWasmUrl from '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url';
import rendererWasmUrl from '@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url';
$typst.setCompilerInitOptions({
  getModule: () => compilerWasmUrl,
});
$typst.setRendererInitOptions({
  getModule: () => rendererWasmUrl,
});

export async function toSVG(input: string) {
  console.log("Starting compiling");
  let svg = await $typst.svg({ mainContent: input });
  return svg;
}

export async function toPDF(input: string): Promise<Blob | undefined> {
  console.log("Starting compiling");
  let pdfData = await $typst.pdf({ mainContent: input });
  if (!pdfData) {
    return undefined;
  }

  const bytes = new Uint8Array(pdfData.byteLength);
  bytes.set(pdfData);

  let pdfBlob = new Blob([bytes], {
    type: "application/pdf",
  });
  return pdfBlob;
}