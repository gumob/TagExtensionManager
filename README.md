# Tag Extension Manager

A tool for efficiently managing Chrome extensions. Group multiple extensions and easily enable/disable them based on your needs.

## 🚀 Features

- Extension group management
- One-click group switching
- Customizable group settings
- Keyboard shortcut support
- Dark mode support

## 📦 Installation

### From Chrome Web Store

1. Visit [Chrome Web Store](https://chrome.google.com/webstore/detail/extension-manager/...)
2. Click "Add to Chrome"
3. Click "Add Extension" in the confirmation dialog

### Development Version

1. Clone or download this repository
2. Open `chrome://extensions` in Chrome
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the downloaded folder

## 💻 Usage

1. Click the extension icon to open the popup
2. Click "Create New Group"
3. Enter a group name and select extensions to manage
4. To switch groups, select the desired group from the popup

## 🛠️ For Developers

### Development Setup

1. Install required tools

   - [Node.js](https://nodejs.org/) (v20 or higher)
   - [pnpm](https://pnpm.io/) (v10 or higher)
   - [mise](https://mise.jdx.dev/) (Development environment manager)

2. Clone the repository

   ```bash
   git clone https://github.com/yourusername/ExtensionManager.git
   cd ExtensionManager
   ```

3. Install dependencies

   ```bash
   pnpm install
   ```

4. Start development server
   ```bash
   pnpm dev
   ```

### Project Structure

For detailed project structure, please refer to [DIRECTORYSTRUCTURE.md](./DIRECTORYSTRUCTURE.md).

### Technology Stack

For detailed technology stack information, please refer to [TECHNOLOGSTACK.md](./TECHNOLOGSTACK.md).

### Development Guidelines

1. Code Style

   - Use ESLint and Prettier
   - Run `pnpm lint` before committing
   - Run `pnpm format` before committing

2. Branch Strategy

   - `main`: Production branch
   - `develop`: Development branch
   - Feature development: `feature/feature-name`
   - Bug fixes: `fix/bug-description`

3. Pull Requests
   - Clear title and description
   - Reference related issue numbers
   - Self-review before submission

### Building

```bash
# Production build
pnpm build

# Development build
pnpm build:dev
```

## 📝 License

This project is licensed under the [MIT License](./LICENSE).

## 🤝 Contributing

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📮 Contact

For bug reports and feature requests, please use [Issues](https://github.com/yourusername/ExtensionManager/issues).
