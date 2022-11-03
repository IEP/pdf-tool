import { PDFDocument, rgb } from "pdf-lib";
import { useEffect, useState } from "react";

function App() {
  const [fileRef, setFileRef] = useState<File | undefined>();
  const [data, setData] = useState<string | ArrayBuffer | null>();
  const [doc, setDoc] = useState<string | undefined>();

  useEffect(() => {
    if (fileRef) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(fileRef);
      reader.onload = () => setData(reader.result);
    }
  }, [fileRef]);

  useEffect(() => {
    if (data) {
      const loader = async () => {
        const pdf = await PDFDocument.load(data);

        for (let page of pdf.getPages()) {
          const width = page.getWidth();
          const height = page.getHeight();

          page.setWidth(width * 1.5);
          page.drawLine({
            start: { x: width, y: 0 },
            end: { x: width, y: height },
            thickness: 1,
            color: rgb(0, 0, 0),
            opacity: 1,
          });
        }

        const dataDoc = await pdf.save();
        const blob = new Blob([dataDoc], { type: "application/pdf" });
        const docUrl = URL.createObjectURL(blob);

        setDoc(docUrl);
      };
      loader();
    }
  }, [data]);

  return (
    <div className="container mx-auto flex flex-col justify-between h-full">
      <h1 className="text-4xl">PDF Tool: Add Right Margin</h1>
      {doc && (
        <div className="w-full h-full my-2">
          <iframe src={doc} className="grow w-full h-full" />
          <p />
        </div>
      )}
      <div className="flex-none my-16">
        <input
          type="file"
          onChange={(e) => setFileRef(e.target.files?.[0])}
          accept=".pdf"
        />
      </div>
    </div>
  );
}

export default App;
