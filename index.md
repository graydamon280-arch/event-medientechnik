---
title: Startseite
---

# Event- & Medientechnik

Checklisten und Ablaufhilfen für alle Einsätze – zum Ausdrucken oder direkt
am Handy während des Aufbaus.

**Neue Veranstaltung planen?** Der [Konfigurator]({{ '/konfigurator/' | relative_url }})
fragt ab, was gebraucht wird, und erstellt daraus eine passend gefilterte
Checkliste – statt immer alle Punkte auf einmal zu zeigen.

<div class="module-grid">
{% for g in site.data.gebiete %}
  {% assign count = site.data.checkliste.items | where_exp: "item", "item.module contains g.slug" | size %}
  <a class="module-card" style="--card-accent: {{ g.color }};" href="{{ '/gebiete/' | append: g.slug | append: '/' | relative_url }}">
    <span class="module-card__label">{{ g.title }}</span>
    <span class="module-card__count">{{ count }} Punkte</span>
    <span class="module-card__hint">{{ g.kurz }}</span>
  </a>
{% endfor %}
</div>
