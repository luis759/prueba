import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CameraPage } from '../modals/camera/camera.page';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Chooser } from '@ionic-native/chooser/ngx';

import { File } from '@ionic-native/file/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  cameras=true
  foto=""
  constructor(private modal:ModalController,
    private selec:ImagePicker,
    private web:WebView,private fileChooser: FileChooser,private Chooses:Chooser,private Files:File) {
      this.Files.listDir('file:///storage/emulated/0/','').then(Valor=>{
        console.log(Valor)
      })
    }
  selectimagen(){
    this.fileChooser.open({ "mime": "image/jpeg,image/png" })
    .then(uri => this.foto=this.web.convertFileSrc(uri)  )
    .catch(e => console.log(e));
  }
  selectimagen2(){
    this.Chooses.getFile('image/png,image/jpeg').then(file =>{
      this.foto=this.web.convertFileSrc(file.uri)  
    } )
    .catch(e => console.log(e));
  }
  selectimagen3(){
    let options = {
      // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
      // selection of a single image, the plugin will return it.
      maximumImagesCount: 1,
      
      // max width and height to allow the images to be.  Will keep aspect
      // ratio no matter what.  So if both are 800, the returned image
      // will be at most 800 pixels wide and 800 pixels tall.  If the width is
      // 800 and height 0 the image will be 800 pixels wide if the source
      // is at least that wide.
      width: 1080,
      height: 1080,
      
      // quality of resized image, defaults to 100
      quality: 80,
  
      // output type, defaults to FILE_URIs.
      // available options are 
      // window.imagePicker.OutputType.FILE_URI (0) or 
      // window.imagePicker.OutputType.BASE64_STRING (1)
      outputType: 0
  };
    this.selec.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        this.foto=this.web.convertFileSrc(results[i])  
      }
    }, (err) => { 
      console.log('Image err: ' +err );});
  }
  async mostrarcamara(){
    this.cameras=false
    const modal=await this.modal.create({
      component:CameraPage
    });
    modal.onDidDismiss().then((dato)=>{
      if(dato['data']){
        let valorImagen=dato['data']['file']
        this.foto=this.web.convertFileSrc(valorImagen)  
      }
      this.cameras=true
    })
  return await modal.present()
  }
}
