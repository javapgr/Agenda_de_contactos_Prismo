function Icon({ children, className = 'h-[18px] w-[18px]' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function IconHome(props) {
  return (
    <Icon {...props}>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </Icon>
  );
}

export function IconContacts(props) {
  return (
    <Icon {...props}>
      <path d="M8 6h11a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
      <path d="M6 4h10" />
      <path d="M4 2h10" />
    </Icon>
  );
}

export function IconGrid(props) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </Icon>
  );
}

export function IconPuzzle(props) {
  return (
    <Icon {...props}>
      <path d="M12 2v3a2 2 0 104 0V2h3v6h-2a2 2 0 100 4h2v6h-6v-2a2 2 0 10-4 0v2H3v-6h2a2 2 0 100-4H3V2h9z" />
    </Icon>
  );
}

export function IconClock(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </Icon>
  );
}

export function IconStar(props) {
  return (
    <Icon {...props}>
      <path d="M12 3l2.7 5.5 6 .9-4.4 4.2 1 6-5.3-2.8L6.7 19.6l1-6L3.3 9.4l6-.9L12 3z" />
    </Icon>
  );
}

export function IconFolder(props) {
  return (
    <Icon {...props}>
      <path d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </Icon>
  );
}

export function IconTrash(props) {
  return (
    <Icon {...props}>
      <path d="M4 7h16" />
      <path d="M9 7V5h6v2" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M10 11v6M14 11v6" />
    </Icon>
  );
}

export function IconShare(props) {
  return (
    <Icon {...props}>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.5 13.2l7 3.8M15.5 6.8l-7 3.8" />
    </Icon>
  );
}

export function IconSearch(props) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16.5 16.5L21 21" />
    </Icon>
  );
}

export function IconMenu(props) {
  return (
    <Icon {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Icon>
  );
}

export function IconChevron(props) {
  return (
    <Icon {...props}>
      <path d="M9 6l6 6-6 6" />
    </Icon>
  );
}

export function IconList(props) {
  return (
    <Icon {...props}>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
    </Icon>
  );
}

export function IconDownload(props) {
  return (
    <Icon {...props}>
      <path d="M12 4v12" />
      <path d="M7 11l5 5 5-5" />
      <path d="M5 20h14" />
    </Icon>
  );
}

export function IconUpload(props) {
  return (
    <Icon {...props}>
      <path d="M12 20V8" />
      <path d="M7 13l5-5 5 5" />
      <path d="M5 4h14" />
    </Icon>
  );
}

export function IconStats(props) {
  return (
    <Icon {...props}>
      <path d="M4 20h16" />
      <path d="M7 16V9" />
      <path d="M12 16V5" />
      <path d="M17 16v-5" />
    </Icon>
  );
}
