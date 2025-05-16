# Directory Structure

Please follow the directory structure below for implementation:

```
/
├── src/                          # Source directory
│   ├── background/               # Background script
│   ├── components/               # UI Components
│   ├── content/                  # Content scripts
│   ├── popup/                    # Popup UI
│   ├── services/                 # Business logic services
│   ├── utils/                    # Utility functions
│   └── manifest.json            # Extension manifest
├── public/                       # Static assets
├── dist/                         # Output directory
├── node_modules/                 # Dependency packages
├── .gitignore                    # Git ignore patterns
├── .prettierrc                   # Prettier configuration
├── .prettierignore              # Prettier ignore patterns
├── .eslintignore                # ESLint ignore patterns
├── package.json                  # Project settings
├── package-script.sh            # Build and development scripts
├── pnpm-lock.yaml               # Dependency lock file
├── tsconfig.json                # TypeScript settings
├── webpack.config.ts            # Webpack configuration
├── mise.toml                    # Development environment settings
├── TECHNOLOGSTACK.md            # Technology stack documentation
├── DIRECTORYSTRUCTURE.md        # Directory structure documentation
├── LICENSE                      # License information
└── README.md                     # Project documentation

### Directory Descriptions

#### Source Code (`src/`)
- `background/`: Background script implementation
- `components/`: UI component implementations
- `content/`: Content script implementations
- `popup/`: Popup UI implementation
- `services/`: Business logic and service implementations
- `utils/`: General utility functions
- `manifest.json`: Extension manifest configuration

#### Configuration Files
- `.prettierrc`: Prettier formatting rules
- `.eslintignore`: ESLint ignore patterns
- `tsconfig.json`: TypeScript compiler configuration
- `webpack.config.ts`: Webpack build configuration

#### Build and Dependencies
- `dist/`: Compiled output files
- `public/`: Static assets
- `node_modules/`: Third-party dependencies
- `package.json`: Project metadata and dependencies
- `pnpm-lock.yaml`: Dependency version lock file
- `package-script.sh`: Build and development scripts

#### Documentation
- `TECHNOLOGSTACK.md`: Technology stack specifications
- `DIRECTORYSTRUCTURE.md`: Directory structure guide
- `README.md`: Project overview and setup instructions
- `LICENSE`: Project license information
```
