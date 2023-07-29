import fs from "node:fs";
import path from "node:path";
export interface ModuleJson{

}
export interface ModuleJsonValue extends ModuleInfo{
    dependencies: ModuleInfo[];
}
export interface ModuleInfo {
    name: string;
    version: string;
    isDep: boolean;
    url: string;
    description: string;
}

export type DependencyGraph = Map<ModuleInfo,ModuleInfo[]>

export class Dependencies {

    private _graph: DependencyGraph;
    constructor() {
        this._graph = new Map<ModuleInfo,ModuleInfo[]>;
    }

    /**
     * 添加依赖节点
     * @param moduleInfo 依赖信息
     */
    public setDependency(moduleInfo: ModuleInfo | null){
        if (!moduleInfo){
            return;
        }
        if(!this.hasKey(moduleInfo)){
            this._graph.set(moduleInfo,[]);
        }
    }
    private hasKey(moduleInfo: ModuleInfo | null): boolean{
        for (const key of this._graph.keys()) {
            if (key.name == moduleInfo?.name && key.version == moduleInfo?.version){
                return true;
            }
        }
        return false;
    }
    public writeFile(p:string){
        const obj: { [key: string]: string[] } = {};
        for (const [key, value] of this._graph.entries()) {
            let dependencies: string[] = []
            for (const dependency of value){
                dependencies.push(dependency.name+' '+dependency.version)
            }
            obj[key.name+' '+key.version] = dependencies;
        }
        console.log(obj)
        fs.writeFile(path.resolve(p, './pkgs.json'), JSON.stringify(obj), err => {
            if (err){
                throw  new Error('出错了')
            }
        })
    }
}

export const pkgData = new Dependencies();

