import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { S3BucketService } from 'src/app/shared/s3-bucket.service';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ObjectLoader } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnDestroy, OnChanges {

  @ViewChild('canvas')
  private canvasRef: ElementRef;
  @ViewChild('loader')
  private loaderRef: ElementRef;
  @ViewChild('select')
  private selectRef: ElementRef;
  @ViewChild('progress')
  private progressRef: ElementRef;

  @Input() darkMode: boolean;
  @Input() path: string;
  @Input() type: string;

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
      console.log(this.type);

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

  private get loader(): HTMLCanvasElement {
    return this.loaderRef.nativeElement;
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
    const loadElement = this.loader;
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

    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    // add camera
    this.camera = new THREE.PerspectiveCamera(45, domElement.clientWidth / domElement.clientHeight, 1, 2000);
    //this.camera.add(new THREE.PointLight(0xffffff));

    this.scene.add(this.camera);

    //this.scene.add(new THREE.HemisphereLight(0xffffff, 0x444444));
    this.scene.add(new THREE.AmbientLight(0xa6a6a6, 3))
    const dirLight1 = new THREE.DirectionalLight(0xa6a6a6, 0.8)
    dirLight1.position.set(100, 0, 100)
    this.scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(0xa6a6a6, 0.8)
    dirLight2.position.set(-100, 0, 100)
    this.scene.add(dirLight2)



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

    const manager = new THREE.LoadingManager();
    manager.onStart = function (url, itemsLoaded, itemsTotal) {

      console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
      loadElement.style.display = "block";
      loadElement.style.width = domElement.clientWidth + "px";
      loadElement.style.height = domElement.clientHeight + "px";
    };

    manager.onLoad = function () {
      console.log('Loading complete!');
      loadElement.style.display = "none";
    };


    manager.onProgress = function (url, itemsLoaded, itemsTotal) {

      console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

    };

    manager.onError = function (url) {

      console.log('There was an error loading ' + url);

    };
    // loader FBX
    var loader;
    let extension = this.type.split(".").pop().toLowerCase();
    switch (extension) {
      case "fbx":
        loader = new FBXLoader(manager);

        break;
      case "glb":
        loader = new GLTFLoader(manager);
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/');
        loader.setDRACOLoader(dracoLoader);
        break;
      case "obj":
        loader = new ObjectLoader(manager);
        break;
      default:
        loader = new FBXLoader(manager);
        break;
    }

    loader.load(
      this.threeDPath,
      (objLoaded: any) => {
        switch (extension) {
          case "fbx":
            this.object3D = objLoaded;

            break;
          case "glb":
            this.object3D = objLoaded.scene;
            break;
          default:
            break;
        }
        const box = new THREE.Box3().setFromObject(this.object3D);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());
        this.controls.reset();

        // object position
        this.object3D.position.x += this.object3D.position.x - center.x;
        this.object3D.position.y += this.object3D.position.y;
        this.object3D.position.z += this.object3D.position.z - center.z;
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

        this.object3D.traverse((object: { isMesh: any; castShadow: boolean }) => {
          if (object.isMesh) {
            object.castShadow = true;
          }
        });

        // animation
        // Create an AnimationMixer, and get the list of AnimationClip instances

        this.mixer = new THREE.AnimationMixer(this.object3D);
        if (this.object3D.animations.length > 0) {
          this.select.style.display = "block";
          this.animations = this.object3D.animations;
          this.selectedAnimation = this.animations[0];
          this.action = this.mixer.clipAction(this.selectedAnimation);

          // Play a specific animation
          this.action.play();
        }

        this.object3D.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        this.scene.add(this.object3D);

        this.controls.update();
        this.onWindowResize();
      },
      this.onProgress,
    );


    window.addEventListener('resize', this.onWindowResize, false);
  }

  selectChange(event: any) {
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