export const MEASURE = "7rem";

export const row = "flex flex-row flex-wrap max-w-full";
export const rowReverse = "flex flex-row-reverse flex-wrap max-w-full";

export const inlineRow = "inline-flex flex-row flex-wrap max-w-full";
export const inlineFlex = "inline-flex! max-w-full";

export const rowFill = "min-w-[min(100%,7rem)] grow basis-[7rem]";
export const rowLine = "min-w-0 flex-1 basis-0 truncate";
export const rowGrow = "min-w-0 flex-1 basis-0";
export const rowEnd = "ms-auto min-w-0 max-w-full";

export const stack = "flex flex-col";
export const stackReverse = "flex flex-col-reverse";

export const gridBase = "grid";

export const grid = {
  xs: "grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,12rem),1fr))]",
  sm: "grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))]",
  md: "grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))]",
  pairs: "grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,11rem),1fr))]",
  one: "grid min-w-0 grid-cols-[minmax(0,1fr)]",
  calendar: "grid min-w-0 grid-flow-col grid-rows-7 auto-cols-[minmax(0,1fr)] gap-0.5",
  month: "grid min-w-0 grid-cols-[repeat(7,minmax(0,1fr))] gap-0.5",
} as const;

export const layers = {
  box: "grid min-w-0 grid-cols-[minmax(0,1fr)]",
  cell: "[grid-area:1/1] min-w-0",
} as const;

export const pairsInline =
  "grid min-w-0 grid-cols-[minmax(0,1fr)] gap-x-4 [&_dd]:mb-3 @min-[24rem]:grid-cols-[minmax(min(8rem,40%),max-content)_minmax(0,1fr)] @min-[24rem]:items-baseline @min-[24rem]:gap-y-2 @min-[24rem]:[&_dd]:mb-0";

export const sidebar = {
  box: "flex! flex-row flex-wrap max-w-full",
  main: "min-w-[min(100%,30rem)] grow-[999] basis-0",
  side: "min-w-[min(100%,7rem)] grow basis-[18rem]",
} as const;

export const inset = {
  "0": "w-full px-0",
  "0.5": "w-full px-[min(2px,max(0px,calc((100%_-_7rem)/2)))]",
  "1": "w-full px-[min(4px,max(0px,calc((100%_-_7rem)/2)))]",
  "1.5": "w-full px-[min(6px,max(0px,calc((100%_-_7rem)/2)))]",
  "2": "w-full px-[min(8px,max(0px,calc((100%_-_7rem)/2)))]",
  "2.5": "w-full px-[min(10px,max(0px,calc((100%_-_7rem)/2)))]",
  "3": "w-full px-[min(12px,max(0px,calc((100%_-_7rem)/2)))]",
  "4": "w-full px-[min(16px,max(0px,calc((100%_-_7rem)/2)))]",
  "5": "w-full px-[min(20px,max(0px,calc((100%_-_7rem)/2)))]",
  "6": "w-full px-[min(24px,max(0px,calc((100%_-_7rem)/2)))]",
  "8": "w-full px-[min(32px,max(0px,calc((100%_-_7rem)/2)))]",
  "10": "w-full px-[min(40px,max(0px,calc((100%_-_7rem)/2)))]",
  "12": "w-full px-[min(48px,max(0px,calc((100%_-_7rem)/2)))]",
  "16": "w-full px-[min(64px,max(0px,calc((100%_-_7rem)/2)))]",
  page: "w-full px-[min(clamp(1rem,3cqi,1.5rem),max(0px,calc((100%_-_7rem)/2)))]",
} as const;

export const pad = {
  "0": "px-0",
  "0.5": "px-0.5",
  "1": "px-1",
  "1.5": "px-1.5",
  "2": "px-2",
  "2.5": "px-2.5",
  "3": "px-3",
  "4": "px-4",
  "5": "px-5",
  "6": "px-6",
} as const;

export const padStart = {
  "1": "ps-[min(4px,max(0px,calc(100%_-_7rem)))]",
  "2": "ps-[min(8px,max(0px,calc(100%_-_7rem)))]",
  "3": "ps-[min(12px,max(0px,calc(100%_-_7rem)))]",
  "4": "ps-[min(16px,max(0px,calc(100%_-_7rem)))]",
  "5": "ps-[min(20px,max(0px,calc(100%_-_7rem)))]",
  "6": "ps-[min(24px,max(0px,calc(100%_-_7rem)))]",
  "8": "ps-[min(32px,max(0px,calc(100%_-_7rem)))]",
} as const;
export const padEnd = {
  "1": "pe-[min(4px,max(0px,calc(100%_-_7rem)))]",
  "2": "pe-[min(8px,max(0px,calc(100%_-_7rem)))]",
  "3": "pe-[min(12px,max(0px,calc(100%_-_7rem)))]",
  "4": "pe-[min(16px,max(0px,calc(100%_-_7rem)))]",
  "5": "pe-[min(20px,max(0px,calc(100%_-_7rem)))]",
  "6": "pe-[min(24px,max(0px,calc(100%_-_7rem)))]",
  "8": "pe-[min(32px,max(0px,calc(100%_-_7rem)))]",
} as const;

