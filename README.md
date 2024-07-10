# Polyrepo manager.

The purpose of monorepos should be questioned. Monorepos are used because sharing a set of code across multiple projects makes it inconvenient to frequently update dependencies, so everything is put into one repository. However, this makes it difficult to edit packages across different enterprises and projects. Traditional polyrepos do not have this issue. This approach does not align with first principles. Instead, we should focus on better combining multiple polyrepos rather than putting them into a single repository. Having each package in its own repository enhances modularity and flexibility. By creating a CLI tool to manage multiple polyrepos.

This package is designed to solve these issues through its CLI tools.

### Install

```sh
npm i -g ployrepo-manager
```

### Multiple polyrepo dir

Create several polyrepos in a directory, then create a `poly.config.json` file in the directory.

**poly.config.json**:

```json
{
  // add some example
  "repos": [
    "https://github.com/polyrepos/template-base",
    "https://github.com/polyrepos/template-fullstack",
    "https://github.com/your-username/your-project",
  ]
  // github pr and set-secret need username
  "github": {
    "username": "polyrepos"
  }
}
```

Run `poly clone` to achieve the following directory structure:

```
template-base
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
your-project
  ├── .git
  ├── src
  ├── package.json
poly.config.json
```

### copy

To copy certain files from `template-base` to `your-project`, edit the `package.json` of `your-project`.

package.json:

```json
{
  "polyCopy": {
    // @polyrepo/template-base is the template-bun/package.json's name
    "@polyrepo/template-base": [
      "package.json.merge",
      ".github",
      "LICENSE",
      "biome.json",
      ".husky",
      "tsconfig.json"
    ]
  }
}
```

If a file ends with `.json.merge` and the target file ends with `.json`, the contents will be merged. It is safe and will not overwrite existing fields.

Run the script to execute the copy:

```sh
poly copy
```

### Command Descriptions

- `poly copy` :

  - The copy command is used to copy a file from a source path to a destination path.

- `poly update --npm` :

  - The update command is used to update the dependencies version in all workspaces.

- `poly all "git add . && git commit -m 'chore: update readme'"`:

  - In all workspace run command.

- `poly filter "template-" "touch README.md"` :

  - The run package.name is match /template-/ repos.

- `poly changed "git add . && git commit -m 'chore: update readme'"` :

  - The changed command will execute the specified command in all workspaces that have uncommitted changes. For example, running node cli.js changes git status will execute the git status command in all workspace directories with uncommitted changes.

- `poly unchanged "git pull --rebase"` :

  - The unchanged command will execute the specified command in all workspaces that not have uncommitted changed.

- `poly set-secret NPM_TOKEN abcdefg123` :

  - (requires github username, requires brew install gh, gh auth login) Setting workspace all repo github secret: key, value

- `poly pr squash "chore(main): release"` :

  - (requires github username, requires brew install gh, gh auth login) Merge --squash all repos PR match title is start with: chore(main): release

- `poly pr rebase "chore(main): release"` :

  - (requires github username, requires brew install gh, gh auth login) Merge --rebase all repos PR match title is start with: chore(main): release

- `poly --help`:

```
Usage: poly [options] [command]

The purpose of monorepos should be questioned. Monorepos are used because sharing a set of code across multiple projects makes it inconvenient to frequently update dependencies, so everything is put into one
repository. However, this makes it difficult to edit packages across different enterprises and projects. Traditional polyrepos do not have this issue. This approach does not align with first principles. Instead, we
should focus on better combining multiple polyrepos rather than putting them into a single repository. Having each package in its own repository enhances modularity and flexibility. By creating a CLI tool to manage
multiple polyrepos.

Options:
  -V, --version             output the version number
  -h, --help                display help for command

Commands:
  copy                      The copy command is used to copy a file from a source path to a destination path
  all <args>                In all workspace run command
  filter <filter> <args>    poly filter "template-" "touch README.md", The run package.name is match /template-/ repos.
  changed <args>            Run all workspace has uncommitted dir
  unchanged <args>          Run all workspace has changed dir
  set-secret <key> <value>  Run all workspace set github secret
  pr <event> <matchTitle>   merge pr, like: poly pr squash 'chore(main): release'
  update [options]          Update all workspace dependencies version
  clone                     Clone all repos in workspace
  prettier-package          prettier your package.json
  help [command]            display help for command
```
