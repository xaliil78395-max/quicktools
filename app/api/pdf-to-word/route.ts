import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";

export const runtime = "nodejs";

function containsArabic(text: string) {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
}

function buildLines(
  items: Array<{ text: string; x: number; y: number }>,
) {
  const lines: Array<{
    y: number;
    items: Array<{ text: string; x: number }>;
  }> = [];

  for (const item of items) {
    let line = lines.find((candidate) => Math.abs(candidate.y - item.y) <= 4);

    if (!line) {
      line = { y: item.y, items: [] };
      lines.push(line);
    }

    line.items.push({
      text: item.text,
      x: item.x,
    });
  }

  lines.sort((a, b) => b.y - a.y);

  return lines.map((line) => {
    const text = line.items.map((item) => item.text).join(" ");
    const arabic = containsArabic(text);

    line.items.sort((a, b) =>
      arabic ? b.x - a.x : a.x - b.x,
    );

    return {
      text: line.items
        .map((item) => item.text)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim(),
      arabic,
    };
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please upload a PDF file." },
        { status: 400 },
      );
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return NextResponse.json(
        { error: "Only PDF files are supported." },
        { status: 400 },
      );
    }

    const buffer = new Uint8Array(await file.arrayBuffer());

    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

    const loadingTask = pdfjs.getDocument({
      data: buffer,
      useWorkerFetch: false,
    });

    const pdfDocument = await loadingTask.promise;
    const allParagraphs: Array<{ text: string; arabic: boolean }> = [];

    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
      const page = await pdfDocument.getPage(pageNumber);
      const content = await page.getTextContent();

      const items = content.items
        .filter(
          (item): item is typeof item & { str: string; transform: number[] } =>
            "str" in item && "transform" in item,
        )
        .filter((item) => item.str.trim().length > 0)
        .map((item) => ({
          text: item.str,
          x: item.transform[4],
          y: item.transform[5],
        }));

      const lines = buildLines(items);

      let currentParagraph = "";
      let currentArabic = false;

      for (const line of lines) {
        if (!line.text) continue;

        if (!currentParagraph) {
          currentParagraph = line.text;
          currentArabic = line.arabic;
        } else if (line.arabic === currentArabic) {
          currentParagraph += " " + line.text;
        } else {
          allParagraphs.push({
            text: currentParagraph.trim(),
            arabic: currentArabic,
          });

          currentParagraph = line.text;
          currentArabic = line.arabic;
        }
      }

      if (currentParagraph.trim()) {
        allParagraphs.push({
          text: currentParagraph.trim(),
          arabic: currentArabic,
        });
      }

      if (pageNumber < pdfDocument.numPages) {
        allParagraphs.push({
          text: "",
          arabic: false,
        });
      }
    }

    const children =
      allParagraphs.filter((paragraph) => paragraph.text).length > 0
        ? allParagraphs
            .filter((paragraph) => paragraph.text)
            .map(
              (paragraph) =>
                new Paragraph({
                  bidirectional: paragraph.arabic,
                  alignment: paragraph.arabic
                    ? AlignmentType.RIGHT
                    : AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: paragraph.text,
                      rightToLeft: paragraph.arabic,
                    }),
                  ],
                }),
            )
        : [
            new Paragraph({
              text: "No readable text was found in this PDF.",
            }),
          ];

    const document = new Document({
      sections: [
        {
          properties: {},
          children,
        },
      ],
    });

    const docxBuffer = await Packer.toBuffer(document);

    return new NextResponse(docxBuffer as BodyInit, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.pdf$/i, "")}.docx"`,
      },
    });
  } catch (error) {
    console.error("PDF to Word conversion error:", error);

    return NextResponse.json(
      { error: "Unable to convert this PDF. Please try another file." },
      { status: 500 },
    );
  }
}