export const cardInset = {
  md: "[&>.card-body]:[--card-p:clamp(1rem,4cqi,1.5rem)]",
  xs: "[&>.card-body]:[--card-p:0.375rem_0.75rem]",
} as const;

export const scrollRoom = `${inset["1"]} py-1`;
export const backdrop =
  "bg-surface-container [background-image:var(--app-background,none),radial-gradient(70%_60%_at_0%_0%,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_70%),radial-gradient(60%_55%_at_100%_100%,color-mix(in_oklab,var(--color-secondary)_12%,transparent),transparent_70%),radial-gradient(45%_40%_at_100%_0%,color-mix(in_oklab,var(--color-accent)_9%,transparent),transparent_70%)] bg-cover bg-center";

export const clipRoom = "overflow-clip [overflow-clip-margin:4px]";
export const scrollX = `min-w-0 max-w-full overflow-x-auto ${scrollRoom}`;
export const scrolled = {
  tableColumns: "[&_:is(th,td)]:min-w-[10rem]",
  headOneLine: "[&_thead_th_button]:min-w-max",
  steps: "[&>.step]:min-w-[10rem]",
} as const;

export const fixed = {
  "1.5": "size-1.5 shrink-0",
  "2": "size-2 shrink-0",
  "2.5": "size-2.5 shrink-0",
  "3": "size-3 shrink-0",
  "3.5": "size-3.5 shrink-0",
  "4": "size-4 shrink-0",
  "4.5": "size-4.5 shrink-0",
  "5": "size-5 shrink-0",
  "6": "size-6 shrink-0",
  "7": "size-7 shrink-0",
  "8": "size-8 shrink-0",
  "9": "size-9 shrink-0",
  "10": "size-10 shrink-0",
  "11": "size-11 shrink-0",
  "12": "size-12 shrink-0",
  "14": "size-14 shrink-0",
  "16": "size-16 shrink-0",
  corner: "size-[max(1.25rem,var(--radius-box))] shrink-0",
} as const;
export const fixedWidth = {
  "2": "w-2 shrink-0",
  "4": "w-4 shrink-0",
  "6": "w-6 shrink-0",
  "8": "w-8 shrink-0",
  "10": "w-10 shrink-0",
  "11": "w-11 shrink-0",
  "12": "w-12 shrink-0",
  "16": "w-16 shrink-0",
} as const;

export const text = {
  prose: "min-w-[min(100%,7rem)] [overflow-wrap:anywhere]",
  label: "min-w-0 [overflow-wrap:anywhere]",
  line: "min-w-0 truncate",
} as const;

export const cap = {
  xs: "w-full max-w-xs",
  sm: "w-full max-w-sm",
  md: "w-full max-w-md",
  lg: "w-full max-w-lg",
  xl: "w-full max-w-xl",
  "2xl": "w-full max-w-2xl",
  "3xl": "w-full max-w-3xl",
  "4xl": "w-full max-w-4xl",
  "5xl": "w-full max-w-5xl",
  "6xl": "w-full max-w-6xl",
  "7xl": "w-full max-w-7xl",
  prose: "w-full max-w-[40rem]",
} as const;

