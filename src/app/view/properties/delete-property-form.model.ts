import { BsModalRef } from "ngx-bootstrap/modal";
import { Properties } from "./properties.model";

export class DeletePropertyFormModel{
    list: Properties[];
    modalRef: BsModalRef<any>;
    message:string;
}