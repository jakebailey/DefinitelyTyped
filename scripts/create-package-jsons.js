import fs from 'fs';
import path from 'path';
import url from 'url';
import fetch from 'node-fetch';
import assert from 'assert';
import PQueue from 'p-queue';
import ora from 'ora';

const __filename = url.fileURLToPath(new URL(import.meta.url));
const __dirname = path.dirname(__filename);

const dtRoot = path.join(__dirname, '..');
const types = path.join(dtRoot, 'types');

/**
 * @param {string} p
 */
function prettyPath(p) {
    return path.relative(dtRoot, p);
}

/**
 * @param {string} name
 */
function npmPackageName(name) {
    return `@types/${name}`;
}

/**
 * @param {string | undefined} a
 * @param {string | undefined} b
 */
function compareComparableValues(a, b) {
    return a === b ? 0 : a === undefined ? -1 : b === undefined ? 1 : a < b ? -1 : 1;
}

const desiredPropertyOrder = [
    'private',
    'name',
    'version',
    'license',
    'type',
    'exports',
    'types',
    'typesVersions',
    'dependencies',
    'devDependencies',
];

/**
 * @param {string} pkgName
 * @param {string} p
 * @param {string} [version]
 */
async function handlePackage(pkgName, p, version) {
    const packageJsonPath = path.join(p, 'package.json');

    /** @type {Record<string, any>} */
    const packageJsonContents = { name: pkgName, private: true };

    if (fs.existsSync(packageJsonPath)) {
        const existing = JSON.parse(await fs.promises.readFile(packageJsonPath, { encoding: 'utf8' }));
        if (existing.version) {
            return;
        }
        Object.assign(packageJsonContents, existing);
    }

    // registry is faster, but unpkg handles semver
    const url = version
        ? `https://unpkg.com/${pkgName}@${version}/package.json`
        : `https://registry.npmjs.org/${pkgName}/latest`;
    const response = await fetch(url);
    const publishedPackageJson = await response.json();

    // Get rid of this; we're going to replace it with the published ones instead,
    // as those have already been processed by the DT tooling to include implicit deps.
    packageJsonContents.dependencies = {};

    for (const [key, value] of Object.entries(publishedPackageJson.dependencies || {})) {
        if (key === pkgName) {
            // Weird self dependency.
            console.log(`${pkgName} depended on itself`);
            continue;
        }
        packageJsonContents.dependencies[key] = value;
    }

    if (Object.keys(packageJsonContents.dependencies).length === 0) {
        delete packageJsonContents.dependencies;
    } else {
        packageJsonContents.dependencies = Object.fromEntries(
            Object.entries(packageJsonContents.dependencies).sort((a, b) => compareComparableValues(a[0], b[0])),
        );
    }

    const splitVersion = publishedPackageJson.version.split('.');
    splitVersion[splitVersion.length - 1] = '0';
    packageJsonContents.version = splitVersion.join('.');

    /** @type {Record<string, any>} */
    const finalPackageJsonContents = {};

    for (const prop of desiredPropertyOrder) {
        finalPackageJsonContents[prop] = packageJsonContents[prop];
        delete packageJsonContents[prop];
    }

    assert.deepStrictEqual(packageJsonContents, {}, `${prettyPath(p)} contains unknown properties`);

    Object.assign(finalPackageJsonContents, packageJsonContents);

    await fs.promises.writeFile(packageJsonPath, JSON.stringify(finalPackageJsonContents, undefined, 4) + '\n');
}

const packages = fs.readdirSync(types);

let progress = 0;
const total = packages.length;

const spinner = ora('').start();

/**
 * @param {(...args: any[]) => void} log
 * @returns {(...args: any[]) => void}
 */
function patchLog(log) {
    return (...args) => {
        spinner.clear();
        spinner.frame();
        log(...args);
    }
}
console.log = patchLog(console.log);
console.error = patchLog(console.error);


/**
 * @param {string} pkgName
 */
function done(pkgName) {
    progress++;
    spinner.text = `${progress}/${total} ${pkgName}`;
}

const queue = new PQueue({ concurrency: 16 });

for (const name of packages) {
    queue.add(async () => {
        const p = path.join(types, name);
        const pkgName = npmPackageName(name);
        await handlePackage(pkgName, p);

        const subdirs = await fs.promises.readdir(p);
        for (const subdir of subdirs) {
            if (/^v\d+(?:\.\d+)?$/.test(subdir)) {
                const subP = path.join(p, subdir);
                await handlePackage(pkgName, subP, subdir);
            }
        }
        done(pkgName);
    });
}

queue.onEmpty().then(() => spinner.stop());
