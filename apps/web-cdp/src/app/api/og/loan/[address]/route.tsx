import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getLoanDataForMetadata } from '@/lib/loanMetadata';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const loan = await getLoanDataForMetadata(address);

    if (!loan) {
      return new Response('Loan not found', { status: 404 });
    }

    const progressPercent = Math.round((loan.totalFunded / loan.principal) * 100);

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            backgroundColor: '#f9fafb',
            padding: '60px',
          }}
        >
          {/* Card Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              backgroundColor: 'white',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Loan Image */}
            {loan.image && (
              <div
                style={{
                  width: '100%',
                  height: '340px',
                  overflow: 'hidden',
                  display: 'flex',
                }}
              >
                <img
                  src={loan.image}
                  alt={loan.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            )}

            {/* Content Area */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '40px 50px',
                flex: 1,
                justifyContent: 'space-between',
              }}
            >
              {/* Title */}
              <h1
                style={{
                  fontSize: '48px',
                  fontWeight: 600,
                  color: '#111827',
                  margin: '0 0 20px 0',
                  lineHeight: '1.2',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {loan.title}
              </h1>

              {/* Bottom Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Borrower Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px', color: '#6b7280' }}>
                    Borrower:
                  </span>
                  <span style={{ fontSize: '20px', color: '#111827', fontWeight: 500 }}>
                    {loan.borrower.substring(0, 6)}...{loan.borrower.substring(loan.borrower.length - 4)}
                  </span>
                </div>

                {/* Progress Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '20px', color: '#6b7280' }}>
                      Progress:
                    </span>
                    <span style={{ fontSize: '32px', color: '#10b981', fontWeight: 700 }}>
                      {progressPercent}% funded
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '12px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      display: 'flex',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(progressPercent, 100)}%`,
                        height: '100%',
                        backgroundColor: '#10b981',
                        borderRadius: '6px',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Branding */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#f9fafb',
                borderTop: '1px solid #e5e7eb',
              }}
            >
              <span style={{ fontSize: '18px', color: '#6b7280', fontWeight: 500 }}>
                everybit • Together, we build stronger communities
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
