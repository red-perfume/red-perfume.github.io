## `red-perfume-task-runner`

**Subject to change before v1.0.0**


### Task Runner Example

You can point to files or pass strings in directly. Tasks are sequential, the output of one can feed into the input of the next. You can output to file or use lifecycle callback hooks (documented in next section).

```js
const redPerfume = require('red-perfume');

redPerfume.atomize({
  tasks: [
    {
      uglify: false,
      styles: {
        in: [
          './styles/file.css',
          './styles/style.css'
        ],
        // The two above files will be concatenated and atomized then output to this file
        out: './dist/styles/styles.css'
      },
      // The output markup will be a copy of the input but modified to have the class names
      // replaced to match the new atomized styles in this task
      markup: [
        {
          in: './index.html',
          out: './dist/index.html'
        },
        {
          in: './contact.html',
          out: './dist/contact.html'
        }
      ],
      scripts: {
        // Design of this JSON file will change before v1.0.0.
        // The point is to allow your JavaScript to reference a map of the original class
        // name (key) and the atomized classes produced from it (value)
        out: './dist/atomic-styles.json'
      }
    },
    {
      uglify: true,
      styles: {
        // You can provide a string directly instead of (or in addition to) using input files
        data: '.example { padding: 10px; margin: 10px; }',
        // There are many lifecycle hooks that can be used as callbacks at specific points
        // in execution. Useful for 3rd party plugins. Fully documented below.
        hooks: {
          afterOutput: function (options, { task, inputCss, atomizedCss, classMap, styleErrors }) {
            console.log({ options, task, inputCss, atomizedCss, classMap, styleErrors });
          }
        }
      },
      markup: [
        {
          data: '<!DOCTYPE html><html><body><div class="example"></div></body></html>',
          hooks: {
            afterOutput: function (options, { task, subTask, classMap, inputHtml, atomizedHtml, markupErrors }) {
              console.log({ options, task, subTask, classMap, inputHtml, atomizedHtml, markupErrors });
            }
          }
        }
      ],
      scripts: {
        hooks: {
          afterOutput: function (options, { task, classMap, scriptErrors }) {
            console.log({ options, task, classMap, scriptErrors });
          }
        }
      }
    }
  ]
});
```


### API Implementation Status

**Status:** ALPHA

