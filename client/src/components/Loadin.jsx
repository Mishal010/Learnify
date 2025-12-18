import React from "react";

const Loadin = ({ size = 64, className = "" }) => {
  const count = 8;
  const dur = 1; // seconds
  const rectW = 6;
  const rectH = 14;
  const radius = size / 2 - rectH - 4;

  return (
    <div
      className={`flex items-center justify-center ${className} h-[calc(100vh-10vh)]`}
      role="status"
      aria-label="Loading"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          {Array.from({ length: count }).map((_, i) => {
            const angle = (360 / count) * i;
            const begin = `${(i * dur) / count}s`;
            return (
              <rect
                key={i}
                x={-rectW / 2}
                y={-radius - rectH / 2}
                width={rectW}
                height={rectH}
                rx={2}
                ry={2}
                fill="#2563eb"
                transform={`rotate(${angle})`}
              >
                <animate
                  attributeName="opacity"
                  values="1;0.25;1"
                  dur={`${dur}s`}
                  begin={begin}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="transform"
                  type="scale"
                  values="1;0.6;1"
                  dur={`${dur}s`}
                  begin={begin}
                  repeatCount="indefinite"
                />
              </rect>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default Loadin;
