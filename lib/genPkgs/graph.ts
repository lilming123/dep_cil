import path from 'node:path'
import type { ILinks, INodes } from '../src/types'
import { LogNotExportPkg } from '../src/const'
import { readDir, readFile } from './tools'

const nodesName = new Set()
const nodes: INodes[] = []
const links: ILinks[] = []

function addNode(name: string, category: number = 3, version: string = 'latest') {
  if (!name)
    return
  if (!nodesName.has(name)) {
    nodes.push({
      name,
      id: name,
      category,
      version,
    })
    nodesName.add(name)
  }
}

function dealPkgs(name: string, pkgs: any, category: number) {
  if (!pkgs)
    return
  for (const [key, version] of Object.entries(pkgs)) {
    addNode(key, category, version as string)
    links.push({
      source: key,
      target: name,
    })
  }
}

function readGlob(p: string) {
  if (!p.includes('node_modules')) {
    const pkg = readFile(p)
    return pkg
  }
  const pkgsRoot = readDir(p)
  const pkgs: {
    [key: string]: any
  } = {}
  for (let i = 0; i < pkgsRoot.length; i++) {
    const pkgPath = path.resolve(p, `${pkgsRoot[i]}`)
    if (!pkgsRoot[i].includes('.')) {
      try {
        // 处理带有 @
        if (pkgsRoot[i].startsWith('@')) {
          const dirs = readDir(pkgPath)
          for (let i = 0; i < dirs.length; i++)
            readGlob(pkgPath)
        }
        else {
          const pkg = readFile(`${pkgPath}/package.json`)
          pkgs[pkg.name] = {
            devDependencies: pkg.devDependencies,
            dependencies: pkg.dependencies,
          }
        }
      }
      catch (err: any) {
        LogNotExportPkg(err.message)
      }
    }
  }
  return pkgs
}

function initModules() {
  const root = readGlob('./package.json')
  const { name, devDependencies, dependencies } = (root ?? {}) as any
  addNode(name)
  dealPkgs(name, dependencies, 0)
  dealPkgs(name, devDependencies, 1)

  const modules = readGlob('./node_modules/') as any
  for (const [name, { devDependencies, dependencies }] of Object.entries(modules ?? {}) as any) {
    addNode(name, 2)
    dealPkgs(name, dependencies, 0)
    dealPkgs(name, devDependencies, 1)
  }
}

export default function genGraphPkgs() {
  initModules()
  return {
    nodes,
    links,
  }
}
