export function TrustBadges() {
  const badges = [
    { icon: '🔒', label: '256-bit Encryption' },
    { icon: '✓', label: 'RBI Compliant' },
    { icon: '🛡️', label: 'Data Privacy' },
  ];

  return (
    <div className="flex items-center justify-center gap-6 mt-8 py-4">
      {badges.map((badge) => (
        <div key={badge.label} className="flex items-center gap-2 text-caption text-brand-muted">
          <span aria-hidden="true">{badge.icon}</span>
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
