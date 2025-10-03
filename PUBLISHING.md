## Publishing FlexDoc to NPM

Follow these steps to publish FlexDoc to the npm registry:

### Prerequisites

1. **Create an npm account** (if you don't have one):
   - Go to https://www.npmjs.com/signup
   - Create your account

2. **Login to npm from terminal**:
   ```bash
   npm login
   ```
   Enter your username, password, and email when prompted.

### Publishing Steps

#### Option 1: Using the Publishing Script (Recommended)

```bash
# Make the script executable
chmod +x publish.sh

# Run the publishing script
./publish.sh
```

The script will:
- Check your npm login status
- Install dependencies
- Build the TypeScript code
- Run tests
- Check package name availability
- Help you version the release
- Publish to npm

#### Option 2: Manual Publishing

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Run tests** (optional but recommended):
   ```bash
   npm test
   ```

4. **Check if name is available**:
   ```bash
   npm search flexdoc
   ```

5. **Update version** (if needed):
   ```bash
   # For patch release (1.0.0 → 1.0.1)
   npm version patch

   # For minor release (1.0.0 → 1.1.0)
   npm version minor

   # For major release (1.0.0 → 2.0.0)
   npm version major
   ```

6. **Publish to npm**:
   ```bash
   npm publish
   ```

### After Publishing

Once published successfully, your package will be available at:
- npm page: https://www.npmjs.com/package/flexdoc
- Installation: `npm install flexdoc`

### Updating the Package

To publish updates:

1. Make your changes
2. Update the version number in `package.json`
3. Build and test
4. Run `npm publish`

### Troubleshooting

If you encounter issues:

1. **Name already taken**: Choose a different name in `package.json`
2. **Authentication error**: Run `npm login` again
3. **Build errors**: Ensure TypeScript compiles with `npm run build`
4. **Test failures**: Fix failing tests before publishing

### Alternative Names (if flexdoc is taken)

If 'flexdoc' is already taken on npm, you can update the package name in `package.json`:

- `@yourusername/flexdoc` (scoped package)
- `flexdoc-converter`
- `html-flexdoc`
- `flex-document`
- `flexdoc-html`

For scoped packages:
```json
{
  "name": "@yourusername/flexdoc",
  ...
}
```

Then users will install with:
```bash
npm install @yourusername/flexdoc
```

### Maintenance

After publishing:
- Monitor issues on GitHub
- Respond to user feedback
- Release updates regularly
- Keep dependencies updated
- Maintain documentation
