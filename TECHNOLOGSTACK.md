# Technology Stack

## Core Technologies

- TypeScript: ^5
- Node.js: ^20.17.31

## Frontend

- Vanilla JavaScript with TypeScript
- DOM Manipulation API
- Tampermonkey API

## Development Tools

### Code Quality

- ESLint: ^9
- Prettier: ^3.5.3
- TypeScript ESLint Parser

### Build System

- Webpack: ^5.91.0
- webpack-dev-server: ^5.2.1
- webpack-monkey: ^0.2.1
- pnpm: 10.9.0

### Build Tools & Loaders

- babel-loader: ^9.1.3
- css-loader: ^6.10.0
- style-loader: ^3.3.4
- terser-webpack-plugin: ^5.3.10
- ts-loader: ^9.5.2

### Type Definitions

- @types/node: ^20.17.31
- @types/tampermonkey: ^5.0.4

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

- Tampermonkey user script is built from TypeScript source
- DOM elements are created with vanilla JavaScript
- Style definitions are bundled inline for userscript compatibility

### AI Integration

- Uses built-in AI capabilities
- No external API keys required
- Custom prompt template support
