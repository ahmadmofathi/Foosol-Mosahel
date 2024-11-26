import { Component } from '@angular/core';


@Component({
  selector: 'app-technical',
  templateUrl: './technical.component.html',
  styleUrls: ['./technical.component.css']
})
export class TechnicalComponent {



isNavbarOpen = false;
isIconShow = false;
isSettingBarOpen= false;

openNav() {
  this.isNavbarOpen = !this.isNavbarOpen;
  this.showIcone();
}

showIcone(){
  this.isIconShow =true;
}

openSetting(){
  this.isSettingBarOpen = !this.isSettingBarOpen;
}

chats = [
  { name: 'خالد محمد', lastMessage: 'السلام عليكم ورحمه الله وبركاته', timestamp: 'الاثنين',  status: 'Online', messages: [
    { text: 'السلام عليكم ورحمه الله وبركاته', timestamp: '2:30 pm', sent: false },
    { text: 'وعليكم السلام ورحمه الله وبركاته', timestamp: '2:32 pm', sent: true },
  
  ] },
];

activeChat: any = null;
newMessage: string = '';

openChat(name: string) {
  this.activeChat = this.chats.find(chat => chat.name === name);
}

sendMessage() {
  if (this.newMessage.trim() && this.activeChat) {
    const newMsg = {
      text: this.newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sent: true
    };
    this.activeChat.messages.push(newMsg);
    this.newMessage = '';
  }
}

}
