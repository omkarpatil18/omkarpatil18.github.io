---
layout: page
permalink: /publications/
title: publications
description: I am primarily interested in compositional robot learning. I believe composing modalities will play an important role in developing generalist robots as paired scaling of all sensory data is difficult, and we will need efficient ways to compose information obtained through different modalities. Also related is policy improvement, where I try to develop methods that improve the performance of a pre-trained policy using new sources of information. Prior to joining the PhD program at Arizona State, I worked on NLP research at Wells Fargo.
nav: true
nav_order: 2
---

<!-- _pages/publications.md -->

<!-- Bibsearch Feature -->

<!-- {% include bib_search.liquid %} -->

<div class="publications">

<div class="topic-filter" role="group" aria-label="Filter publications by topic">
  {%- for topic in site.data.topics -%}
    <button
      type="button"
      class="topic-toggle"
      data-topic="{{ topic[0] }}"
      aria-pressed="false"
      style="--topic-color: {{ topic[1].color }}"
    >
      {{ topic[1].name }}
    </button>
  {%- endfor -%}
  <button type="button" class="topic-clear" aria-label="Show all publications">Clear</button>
</div>

{% bibliography %}

</div>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const filter = document.querySelector(".topic-filter");
    if (!filter) return;

    const toggles = filter.querySelectorAll(".topic-toggle");
    const clear = filter.querySelector(".topic-clear");
    const entries = document.querySelectorAll(".publications ol.bibliography > li");
    const selected = new Set();

    function apply() {
      entries.forEach(function (entry) {
        const row = entry.querySelector("[data-topics]");
        const topics = row ? row.dataset.topics.split(/\s+/).filter(Boolean) : [];
        const visible = selected.size === 0 || topics.some((t) => selected.has(t));
        entry.style.display = visible ? "" : "none";
      });
      clear.style.display = selected.size === 0 ? "none" : "";
    }

    toggles.forEach(function (button) {
      button.addEventListener("click", function () {
        const topic = button.dataset.topic;
        const active = selected.has(topic);
        if (active) {
          selected.delete(topic);
        } else {
          selected.add(topic);
        }
        button.classList.toggle("active", !active);
        button.setAttribute("aria-pressed", String(!active));
        apply();
      });
    });

    clear.addEventListener("click", function () {
      selected.clear();
      toggles.forEach(function (button) {
        button.classList.remove("active");
        button.setAttribute("aria-pressed", "false");
      });
      apply();
    });

    apply();
  });
</script>
