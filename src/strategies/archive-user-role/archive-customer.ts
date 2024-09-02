import { ArchiveUserRoleStrategy } from ".";


export class ArchiveCustomerStrategy implements ArchiveUserRoleStrategy {

    private userId: number

    constructor(userId: number){
        this.userId = userId;
    }

    async execute() {
        
    }
}