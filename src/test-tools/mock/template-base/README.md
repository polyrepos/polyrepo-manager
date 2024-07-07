# template bun

Template for creating bun projects.

### How to use

Recommended to use polyrepo manger:

```sh
npm i -g @polyrepos/polyrepo-manager
```

In your project's package.json set:

```json
{
  "polyCopy": {
    "@polyrepo/template-base": [
      "package.json.merge",
      ".github",
      "LICENSE",
      ".gitignore",
      "biome.json",
      ".husky",
      "tsconfig.json",
      "tsconfig.ci.json"
    ],
    "@polyrepo/template-full-stack": [
      ".gitignore",
      "biome.json",
      "tsconfig.json"
    ]
  }
}
```

Setup and run:

```sh
poly copy
```
