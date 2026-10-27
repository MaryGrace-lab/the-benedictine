// lib/pdf/renderLetter.ts
import { renderToBuffer } from "@react-pdf/renderer";
import AdmissionLetter from "./AdmissionLetter";

export async function generateAdmissionLetterPDF(data: {
  registrationNumber: string;
  studentName: string;
  applyingClass: string;
  session: string;
  parentName: string;
  date: string;
}) {
  // Use renderToBuffer instead of renderToStream
  // Returns a Buffer which works perfectly with Next.js Response
  const buffer = await renderToBuffer(AdmissionLetter(data));
  
  return buffer;
}