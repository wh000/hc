import { Component, OnInit, ViewChild } from '@angular/core';
import { PEERJS_HOST, LOCAL } from './shared/utils/strings.util';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    @ViewChild('myvideo') myVideo: any;
    @ViewChild('myaudio') myAudio: any;

    peer;
    anotherid;
    mypeerid;

    constructor() {
    }

    ngOnInit() {
        let video = this.myVideo.nativeElement;
        let audio = this.myAudio.nativeElement;
        //this.peer = new Peer({host: PEERJS_HOST, port:'',path:'/'});
        this.peer = new Peer({host: '192.168.43.211', port:9000,path:'/'});
        
        setTimeout(() => {
            console.log('executing');
            this.mypeerid = this.peer.id;
        }, 3000);
       
        this.peer.on('connection', function (conn) {
            conn.on('data', function (data) {
                console.log(data);
            });
        });

        var n = <any>navigator;
        n.getUserMedia =  ( n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia );
        
        this.peer.on('call', function(call) {
          
          n.getUserMedia({ audio: true}, function(stream) {
            call.answer(stream);
            call.on('stream', function(remotestream){
              video.src = URL.createObjectURL(remotestream);
              audio.src = URL.createObjectURL(remotestream);
              video.play();
              audio.play();
            })
          }, function(err) {
            console.log('Failed to get stream', err);
          })
        })

    }

    videoconnect(){
        let video = this.myVideo.nativeElement;
        let audio = this.myAudio.nativeElement;
        var localvar = this.peer;
        var fname = this.anotherid;
        
        var n = <any>navigator;
        
        n.getUserMedia = ( n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia  || n.msGetUserMedia );
        
        n.getUserMedia({audio: true}, function(stream) {
          var call = localvar.call(fname, stream);
          call.on('stream', function(remotestream) {
            video.src = URL.createObjectURL(remotestream);
            audio.src = URL.createObjectURL(remotestream);
            audio.play();
            video.play();
          })
        }, function(err){
          console.log('Failed to get stream', err);
        })
      }

    connect() {
        var conn = this.peer.connect(this.anotherid);
        conn.on('open', function () {
            conn.send('Message from that id');
        }) ;
    }
}