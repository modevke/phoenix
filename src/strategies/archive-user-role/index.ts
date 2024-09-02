export interface ArchiveUserRoleStrategy {
    execute(): Promise<any>
}

export class ArchiveUserRole {
    private ms: Array<ArchiveUserRoleStrategy> = []

    constructor(ms?: Array<ArchiveUserRoleStrategy>) {
        this.ms = ms
    }

    addUrs(s: ArchiveUserRoleStrategy) {
        this.ms.push()
    }

    run(){
        if(this.ms && this.ms.length > 0){
            return this.ms.map(el => el => el.execute())
        }
    }

}