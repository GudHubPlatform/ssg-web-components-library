# How it works
In GudHub you need to create gh-element - "Code Editor" in page item in any chapter (pages, blog, landings etc.).
Find ```field_id``` of "Code Editor" and update ```chapters.mjs``` - add property ```html_template_field_id```

## chapter.mjs example
```
landings: {
    app_id: 33333,
    slug_field_id: 888888,
    title_field_id: 888888,
    description_field_id: 888888,
    html_template_field_id: 888888
}
```