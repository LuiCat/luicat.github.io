---
layout: index
---

# My Posts

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a> - {{ post.date | date: ' %b %d, %Y'}}
    </li>
  {% endfor %}
</ul>

# Useful Links

- [Markdown Syntax Reference](syntax-ref)
- [Mathematic Symbols in Markdown](http://csrgxtu.github.io/2015/03/20/Writing-Mathematic-Fomulars-in-Markdown/)

