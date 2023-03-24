import fs from "fs";
import path from "path";
import url from "url";
import fetch from "node-fetch";
import assert from "assert";

const __filename = url.fileURLToPath(new URL(import.meta.url));
const __dirname = path.dirname(__filename);

const types = path.join(__dirname, "..", "types");

const packages = fs.readdirSync(types);

const versionDirRegex = /^v\d+(?:\.\d+)?$/;

/**
 * @param {string} name
 */
function npmPackageName(name) {
    return `@types/${name}`;
}

const allPackages = new Set(packages.map(npmPackageName));

/**
 * @param {string | undefined} a
 * @param {string | undefined} b
 */
function compareComparableValues(a, b) {
    return a === b ? 0 :
        a === undefined ? -1 :
        b === undefined ? 1 :
        a < b ? -1 :
        1;
}

/**
 * @param {string} pkgName
 * @param {string} p
 * @param {string} [version]
 */
async function handlePackage(pkgName, p, version) {
    // console.log(pkgName);
    const packageJsonPath = path.join(p, "package.json");
    /** @type {Record<string, any>} */
    // const packageJsonContents = { name: pkgName, private: true };
    const packageJsonContents = { };
    try {
        const existing = JSON.parse(await fs.promises.readFile(packageJsonPath, { encoding: "utf8" }));
        Object.assign(packageJsonContents, existing);
    }
    catch {
        // OK
        return; // TODO(jakebailey): remove
    }

    // registry is faster, but unpkg handles semver
    const url = version ? `https://unpkg.com/${pkgName}@${version}/package.json` : `https://registry.npmjs.org/${pkgName}/latest`
    const response = await fetch(url);
    const publishedPackageJson = await response.json();
    packageJsonContents.dependencies ||= {};

    for (const key of Object.keys(packageJsonContents.dependencies)) {
        if (allPackages.has(key)) {
            console.log(`Check ${p}/package.json for ${key} dependency, may need to be mapped to a folder.`)
        }
    }

    publishedPackageJson.dependencies ||= {};

    for (const [key, value] of Object.entries(publishedPackageJson.dependencies)) {
        if (!packageJsonContents.dependencies[key]) {
            // Dependency added by the publisher, map locally.
            const depRoot = path.relative(p, path.join(types, key.slice("@types/".length)));
            const relativePathToDep = value === "*" ? depRoot : path.join(depRoot, `v${value.slice(1)}`)
            packageJsonContents.dependencies[key] = `workspace:${relativePathToDep}`;
        }
    }

    if (Object.keys(packageJsonContents.dependencies).length === 0) {
        delete packageJsonContents.dependencies;
    }
    else {
        packageJsonContents.dependencies = Object.fromEntries(Object.entries(packageJsonContents.dependencies).sort((a, b) => compareComparableValues(a[0], b[0])))
    }

    await fs.promises.writeFile(packageJsonPath, JSON.stringify(packageJsonContents, undefined, 4) + "\n");
}

async function main() {
    for (const name of packages) {
        const p = path.join(types, name)
        const pkgName = npmPackageName(name);
        await handlePackage(pkgName, p);
    
        const subdirs = fs.readdirSync(p);
        for (const subdir of subdirs) {
            if (versionDirRegex.test(subdir)) {
                const subP = path.join(p, subdir);
                await handlePackage(pkgName, subP, subdir);
            }
        }
    }
}

main();
