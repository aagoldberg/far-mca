import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const pinataJwt = process.env.PINATA_JWT;

  if (!pinataJwt) {
    console.error("PINATA_JWT environment variable not found!");
    return NextResponse.json(
      { error: "Server configuration error: Pinata JWT not set." },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Use FormData for the direct API call
    const data = new FormData();
    data.append("file", file);
    data.append("pinataMetadata", JSON.stringify({ name: file.name }));
    data.append("pinataOptions", JSON.stringify({ cidVersion: 0 }));

    const pinataResponse = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${pinataJwt}`
        },
        body: data
    });

    if (!pinataResponse.ok) {
        const errorData = await pinataResponse.json();
        throw new Error(errorData.error?.details || "Failed to pin file to IPFS.");
    }

    const result = await pinataResponse.json();

    return NextResponse.json(
      {
        cid: result.IpfsHash,
        pinataUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error uploading to Pinata:", error);
    return NextResponse.json(
      {
        error: "Failed to upload image to IPFS via Pinata.",
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
} 