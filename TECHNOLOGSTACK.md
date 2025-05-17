# Technology Stack

## Core Technologies

- TypeScript: ^5.8.3
- Node.js: ^20.17.47

## Frontend

- Chrome Extension with TypeScript
- Vanilla JavaScript for DOM manipulation

## Development Tools

### Code Quality

- ESLint: ^9.27.0
- Prettier: ^3.5.3
- TypeScript ESLint Parser: ^8.32.1

### Build System

- Webpack: ^5.99.8
- webpack-cli: ^5.1.4
- pnpm: 10.11.0

### Build Tools & Loaders

- ts-loader: ^9.5.2
- css-loader: ^7.1.2
- style-loader: ^4.0.0
- copy-webpack-plugin: ^12.0.2
- ts-node: ^10.9.2

### Type Definitions

- @types/node: ^20.17.47
- @types/chrome: ^0.0.323
- @types/uuid: ^10.0.0

## Dependencies

- uuid: ^11.1.0

## Development Environment

- VSCode
- Cursor IDE
- mise (Development environment manager)

## Implementation Rules

### Code Organization

- Modular component architecture
- Strict TypeScript type checking
- ESLint and Prettier for code style enforcement

### Build Process

- Chrome extension is built from TypeScript source
- DOM elements are created with vanilla JavaScript
- Style definitions are bundled inline for extension compatibility

### Development Workflow

- Development mode with hot reloading
- Production build optimization
- Type checking and linting in CI/CD pipeline
