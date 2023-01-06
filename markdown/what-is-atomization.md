# Intro to CSS Atomization

## What is Atomization?

CSS Atomization is an optimization technique where you take in any CSS stylesheet:

```css
.headline {
  padding: 1rem;
  margin: 2rem;
  font-size: 2em;
}
.side-nav {
  padding: 1rem;
  margin: 2rem;
}
```

Examine each CSS rule in the style sheet:

```css
.headline {
  padding: 1rem;
  margin: 2rem;
  font-size: 2em;
}
```

Then create new atomized classes based on the property/value pairs:

```css
.padding-1rem { padding: 1rem }
.margin-2rem { margin: 2rem }
.font-size-2em { font-size: 2em }
```

And associate the original class names to the new atomized classes:

```js
{
  'headline': 'padding-1rem margin-2rem font-size-2em',
  'side-nav': 'padding-1rem margin-2rem'
}
```

This map of classes is then used to update any markup you have, so this:

```html
<h1 class="headline">Example</h1>
<nav class="side-nav">Example</nav>
```

automatically becomes this:

```html
<h1 class="padding-1rem margin-2rem font-size-2em">Example</h1>
<nav class="padding-1rem margin-2rem">Example</nav>
```

Because this is a build step, and the output doesn't need to be human readable, this process can even automatically shrink the class names for you.

```css
.a { padding: 1rem }
.b { margin: 2rem }
.c { font-size: 2em }
```
```js
{
  'headline': 'a b c',
  'side-nav': 'a b'
}
```
```html
<h1 class="a b c">Example</h1>
<nav class="a b">Example</nav>
```

And the generated classmap can be used in your JavaScript.

**Vue.js example:**

```html
<h1 :class="s.headline">Example</h1>
<nav :class="s['side-nav']">Example</nav>
```

**Svelte example:**

```html
<script>
import s from '../classMap.js';
</script>

<h1 class={s.headline}>Example</h1>
<nav class={s['side-nav']}>Example</nav>
```

**JSX example:**

```jsx
import s from '../classMap.js';
export function AnExample () {
  return (
    <div>
      <h1 className={s.headline}>Example</h1>
      <nav className={s['side-nav']}>Example</nav>
    </div>
  );
};
```


## Why should you automatically atomize your CSS?

During the atomization process, we are essentially looking for patterns and reducing repetition. The end result is that you send much less code. It is all highly dependent on the codebase, but most save around 60%-80%. If you are already pre-atomizing your code, with a tool like Tailwind, then expect to see savings closer to 10-20%. Red Perfume will always do a better job of atomizing your code than if you try to do it by hand, so you can feel free to write your code in any style you want, with any framework, and with any tooling.

Most major tech websites (Google, Twitter, Facebook) will emplore some form of automated CSS atomization. When converting the Facebook.com homepage to use automated CSS atomization, they found it [reduced their homepage CSS by **80%**](https://engineering.fb.com/web/facebook-redesign).


## If the big tech companies are doing it, why isn't everyone else?

It's because, before Red-Perfume, there was no easy way to do CSS atomization. It was possible, but only by combining dozens of libraries that weren't designed to interconnect specifically to solve this problem. So you had a lot of "glue" you had to manage, and ultimately needed a deeper knowledge of what kinds of CSS you could and couldn't write, as not everything would work with these systems.

Red-Perfume is different. It's goal is to simplify this process so that anyone can easily add atomization to their projects. As part of this approach, the entire atomization process is handled by this library, so that all features are added and all bugs are fixed in one place, resulting in a more optimized tool. The API is designed to be super easy, but fully extendible for any pipeline. And our goal is to handle any arbitrary CSS file.

Currently Red-Perfume is a work in progress, so simple CSS works fine, but more advanced CSS isn't support yet. But we're working hard to support all of the CSS spec.
