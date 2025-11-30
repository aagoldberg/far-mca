import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const pinataJwt = process.env.PINATA_JWT;
  
  // --- TEMPORARY DEBUGGING ---
  // This will log the full key to your server console.
  // Please remove this after we have resolved the issue.
  console.log("Full PINATA_JWT being used:", pinataJwt);
  // --- END TEMPORARY DEBUGGING ---

  if (!pinataJwt) {
    console.error("PINATA_JWT environment variable not found!");
    return NextResponse.json(
      { error: "Server configuration error: Pinata JWT not set." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    
    if (!body) {
      return NextResponse.json({ error: "No JSON body provided." }, { status: 400 });
    }

    const pinataResponse = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${pinataJwt}`
        },
        body: JSON.stringify({
            pinataContent: body,
            pinataMetadata: {
                name: `CampaignMetadata_${body.title || Date.now()}`
            }
        })
    });

    if (!pinataResponse.ok) {
        const errorData = await pinataResponse.json();
        throw new Error(errorData.error?.details || "Failed to pin JSON to IPFS.");
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
    console.error("Error uploading JSON to Pinata:", error);
    return NextResponse.json(
      {
        error: "Failed to upload JSON to IPFS via Pinata.",
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
} 