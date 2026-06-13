// 装饰性航运路线图形（Vancouver → destination 主题）。纯装饰，使用 currentColor，
// 由父级设定颜色与透明度（如 text-secondary/15）。不参与交互。
interface RouteLinesProps {
  className?: string;
}

export default function RouteLines({ className = "" }: RouteLinesProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 600"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2 9"
        strokeLinecap="round"
      >
        <path d="M-40 470 C 250 360, 470 520, 760 300 S 1150 170, 1260 230" />
        <path d="M-40 300 C 210 230, 520 360, 820 185 S 1140 70, 1260 130" />
        <path d="M-40 560 C 300 520, 600 600, 900 455 S 1180 380, 1260 420" />
      </g>
      <g fill="currentColor">
        <circle cx="250" cy="392" r="3.5" />
        <circle cx="760" cy="300" r="5" />
        <circle cx="820" cy="185" r="3.5" />
        <circle cx="900" cy="455" r="3.5" />
        <circle cx="1245" cy="232" r="4" />
        <circle cx="1245" cy="131" r="4" />
      </g>
    </svg>
  );
}
