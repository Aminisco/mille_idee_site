import { PROJECTS, findProject, formatProjectDate } from './projects';

describe('projects data', () => {
  it('formats month-only and full dates', () => {
    expect(formatProjectDate('2026-06-01')).toBe('Juin 2026');
    expect(formatProjectDate('2025-12-24')).toBe('24 décembre 2025');
  });

  it('keeps the seven projects of the site, with unique slugs', () => {
    const slugs = PROJECTS.map(p => p.slug);
    expect(slugs.length).toBe(7);
    expect(new Set(slugs).size).toBe(7);
  });

  it('throws on an unknown slug', () => {
    expect(findProject('boxe').title).toBe('Atelier boxe anglaise');
    expect(() => findProject('inconnu')).toThrowError(/inconnu/);
  });

  it('points every photo and drawing to a file that is actually served', async () => {
    const paths = PROJECTS.flatMap(p => [p.doodle, ...(p.photo ? [p.photo.src] : [])]);
    const statuses = await Promise.all(paths.map(async path => [path, (await fetch('/' + path)).status] as const));
    expect(statuses.filter(([, status]) => status !== 200)).toEqual([]);
  });
});
