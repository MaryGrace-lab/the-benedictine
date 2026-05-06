// app/api/admission/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { generateApplicationId, calculateDraftExpiry } from '@/lib/admissionUtilis';  // fixed typo

const resend = new Resend(process.env.RESEND_API_KEY);

// Your domain – fallback to localhost if env variable not set (useful in dev)
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Schemas (unchanged)
const step1Schema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  dateOfBirth: z.string().min(1),
  gender: z.string().min(1),
  previousSchool: z.string().min(1, 'Previous school is required'),
});

const step2Schema = z.object({
  parentName: z.string().min(2).max(100),
  parentEmail: z.string().email(),
  parentPhone: z.string().min(10).max(15),
  address: z.string().min(5).max(200),
});

const step3Schema = z.object({
  classApplied: z.string().min(1),
  documents: z.object({
    birthCertificate: z.array(z.string()).optional(),
    passportPhoto: z.array(z.string()).optional(),
    previousResult: z.array(z.string()).optional(),
    medicalReport: z.array(z.string()).optional(),
  }).optional(),
});

const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, applicationId, data, step } = body;

    switch (action) {
      case 'init': {
        const parsed = step1Schema.safeParse(data);
        if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

        const appId = generateApplicationId();
        const expiry = calculateDraftExpiry();

        await prisma.admission.create({
          data: {
            applicationId: appId,
            studentFirstName: parsed.data.firstName,
            studentLastName: parsed.data.lastName,
            studentDOB: new Date(parsed.data.dateOfBirth),
            studentGender: parsed.data.gender,
            previousSchool: parsed.data.previousSchool || '',
            parentFirstName: '',
            parentLastName: '',
            parentEmail: '',
            parentPhone: '',
            parentAddress: '',
            applyingForClass: '',
            academicYear: '2026/2027',
            admissionType: 'day',
            draftExpiresAt: expiry,
            currentStep: 1,
            status: 'draft',
          },
        });

        return NextResponse.json({ success: true, applicationId: appId, message: 'Application started' });
      }

      case 'saveDraft': {
        if (!applicationId) return NextResponse.json({ error: 'Application ID required' }, { status: 400 });

        const existing = await prisma.admission.findUnique({ where: { applicationId } });
        if (!existing) return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        if (existing.status === 'submitted') return NextResponse.json({ error: 'Already submitted' }, { status: 400 });
        if (existing.draftExpiresAt && new Date() > existing.draftExpiresAt)
          return NextResponse.json({ error: 'Draft expired' }, { status: 410 });

        let updateData: any = { lastSaved: new Date() };

        if (step && step >= 1) {
          const parsed = step1Schema.safeParse(data);
          if (parsed.success) {
            updateData.studentFirstName = parsed.data.firstName;
            updateData.studentLastName = parsed.data.lastName;
            updateData.studentDOB = new Date(parsed.data.dateOfBirth);
            updateData.studentGender = parsed.data.gender;
            updateData.previousSchool = parsed.data.previousSchool || '';
            updateData.currentStep = step;
          }
        }
        if (step && step >= 2) {
          const parsed = step2Schema.safeParse(data);
          if (parsed.success) {
            updateData.parentFirstName = parsed.data.parentName.split(' ')[0] || '';
            updateData.parentLastName = parsed.data.parentName.split(' ').slice(1).join(' ') || '';
            updateData.parentEmail = parsed.data.parentEmail;
            updateData.parentPhone = parsed.data.parentPhone;
            updateData.parentAddress = parsed.data.address;
            updateData.currentStep = step;
          }
        }
        if (step && step >= 3) {
          const parsed = step3Schema.safeParse(data);
          if (parsed.success) {
            updateData.applyingForClass = parsed.data.classApplied;
            updateData.currentStep = step;
          }
        }

        await prisma.admission.update({ where: { applicationId }, data: updateData });
        return NextResponse.json({ success: true, message: 'Draft saved' });
      }

      case 'submit': {
        if (!applicationId) return NextResponse.json({ error: 'Application ID required' }, { status: 400 });

        const existing = await prisma.admission.findUnique({ where: { applicationId } });
        if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        if (existing.status === 'submitted') return NextResponse.json({ error: 'Already submitted' }, { status: 400 });

        const full = fullSchema.safeParse(data);
        if (!full.success) {
          console.log('Submit validation errors:', full.error.flatten());
          return NextResponse.json({ error: full.error.flatten() }, { status: 400 });
        }

        const docBirth = full.data.documents?.birthCertificate?.[0] || '';
        const docPhoto = full.data.documents?.passportPhoto?.[0] || '';
        const docResult = full.data.documents?.previousResult?.[0] || '';
        const docMedical = full.data.documents?.medicalReport?.[0] || '';

        await prisma.admission.update({
          where: { applicationId },
          data: {
            studentFirstName: full.data.firstName,
            studentLastName: full.data.lastName,
            studentDOB: new Date(full.data.dateOfBirth),
            studentGender: full.data.gender,
            previousSchool: full.data.previousSchool || '',
            parentFirstName: full.data.parentName.split(' ')[0] || '',
            parentLastName: full.data.parentName.split(' ').slice(1).join(' ') || '',
            parentEmail: full.data.parentEmail,
            parentPhone: full.data.parentPhone,
            parentAddress: full.data.address,
            applyingForClass: full.data.classApplied,
            birthCertificate: docBirth,
            passportPhoto: docPhoto,
            previousReports: docResult,
            medicalReport: docMedical,
            status: 'submitted',
            isComplete: true,
            submittedAt: new Date(),
            currentStep: 4,
          },
        });

        // Helper to make absolute URL from relative path
        const absoluteUrl = (path: string) => {
          if (!path) return '';
          return path.startsWith('http') ? path : `${BASE_URL}${path}`;
        };

        // Send emails
        try {
          await resend.emails.send({
            from: 'The Benedictine Academy <info@mail.thebenedictineacademyportal.com>',
            to: full.data.parentEmail,
            subject: 'Application Received - The Benedictine Academy',
            html: `
              <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
                <h2 style="color:#1a365d;">Application Received</h2>
                <p>Dear ${full.data.parentName},</p>
                <p>We have received your application for <strong>${full.data.firstName} ${full.data.lastName}</strong> for <strong>${full.data.classApplied}</strong>.</p>
                <p>Your <strong>Application ID</strong> is: <span style="font-size:1.5em;font-weight:bold;">${applicationId}</span></p>
                <p>Please keep this ID to track your application status on our website.</p>
                <p>We will review your application and contact you soon.</p>
                <br/>
                <p>Best regards,<br/>The Benedictine Academy</p>
              </div>`,
          });

          await resend.emails.send({
            from: 'The Benedictine Academy <info@mail.thebenedictineacademyportal.com>',
            to: 'thebenedictineacademy@gmail.com',
            subject: `New Admission: ${full.data.firstName} ${full.data.lastName}`,
            html: `
              <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
                <h2>New Application Submitted</h2>
                <table style="width:100%;border-collapse:collapse;">
                  <tr><td><strong>Application ID:</strong></td><td>${applicationId}</td></tr>
                  <tr><td><strong>Student:</strong></td><td>${full.data.firstName} ${full.data.lastName}</td></tr>
                  <tr><td><strong>DOB:</strong></td><td>${full.data.dateOfBirth}</td></tr>
                  <tr><td><strong>Gender:</strong></td><td>${full.data.gender}</td></tr>
                  <tr><td><strong>Previous School:</strong></td><td>${full.data.previousSchool || 'N/A'}</td></tr>
                  <tr><td><strong>Class:</strong></td><td>${full.data.classApplied}</td></tr>
                  <tr><td><strong>Parent/Guardian:</strong></td><td>${full.data.parentName}</td></tr>
                  <tr><td><strong>Email:</strong></td><td>${full.data.parentEmail}</td></tr>
                  <tr><td><strong>Phone:</strong></td><td>${full.data.parentPhone}</td></tr>
                  <tr><td><strong>Address:</strong></td><td>${full.data.address}</td></tr>
                </table>
                <h3>Uploaded Documents</h3>
                <table>
                  <tr><td><strong>Birth Certificate:</strong></td><td>${docBirth ? `<a href="${absoluteUrl(docBirth)}" target="_blank">Download</a>` : 'None'}</td></tr>
                  <tr><td><strong>Passport Photo:</strong></td><td>${docPhoto ? `<a href="${absoluteUrl(docPhoto)}" target="_blank"><img src="${absoluteUrl(docPhoto)}" width="100" height="100" style="object-fit:cover;" /></a>` : 'None'}</td></tr>
                  <tr><td><strong>Previous Term Result:</strong></td><td>${docResult ? `<a href="${absoluteUrl(docResult)}" target="_blank">Download</a>` : 'None'}</td></tr>
                  <tr><td><strong>Medical Report:</strong></td><td>${docMedical ? `<a href="${absoluteUrl(docMedical)}" target="_blank">Download</a>` : 'None'}</td></tr>
                </table>
              </div>`,
          });
        } catch (emailErr) {
          console.error('Email sending failed:', emailErr);
        }

        return NextResponse.json({ success: true, applicationId, message: 'Submitted!' });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admission API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const applicationId = searchParams.get('applicationId');
  const action = searchParams.get('action');

  if (!applicationId) return NextResponse.json({ error: 'applicationId required' }, { status: 400 });

  const application = await prisma.admission.findUnique({ where: { applicationId } });
  if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (action === 'resume') {
    if (application.status !== 'draft')
      return NextResponse.json({ error: 'Application is not a draft' }, { status: 403 });
    if (application.draftExpiresAt && new Date() > application.draftExpiresAt)
      return NextResponse.json({ error: 'Draft expired' }, { status: 410 });

    return NextResponse.json({
      applicationId: application.applicationId,
      currentStep: application.currentStep,
      studentData: {
        firstName: application.studentFirstName,
        lastName: application.studentLastName,
        dateOfBirth: application.studentDOB.toISOString().split('T')[0],
        gender: application.studentGender,
        previousSchool: application.previousSchool || '',
      },
      parentData: {
        parentName: `${application.parentFirstName} ${application.parentLastName}`.trim(),
        parentEmail: application.parentEmail,
        parentPhone: application.parentPhone,
        address: application.parentAddress || '',
      },
      classApplied: application.applyingForClass,
    });
  }

  return NextResponse.json({
    applicationId: application.applicationId,
    studentName: `${application.studentFirstName} ${application.studentLastName}`,
    classApplied: application.applyingForClass,
    status: application.status,
    submittedAt: application.submittedAt,
    draftExpiresAt: application.draftExpiresAt,
    currentStep: application.currentStep,
  });
}