---
sitemap: true
layout: page
permalink: /teaching/
title: teaching
description: Contributions to education at KU Leuven
nav: true
nav_order: 5
teaching_yml: ../_data/teaching.yml
---

<!-- _pages/teaching.md -->

## Theses
{% if site.data.teaching.theses %}
<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for thesis in site.data.teaching.theses %}
    <br> {{thesis}} <br/>
  {% endfor %}
</div>
{% endif %}

---

## Teaching assistent

{% if site.data.teaching.TA %}
<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for course in site.data.teaching.TA %}
    <br> {{course}} <br/>
  {% endfor %}
</div>
{% endif %}



