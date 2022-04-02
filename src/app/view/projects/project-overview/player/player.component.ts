import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { S3BucketService } from 'src/app/shared/s3-bucket.service';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnDestroy, OnChanges {

  @ViewChild('canvas')
  private canvasRef: ElementRef;
  @ViewChild('select')
  private selectRef: ElementRef;
  @ViewChild('progress')
  private progressRef: ElementRef;

  @Input() darkMode: boolean;
  @Input() path: string;

  loaderType: string | undefined;

  value: number = 0
  comp: any;
  object: any;

  // OBJECT
  object3D: any;

  renderer: any;
  camera: any;
  scene: any;
  controls: any;
  mixer: any;
  clock = new THREE.Clock();
  action: any;
  animations: any[];
  selectedAnimation: any;
  //
  threeDPath: string;
  requestId;
  //
  constructor(el: ElementRef, s3BucketService: S3BucketService) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.path.firstChange) {
      
      if (this.renderer) {
        this.renderer.dispose();
        cancelAnimationFrame(this.requestId);
      }

      this.select.style.display = "none";
      this.animations = [];
      this.selectedAnimation = null;
      this.progress.style.display = "block";

      this.threeDPath = changes.path.currentValue;
      setTimeout(() => {
        this.loaderType = this.threeDPath.substr(this.threeDPath.lastIndexOf('.') + 1);
        this.play3D();
        this.onWindowResize();
        this.animate();
      });
      this.render = this.render.bind(this);
      this.onWindowResize = this.onWindowResize.bind(this);
      this.onProgress = this.onProgress.bind(this);
      this.animate = this.animate.bind(this);
    }
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private get select(): HTMLCanvasElement {
    return this.selectRef.nativeElement;
  }

  private get progress(): HTMLCanvasElement {
    return this.progressRef.nativeElement;
  }

  ngOnDestroy() {
    this.renderer.dispose();
    cancelAnimationFrame(this.requestId);
    this.select.style.display = "none";
    this.animations = [];
    this.selectedAnimation = null;
    this.progress.style.display = "block";
  }

  animate() {
    this.requestId = requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();

    if (this.mixer) {
      this.mixer.update(delta);
    }

    this.controls.update();

    this.render();
  }

  play3D() {
    const domElement = this.canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas: domElement
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(domElement.clientWidth, domElement.clientHeight);
    this.clock = new THREE.Clock();

    // create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeeeeee);


    // add camera
    this.scene.add(new THREE.AmbientLight(0x404040));
    this.camera = new THREE.PerspectiveCamera(45, domElement.clientWidth / domElement.clientHeight, 1, 2000);
    this.camera.add(new THREE.PointLight(0xffffff, 1, 100));

    this.scene.add(this.camera);

    // add light
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    hemiLight.position.set(0, 20, 0);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(-3, 10, -10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;

    this.scene.add(dirLight);

    // axes
    // this.scene.add(new THREE.AxesHelper(20));

    // controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // ground
    // const mesh = new THREE.Mesh(
    //   new THREE.PlaneBufferGeometry(2000, 2000),
    //   new THREE.MeshPhongMaterial({ color: 0xd0bb95, depthWrite: false }),
    // );
    // mesh.rotation.x = -Math.PI / 2;
    // mesh.receiveShadow = true;
    // this.scene.add(mesh);

    // const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    // this.scene.add(grid);

    // loader FBX
    const loader = new FBXLoader();
    loader.load(
      this.threeDPath,
      (objLoaded: any) => {
        const box = new THREE.Box3().setFromObject(objLoaded);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());
        this.controls.reset();

        // object position
        objLoaded.position.x += objLoaded.position.x - center.x;
        objLoaded.position.y += objLoaded.position.y;
        objLoaded.position.z += objLoaded.position.z - center.z;
        this.controls.maxDistance = size * 10;

        // camera position respect object
        this.camera.near = size / 100;
        this.camera.far = size * 100;
        this.camera.updateProjectionMatrix();

        this.camera.position.copy(center);
        this.camera.position.x -= size;
        this.camera.position.y += size / 4;
        this.camera.position.z += size;

        this.camera.lookAt(center);

        objLoaded.traverse((object: { isMesh: any; castShadow: boolean }) => {
          if (object.isMesh) {
            object.castShadow = true;
          }
        });

        // animation
        // Create an AnimationMixer, and get the list of AnimationClip instances

        this.mixer = new THREE.AnimationMixer(objLoaded);
        if (objLoaded.animations.length > 0) {
          this.select.style.display = "block";
          this.animations = objLoaded.animations;
          this.selectedAnimation = this.animations[0];
          this.action = this.mixer.clipAction(this.selectedAnimation);

          // Play a specific animation
          this.action.play();
        }

        objLoaded.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        this.object3D = objLoaded;
        this.scene.add(this.object3D);

        this.controls.update();
        this.onWindowResize();
      },
      this.onProgress,
    );

    window.addEventListener('resize', this.onWindowResize, false);
  }

  selectChange(event:any) {
    this.action.stop();
    this.action = this.mixer.clipAction(this.selectedAnimation);
    this.action.play();
  }

  onProgress(xhr: any) {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      this.value = percentComplete;
      let progressBar = <HTMLElement>this.progress.firstElementChild;
      progressBar.style.width = percentComplete.toFixed(0) + '%'
      progressBar.innerHTML = percentComplete.toFixed(0) + '%'
      if (percentComplete == 100) {
        this.progress.style.display = "none";
        progressBar.style.width = "0%";
        progressBar.innerHTML = "0%";
      }
    }
  }

  onWindowResize() {
    const domElement = this.canvas;
    this.camera.aspect = domElement.clientWidth / domElement.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(domElement.clientWidth, domElement.clientHeight);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

}