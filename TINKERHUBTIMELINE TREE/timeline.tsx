import type { CSSProperties } from 'react';

type TimelineItem = {
  title: string;
  date: string;
  description: string;
  tag?: string;
};

type TimelineProps = {
  title?: string;
  subtitle?: string;
  items?: TimelineItem[];
};

const defaultItems: TimelineItem[] = [
  {
    title: 'Founding Spark',
    date: '2022',
    tag: 'Launch',
    description:
      'A small group of curious students came together to build a welcoming space for creativity, coding, and hands-on making.',
  },
  {
    title: 'First Build Sprint',
    date: '2023',
    tag: 'Community',
    description:
      'The first set of workshops and collaborative projects helped members turn ideas into working prototypes.',
  },
  {
    title: 'Growing the Network',
    date: '2024',
    tag: 'Growth',
    description:
      'More mentors, events, and student-led initiatives joined the movement, strengthening the ecosystem around innovation.',
  },
  {
    title: 'Shaping the Future',
    date: '2025',
    tag: 'Impact',
    description:
      'Tinkerhub continues to inspire learners to experiment boldly, build confidently, and share knowledge with others.',
  },
];

const styles: Record<string, CSSProperties> = {
  section: {
    minHeight: '100vh',
    padding: '64px 24px',
    background: 'linear-gradient(135deg, #07111f 0%, #11233d 100%)',
    color: '#f5f7fb',
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  container: {
    maxWidth: '960px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '40px',
    textAlign: 'center',
  },
  eyebrow: {
    display: 'inline-block',
    marginBottom: '10px',
    padding: '6px 12px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.12)',
    color: '#7dd3fc',
    fontSize: '0.85rem',
    fontWeight: 700,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
  },
  title: {
    margin: '0 0 10px',
    fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
    lineHeight: 1.2,
  },
  subtitle: {
    margin: 0,
    fontSize: '1rem',
    color: '#cbd5e1',
    lineHeight: 1.7,
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  row: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  markerColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '8px',
  },
  dot: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    background: '#38bdf8',
    boxShadow: '0 0 0 6px rgba(56, 189, 248, 0.18)',
    flexShrink: 0,
  },
  line: {
    width: '2px',
    flex: 1,
    marginTop: '6px',
    background: 'linear-gradient(180deg, #38bdf8 0%, rgba(56, 189, 248, 0.2) 100%)',
  },
  card: {
    flex: 1,
    padding: '20px 22px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 10px 30px rgba(2, 8, 23, 0.22)',
    backdropFilter: 'blur(10px)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px',
    flexWrap: 'wrap',
  },
  tag: {
    padding: '4px 10px',
    borderRadius: '999px',
    background: 'rgba(125, 211, 252, 0.16)',
    color: '#bae6fd',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
  },
  date: {
    color: '#94a3b8',
    fontSize: '0.95rem',
    fontWeight: 600,
  },
  cardTitle: {
    margin: '0 0 8px',
    fontSize: '1.12rem',
  },
  description: {
    margin: 0,
    color: '#e2e8f0',
    lineHeight: 1.7,
    fontSize: '0.95rem',
  },
};

export default function Timeline({
  title = 'Tinkerhub Timeline',
  subtitle = 'A glimpse of how the community has grown over time.',
  items = defaultItems,
}: TimelineProps) {
  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.eyebrow}>Community Story</span>
          <h2 style={styles.title}>{title}</h2>
          <p style={styles.subtitle}>{subtitle}</p>
        </div>

        <div style={styles.timeline}>
          {items.map((item, index) => (
            <div key={`${item.title}-${item.date}`} style={styles.row}>
              <div style={styles.markerColumn}>
                <div style={styles.dot} />
                {index < items.length - 1 ? <div style={styles.line} /> : null}
              </div>

              <article style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.tag}>{item.tag ?? 'Milestone'}</span>
                  <span style={styles.date}>{item.date}</span>
                </div>
                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.description}>{item.description}</p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
