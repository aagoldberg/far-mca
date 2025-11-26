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
    const progressEmoji = progressPercent >= 75 ? '🔥' : progressPercent >= 50 ? '🎯' : progressPercent >= 25 ? '✨' : '💚';
    const remaining = loan.principal - loan.totalFunded;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            position: 'relative',
          }}
        >
          {/* Background Image with Overlay */}
          {loan.image && (
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
              }}
            >
              <img
                src={loan.image}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.4)',
                }}
              />
            </div>
          )}

          {/* Content Overlay */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              padding: '60px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              color: 'white',
            }}
          >
            {/* Header Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'rgba(59, 155, 127, 0.9)',
                padding: '16px 24px',
                borderRadius: '12px',
                width: 'fit-content',
              }}
            >
              <span style={{ fontSize: '32px' }}>{progressEmoji}</span>
              <span style={{ fontSize: '28px', fontWeight: 600 }}>Zero-Interest Community Loan</span>
            </div>

            {/* Title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h1
                style={{
                  fontSize: '72px',
                  fontWeight: 'bold',
                  lineHeight: 1.2,
                  margin: 0,
                  textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                  maxWidth: '1000px',
                }}
              >
                {loan.title}
              </h1>

              {/* Progress Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Progress Bar */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '48px',
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      border: '3px solid rgba(255,255,255,0.5)',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(progressPercent, 100)}%`,
                        height: '100%',
                        backgroundColor: progressPercent >= 75 ? '#EF4444' : progressPercent >= 50 ? '#F59E0B' : '#10B981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: '20px',
                      }}
                    >
                      <span style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>
                        {progressPercent}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '36px',
                    fontWeight: 600,
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#10B981' }}>
                      ${loan.totalFunded.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '32px', opacity: 0.9 }}>raised</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                    <div style={{ fontSize: '56px', fontWeight: 'bold' }}>
                      ${loan.principal.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '32px', opacity: 0.9 }}>goal</div>
                  </div>
                </div>

                {remaining > 0 && (
                  <div
                    style={{
                      fontSize: '28px',
                      backgroundColor: 'rgba(239, 68, 68, 0.9)',
                      padding: '16px 24px',
                      borderRadius: '12px',
                      width: 'fit-content',
                      fontWeight: 600,
                    }}
                  >
                    Only ${remaining.toLocaleString()} left to go!
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: '24px', opacity: 0.9 }}>
                Every dollar makes a difference 💚
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 600,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                }}
              >
                Community Microloans
              </div>
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
