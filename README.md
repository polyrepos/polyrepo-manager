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
    // @polyrepo/template-base is the template-bun/package.json 's name
    "@polyrepo/template-base": [
      "package.json.merge",
      ".github",
      "LICENSE",
      "biome.json",
      ".husky",
      "tsconfig.json"
    ]
  },
  // github set-secret need username
  "github": {
    "username": "polyrepos"
  }
}
```

If the file is _.json.merge, and target has _.json file, we can merge _.json.merge to _.json

After setting up, run this script:

```sh
poly copy
```

### Command Descriptions

`poly copy` :

The copy command is used to copy a file from a source path to a destination path. The specific implementation depends on the ./actions/copy module.

`poly update` :

The update command is used to update the dependencies version in all workspaces. The specific implementation depends on the ./actions/update-version module.

`poly run "git add . && git commit -m 'chore: update readme'"`:

The run command will execute the specified command in all workspaces. For example, running node cli.js run ls will execute the ls command in all workspace directories.

`poly changed "git add . && git commit -m 'chore: update readme'"` :

`poly unchanged "git pull --rebase"` :

The changes command will execute the specified command in all workspaces that have uncommitted changes. For example, running node cli.js changes git status will execute the git status command in all workspace directories with uncommitted changes.

`poly set-secret NPM_TOKEN abcdefg123` :

Setting github secret: key, value
