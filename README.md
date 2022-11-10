# GitHub Action: Config Levels

This action is designed to create a configuration consisting of different levels of configuration files.

During the merging of configuration files, objects that are at higher levels are overridden by objects that are at lower levels.
In the same way, objects and lists can be supplemented with each lower level of configuration.
The type of merging is determined by the parameters of the action.

For example, we have the following file structure in our project:

```
project/
  ├── .github/
  │     ...
  ├── group1/
  │     ├── common.yml
  │     ├── dev.yml
  │     └── prod.yml
  ├── group2/
  │     ├── common.yml
  │     ├── dev.yml
  │     └── prod.yml
  ├── common.yml
  ├── dev.yml
  └── prod.yml
```

Whereat the level of the folder "project" the general configuration is defined.
The `groupX` folders define a specific configuration for each group.

Due to the imaginary environment variables `env.GROUP` and `env.ENV` we can get different configurations as a result of merging the contents of files.

```yml
- uses: blablacar/action-config-levels@master
  id: config
  with:
    patterns: |
      - common.yml
      - ${{ env.ENV }}.yml
      - ${{ env.GROUP }}/common.yml
      - ${{ env.GROUP }}/${{ env.ENV }}.yml

- run: echo '${{ steps.config.outputs.result }}'
```

Configuration files have more weight, which is lower in the list.

<table>
  <tr>
    <th>common.yml</th><th>dev.yml</th><th>group1/common.yml</th><th>group1/dev.yml</th><th>Result</th>
  </tr>
  <tr>
    <td valign="top">
<pre>
---
project: hello
</pre>
    </td><td valign="top">
<pre>
---
environment: dev
logging: INFO
</pre>
    </td><td valign="top">
<pre>
---
logging: DEBUG
</pre>
    </td><td valign="top">
<pre>
---
project: World
hosts:
- boo
- foo
</pre>
    </td><td valign="top">
<pre>
{
  "project": "World",
  "environment": "dev",
  "logging": "DEBUG",
  "hosts": ["boo", "foo"]
}
</pre>
    </td>
  </tr>
</table>

## Inputs

### `patterns`

**Required** A list of path patterns to possible configuration files.
This field contains a string with a list in YAML format.

The file path may contain special patterns, such as `*` and `**`.
For more on patterns that can be used in the `patterns` parameter, see [Glob Primer](https://github.com/isaacs/node-glob#glob-primer).

### `merge_object`

Way to merge objects [deep, overwrite, off].
- `deep` — merge objects deeply
- `overwrite` — overwrite objects that are at the root
- `off` — use the lowest level configuration file

Default: `deep`.

### `merge_array`

Way to merge arrays [concatenating, overwrite].
Also affects the type of array merge when merging objects.

Default: `concatenating`.

### `merge_plain`

Way to merge plain text [concatenating, overwrite].

Default: `concatenating`.

### `output_properties`

Output each property of the object as JSON.

Default: `false`.

### `loop`

If `loop` is defined, then the action is repeated as many times as the number of rows in the variable's content.
All found mentions of `{{ item }}` in the pattern are replaced with a row from the `loop` variable.
The iterative execution of the action returns the object as JSON, where the key contains a row,
and the value is the result of the execution of the action according to the pattern.
Also it has output for each row as a serialized key with value in JSON if `output_properties` is enabled.

Example:

```yml
- uses: blablacar/action-config-levels@master
  id: config
  with:
    patterns: |
      - {{ item }}/common.yml
      - {{ item }}/${{ env.ENV }}.yml
    loop: |
      dir1
      dir2/subdir

- run: echo '${{ steps.config.outputs.result }}'

- run: echo '${{ steps.config.outputs.dir1 }}'

- run: echo '${{ steps.config.outputs.dir2_subdir }}'
```

## Outputs

###  `result`

Merged configuration in JSON or plain text format.
The format is determined automatically based on file suffixes.
`.yml`, `.yaml`, and `.json` files are converted to objects.

### `<object property>`

Returns each property of an object in a separate output.
Properties are returned when the `output_properties` input parameter is set to `true`.

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
