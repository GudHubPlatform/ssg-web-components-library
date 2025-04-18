# Work types

We have two different ways to use this component:

1. Automatically: pass `data-src` and `data-url` attributes – the image will be fetched, saved, and loaded automatically (SSR supported).
2. Manually: use `src` to provide a static image path.

**Manually example:**
```html
<image-component
    src="/assets/example.jpg"
    alt="{Image alt here}"
    title="{Image title here}"
    lazyload
    width="400"
    height="300"
></image-component>
```

**Automatically example:**
```html
<image-component
    data-src="/assets/cache/example.jpg"
    data-url="https://example.com/image.jpg"
    alt="{Image alt here}"
    title="{Image title here}"
    data-rerender
    lazyload
></image-component>
```

---

# Attributes:

| **Attribute**    | **Description**                                                        | **Type / Example**                                          |
| ---------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------- |
| `src`            | Path to static image                                                   | `string`<br>`/assets/image.jpg`                             |
| `alt`            | Alternative text for the image                                         | `string`<br>`"Description of image"`                        |
| `title`          | Image title (shown as tooltip)                                         | `string`<br>`"My Image Title"`                              |
| `lazyload`       | Enables native browser lazy loading (`loading="lazy"`)                 | `boolean` (just include the attribute)                      |
| `data-src`       | Local path to save image fetched from `data-url`                       | `string`<br>`/assets/blog/top-web-development-books.jpg`    |
| `data-url`       | Remote image URL                                                       | `string`<br>`https://gudhub.com/userdata/29883/1083204.jpg` |
| `data-rerender`  | Enables client-side rerendering after SSR *(currently not working❗❗❗)* | `boolean` (just include the attribute)                      |
| `width`          | Image width *(currently not working❗❗❗)*                               | `string`<br>`"300"`                                         |
| `height`         | Image height *(currently not working❗❗❗)*                              | `string`<br>`"200"`                                         |
| `data-max-width` | Optional maximum width configuration                                   | `string`<br>`"800px"`                                       |
| `data-crop`      | Optional crop configuration                                            | `string`<br>`"center"`                                      |

---

# Image processing behavior:

If you're using `data-url` + `data-src`, the image will be downloaded and processed using these rules:

1. If **`data-crop` = `1200x1200`**  
   → Image will be cropped to exactly `1200x1200` pixels (centered crop).

2. If only **`data-max-width` = `1200`**  
   → Image will be resized proportionally to width `1200px`.

3. If **no `data-crop` or `data-max-width`** is provided  
   → Image will be scaled by width to `1920px` by default (preserving aspect ratio).

---

# Component data-flow:

("?" means "unnecessary")

```config file
{
    src?: "string",
    alt?: "string",
    title?: "string",
    lazyload?: boolean,
    data-src?: "string",
    data-url?: "string",
    data-rerender?: boolean,
    width?: "number|string",
    height?: "number|string",
    data-max-width?: "string",
    data-crop?: "string"
}
```
