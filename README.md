# Truth-cli🤩

> A command-line tool for analyzing dependencies under node_moudles.

# feature

- Simple API
- Visualization
- Friendly error message prompt

# installing

**Using npm:**

```bash
npm install -g truth-cli
```

# usage

**Start Web and Generate file:**

```bash
truth-cli analyze
```

*The Content of web inluces:*

- Tree
- Force Layout

By default, you will see `pkgs.json` in the root of your project.

Due to management style of npm's dependency , we have set the depth to 3 for the web and 2 for the `pkgs.json` by default, you can use `--dep` of `-d` to change it:

```bash
truth-cli analyze -d 4
```

We do not recommend setting the depth too large, if the `dep` is over 5, we will stop the operation, If you still want to continue, add `--force` or `-f`:

> `dep` will influence the `pkgs.json` and `Tree`

```bash
truth-cli analyze -d 7 -f
```

> This will take a lot of time.

**Only Generate file:**

Use `--json` or `-j` option:

```bash
truth-cli analyze --json [file-path]
```

By default, the `file-path` is `./`, which is the root of your project.

You can use `--dep` or `-d` option:

```bash
truth-cli analyze --json [file-path] --dep [depth]
```

**only start website:**

Use `--web` or `-w` option:

```bash
truth-cli analyze --web
```

**Get usage:**

```bash
truth-cli -h
```

Now we only offer `analyze` command, so all you need to do in terminal is:

```bash
truth-cli analyze -h 
```
