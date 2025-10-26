// Build a CJS-compatible bundle of jsonresume-theme-professional
const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

(async () => {
    const entry = path.resolve(__dirname, 'node_modules/jsonresume-theme-professional/src/index.js');
    await esbuild.build({
        entryPoints: [entry],
        bundle: true,
        platform: 'node',
        format: 'cjs',
        target: ['node16'],
        outfile: path.resolve(__dirname, 'dist/jsonresume-theme-professional.cjs'),
        external: [],
        loader: { '.js': 'jsx' },
        banner: {
            js: 'const React = require("react");',
        },
    });
    console.log('Built dist/jsonresume-theme-professional.cjs');

    // Create a folder variant that resume-cli can "install" (expects <theme>/index.js)
    const themeDir = path.resolve(__dirname, 'dist/jsonresume-theme-professional');
    if (!fs.existsSync(themeDir)) fs.mkdirSync(themeDir, { recursive: true });
    const indexJs = `module.exports = require('./bundle.cjs');`;
    fs.writeFileSync(path.join(themeDir, 'index.js'), indexJs);
    // Copy bundle
    fs.copyFileSync(
        path.resolve(__dirname, 'dist/jsonresume-theme-professional.cjs'),
        path.join(themeDir, 'bundle.cjs')
    );
    // Minimal package.json so npm/require treats it like a package
    const pkg = {
        name: 'jsonresume-theme-professional-local',
        version: '1.0.0',
        main: 'index.js'
    };
    fs.writeFileSync(path.join(themeDir, 'package.json'), JSON.stringify(pkg, null, 2));
    console.log('Prepared dist/jsonresume-theme-professional/ as a local theme package');
})().catch((e) => {
    console.error(e);
    process.exit(1);
});
