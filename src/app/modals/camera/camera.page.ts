import { Component, OnInit } from '@angular/core';

import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@ionic-native/camera-preview/ngx';
import { ModalController } from '@ionic/angular';

import { File } from '@ionic-native/file/ngx';
@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {
  picture: string;
  constructor(private camera:CameraPreview,private modal:ModalController,private Files:File) {
  
   }
  async startCamera() {
    this.picture = null;
    const cameraPreviewOpts: CameraPreviewOptions = {
      x: 0,
      y: 0,
      width: window.screen.width,
      height: window.screen.height,
      tapPhoto: true,
      toBack: true,
    }
    const result = await this.camera.startCamera(cameraPreviewOpts);
    console.log(result);
  }
  ngOnInit() {
    this.startCamera()
   
  }
  ngOnDestroy(){
    this.camera.stopCamera()
  }
  Switch(){
    this.camera.switchCamera()
  }
  TomarFoto(){
    const pictureOpts: CameraPreviewPictureOptions = {
      width: 1080,
      height: 1080,
      quality: 85
    }
    // take a picture
    this.camera.takePicture(pictureOpts).then((imageData) => {
      console.log(imageData)
      this.saveBase64(imageData,"Foto.jpeg").then((Data)=>{
        this.modal.dismiss({file:Data})
      })
    }, (err) => {
      console.log(err);
    });
  }
  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}
public saveBase64(base64:string, name:string):Promise<string>{
  return new Promise((resolve, reject)=>{
    let blob=this.b64toBlob(base64, 'image/jpeg')
    let path=this.Files.externalApplicationStorageDirectory
    this.Files.writeFile(path, name, blob,{replace: true})
    .then((data)=>{
      console.log(data)
      resolve(path+name);
    })
    .catch((err)=>{
      console.log('error writing blob')
      reject(err)
    })
  })
}
}
