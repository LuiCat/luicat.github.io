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

- [Syntax Reference for MD](syntax-ref)

