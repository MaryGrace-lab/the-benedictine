// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/pdf',
];

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: JPG, PNG, PDF` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(`admission-${Date.now()}-${file.name}`, file, {
      access: 'public',
      contentType: file.type,
    });

    console.log('✅ File uploaded:', blob.url);

    return NextResponse.json({
      success: true,
      url: blob.url, // This is a permanent, public URL
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}