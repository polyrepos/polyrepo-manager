# Polyrepo manager

The purpose of monorepos should be questioned. Monorepos are used because sharing a set of code across multiple projects makes it inconvenient to frequently update dependencies, so everything is put into one repository. However, this makes it difficult to edit packages across different enterprises and projects. Traditional polyrepos do not have this issue. This approach does not align with first principles. Instead, we should focus on better combining multiple polyrepos rather than putting them into a single repository. Having each package in its own repository enhances modularity and flexibility. By creating a CLI tool to manage multiple polyrepos.

This package is designed to solve these issues through its CLI tools.

### Install

```sh
npm i -g ployrepo-manager
```

### Multiple polyrepo dir

You need create some polyrepo in a dir, and create `*.code-workspace` in the dir

**Example project layout**:

```
template-bun
  ├── .git
  ├── .husky
  ├── src
  ├── LICENSE
  ├── biome.json
  ├── tsconfig.json
  ├── package.json
template-fullstack
  ├── .git
  ├── src
  ├── package.json
template-bun
  ├── .git
  ├── src
  ├── package.json
your-project
  ├── .git
  ├── src
  ├── package.json
your-workspace-name.code-workspace
```

### copy

Like the example project layout, if you need copy template-bun some files go to your-project repo, you can edit your-project package.json:

```json
// package.json
{
  "polyCopy": {
    // @polyrepo/template-bun is the template-bun/package.json 's name
    "@polyrepo/template-bun": [
      ".github",
      "LICENSE",
      "biome.json",
      ".husky",
      "tsconfig.json"
    ]
  }
}
```

After setting up, run this script:

```sh
poly copy
```
