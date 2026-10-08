function loadGarageAutomatically() {
    const loader = new THREE.GLTFLoader();

    document.getElementById("toast").textContent =
        "Chargement du garage automobile…";

    loader.load(
        "./models/car-garage.glb",

        gltf => {
            glb = gltf.scene;

            glb.traverse(object => {
                if (object.isMesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;
                }
            });

            let box = new THREE.Box3().setFromObject(glb);
            const size = box.getSize(new THREE.Vector3());

            const scale = 18 / Math.max(
                size.x,
                size.z,
                0.001
            );

            glb.scale.setScalar(scale);

            box = new THREE.Box3().setFromObject(glb);

            const center = box.getCenter(
                new THREE.Vector3()
            );

            glb.position.set(
                -center.x,
                -box.min.y,
                -center.z
            );

            scene.add(glb);

            document.getElementById("toast").textContent =
                "Garage chargé. Commencez le circuit prévention.";
        },

        progress => {
            if (!progress.total) return;

            const percentage = Math.round(
                progress.loaded /
                progress.total *
                100
            );

            document.getElementById("toast").textContent =
                `Chargement du garage : ${percentage} %`;
        },

        error => {
            console.error(error);

            document.getElementById("toast").textContent =
                "Le garage 3D n’a pas pu être chargé.";
        }
    );
}

loadGarageAutomatically();
