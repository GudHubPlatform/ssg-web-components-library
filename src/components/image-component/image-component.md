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
    data-max-width="1200"
    data-crop
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
    data-max-width="1200"
    data-crop
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
| `width`          | Image width                                                            | `string`<br>`"300"`                                         |
| `height`         | Image height                                                           | `string`<br>`"200"`                                         |
| `data-max-width` | Optional maximum width configuration                                   | `number`<br>`"600"`                                         |
| `data-crop`      | Optional crop configuration                                            | `boolean` (just include the attribute)                      |

---

# Image processing behavior:

#### 1. `data-crop`  
If the `data-crop` attribute is present:
- The image is **cropped** to fit exactly the target resolutions (`600w`, `1200w`, and original).
- Cropping uses a `cover` strategy — the image fills the space and is centered.

✅ **Combination with `data-max-width`:**  
If `data-max-width` is also set (e.g., `data-max-width="600"`), **only** the responsive sizes **up to that max width** will be cropped.  
If `data-max-width` is **not** set, **all** predefined sizes (`600w`, `1200w`, original) will be cropped.

#### 2. `data-max-width="600"`  
If the `data-max-width` attribute is set:
- The image is **resized proportionally** to the specified width (e.g., `600px`).
- Aspect ratio is preserved, and no cropping is applied (unless combined with `data-crop`, see above).

#### 3. No Attributes  
If neither `data-crop` nor `data-max-width` is set:
- The image is **resized proportionally** to a **default width of `1920px`**, maintaining the original aspect ratio.

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
    data-max-width?: number,
    data-crop?: boolean
}
```