The documented API is fully implemented and tested. Though there are many edge cases that have not been covered yet (see: [project board](https://github.com/orgs/red-perfume/projects/2)), and some **features** not yet implemented (also: [project board](https://github.com/orgs/red-perfume/projects/2)).


### Task Runner API Documentation

Top level/global settings.

```js
redPerfume.atomize({ verbose, customLogger, tasks, hooks });
```

Key             | Type     | Allowed          | Default         | Description
:--             | :--      | :--              | :--             | :--
`verbose`       | Boolean  | `true`, `false`  | `true`          | If true, consoles out helpful warnings and errors using `customLogger` or `console.error`.
`customLogger`  | Function | Any function     | `console.error` | **Advanced** - You can pass in your own custom function to log errors/warnings to. When called the function will receive a `message` string for the first argument and sometimes an `error` object for the second argument. This can be useful in scenarios like adding in custom wrappers or colors in a command line/terminal. This function may be called multiple times before all tasks complete. Only called if `verbose` is true. If not provided and `verbose` is true, normal `console.error` messages are called.
`tasks`         | Array    | Array of objects | `undefined`     | An array of task objects. Each represents the settings for an atomization task to be performed.
`hooks`         | Object   | Array of methods | `{}`            | Lifecycle callback hooks (documented in next section)


**Tasks API:**

Tasks are an array of objects with the following API.

```js
redPerfume.atomize({ tasks: [{ uglify, styles, markup, scripts, hooks }] });
```

Key       | Type    | Default     | Description
:--       | :--     | :--         | :--
`uglify`  | Boolean | `false`     | If `false` the atomized classes, and all references to them, are long (`.rp__padding__--COLOR12px`). If `true` they are short (`.rp__b5p`).
`styles`  | Object  | `undefined` | CSS settings. API below
`markup`  | Array   | `undefined` | HTML settings. An array of objects with their API defined below
`scripts` | Object  | `undefined` | JS settings. API below
`hooks`   | Object  | `{}`        | Lifecycle callback hooks (documented in next section)


**Styles Task API:**

```js
redPerfume.atomize({ tasks: [{ styles: { in, data, out, hooks } }] });
```

Key       | Type    | Default     | Description
:--       | :--     | :--         | :--
`in`      | Array   | `undefined` | An array of strings to valid paths for CSS files. All files will remain untouched. A new atomized string is produced for `out` and/or hooks.
`data`    | String  | `undefined` | A string of CSS to be atomized. Files provived via `in` are concatenated with `data` at the end, then atomized and sent to `out` and/or hooks.
`out`     | String  | `undefined` | A string file path output. If file exists it will be overwritten with the atomized styles from `in` and/or `data`
`hooks`   | Object  | `{}`        | Lifecycle callback hooks (documented in next section)


**Markup Task API:**

```js
redPerfume.atomize({ tasks: [{ markup: [{ in, data, out, hooks }] }] });
```

Key       | Type    | Default     | Description
:--       | :--     | :--         | :--
`in`      | String  | `undefined` | Path to an HTML file to be processed.
`data`    | String  | `undefined` | A string of markup to be processed. This is appended to the end of the `in` file contents if both are provided.
`out`     | String  | `undefined` | Path where the modified version of the `in` file and/or `data` will be stored. If file already exists, it will be overwritten.
`hooks`   | Object  | `{}`        | Lifecycle callback hooks (documented in next section)


**Scripts Task API:**

```js
redPerfume.atomize({ tasks: [{ scripts: { out, hooks } }] });
```

Key       | Type    | Default     | Description
:--       | :--     | :--         | :--
`out`     | String  | `undefined` | Path where a JSON object (`classMap`) will be stored. The object contains keys (selectors) and values (array of strings of atomized class names). If file already exists, it will be overwritten. Output subject to change before v1.0.0.
`hooks`   | Object  | `{}`        | Lifecycle callback hooks (documented in next section)


### Lifecycle Callback Hooks Example

All the hooks are shown below. **Most users will only use the `afterOutput` hooks as a simple callback to know when something has finished**. Perhaps to pass along the atomized string to another plugin (to minify, or generate a report or something). These hooks are primarily for those writing 3rd party plugins. Or for existing 3rd party libraries to add documentation to their repo on how to combine them with Red Perfume.

```js
redPerfume.atomize({
  hooks: {
    beforeValidation: function (options) {},
    afterValidation: function (options) {},
    beforeTasks: function (options) {},
    afterTasks: function (options, [{
      task,
      inputCss,
      atomizedCss,
      classMap,
      allInputMarkup,
      allAtomizedMarkup,
      styleErrors,
      markupErrors,
      scriptErrors
    }]) {}
  },
  tasks: [
    {
      hooks: {
        beforeTask: function (options, { task }) {},
        afterTask: function (options, {
          task,
          inputCss,
          atomizedCss,
          classMap,
          allInputMarkup,
          allAtomizedMarkup,
          styleErrors,
          markupErrors,
          scriptErrors
        }) {}
      },
      styles: {
        hooks: {
          beforeRead:     function (options, { task }) {},
          afterRead:      function (options, { task, inputCss, styleErrors }) {},
          afterProcessed: function (options, { task, inputCss, styleErrors, atomizedCss, classMap }) {},
          afterOutput:    function (options, { task, inputCss, styleErrors, atomizedCss, classMap }) {}
        }
      },
      markup: [
        {
          hooks: {
            beforeRead:     function (options, { task, subTask, classMap }) {},
            afterRead:      function (options, { task, subTask, classMap, inputHtml, markupErrors }) {},
            afterProcessed: function (options, { task, subTask, classMap, inputHtml, markupErrors, atomizedHtml }) {},
            afterOutput:    function (options, { task, subTask, classMap, inputHtml, markupErrors, atomizedHtml }) {}
          }
        }
      ],
      scripts: {
        hooks: {
          beforeOutput: function (options, { task, classMap }) {},
          afterOutput:  function (options, { task, classMap, scriptErrors }) {}
        }
      }
    }
  ]
});
```

**Hook descriptions:**

These are always called and in the same order. For example, `afterOutput` will still be called even if the `out` setting was `undefined`, the output is skipped but the hook is still called if provided.

* Global hooks:
  * `beforeValidation` - Before the options object is validated and defaulted. The first thing ran before anything else. If a third party tool wants to modify your options object, doing that here first would ensure their modifications pass Red Perfume's internal API validators.
  * `afterValidation` - Right after the options are validated, they will be in this state for the rest of all the hooks, unless altered by you or a 3rd party in another hook.
  * `beforeTasks` - Right before we start processing the tasks array
  * `afterTasks` - After the last task has been processed. This is the final hook called. Nothing else happens after this. Includes an array where each object is the resulting data from a task.
* Task hooks
  * `beforeTask` - Ran right before a task starts.
  * `afterTask` - Ran right after a task finishes.
* Styles/Markup hooks:
  * `beforeRead` - Right before we get the string of text from files and/or `data`.
  * `afterRead` - Right after we get the string of text from files and/or `data`. Also right before we atomize the string.
  * `afterProcessed` - Right after the string has been atomized. Right before we output it to file if `out` is provided.
* Scripts hooks
  * `beforeOutput` - Right before we write the JSON to disk if `out` is provided.
* Styles/Markup/Scripts hook
  * `afterOutput` - Right after the file has been written to disk if `out` is provided.

**Hook argument definitions:**

The arguments defined here will always be the same, in every hook, with the excpection that `options` will be mutated during validation. However, due to the nature of JavaScript object referencing, it is very possible for 3rd party plugins you use to mutate these object values. This is intentional and allowed. Though we would encourage 3rd party libraries to just add their settings to the `options` object rather than mutate the data used by Red Perfume when possible, since the validation does not remove undocumented keys.

Argument             | Type   | Description
:--                  | :--    | :--
`options`            | object | The options the user originally passed in (`beforeValidation`) or a modifed version with all API defaults in place (any point from `afterValidation` and on)
`task`               | object | The current task being processed. Looks like `{ styles, markup, scripts, hooks }`, see API above for more info.
`inputCss`           | string | All of the CSS input files and `data` combined, but not atomized.
`inputHtml`          | string | The HTML from the `in` file and `data` combined, but not atomized.
`atomizedCss`        | string | The inputCss string after it is atomized.
`atomizedHtml`       | string | The atomized HTML for a specific markup subtask.
`classMap`           | object | An object where the keys are the original class names and the values are the atomized class names made from the original CSS rule. This is the same map we output in the `scripts.out`. **IMPORTANT:** How the keys are written (with or without a `.`) and how the values are stored (as an array or string) are subject to change before v1.0.0.
`subTask`            | object | The current markup subTask being processed. Looks like `{ in, out, data, hooks }`, see API above for more info.
`allInputMarkup`     | array  | Array of all input strings of HTML for each markup subtask.
`allAtomizedMarkup`  | array  | Array of atomized strings of HTML for each markup subTask.
`styleErrors`        | array  | An array of errors from attempting to read/write/parse/stringify style files.
`markupErrors`       | array  | An array of errors from attempting to read/write/parse/stringify markup files.
`scriptErrors`       | array  | An array of errors from attempting to write JSON files to disk.

The order hooks are called in:

1. Global: `beforeValidation`
1. Global: `afterValidation`
1. Global: `beforeTasks`
1. Task 1: `beforeTask`
1. Task 1 - Styles: `beforeRead`
1. Task 1 - Styles: `afterRead`
1. Task 1 - Styles: `afterProcessed`
1. Task 1 - Styles: `afterOutput`
1. Task 1 - Markup: `beforeRead`
1. Task 1 - Markup: `afterRead`
1. Task 1 - Markup: `afterProcessed`
1. Task 1 - Markup: `afterOutput`
1. Task 1 - Scripts: `beforeOutput`
1. Task 1 - Scripts: `afterOutput`
1. Task 1: `afterTask`
1. Task 2: `beforeTask`
1. Task 2 - Styles: `beforeRead`
1. Task 2 - Styles: `afterRead`
1. Task 2 - Styles: `afterProcessed`
1. Task 2 - Styles: `afterOutput`
1. Task 2 - Markup: `beforeRead`
1. Task 2 - Markup: `afterRead`
1. Task 2 - Markup: `afterProcessed`
1. Task 2 - Markup: `afterOutput`
1. Task 2 - Scripts: `beforeOutput`
1. Task 2 - Scripts: `afterOutput`
1. Task 2: `afterTask`
1. Global: `afterTasks`
