---
layout: index
---

# My Posts

<ul>
  {% for post in site.posts %}
    <li>
      {% if post.course %}
      <span class="post_course">{{ post.course }}</span>
      {% endif %}
      <span class="post_title"><a href="{{ post.url }}">{{ post.title }}</a> - {{ post.date | date: ' %b %d, %Y'}}</span>
    </li>
  {% endfor %}
</ul>

# Useful Links

- [Markdown Syntax Reference](syntax-ref)
- [Mathematic Symbols in Markdown](http://csrgxtu.github.io/2015/03/20/Writing-Mathematic-Fomulars-in-Markdown/)
