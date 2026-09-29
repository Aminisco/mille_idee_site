import { Component, computed, signal } from '@angular/core';
import { PROJECTS, ProjectTag, TAG_LABELS, formatProjectDate } from '../../data/projects';

type FilterKey = ProjectTag | 'all';

const FILTER_KEYS: FilterKey[] = ['all', 'maraude', 'citoyen', 'sport', 'financement'];

// Petits objets de la frise, posés à côté du premier projet de leur thème pour aérer la liste
const DECOR_BY_TAG: Partial<Record<ProjectTag, string>> = {
  sport: 'illustrations/obj_ball.svg',
  citoyen: 'illustrations/obj_leaf.svg',
};

@Component({
  selector: 'app-projects',
  templateUrl: './projets.html',
  styleUrl: './projets.scss',
})
export class ProjectsComponent {
  protected readonly tagLabels = TAG_LABELS;
  protected readonly formatDate = formatProjectDate;

  private readonly today = new Date().toISOString().slice(0, 10);
  private readonly projects = [...PROJECTS].sort((a, b) => b.date.localeCompare(a.date));

  readonly activeFilter = signal<FilterKey>('all');

  readonly filters = FILTER_KEYS.map(key => ({
    key,
    label: key === 'all' ? 'Tous' : TAG_LABELS[key],
    count: key === 'all' ? this.projects.length : this.projects.filter(p => p.tag === key).length,
  }));

  readonly filteredProjects = computed(() => {
    const filter = this.activeFilter();
    return filter === 'all' ? this.projects : this.projects.filter(p => p.tag === filter);
  });

  readonly decorBySlug = computed(() => {
    const decor = new Map<string, string>();
    for (const project of this.filteredProjects()) {
      const src = DECOR_BY_TAG[project.tag];
      if (src && ![...decor.values()].includes(src)) decor.set(project.slug, src);
    }
    return decor;
  });

  isUpcoming(date: string): boolean {
    return date > this.today;
  }

  setFilter(key: FilterKey): void {
    this.activeFilter.set(key);
  }
}