export const floating = {
  "4": "w-[min(calc(4_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  "5": "w-[min(calc(5_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  "6": "w-[min(calc(6_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  "7": "w-[min(calc(7_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  "8": "w-[min(calc(8_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  "10": "w-[min(calc(10_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  "12": "w-[min(calc(12_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  "18": "w-[min(calc(18_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  sheet: "w-[min(calc(8_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  sheetWide: "w-[min(calc(12_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  anchor:
    "w-[round(up,max(var(--anchor-w,0px),calc(4_*_var(--tile-w))),var(--tile-w))] max-w-[round(down,calc(100vw_-_2rem),var(--tile-w))]",
  fit: "not-supports-[width:calc-size(max-content,size)]:w-max supports-[width:calc-size(max-content,size)]:w-[calc-size(max-content,round(up,size,var(--tile-w)))] max-w-[round(down,calc(100vw_-_2rem),var(--tile-w))]",
} as const;

export const floatMotion =
  "not-open:hidden origin-(--float-origin) opacity-0 scale-95 open:opacity-100 open:scale-100 starting:open:opacity-0 starting:open:scale-95 [transition:opacity_var(--duration-short3)_var(--ease-emphasized-accelerate),scale_var(--duration-short3)_var(--ease-emphasized-accelerate),display_var(--duration-short3)_allow-discrete,overlay_var(--duration-short3)_allow-discrete] open:[transition:opacity_var(--duration-short3)_var(--ease-emphasized-decelerate),scale_var(--duration-medium1)_var(--ease-emphasized-decelerate),display_var(--duration-medium1)_allow-discrete,overlay_var(--duration-medium1)_allow-discrete] motion-reduce:transition-none";

export const floatingFit = {
  "6": "not-supports-[width:calc-size(max-content,size)]:w-max supports-[width:calc-size(max-content,size)]:w-[calc-size(max-content,round(up,size,var(--tile-w)))] max-w-[min(calc(6_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  "11": "not-supports-[width:calc-size(max-content,size)]:w-max supports-[width:calc-size(max-content,size)]:w-[calc-size(max-content,round(up,size,var(--tile-w)))] max-w-[min(calc(11_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  "11In":
    "not-supports-[width:calc-size(max-content,size)]:w-max supports-[width:calc-size(max-content,size)]:w-[calc-size(max-content,round(up,size,var(--tile-w)))] max-w-[min(calc(11_*_var(--tile-w)),round(down,100%,var(--tile-w)))]",
} as const;

export const floatingHeight = {
  fit: "supports-[height:calc-size(auto,size)]:h-[calc-size(auto,round(up,size,calc(var(--tile-h)/4)))]",
  list: "max-h-[round(down,min(calc(5_*_var(--tile-h)),var(--float-max-h,100dvh)),calc(var(--tile-h)/4))]",
  dialog: "max-h-[round(down,min(36rem,calc(100dvh_-_1rem),calc(76dvh_+_4rem)),calc(var(--tile-h)/4))]",
  panel: "h-[round(down,min(38rem,calc(100dvh_-_7rem)),calc(var(--tile-h)/4))]",
  tool: "max-h-[round(down,min(28rem,60dvh),calc(var(--tile-h)/4))]",
  sheet: "h-[round(down,100%,calc(var(--tile-h)/4))]",
  "2": "max-h-[round(down,calc(2_*_var(--tile-h)),calc(var(--tile-h)/4))]",
  "3": "max-h-[round(down,calc(3_*_var(--tile-h)),calc(var(--tile-h)/4))]",
  "4": "max-h-[round(down,calc(4_*_var(--tile-h)),calc(var(--tile-h)/4))]",
  "6": "max-h-[round(down,calc(6_*_var(--tile-h)),calc(var(--tile-h)/4))]",
} as const;

export const tiles = {
  "2": "w-[calc(2_*_var(--tile-w))] max-w-full",
  "4": "w-[calc(4_*_var(--tile-w))] max-w-full",
  "5": "w-[calc(5_*_var(--tile-w))] max-w-full",
  "6": "w-[calc(6_*_var(--tile-w))] max-w-full",
  "7": "w-[calc(7_*_var(--tile-w))] max-w-full",
  "8": "w-[calc(8_*_var(--tile-w))] max-w-full",
  "10": "w-[calc(10_*_var(--tile-w))] max-w-full",
} as const;

export const tileCap = {
  "6": "w-full max-w-[calc(6_*_var(--tile-w))]",
  "7": "w-full max-w-[calc(7_*_var(--tile-w))]",
  "8": "w-full max-w-[calc(8_*_var(--tile-w))]",
  "11": "w-full max-w-[calc(11_*_var(--tile-w))]",
} as const;

export const container = {
  plain: "@container w-full",
  alert: "@container/alert w-full",
  item: "@container/item w-full",
  header: "@container/header w-full",
  axis: "@container w-full",
} as const;

export const frame = {
  compact: "[--frame-gap:0px]",
  headerInset: "px-[max(var(--frame-edge),0.25rem)]",
  grid: "grid grid-rows-[repeat(var(--frame-quarter-rows,12),calc(var(--tile-h)/4))_minmax(0,1fr)] grid-cols-[repeat(4,calc(var(--tile-w)/4))_var(--frame-slack,0px)_repeat(var(--frame-inner-quarters,16),calc(var(--tile-w)/4))_var(--frame-slack,0px)_repeat(4,var(--frame-end-quarter,calc(var(--tile-w)/4)))]",
  headerArea: "[grid-area:1/1/5/-1]",
  headerGrid: "grid grid-cols-subgrid grid-rows-[var(--frame-header)]",
  frameContainer: "@container/frame",
  headerStart: "[grid-row:1] [grid-column:1/span_4] @min-[40rem]/frame:[grid-column:1/span_16]",
  headerSearch: "[grid-row:1] [grid-column:6/span_4] @min-[40rem]/frame:[grid-column:18/-18]",
  headerActions:
    "[grid-row:1] [grid-column:6/var(--frame-actions-end,-1)] justify-self-end grid grid-flow-col auto-cols-(--tile-w) justify-items-center",
  searchBox: "w-full max-w-[calc(8*var(--tile-w))] grid justify-items-center",
  brandInset: "ps-[calc((var(--frame-rail)_-_2rem)/2)]",
  startArea: "[grid-area:5/1/-2/5]",
  mainArea: "[grid-area:5/5/-1/-5]",
  mainRows: "grid grid-rows-subgrid grid-cols-[minmax(0,1fr)]",
  windowRows: "[grid-row:1/-3]",
  footerRows: "[grid-row:-3/-1]",
  endArea: "[grid-area:5/-5/-2/-1] justify-self-end",
  pushStart: "ms-[calc(var(--frame-nav)_-_var(--frame-rail)_+_var(--drag-start-o,0px))]",
  pushEnd: "me-[calc(var(--frame-aside)_-_var(--frame-rail)_+_var(--drag-end-o,0px))]",
  dragStart: "ms-(--drag-start)",
  dragEnd: "me-(--drag-end)",
  dragHandle: "absolute inset-y-0 z-20 w-4 shrink-0 cursor-col-resize touch-none rounded-full touch-target",
  pushMove:
    "[transition:margin-inline-start_var(--duration-spatial)_var(--ease-spatial)_var(--push-start-delay,0s),margin-inline-end_var(--duration-spatial)_var(--ease-spatial)_var(--push-end-delay,0s)] motion-reduce:transition-none",
  column: "group/column shrink-0",
  rail: "w-(--frame-rail)",
  navOpen: "w-(--frame-nav)",
  asideOpen: "w-(--frame-aside)",
  listStart: "w-[calc(var(--frame-nav)_-_var(--frame-rail)_+_2.75rem)]! max-w-none",
  listEnd: "w-[calc(var(--frame-aside)_-_var(--frame-rail)_+_2.75rem)]! max-w-none",
  railDragStart: "w-[calc(var(--frame-rail)_+_var(--drag-start,0px))]",
  railDragEnd: "w-[calc(var(--frame-rail)_+_var(--drag-end,0px))]",
  navDrag: "w-[calc(var(--frame-nav)_+_var(--drag-start-o,0px))]",
  asideDrag: "w-[calc(var(--frame-aside)_+_var(--drag-end-o,0px))]",
  glint: "pointer-events-none absolute top-0 start-0 w-screen h-dvh",
  railInset: "px-[calc((var(--frame-rail)_-_2.75rem)/2)]",
  edgeStart: "-ms-(--frame-edge) border-s-(length:--frame-edge)",
  edgeEnd: "-me-(--frame-edge) border-e-(length:--frame-edge)",
  panel: "w-[calc(100%_+_var(--frame-edge))]",
  panelRail: "w-[calc(var(--frame-rail)_+_var(--frame-edge))]",
  sheetNav: "w-[calc(var(--frame-nav)_+_var(--frame-edge))]",
  sheetAside: "w-[calc(var(--frame-aside)_+_var(--frame-edge))]",
  center: "min-w-(--main-min)",
  footer: "[grid-row:-3/-1] shrink-0",
  toggle: "shrink-0 group/toggle",
} as const;

export const board = {
  box: "@container/board w-full",
  lanes:
    "grid auto-rows-[calc(var(--tile-h)/4)] gap-0 [grid-template-columns:repeat(var(--board-quarters,4),calc(var(--tile-w)/4))]",
  tile: "grid min-w-0 min-h-0 overflow-clip [--clips:frame] grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] [grid-column:var(--lane)/span_var(--span)] [grid-row:var(--row)/span_var(--rows)]",
  inset: "p-1",
  skip: "[content-visibility:auto] [contain-intrinsic-size:auto_none] data-held:[content-visibility:visible]",
  held: "data-held:origin-(--grab) data-held:[transition:scale_var(--duration-spatial-fast)_var(--ease-spatial-fast)] data-out:scale-50 data-out:opacity-90 motion-reduce:data-held:transition-none data-held:fixed data-held:inset-auto data-held:left-(--lift-x) data-held:top-(--lift-y) data-held:m-0 data-held:border-0 data-held:bg-transparent data-held:text-inherit data-held:overflow-visible data-held:pointer-events-none data-held:w-(--held-w) data-held:h-(--held-h)",
  drop: "pointer-events-none p-1 [grid-column:var(--lane)/span_var(--span)] [grid-row:var(--row)/span_var(--rows)]",
  fit: "self-start min-w-0",
} as const;
