import path from 'node:path'
import type { IRelations } from 'lib/utils/types.js'
import { LogNotExportPkg } from '../utils/const.js'
import { readDir, readFile } from '../utils/tools.js'

export const relations: Partial<IRelations> = {}
export const rootPkg: Partial<IRelations> = {}
export const rootPkgSet: Partial<IRelations> = {}

function dealEmptyRelation(relation: { [key: string]: any } | undefined) {
  if (relation && JSON.stringify(relation) !== '{}')
    return true
  return false
}

async function readGlob(p: string) {
  if (!p.includes('node_modules')) {
    const pkg = (await readFile(p)) as IRelations
    const { name, description, version, dependencies, devDependencies, repository, author, homepage } = pkg
    relations[pkg.name] = {
      name,
      description,
      version,
      homepage,
      dependencies,
      devDependencies,
      repository,
      author,
    }
    rootPkg.__root__ = {
      name,
      version,
      devDependencies,
      dependencies,
    }
    rootPkgSet.add(name)
    return
  }
  const pkgsRoot = await readDir(p)
  for (let i = 0; i < pkgsRoot.length; i++) {
    const pkgPath = path.resolve(p, `${pkgsRoot[i]}`)
    if (!pkgsRoot[i].includes('.')) {
      try {
        // 处理带有 @
        if (pkgsRoot[i].startsWith('@')) {
          const dirs = await readDir(pkgPath)
          for (let i = 0; i < dirs.length; i++) await readGlob(pkgPath)
        }
        else {
          const pkg = (await readFile(`${pkgPath}/package.json`)) as IRelations
          const { name, description, version, dependencies, devDependencies, repository, author, homepage } = pkg
          relations[pkg.name] = {
            name, description, version, homepage, repository, author,
          }
          dealEmptyRelation(dependencies) && (relations[pkg.name].dependencies = dependencies)
          dealEmptyRelation(devDependencies) && (relations[pkg.name].devDependencies = devDependencies)
        }
      }
      catch (err: any) {
        LogNotExportPkg(err.message)
      }
    }
  }
}

export async function genRelations() {
  await readGlob('./package.json')
  await readGlob('./node_modules/')
  return relations
}
