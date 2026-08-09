// src/components/PaletteStrip.tsx
const swatches = [
  { name: 'Warm Oat',    hex: '#F5EFE6' },
  { name: 'Blush',       hex: '#EFC5B5' },
  { name: 'Terracotta',  hex: '#C4624A' },
  { name: 'Sage',        hex: '#7B9E87' },
  { name: 'Charcoal',    hex: '#2C2C2C' },
];

export default function PaletteStrip() {
  return (
    <section className="palette-strip">
      <p className="palette-title serif">
        Our Signature Palette — colors inspired by nature, made to mix and match.
      </p>
      <div className="palette-swatches">
        {swatches.map((s) => (
          <div key={s.name} className="palette-swatch">
            <div
              className="swatch-circle"
              style={{ background: s.hex }}
              title={s.hex}
            />
            <span className="swatch-name">{s.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
