// src/components/Testimonials.tsx
const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    quote:
      "I ordered the Standard kit and honestly fell in love with every single element. The yarn quality is incredible and the packaging felt like opening a gift. TRIANYAA is my go-to brand for crochet!",
    stars: 5,
    emoji: '👩🏽',
  },
  {
    id: 2,
    name: 'Ananya Krishnan',
    location: 'Bangalore',
    quote:
      "The keychains I ordered were ADORABLE. I gave them as bridesmaid gifts and everyone was obsessed. Already planning my next order — the Premium kit is calling my name!",
    stars: 5,
    emoji: '👧🏻',
  },
  {
    id: 3,
    name: 'Meera Joshi',
    location: 'Delhi',
    quote:
      "As a beginner, the Basic kit was perfect. The pattern guide was easy to follow and the yarn is so soft. The 'keep creating' card that came with it genuinely made my day ✨",
    stars: 5,
    emoji: '👩🏼',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="testimonial-stars">
      {'★'.repeat(count)}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="section-header">
        <div className="section-eyebrow">Made with Love, Received with Joy</div>
        <h2 className="section-title serif">What Our Crafters Say</h2>
      </div>
      <div className="testimonials-grid">
        {testimonials.map((t) => (
          <div key={t.id} className="testimonial-card">
            <div className="testimonial-avatar">
              <span role="img" aria-label={t.name}>{t.emoji}</span>
            </div>
            <StarRating count={t.stars} />
            <p className="testimonial-quote serif">"{t.quote}"</p>
            <div className="testimonial-author">{t.name}</div>
            <div className="testimonial-location">{t.location}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
