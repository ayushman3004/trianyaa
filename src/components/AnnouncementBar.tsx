// src/components/AnnouncementBar.tsx
export default function AnnouncementBar() {
  const items = [
    ' Free Shipping on orders above ₹499',
    'Use code TRIANYAA10 for 10% off your first order ',
    ' 100% Handcrafted with Love',
    
  ];

  return (
    <div className="announcement-bar-wrapper" role="region" aria-label="Announcement Bar">
      <div className="announcement-bar-track">
        {[...items, ...items].map((text, idx) => (
          <div key={idx} className="announcement-item">
            <span>{text}</span>
            <span className="divider">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
