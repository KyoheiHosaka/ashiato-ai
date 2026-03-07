import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const RESULT_LABELS: Record<string, { emoji: string; label: string; color: string }> = {
  solved: { emoji: '✅', label: '解決', color: '#059669' },
  partial: { emoji: '△', label: '部分的に解決', color: '#d97706' },
  unsolved: { emoji: '❌', label: '解決できなかった', color: '#dc2626' },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get('title') || 'AI活用事例';
  const industry = searchParams.get('industry') || '';
  const role = searchParams.get('role') || '';
  const result = searchParams.get('result') || 'solved';
  const aiTools = searchParams.get('tools')?.split(',').filter(Boolean) || [];

  const resultInfo = RESULT_LABELS[result] || RESULT_LABELS.solved;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          padding: '60px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#059669',
            }}
          >
            ASHIATO.ai
          </div>
          <div
            style={{
              display: 'flex',
              gap: '12px',
            }}
          >
            {industry && (
              <div
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '20px',
                }}
              >
                {industry}
              </div>
            )}
            {role && (
              <div
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '20px',
                }}
              >
                {role}
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#111827',
            lineHeight: 1.3,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {title.length > 60 ? `${title.slice(0, 60)}...` : title}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '40px',
          }}
        >
          {/* AI Tools */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
            }}
          >
            {aiTools.slice(0, 3).map((tool) => (
              <div
                key={tool}
                style={{
                  backgroundColor: '#d1fae5',
                  color: '#047857',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '20px',
                  fontWeight: '500',
                }}
              >
                {tool}
              </div>
            ))}
          </div>

          {/* Result */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: `${resultInfo.color}15`,
              color: resultInfo.color,
              padding: '12px 24px',
              borderRadius: '24px',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            <span>{resultInfo.emoji}</span>
            <span>{resultInfo.label}</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
