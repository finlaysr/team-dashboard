import { browser } from "$app/environment";

type TypstModule = typeof import("@myriaddreamin/typst.ts");

export class TeamLinesDoc {
  typst: TypstModule["$typst"] | null = null;

  async init(): Promise<void> {
    if (!browser) {
      throw new Error("Typst rendering is only available in the browser.");
    }

    // Import typst modules
    const typstModule = await import("@myriaddreamin/typst.ts");
    const compilerWasmUrl = (
      await import(
        "@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url"
      )
    ).default as string;
    const rendererWasmUrl = (
      await import(
        "@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url"
      )
    ).default as string;

    // Import fonts
    const ptSansUrl: string = (
      await import("$lib/assets/PT-Sans/PTSans-Regular.ttf?url")
    ).default;
    const ptSansBoldUrl: string = (
      await import("$lib/assets/PT-Sans/PTSans-Bold.ttf?url")
    ).default;
    const ptSansItalicUrl: string = (
      await import("$lib/assets/PT-Sans/PTSans-Italic.ttf?url")
    ).default;

    this.typst = typstModule.$typst;
    this.typst.setCompilerInitOptions({
      getModule: () => compilerWasmUrl,
      beforeBuild: [typstModule.loadFonts([ptSansUrl, ptSansBoldUrl, ptSansItalicUrl])],
    });
    this.typst.setRendererInitOptions({
      getModule: () => rendererWasmUrl,
    });

    // Set up files
    const mainFile: string = (await import("$lib/team-lines-doc/main.typ?raw")).default;
    this.typst.addSource("/main.typ", mainFile);

    const logoImageUrl: string = (await import("$lib/team-lines-doc/shinty-logo.png?url")).default;
    const ballImageUrl: string = (await import("$lib/team-lines-doc/shinty-ball.png?url")).default;
    for (const img of [[logoImageUrl, "/shinty-logo.png"], [ballImageUrl, "/shinty-ball.png"]]) {
      const response: Response = await fetch(img[0]);
      const logoBytes: Uint8Array = new Uint8Array(await response.arrayBuffer());
      this.typst.mapShadow(img[1], logoBytes);
    }

    const jsonFile: string = (await import("$lib/team-lines-doc/data.json?raw")).default;
    this.typst.mapShadow("/data.json", new TextEncoder().encode(jsonFile));
  }

  async updateData(data: teamLinesDocInputs) {
    if (!this.typst) return;

    const jsonFile: string = JSON.stringify(data);
    this.typst.mapShadow("/data.json", new TextEncoder().encode(jsonFile));
  }

  async toSVG(): Promise<string> {
    if (!this.typst) return "";

    let svg = await this.typst.svg({ mainFilePath: "/main.typ" });
    return svg;
  }

  async toPDF(): Promise<Blob | undefined> {
    if (!this.typst) return undefined;

    let pdfData = await this.typst.pdf({ mainFilePath: "/main.typ" });
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
}

export interface teamLinesDocInputs {
  competition: string;
  date: string;
  homeTeam: string;
  visitors: string;
  players: TeamLinePlayer[];
  substitutes: TeamLinePlayer[];
  referee: string;
  printName: string;
  club: string;
  options: {
    u17Competition: boolean;
  }
}

interface TeamLinePlayer {
  num: string;
  name: string;
  membNum: string;
  youthHelmet: string;
}