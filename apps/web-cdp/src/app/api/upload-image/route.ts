import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Debug: Log API key values (first 10 chars only for security)
    console.log('API Key (first 10 chars):', process.env.PINATA_API_KEY?.substring(0, 10));
    console.log('Secret Key (first 10 chars):', process.env.PINATA_SECRET_KEY?.substring(0, 10));

    // Create FormData for Pinata
    const pinataFormData = new FormData();
    pinataFormData.append('file', file);

    const metadata = JSON.stringify({
      name: `Loan Image - ${file.name}`,
      keyvalues: {
        type: 'loan-image',
        timestamp: new Date().toISOString(),
        filename: file.name,
      },
    });

    pinataFormData.append('pinataMetadata', metadata);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': process.env.PINATA_API_KEY!,
        'pinata_secret_api_key': process.env.PINATA_SECRET_KEY!,
      },
      body: pinataFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pinata API error:', response.status, errorText);
      throw new Error(`Pinata API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const ipfsUrl = `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${result.IpfsHash}`;
    return NextResponse.json({
      hash: result.IpfsHash,
      ipfsUrl
    });
  } catch (error: any) {
    console.error('Error uploading image to IPFS:', error);
    console.error('Error message:', error.message);
    console.error('API Keys present:', {
      hasApiKey: !!process.env.PINATA_API_KEY,
      hasSecretKey: !!process.env.PINATA_SECRET_KEY,
    });
    return NextResponse.json(
      { error: `Failed to upload image to IPFS: ${error.message}` },
      { status: 500 }
    );
  }
}
