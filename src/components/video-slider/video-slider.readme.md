# Video Slider Component

## Description

`video-slider` is a canvas-based animated image slider that supports multiple transition effects between slides.

The component loads configuration and images from GudHub data and automatically starts the animation loop after initialization.

---

# Data Structure

The component expects the following JSON structure:

```json
{
  "video-slider": {
    "animation": "fade",
    "slideDuration": "100",
    "transitionDuration": "2000",
    "images": [
      "https://app.gudhub.com/userdata/12345/image1.jpg",
      "https://app.gudhub.com/userdata/12354/image2.jpg",
      "https://app.gudhub.com/userdata/11345/image3.jpg"
    ]
  }
}
```

## Configuration Parameters

| Property           | Type          | Required | Description                                            |
| ------------------ | ------------- | -------- | ------------------------------------------------------ |
| animation          | string        | Yes      | Animation type used between slides                     |
| slideDuration      | string/number | Yes      | Duration of static slide display in milliseconds       |
| transitionDuration | string/number | Yes      | Duration of slide transition animation in milliseconds |
| images             | array         | Yes      | Ordered list of image URLs                             |

---

## Supported Animations

The following animation values are supported:

```text
wipeLeft
fade
zoom
multiStrip
cascadeStrips
sectors
```

Example:

```json
{
  "animation": "zoom"
}
```

---

## Slide Duration

Defines how long a slide remains visible before transition starts.

Example:

```json
{
  "slideDuration": "3000"
}
```

Result:

```text
3 seconds display
+
transition animation
```

---

## Transition Duration

Defines how long the transition animation lasts.

Example:

```json
{
  "transitionDuration": "1500"
}
```

Result:

```text
1.5 second transition
```

---

## Images

Images must be provided as an ordered array of URLs.

The component displays images in the exact order they appear in the array.

Example:

```json
{
  "images": [
    "image-1.jpg",
    "image-2.jpg",
    "image-3.jpg"
  ]
}
```

Display order:

```text
image-1
↓
image-2
↓
image-3
↓
image-1
(repeat)
```

---

# Usage

## Static Pages

For static pages only `data-gh-id` is required.

```html
<video-slider
    data-gh-id="video-slider"
></video-slider>
```

---

## Dynamic Pages

For dynamic pages an additional `data-chapter` attribute must be specified.

```html
<video-slider
    data-gh-id="video-slider"
    data-chapter="areas"
></video-slider>
```

### data-chapter

Defines the chapter from which GudHub should load dynamic page data.

Example:

```html
data-chapter="areas"
```

---

# Required Attributes

| Attribute    | Required           | Description                                |
| ------------ | ------------------ | ------------------------------------------ |
| data-gh-id   | Yes                | GudHub component identifier                |
| data-chapter | Dynamic pages only | Chapter used to retrieve current item data |

---

# Example

```html
<video-slider
    data-gh-id="video-slider"
    data-chapter="areas"
></video-slider>
```

```json
{
  "video-slider": {
    "animation": "fade",
    "slideDuration": "3000",
    "transitionDuration": "1500",
    "images": [
      "https://example.com/slide-1.jpg",
      "https://example.com/slide-2.jpg",
      "https://example.com/slide-3.jpg"
    ]
  }
}
```

---

# Notes

* All images should be publicly accessible URLs.
* Images are preloaded before animation starts.
* The slider automatically loops through all images.
* Images are displayed using a cover-fit algorithm similar to CSS `object-fit: cover`.
* Animation starts automatically after component initialization.
* If an invalid animation name is provided, no transition animation will be rendered.
