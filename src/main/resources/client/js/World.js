class World {
    constructor () {
        // ThreeJS Renderer Setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.CubeTextureLoader(THREE.DefaultLoadingManager).load([
                "textures/skybox.png",
                "textures/skybox.png",
                "textures/skybox.png",
                "textures/skybox.png",
                "textures/skybox.png",
                "textures/skybox.png"
            ]);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight + 5);
        this.renderer.setClearColor(0x030F25);

        document.body.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);

        //this.controller = new THREE.PointerLockControls(this.camera, this.renderer.domElement);
        this.controller = new THREE.PointerLockControls(this.camera, this.renderer.domElement);
        this.w = this.s = this.a = this.d = this.up = this.dn = false;

        let keyfn = (e, down) => {
            switch (e.key) {
                case "w":       self.w  = down; break;
                case "a":       self.a  = down; break;
                case "s":       self.s  = down; break;
                case "d":       self.d  = down; break;
                case " ":       self.up = down; break;
                case "Shift":   self.dn = down; break;
                case "Escape":  self.controller.unlock(); break;
            }
        };

        window.addEventListener("click", () => { self.controller.lock(); }, false);
        window.addEventListener('keydown', (e) => keyfn(e, true ), false);
        window.addEventListener('keyup',   (e) => keyfn(e, false), false);

        this.camera.position.z = 15;
        this.camera.position.y = 5;
        this.camera.position.x = 15;

        // Some camera controllers (e.g. PointerLockControls) don't have an update function,
        // so check if the update function exists before calling it.
        if (Utility.Exists(this.controller.update)) this.controller.update();

        let self = this;
        window.addEventListener(
            "resize", 
            () => {
                self.camera.aspect = window.innerWidth / window.innerHeight;
                self.camera.updateProjectionMatrix();
                self.renderer.setSize(window.innerWidth, window.innerHeight);
            }, 
            false
        );

        let light = new THREE.AmbientLight(0x404040);
        this.scene.add(light);

        this.down = new THREE.Object3D();
        this.down.position.set(0, -100000000, 0);
        this.scene.add(this.down);

        // Socket updater
        this.updater = new SocketManager(new WorldObjectFactory(this));

        // Render loop
        this.frameCount = 0;
        this.animate = () => {
            //let camLookVec = new THREE.Vector3(0, 0, -1);
            //camLookVec.applyEuler(self.camera.rotation, self.camera.eulerOrder);

            // Move camera.
            if (self.controller.isLocked) {
                let dx = ((self.d  ? 1.0 : 0.0) - (self.a  ? 1.0 : 0.0)) * 0.1;
                let dy = ((self.up ? 1.0 : 0.0) - (self.dn ? 1.0 : 0.0)) * 0.1;
                let dz = ((self.w  ? 1.0 : 0.0) - (self.s  ? 1.0 : 0.0)) * 0.1;

                self.controller.moveRight(dx);
                self.controller.moveForward(dz);
                self.controller.getObject().position.y += dy;
            }

            requestAnimationFrame(self.animate);
            if (Utility.Exists(self.controller.update)) self.controller.update();
            self.renderer.render(self.scene, self.camera);

            ++self.frameCount;
        };
    }

    addObject(object) {
        let mesh = object.getMesh();
        mesh.name = object.getID();

        this.scene.add(mesh);
    }

    removeObject(object) {
        let mesh = this.scene.getObjectByName(object.getID());
        this.scene.remove(mesh);
    }

    getObjectMesh(id) {
        return this.scene.getObjectByName(id);
    }
}