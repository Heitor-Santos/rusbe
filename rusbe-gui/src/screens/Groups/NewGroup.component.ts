import { Component } from '@angular/core';
import { GroupsService } from '../../service/Groups.service'
import { AlertController } from '@ionic/angular';
import Group from '../../../../common/groups'

@Component({
    selector: 'app-new-group',
    templateUrl: './NewGroup.component.html',
    styleUrls: ['./NewGroup.component.scss']
})
export class NewGroup {
    usersID: string[];
    readyToCreate: Boolean;
    groupName: string;
    userInfo: any;

    constructor(private GroupsService: GroupsService, private alertController: AlertController) { }
    
    ngOnInit(): void {
        var data = localStorage.getItem("user");
        this.usersID = []
        this.groupName=''
        this.readyToCreate = false;
        this.userInfo = (data != null && data !== "") ? JSON.parse(data) : {};
    }
    async presentAlert(msg: string, header:string): Promise<void> {
        const alert = await this.alertController.create({
            header: header,
            message: msg,
        });
        await alert.present();
    }
    changeGroupName():void{
        this.groupName = (<HTMLInputElement>document.getElementById('name')).value;
        this.changeReady() 
    }
    changeReady():void{
        if(this.usersID.length>0 && this.groupName!='')
            this.readyToCreate = true;
        else this.readyToCreate = false;
    }
    backToGroups():void{
        window.location.href="/screens/groups"
    }
    async addMember(): Promise<void> {
        const alert = await this.alertController.create({
            header: 'New member',
            inputs: [{
                name: 'userID',
                type: 'text',
                placeholder: 'Please enter the member login'}],
            buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary'},
                {
                    text: 'OK',
                    handler: (alertData) => {
                        this.usersID.push(alertData.userID)
                        this.changeReady()
                    }
                }
            ]
        });
        await alert.present();
    }
    createGroup():void{
        this.usersID.push(this.userInfo.id)
        this.GroupsService.createGroup(this.usersID, this.groupName).subscribe(
            data=>{
                this.presentAlert("Group created with success!", 'New Group')
                setTimeout(this.backToGroups, 2000)
            },
            err=>{
                this.presentAlert(err, 'Error')
            }
        )
    }
}