# ThermiteOS

Welcome to the official homepage repository for **ThermiteOS** — the self-synthesizing, agent-native distribution built on the memory-safe **Redox Operating System** kernel.

ThermiteOS combines Redox's modern, Rust-based microkernel architecture with autonomous development daemon tooling that monitors, researches, and dynamically patches userland software for Redox target targets.

## Features

- **Redox Microkernel Core**: Immune to typical memory-safety violations, with drivers, filesystems, and network stacks entirely running in isolated user space.
- **Autoresearch Package Synthesizer**: Built-in system daemon (`ard`) that automatically resolves compiler errors, ports POSIX crates to Redox-native APIs, and verifies stability through isolated sandbox compilation.
- **Modern Responsive Landing Page**: An elegant, glassmorphic dark theme landing page with drift-sparks particle backgrounds and a functional terminal emulator that runs a mock shell simulation of the OS and the agent loop.

## Website & Terminal Simulator

The landing page features an interactive mock terminal. You can run the following simulation commands inside the web browser:
- `help` - List available shell commands.
- `about` - Overview of ThermiteOS.
- `kernel` - Technical specs of the underlying Redox microkernel.
- `sysinfo` - Virtual hardware and OS target specs.
- `research [package]` - Trigger the simulation of an AI autoresearch loop identifying, patching, and successfully rebuilding a package (e.g. `research libthermite`).
- `spark` - Dispatches canvas thermite sparks directly onto the viewport.
- `reboot` - Run a simulated shutdown and system restart.

## Running Locally

To view the landing page locally:
1. Clone this repository.
2. Open `index.html` directly in your web browser, or use a local static file server (e.g. VS Code Live Server, python http server, etc.):
   ```bash
   python3 -m http.server 8000
   ```
3. Navigate to `http://localhost:8000` in your browser.

## Contributing

ThermiteOS is currently in alpha status. Pull requests, documentation contributions, and architecture suggestions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Cloudflare publishing

Native Cloudflare Git builds publish `main`. Validate with `npm ci` and
`npm run check:deploy`; build uses `npm run build`, deployment `npm run deploy`.
Only the reviewed public file list is copied to `dist`; original public content
and GitHub Pages recovery remain. Credentials stay in Cloudflare and previews
are disabled. The revision is at `/.well-known/cloudflare-build.json`.
