import fs from 'node:fs'
import {getPackageInfoSync, PackageResolvingOptions} from 'local-pkg'
// @ts-ignore
import {LogNotExportPkg} from './src/const.ts'
// @ts-ignore
import {ModuleInfo, pkgData} from "./src/dependency.ts";

export default class Analyze {
  constructor() {
    try {
      const json = fs.readFileSync('package.json')
      const { devDependencies, dependencies } = JSON.parse(json.toString())
      for (const name of Object.keys(devDependencies ?? {}) as any){
          pkgData.setDependency(this.getMouduleInfo(name,true));
      }
      for (const name of Object.keys(dependencies ?? {}) as any){
          pkgData.setDependency(this.getMouduleInfo(name,false));
      }
    }
    catch (err: any) {
      LogNotExportPkg(err.message)
    }
  }

  /**
   * 获取依赖的信息
   * @param name 依赖名
   * @param path 依赖所在的位置
   * @param isDev 是否是开发依赖
   * @private
   */
  private getMouduleInfo(name:string, isDev: boolean, path: PackageResolvingOptions={}): ModuleInfo | null{
    try {
      const info = getPackageInfoSync(name,path);
      if (!info){
        return null;
      }else {
        return {
          name: info.name,
          version: info.version,
          isDep: isDev,
          url: info.rootPath,
          description: info.packageJson.description
        };
      }
    }
    catch (err: any) {
      LogNotExportPkg(err.message)
      return null;
    }
  }
  public analyze(p: string = './') {
    pkgData.writeFile(p)
    // loadPkgs(pkgPath).then(() => {
    //   fs.writeFile(path.resolve(p, './pkgs.json'), JSON.stringify(pkgs), (err) => {
    //     if (err)
    //       throw new Error('出错了')
    //   })
    // })
  }
}

export const analyze = new Analyze();


