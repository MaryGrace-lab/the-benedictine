import { renderToStream } from "@react-pdf/renderer";
import AdmissionLetter from "./AdmissionLetter";

export async function generateAdmissionLetterPDF(data: {
  registrationNumber: string;
  studentName: string;
  applyingClass: string;
  session: string;
  parentName: string;
  date: string;
}) {
  const stream = await renderToStream(
    AdmissionLetter(data)
  );

  return stream;
}