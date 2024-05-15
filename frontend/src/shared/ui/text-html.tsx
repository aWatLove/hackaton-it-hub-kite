'use client';
import { CSSProperties } from 'react';
import DOMPurify from 'isomorphic-dompurify';

export type TextPropsType = { lineClamp?: number; shouldShortText?: boolean; text: string };
export const TextHtml = ({ shouldShortText, lineClamp = 4, text }: TextPropsType) => {
    const shortProps = !shouldShortText
        ? undefined
        : ({
              lineClamp: lineClamp,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              WebkitLineClamp: lineClamp,
          } satisfies CSSProperties);
    return (
        <div
            style={{
                fontSize: '16px',
                overflowWrap: 'anywhere',
                ...shortProps,
            }}
            suppressHydrationWarning
            className="cursor-none select"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}
        ></div>
    );
};
