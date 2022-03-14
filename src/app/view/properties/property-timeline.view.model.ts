export class PropertyTimelineVM{
    private singleDayEventLists: SingleDayEventList[];
    private scrollClass:string;
    constructor(singleDayEventLists:SingleDayEventList[] = null){
        this.singleDayEventLists = singleDayEventLists;
        this.setScrollClass();
    }
    getScrollClass():string{
        return this.scrollClass;
    }
    private setScrollClass():void {
        if(!this.singleDayEventLists?.length ||
            !this.singleDayEventLists[0] ||
            !this.singleDayEventLists[0].tuples?.length ||
            !this.isEventCountMoreThan5()){
            this.scrollClass = '';
            return;
        }
        this.scrollClass = 'scroll';
    }
    isEventCountMoreThan5():boolean {
        var count:number = 0;
        for(var singleDayEventList of this.singleDayEventLists){
            count += singleDayEventList.tuples.length;
            if(count > 5)
                return true;
        }
        return false;
    }
    setSingleDayEventLists(singleDayEventLists:SingleDayEventList[]): void {
        this.singleDayEventLists = singleDayEventLists;
        this.setScrollClass();
    }
    getSingleDayEventLists(): SingleDayEventList[] {
        return this.singleDayEventLists;
    }
}
export class SingleDayEventList{
    tuples: Tuple[]
}
export class Tuple{
    item1: Date;
    item2: string
}