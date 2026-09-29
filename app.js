// app.js - frayD Interactive 3D WebGL Runway Showcase Engine
// Enhanced Human Anatomy Sculpting, Authentic Streetwear Garment Replication & Smart Gender Morphing

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. STATE & REFERENCES
    // -------------------------------------------------------------
    const container = document.getElementById('webgl-canvas-container');
    const regionLabel = document.getElementById('region-label');
    const genderSelect = document.getElementById('gender-select');
    const genderBadge = document.getElementById('gender-badge');
    const ethnicitySelect = document.getElementById('ethnicity-preset');
    const ethnicityBadge = document.getElementById('ethnicity-badge');
    const hairStyleSelect = document.getElementById('hair-style');
    const hairBadge = document.getElementById('hair-badge');
    const hairColorInput = document.getElementById('hair-color');
    const hairColorName = document.getElementById('hair-color-name');
    const sleeveSelect = document.getElementById('sleeve-select');
    const sleeveBadge = document.getElementById('sleeve-badge');
    const skinPicker = document.querySelectorAll('#skin-picker .swatch');
    const bodyTypeSelect = document.getElementById('body-type');
    const heightSlider = document.getElementById('height-slider');

    // Studio Toolbar Controls
    const lightBtns = document.querySelectorAll('.mode-btn');
    const autoRotateBtn = document.getElementById('btn-autorotate');
    const autoRotateText = document.getElementById('autorotate-text');
    const resetCamBtn = document.getElementById('btn-reset-cam');

    // Right Column View Controls
    const initialMessage = document.getElementById('initial-message');
    const apparelListView = document.getElementById('apparel-list-view');
    const customizationView = document.getElementById('customization-view');
    const apparelListTitle = document.getElementById('apparel-list-title');
    const apparelGrid = document.getElementById('apparel-grid');
    const selectedItemName = document.getElementById('selected-item-name');
    const backToListBtn = document.getElementById('back-to-list');
    const removeGarmentBtn = document.getElementById('remove-garment-btn');

    // Customization Toolkit Controls
    const customTextInput = document.getElementById('custom-text');
    const toggleStudsInput = document.getElementById('toggle-studs');
    const tieDyeColorInput = document.getElementById('tie-dye-color');
    const colorHexLabel = document.getElementById('color-hex-label');
    const openCreativityBtn = document.getElementById('open-creativity-btn');

    let activeRegion = null;
    let selectedGarments = { head: null, torso: null, legs: null, feet: null };
    let currentGender = 'female';
    let currentSkinTone = '#f3c299';
    let currentHairColor = '#3a2212';
    let currentSleeveMode = 'short';
    let currentBodyType = 'athletic';
    let currentHeightScale = 1.0;

    // -------------------------------------------------------------
    // 2. APPAREL DATA DEFINITIONS
    // -------------------------------------------------------------
    const apparelData = {
        head: [
            { id: 'h1', name: 'Cyber Snapback Cap', icon: '🧢', defaultColor: '#00f0ff', type: 'snapback' },
            { id: 'h2', name: 'Acid Beanie', icon: '🎩', defaultColor: '#ff007f', type: 'beanie' },
            { id: 'h3', name: 'Tactical Bucket Hat', icon: '🪖', defaultColor: '#2d3a2d', type: 'bucket' },
            { id: 'h4', name: 'Vintage Beret', icon: '🎓', defaultColor: '#7928ca', type: 'beret' },
            { id: 'h5', name: 'Streetwear Balaclava', icon: '🥷', defaultColor: '#1b1b24', type: 'balaclava' }
        ],
        torso: [
            { id: 't1', name: 'Deconstructed Graphic Tee', icon: '👕', defaultColor: '#141318', type: 'tee' },
            { id: 't2', name: 'Hyper-Object Hoodie', icon: '🧥', defaultColor: '#6b21a8', type: 'hoodie' },
            { id: 't3', name: 'Acid-Wash Biker Vest', icon: '🎽', defaultColor: '#22222d', type: 'vest' },
            { id: 't4', name: 'Oversized Denim Jacket', icon: '👔', defaultColor: '#2c4d75', type: 'jacket' },
            { id: 't5', name: 'Techwear Zip Sweater', icon: '🥼', defaultColor: '#111827', type: 'sweater' }
        ],
        legs: [
            { id: 'l1', name: 'Modular Cargo Trousers', icon: '👖', defaultColor: '#323542', type: 'cargo' },
            { id: 'l2', name: 'Distressed Selvedge Jeans', icon: '👖', defaultColor: '#1e3860', type: 'jeans' },
            { id: 'l3', name: 'Cyberpunk Shorts', icon: '🩳', defaultColor: '#14131c', type: 'shorts' },
            { id: 'l4', name: 'Flare Track Pants', icon: '👖', defaultColor: '#121118', type: 'track' },
            { id: 'l5', name: 'Utility Joggers', icon: '👖', defaultColor: '#3e4233', type: 'joggers' }
        ],
        feet: [
            { id: 'f1', name: 'Quantum Chunky Sneakers', icon: '👟', defaultColor: '#ff007f', type: 'sneakers' },
            { id: 'f2', name: 'High-Contrast Combat Boots', icon: '🥾', defaultColor: '#1b1a20', type: 'combat' },
            { id: 'f3', name: 'High-Top Canvas Kicks', icon: '👟', defaultColor: '#00f0ff', type: 'canvas' },
            { id: 'f4', name: 'Leather Chelsea Boots', icon: '👞', defaultColor: '#3a2212', type: 'chelsea' },
            { id: 'f5', name: 'Futuristic Cyber Slides', icon: '🩴', defaultColor: '#ff5e00', type: 'slides' }
        ]
    };

    // Ethnicity Presets
    const ethnicityPresets = {
        'default': { name: 'Global Standard', tone: '#f3c299', eyeColor: '#3a2212', hairColor: '#3a2212' },
        'south-asian': { name: 'South Asian', tone: '#e0ac69', eyeColor: '#1c0e07', hairColor: '#140a05' },
        'east-asian': { name: 'East Asian', tone: '#ffe3cf', eyeColor: '#1b1008', hairColor: '#0d0603' },
        'african': { name: 'Afro-Descendant', tone: '#5c351b', eyeColor: '#120703', hairColor: '#050201' },
        'caucasian': { name: 'European', tone: '#ffebd4', eyeColor: '#2b5c8f', hairColor: '#7a5230' }
    };

    // -------------------------------------------------------------
    // 3. THREE.JS 3D SCENE & ENGINE SETUP
    // -------------------------------------------------------------
    if (!container || typeof THREE === 'undefined') {
        console.error('Three.js or Canvas Container missing.');
        return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0612, 0.07);

    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.25, 3.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Orbit Controls
    let controls = null;
    if (THREE.OrbitControls) {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.target.set(0, 1.1, 0);
        controls.minDistance = 1.6;
        controls.maxDistance = 5.5;
        controls.maxPolarAngle = Math.PI / 2 + 0.04;
        controls.autoRotate = false;
        controls.autoRotateSpeed = 1.2;
    }

    // -------------------------------------------------------------
    // 4. STUDIO LIGHTING & ENVIRONMENT
    // -------------------------------------------------------------
    const studioLightsGroup = new THREE.Group();
    scene.add(studioLightsGroup);

    const ambientLight = new THREE.AmbientLight(0xffecd6, 0.85);
    studioLightsGroup.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.5);
    keyLight.position.set(2.5, 4.5, 3.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0005;
    studioLightsGroup.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7928ca, 0.9);
    fillLight.position.set(-3.0, 2.5, 2.0);
    studioLightsGroup.add(fillLight);

    const rimLight1 = new THREE.SpotLight(0xffc700, 2.2, 12, Math.PI / 4, 0.5);
    rimLight1.position.set(-2.2, 3.2, -2.8);
    rimLight1.target.position.set(0, 1.2, 0);
    studioLightsGroup.add(rimLight1);
    studioLightsGroup.add(rimLight1.target);

    const rimLight2 = new THREE.SpotLight(0xff007f, 2.2, 12, Math.PI / 4, 0.5);
    rimLight2.position.set(2.2, 3.2, -2.8);
    rimLight2.target.position.set(0, 1.2, 0);
    studioLightsGroup.add(rimLight2);
    studioLightsGroup.add(rimLight2.target);

    // Studio Stage Floor
    const floorGeo = new THREE.CylinderGeometry(1.65, 1.75, 0.08, 64);
    const floorMat = new THREE.MeshStandardMaterial({
        color: 0x140d24,
        roughness: 0.28,
        metalness: 0.65
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.04;
    floor.receiveShadow = true;
    scene.add(floor);

    // Glowing Stage Rim
    const ringGeo = new THREE.RingGeometry(1.72, 1.76, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffc700, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.002;
    scene.add(ring);

    function setLightingMode(mode) {
        if (mode === 'atelier') {
            ambientLight.color.setHex(0xffecd6);
            ambientLight.intensity = 0.85;
            keyLight.color.setHex(0xfff5e6);
            keyLight.intensity = 1.5;
            fillLight.color.setHex(0xc299ff);
            fillLight.intensity = 0.75;
            rimLight1.color.setHex(0xffc700);
            rimLight2.color.setHex(0xff007f);
            ringMat.color.setHex(0xffc700);
        } else if (mode === 'cyber') {
            ambientLight.color.setHex(0x140d24);
            ambientLight.intensity = 0.5;
            keyLight.color.setHex(0x00f0ff);
            keyLight.intensity = 1.4;
            fillLight.color.setHex(0x7928ca);
            fillLight.intensity = 1.2;
            rimLight1.color.setHex(0x00f0ff);
            rimLight2.color.setHex(0xff007f);
            ringMat.color.setHex(0x00f0ff);
        } else if (mode === 'editorial') {
            ambientLight.color.setHex(0xffffff);
            ambientLight.intensity = 0.95;
            keyLight.color.setHex(0xffffff);
            keyLight.intensity = 1.6;
            fillLight.color.setHex(0xd0d0d8);
            fillLight.intensity = 0.65;
            rimLight1.color.setHex(0xffffff);
            rimLight2.color.setHex(0xaaaaaa);
            ringMat.color.setHex(0xffffff);
        }
    }

    lightBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            lightBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            setLightingMode(btn.getAttribute('data-light'));
        });
    });

    // -------------------------------------------------------------
    // 5. PBR MATERIALS & HUMAN ANATOMY SCULPTING
    // -------------------------------------------------------------
    const mannequinRoot = new THREE.Group();
    scene.add(mannequinRoot);

    // Realistic PBR Skin Material with clearcoat sheen
    const skinMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(currentSkinTone),
        roughness: 0.44,
        metalness: 0.05,
        clearcoat: 0.25,
        clearcoatRoughness: 0.35,
        reflectivity: 0.45
    });

    // Anatomical facial feature materials
    const lipsMaterial = new THREE.MeshStandardMaterial({
        color: 0xba6468,
        roughness: 0.38,
        metalness: 0.05
    });

    const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
        color: 0xf5f6fa,
        roughness: 0.2,
        metalness: 0.02
    });

    const eyeIrisMaterial = new THREE.MeshStandardMaterial({
        color: 0x24160d,
        roughness: 0.15,
        metalness: 0.1
    });

    const eyePupilMaterial = new THREE.MeshBasicMaterial({
        color: 0x050404
    });

    // High-specular cornea reflection
    const eyeCorneaMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
        roughness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05
    });

    // Base Bodysuit Material
    const baseUnderwearMat = new THREE.MeshStandardMaterial({
        color: 0x120e1a,
        roughness: 0.55,
        metalness: 0.2
    });

    // Hair Material
    const hairMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(currentHairColor),
        roughness: 0.45,
        metalness: 0.22
    });

    // Body groups
    const headGroup = new THREE.Group();
    headGroup.userData = { region: 'head' };
    const torsoGroup = new THREE.Group();
    torsoGroup.userData = { region: 'torso' };
    const legsGroup = new THREE.Group();
    legsGroup.userData = { region: 'legs' };
    const feetGroup = new THREE.Group();
    feetGroup.userData = { region: 'feet' };

    mannequinRoot.add(headGroup);
    mannequinRoot.add(torsoGroup);
    mannequinRoot.add(legsGroup);
    mannequinRoot.add(feetGroup);

    const interactiveMeshes = [];

    function addPartMesh(geo, mat, parent, regionTag) {
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { region: regionTag };
        parent.add(mesh);
        interactiveMeshes.push(mesh);
        return mesh;
    }

    // --- A. HEAD & HUMAN FACE SCULPTING ---
    // Oval Cranium
    const headCranium = addPartMesh(new THREE.SphereGeometry(0.125, 32, 28), skinMaterial, headGroup, 'head');
    headCranium.position.set(0, 1.83, 0);
    headCranium.scale.set(0.96, 1.16, 1.02);

    // Anatomical Jaw & Chin
    const jawMesh = addPartMesh(new THREE.CylinderGeometry(0.108, 0.062, 0.13, 24), skinMaterial, headGroup, 'head');
    jawMesh.position.set(0, 1.73, 0.02);
    jawMesh.scale.set(0.92, 1.0, 0.90);

    // Chin Apex
    const chinTip = new THREE.Mesh(new THREE.SphereGeometry(0.024, 16, 14), skinMaterial);
    chinTip.position.set(0, 1.68, 0.06);
    chinTip.scale.set(1.0, 0.8, 1.1);
    headGroup.add(chinTip);

    // Refined Neck with Collarbone Transition
    const neckMesh = addPartMesh(new THREE.CylinderGeometry(0.054, 0.070, 0.16, 24), skinMaterial, headGroup, 'head');
    neckMesh.position.set(0, 1.64, -0.01);

    // 1. Nose Bridge, Cartilaginous Tip & Nostrils
    const noseBridge = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.014, 0.065, 16), skinMaterial);
    noseBridge.position.set(0, 1.795, 0.135);
    noseBridge.rotation.x = -0.22;
    headGroup.add(noseBridge);

    const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.012, 16, 14), skinMaterial);
    noseTip.position.set(0, 1.765, 0.154);
    noseTip.scale.set(1.0, 0.85, 1.15);
    headGroup.add(noseTip);

    const nostrilL = new THREE.Mesh(new THREE.SphereGeometry(0.007, 12, 10), skinMaterial);
    nostrilL.position.set(-0.014, 1.762, 0.144);
    headGroup.add(nostrilL);

    const nostrilR = new THREE.Mesh(new THREE.SphereGeometry(0.007, 12, 10), skinMaterial);
    nostrilR.position.set(0.014, 1.762, 0.144);
    headGroup.add(nostrilR);

    // 2. Sculpted Almond Eyes (Properly positioned on facial plane)
    function buildAlmondEye(isLeft) {
        const eyeGroup = new THREE.Group();
        const sideMult = isLeft ? -1 : 1;

        // White Sclera
        const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.015, 18, 14), eyeWhiteMaterial);
        sclera.scale.set(1.35, 0.85, 0.7);
        eyeGroup.add(sclera);

        // Iris
        const iris = new THREE.Mesh(new THREE.SphereGeometry(0.0085, 16, 14), eyeIrisMaterial);
        iris.position.set(0, 0, 0.007);
        eyeGroup.add(iris);

        // Pupil
        const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.0042, 12, 12), eyePupilMaterial);
        pupil.position.set(0, 0, 0.011);
        eyeGroup.add(pupil);

        // Cornea Specular Gloss
        const cornea = new THREE.Mesh(new THREE.SphereGeometry(0.0155, 16, 14), eyeCorneaMaterial);
        cornea.scale.set(1.35, 0.85, 0.7);
        eyeGroup.add(cornea);

        // Upper Eyelid / Eyeliner Arc
        const lidGeo = new THREE.TorusGeometry(0.018, 0.0028, 8, 16, Math.PI);
        const lid = new THREE.Mesh(lidGeo, new THREE.MeshBasicMaterial({ color: 0x1a0f0a }));
        lid.position.set(0, 0.004, 0.008);
        lid.rotation.x = Math.PI / 4;
        eyeGroup.add(lid);

        eyeGroup.position.set(0.046 * sideMult, 1.825, 0.126);
        headGroup.add(eyeGroup);
        return eyeGroup;
    }

    const eyeLeftGroup = buildAlmondEye(true);
    const eyeRightGroup = buildAlmondEye(false);

    // 3. Eyebrow Arcs
    const browGeo = new THREE.TorusGeometry(0.034, 0.0038, 10, 18, Math.PI / 2.1);
    const browL = new THREE.Mesh(browGeo, hairMaterial);
    browL.position.set(-0.046, 1.855, 0.126);
    browL.rotation.z = Math.PI * 0.94;
    browL.rotation.x = 0.15;
    headGroup.add(browL);

    const browR = new THREE.Mesh(browGeo, hairMaterial);
    browR.position.set(0.046, 1.855, 0.126);
    browR.rotation.z = Math.PI * 0.06;
    browR.rotation.x = 0.15;
    headGroup.add(browR);

    // 4. Sculpted Lips with Cupid's Bow
    const upperLipL = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.019, 12), lipsMaterial);
    upperLipL.position.set(-0.010, 1.740, 0.138);
    upperLipL.rotation.z = Math.PI / 2 + 0.12;
    headGroup.add(upperLipL);

    const upperLipR = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.019, 12), lipsMaterial);
    upperLipR.position.set(0.010, 1.740, 0.138);
    upperLipR.rotation.z = Math.PI / 2 - 0.12;
    headGroup.add(upperLipR);

    const lowerLip = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.034, 14), lipsMaterial);
    lowerLip.position.set(0, 1.726, 0.135);
    lowerLip.rotation.z = Math.PI / 2;
    headGroup.add(lowerLip);

    // 5. Anatomical Ears
    const earGeo = new THREE.SphereGeometry(0.024, 14, 12);
    const earL = new THREE.Mesh(earGeo, skinMaterial);
    earL.position.set(-0.122, 1.80, -0.01);
    earL.scale.set(0.45, 1.4, 0.85);
    headGroup.add(earL);

    const earR = new THREE.Mesh(earGeo, skinMaterial);
    earR.position.set(0.122, 1.80, -0.01);
    earR.scale.set(0.45, 1.4, 0.85);
    headGroup.add(earR);

    // --- B. TORSO & ANATOMICAL LIMBS ---
    const chestMesh = addPartMesh(new THREE.CylinderGeometry(0.19, 0.165, 0.28, 32), skinMaterial, torsoGroup, 'torso');
    chestMesh.position.set(0, 1.44, 0);
    chestMesh.scale.set(1.12, 1.0, 0.74);

    // Clavicle Collarbones
    const clavicleGeo = new THREE.TorusGeometry(0.14, 0.007, 10, 24, Math.PI / 2);
    const clavicleMesh = new THREE.Mesh(clavicleGeo, skinMaterial);
    clavicleMesh.position.set(0, 1.55, 0.04);
    clavicleMesh.rotation.x = Math.PI / 2;
    clavicleMesh.rotation.z = Math.PI / 4;
    torsoGroup.add(clavicleMesh);

    // Waist Taper
    const waistMesh = addPartMesh(new THREE.CylinderGeometry(0.142, 0.158, 0.22, 32), skinMaterial, torsoGroup, 'torso');
    waistMesh.position.set(0, 1.22, 0);
    waistMesh.scale.set(0.96, 1.0, 0.68);

    // Pelvis / Hips
    const hipsMesh = addPartMesh(new THREE.CylinderGeometry(0.165, 0.185, 0.20, 32), baseUnderwearMat, torsoGroup, 'torso');
    hipsMesh.position.set(0, 1.04, 0);
    hipsMesh.scale.set(1.18, 1.0, 0.76);

    // Sculpted Shoulders
    const shoulderL = addPartMesh(new THREE.SphereGeometry(0.062, 20, 16), skinMaterial, torsoGroup, 'torso');
    shoulderL.position.set(-0.24, 1.52, 0);
    const shoulderR = addPartMesh(new THREE.SphereGeometry(0.062, 20, 16), skinMaterial, torsoGroup, 'torso');
    shoulderR.position.set(0.24, 1.52, 0);

    // Upper Arms (Naturally resting by side in runway poise)
    const upperArmGeo = new THREE.CylinderGeometry(0.042, 0.038, 0.26, 20);
    const armLeftUpper = addPartMesh(upperArmGeo, skinMaterial, torsoGroup, 'torso');
    armLeftUpper.position.set(-0.27, 1.36, 0);
    armLeftUpper.rotation.z = -0.14;
    armLeftUpper.rotation.x = 0.06;

    const armRightUpper = addPartMesh(upperArmGeo, skinMaterial, torsoGroup, 'torso');
    armRightUpper.position.set(0.27, 1.36, 0);
    armRightUpper.rotation.z = 0.14;
    armRightUpper.rotation.x = 0.06;

    // Elbow Joints
    const elbowL = addPartMesh(new THREE.SphereGeometry(0.035, 16, 14), skinMaterial, torsoGroup, 'torso');
    elbowL.position.set(-0.305, 1.22, 0.015);
    const elbowR = addPartMesh(new THREE.SphereGeometry(0.035, 16, 14), skinMaterial, torsoGroup, 'torso');
    elbowR.position.set(0.305, 1.22, 0.015);

    // Forearms (Tapering naturally toward wrist)
    const forearmGeo = new THREE.CylinderGeometry(0.035, 0.026, 0.25, 20);
    const forearmLeft = addPartMesh(forearmGeo, skinMaterial, torsoGroup, 'torso');
    forearmLeft.position.set(-0.312, 1.07, 0.045);
    forearmLeft.rotation.z = -0.06;
    forearmLeft.rotation.x = 0.18;

    const forearmRight = addPartMesh(forearmGeo, skinMaterial, torsoGroup, 'torso');
    forearmRight.position.set(0.312, 1.07, 0.045);
    forearmRight.rotation.z = 0.06;
    forearmRight.rotation.x = 0.18;

    // --- ANATOMICAL POSED RUNWAY HANDS (Sorted, Natural & Refined) ---
    function buildSculptedHand(isLeft) {
        const handRoot = new THREE.Group();
        const sideMult = isLeft ? -1 : 1;

        // Slender Wrist Transition
        const wristMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.020, 0.04, 14), skinMaterial);
        wristMesh.position.set(0, 0.02, 0);
        handRoot.add(wristMesh);

        // Palm Base (Anatomically tapered volume with thenar pad)
        const palmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.052, 0.018), skinMaterial);
        palmMesh.position.set(0, -0.016, 0);
        palmMesh.castShadow = true;
        handRoot.add(palmMesh);

        // Thenar Muscle Mound (Base of thumb)
        const thenarMound = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 10), skinMaterial);
        thenarMound.position.set(0.018 * sideMult, -0.008, 0.006);
        thenarMound.scale.set(1.2, 1.0, 0.8);
        handRoot.add(thenarMound);

        // Natural Posed Thumb (Angling inward toward index finger)
        const thumbProx = new THREE.Mesh(new THREE.CylinderGeometry(0.0065, 0.0055, 0.024, 10), skinMaterial);
        thumbProx.position.set(0.024 * sideMult, -0.014, 0.012);
        thumbProx.rotation.z = -0.45 * sideMult;
        thumbProx.rotation.x = 0.35;
        handRoot.add(thumbProx);

        const thumbDist = new THREE.Mesh(new THREE.CylinderGeometry(0.0052, 0.0040, 0.018, 10), skinMaterial);
        thumbDist.position.set(0.032 * sideMult, -0.028, 0.018);
        thumbDist.rotation.z = -0.25 * sideMult;
        thumbDist.rotation.x = 0.50;
        handRoot.add(thumbDist);

        // 4 Cascaded Runway Fingers (Index, Middle, Ring, Pinky - gently curved)
        const fingerData = [
            { len: 0.042, xOff: -0.012, curl: 0.18 }, // Index
            { len: 0.046, xOff: -0.004, curl: 0.16 }, // Middle (longest)
            { len: 0.040, xOff: 0.004, curl: 0.22 },  // Ring
            { len: 0.033, xOff: 0.011, curl: 0.28 }   // Pinky (most curled)
        ];

        fingerData.forEach(f => {
            const posX = f.xOff * sideMult;
            // Proximal phalanx
            const prox = new THREE.Mesh(new THREE.CylinderGeometry(0.0048, 0.0040, f.len * 0.6, 10), skinMaterial);
            prox.position.set(posX, -0.048, 0.004);
            prox.rotation.x = f.curl;
            handRoot.add(prox);

            // Distal phalanx (curling softly inward toward the thigh)
            const dist = new THREE.Mesh(new THREE.CylinderGeometry(0.0038, 0.0028, f.len * 0.45, 10), skinMaterial);
            dist.position.set(posX, -0.064, 0.012);
            dist.rotation.x = f.curl + 0.25;
            handRoot.add(dist);
        });

        // Position hand gracefully on forearm
        handRoot.position.set(0.316 * sideMult, 0.91, 0.08);
        handRoot.rotation.y = 0.25 * sideMult;
        handRoot.rotation.z = -0.06 * sideMult;
        torsoGroup.add(handRoot);
        return handRoot;
    }

    const handLeftMesh = buildSculptedHand(true);
    const handRightMesh = buildSculptedHand(false);

    // --- C. SCULPTED ATHLETIC LEGS ---
    const thighGeo = new THREE.CylinderGeometry(0.084, 0.062, 0.44, 24);
    const thighLeft = addPartMesh(thighGeo, skinMaterial, legsGroup, 'legs');
    thighLeft.position.set(-0.11, 0.74, 0);

    const thighRight = addPartMesh(thighGeo, skinMaterial, legsGroup, 'legs');
    thighRight.position.set(0.11, 0.74, 0);

    // Sculpted Kneecaps
    const kneeL = addPartMesh(new THREE.SphereGeometry(0.052, 18, 14), skinMaterial, legsGroup, 'legs');
    kneeL.position.set(-0.11, 0.50, 0.012);
    const kneeR = addPartMesh(new THREE.SphereGeometry(0.052, 18, 14), skinMaterial, legsGroup, 'legs');
    kneeR.position.set(0.11, 0.50, 0.012);

    // Calves & Shins
    const calfGeo = new THREE.CylinderGeometry(0.058, 0.038, 0.44, 24);
    const calfLeft = addPartMesh(calfGeo, skinMaterial, legsGroup, 'legs');
    calfLeft.position.set(-0.11, 0.27, 0);
    const calfRight = addPartMesh(calfGeo, skinMaterial, legsGroup, 'legs');
    calfRight.position.set(0.11, 0.27, 0);

    // --- D. ANATOMICAL FEET ---
    const footGeo = new THREE.BoxGeometry(0.068, 0.048, 0.17);
    const footLeft = addPartMesh(footGeo, skinMaterial, feetGroup, 'feet');
    footLeft.position.set(-0.11, 0.03, 0.03);
    const footRight = addPartMesh(footGeo, skinMaterial, feetGroup, 'feet');
    footRight.position.set(0.11, 0.03, 0.03);

    // -------------------------------------------------------------
    // 6. PROCEDURAL 3D HAIR GEOMETRIES (REALISTIC & GENDER-ALIGNED)
    // -------------------------------------------------------------
    const hairContainer = new THREE.Group();
    headGroup.add(hairContainer);
    let activeHairMesh = null;

    function build3DHair(styleKey) {
        if (activeHairMesh) {
            hairContainer.remove(activeHairMesh);
            activeHairMesh = null;
        }

        if (styleKey === 'bald') return;

        const hairGroup = new THREE.Group();

        // 1. FEMALE DEFAULT: Editorial Side-Part & Glamour Waves
        if (styleKey === 'side-part' || styleKey === 'long-waves') {
            // Scalp skull cap fitting securely
            const cap = new THREE.Mesh(new THREE.SphereGeometry(0.134, 28, 24), hairMaterial);
            cap.position.set(0, 1.86, -0.01);
            cap.scale.set(1.02, 1.10, 1.05);
            hairGroup.add(cap);

            // Sweeping side-part fringe across brow
            const sideSweep = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.026, 16, 24, Math.PI * 0.75), hairMaterial);
            sideSweep.position.set(0.03, 1.88, 0.06);
            sideSweep.rotation.z = -0.55;
            sideSweep.rotation.x = 0.25;
            hairGroup.add(sideSweep);

            // Left cascading wavy strand
            const waveL = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.022, 0.48, 16), hairMaterial);
            waveL.position.set(-0.13, 1.62, 0.03);
            waveL.rotation.z = -0.16;
            waveL.rotation.x = 0.08;
            hairGroup.add(waveL);

            // Right cascading wavy strand
            const waveR = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.022, 0.48, 16), hairMaterial);
            waveR.position.set(0.13, 1.62, 0.03);
            waveR.rotation.z = 0.16;
            waveR.rotation.x = 0.08;
            hairGroup.add(waveR);

            // Back flowing drape
            const backDrape = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.085, 0.52, 20), hairMaterial);
            backDrape.position.set(0, 1.60, -0.09);
            backDrape.scale.set(1.1, 1.0, 0.85);
            hairGroup.add(backDrape);
        }
        // 2. MALE DEFAULT: Modern Textured Quiff / High-Fashion Crop
        else if (styleKey === 'short-crop') {
            // Tight salon taper fade around sides & back
            const fadeSides = new THREE.Mesh(new THREE.SphereGeometry(0.130, 28, 24), hairMaterial);
            fadeSides.position.set(0, 1.85, -0.01);
            fadeSides.scale.set(1.02, 1.12, 1.03);
            hairGroup.add(fadeSides);

            // Volumetric textured quiff top
            const quiffBase = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.045, 0.13), hairMaterial);
            quiffBase.position.set(0, 1.95, 0.01);
            quiffBase.rotation.x = 0.15;
            hairGroup.add(quiffBase);

            // Layered directional quiff strands
            for (let i = 0; i < 5; i++) {
                const strand = new THREE.Mesh(new THREE.ConeGeometry(0.020, 0.065, 8), hairMaterial);
                const xOff = (-0.04 + (i * 0.02));
                strand.position.set(xOff, 1.97, 0.03 + (Math.sin(i) * 0.01));
                strand.rotation.x = 0.45;
                strand.rotation.z = (i - 2) * 0.12;
                hairGroup.add(strand);
            }
        }
        // 3. NON-BINARY DEFAULT: Textured Afro High Puff with Metallic Band
        else if (styleKey === 'curly-puff') {
            // Tapered hairline
            const baseHair = new THREE.Mesh(new THREE.SphereGeometry(0.132, 24, 20), hairMaterial);
            baseHair.position.set(0, 1.86, 0);
            hairGroup.add(baseHair);

            // Metallic Gold Styling Cuff Ring
            const cuffMat = new THREE.MeshStandardMaterial({ color: 0xffc700, metalness: 0.9, roughness: 0.2 });
            const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.012, 14, 24), cuffMat);
            cuff.position.set(0, 1.94, -0.02);
            cuff.rotation.x = Math.PI / 2;
            hairGroup.add(cuff);

            // Volumetric High Puff Crown
            const puffCrown = new THREE.Mesh(new THREE.SphereGeometry(0.165, 24, 20), hairMaterial);
            puffCrown.position.set(0, 2.04, -0.02);
            puffCrown.scale.set(1.15, 0.95, 1.15);
            hairGroup.add(puffCrown);

            // Micro-curls
            for (let i = 0; i < 8; i++) {
                const miniCurl = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), hairMaterial);
                const angle = (i / 8) * Math.PI * 2;
                miniCurl.position.set(Math.cos(angle) * 0.13, 2.05 + Math.sin(angle) * 0.03, Math.sin(angle) * 0.13);
                hairGroup.add(miniCurl);
            }
        }
        // 4. BUZZ CUT
        else if (styleKey === 'buzz-cut') {
            const buzz = new THREE.Mesh(new THREE.SphereGeometry(0.128, 28, 24), hairMaterial);
            buzz.position.set(0, 1.84, 0);
            buzz.scale.set(1.02, 1.15, 1.04);
            hairGroup.add(buzz);
        }

        hairContainer.add(hairGroup);
        activeHairMesh = hairGroup;
    }

    build3DHair('side-part');

    // -------------------------------------------------------------
    // 7. GENUINE 3D APPAREL REPLICATION ENGINE
    // -------------------------------------------------------------
    const garmentsRoot = new THREE.Group();
    mannequinRoot.add(garmentsRoot);

    const active3DGarments = { head: null, torso: null, legs: null, feet: null };
    const garmentMaterials = { head: null, torso: null, legs: null, feet: null };
    const studsGroups = { head: null, torso: null, legs: null, feet: null };

    // Canvas Texture Generator for Authentic Streetwear Graphics & Decals
    function createGraphicTeeTexture(customText = '') {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Streetwear Cyber Framing Border
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 6;
        ctx.strokeRect(160, 140, 704, 740);

        // Top Header Pill
        ctx.fillStyle = '#ff007f';
        ctx.fillRect(160, 140, 704, 85);
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 36px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ FRAYD STUDIO // ARCHIVE 2026', 512, 196);

        // Main Dynamic Streetwear Typography
        const displayMain = (customText && customText.trim().length > 0) ? customText.toUpperCase() : 'DECONSTRUCTED';
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 78px "Outfit", sans-serif';
        ctx.fillText(displayMain, 512, 400);

        ctx.fillStyle = '#00f0ff';
        ctx.font = '800 48px "Outfit", sans-serif';
        ctx.fillText('WEAR YOUR POINT OF VIEW', 512, 470);

        // Editorial Accent Lines & Crosshairs
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(220, 520);
        ctx.lineTo(804, 520);
        ctx.stroke();

        ctx.fillStyle = '#aaaaaa';
        ctx.font = '700 24px monospace';
        ctx.fillText('MILAN // TOKYO // NYC  [SPEC-2026]', 512, 560);

        // Circular Seal Badge
        ctx.strokeStyle = '#ffc700';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(512, 660, 68, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ffc700';
        ctx.font = 'bold 24px "Outfit", sans-serif';
        ctx.fillText('LIMITED RUN', 512, 655);
        ctx.fillText('01 OF 50', 512, 685);

        // Barcode
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 34; i++) {
            const w = (i % 4 === 0) ? 8 : (i % 2 === 0 ? 4 : 2);
            ctx.fillRect(240 + (i * 16), 770, w, 60);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    function createChromeStuds(coordsArray, parent) {
        const studsGroup = new THREE.Group();
        const studGeo = new THREE.SphereGeometry(0.012, 12, 10);
        const chromeMat = new THREE.MeshStandardMaterial({
            color: 0xe8eef5,
            metalness: 0.98,
            roughness: 0.10
        });

        coordsArray.forEach(pos => {
            const stud = new THREE.Mesh(studGeo, chromeMat);
            stud.position.set(pos[0], pos[1], pos[2]);
            studsGroup.add(stud);
        });

        studsGroup.visible = false;
        parent.add(studsGroup);
        return studsGroup;
    }

    // Build Authentic 3D Garments Matching Chosen Apparel
    function build3DGarmentMesh(region, item) {
        if (active3DGarments[region]) {
            garmentsRoot.remove(active3DGarments[region]);
            active3DGarments[region] = null;
            garmentMaterials[region] = null;
            studsGroups[region] = null;
        }

        const garmentGroup = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(item.defaultColor),
            roughness: 0.45,
            metalness: 0.15
        });
        garmentMaterials[region] = mat;

        // Gender proportion scaling factors
        const isMale = (currentGender === 'male');
        const chestWidthMult = isMale ? 1.25 : 1.0;
        const shoulderSpread = isMale ? 0.30 : 0.24;

        // =========================================================
        // A. HEADWEAR REPLICATION
        // =========================================================
        if (region === 'head') {
            if (item.type === 'snapback') {
                const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.128, 0.134, 0.09, 24), mat);
                crown.position.set(0, 1.93, 0.01);
                garmentGroup.add(crown);

                const topButton = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 10), mat);
                topButton.position.set(0, 1.98, 0.01);
                garmentGroup.add(topButton);

                const brim = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.012, 0.14), mat);
                brim.position.set(0, 1.90, 0.14);
                garmentGroup.add(brim);

                studsGroups.head = createChromeStuds([[-0.06, 1.93, 0.13], [0.06, 1.93, 0.13]], garmentGroup);
            } else if (item.type === 'beanie') {
                const dome = new THREE.Mesh(new THREE.SphereGeometry(0.138, 24, 20), mat);
                dome.position.set(0, 1.93, 0);
                dome.scale.set(1.02, 1.25, 1.05);
                garmentGroup.add(dome);

                const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.134, 0.026, 16, 32), mat);
                cuff.position.set(0, 1.88, 0);
                cuff.rotation.x = Math.PI / 2;
                garmentGroup.add(cuff);

                studsGroups.head = createChromeStuds([[-0.05, 1.88, 0.14], [0.05, 1.88, 0.14]], garmentGroup);
            } else if (item.type === 'bucket') {
                const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.134, 0.10, 24), mat);
                crown.position.set(0, 1.94, 0);
                garmentGroup.add(crown);

                const brim = new THREE.Mesh(new THREE.ConeGeometry(0.23, 0.06, 32, 1, true), mat);
                brim.position.set(0, 1.88, 0);
                brim.rotation.x = Math.PI;
                garmentGroup.add(brim);

                studsGroups.head = createChromeStuds([[0, 1.94, 0.13], [-0.08, 1.94, 0.11], [0.08, 1.94, 0.11]], garmentGroup);
            } else if (item.type === 'beret') {
                const puff = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.136, 0.05, 32), mat);
                puff.position.set(0.04, 1.94, 0.01);
                puff.rotation.z = -0.25;
                garmentGroup.add(puff);

                studsGroups.head = createChromeStuds([[0.05, 1.95, 0.12]], garmentGroup);
            } else if (item.type === 'balaclava') {
                const hood = new THREE.Mesh(new THREE.SphereGeometry(0.134, 24, 24), mat);
                hood.position.set(0, 1.85, 0);
                hood.scale.set(1.02, 1.35, 1.05);
                garmentGroup.add(hood);

                const neckCover = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.22, 24), mat);
                neckCover.position.set(0, 1.62, 0);
                garmentGroup.add(neckCover);

                studsGroups.head = createChromeStuds([[-0.06, 1.65, 0.09], [0.06, 1.65, 0.09]], garmentGroup);
            }
        }

        // =========================================================
        // B. TORSO REPLICATION (AUTHENTIC STREETWEAR STYLES)
        // =========================================================
        else if (region === 'torso') {
            // 1. DECONSTRUCTED GRAPHIC TEE
            if (item.type === 'tee') {
                const teeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.21 * chestWidthMult, 0.185 * chestWidthMult, 0.52, 32), mat);
                teeBody.position.set(0, 1.35, 0);
                teeBody.scale.set(1.18, 1.0, 0.82);
                garmentGroup.add(teeBody);

                // Prominently placed Streetwear Graphic Decal (Placed safely outside chest mesh)
                const decalGeo = new THREE.PlaneGeometry(0.25 * chestWidthMult, 0.29);
                const decalMat = new THREE.MeshBasicMaterial({
                    map: createGraphicTeeTexture(),
                    transparent: true,
                    polygonOffset: true,
                    polygonOffsetFactor: -1,
                    polygonOffsetUnits: -1
                });
                const decalMesh = new THREE.Mesh(decalGeo, decalMat);
                decalMesh.name = 'tee-graphic-decal';
                decalMesh.position.set(0, 1.36, 0.178);
                garmentGroup.add(decalMesh);

                // Ribbed Crewneck Collar
                const ribMat = new THREE.MeshStandardMaterial({ color: 0x22202c, roughness: 0.6 });
                const collar = new THREE.Mesh(new THREE.TorusGeometry(0.098, 0.014, 14, 32), ribMat);
                collar.position.set(0, 1.58, 0);
                collar.rotation.x = Math.PI / 2;
                garmentGroup.add(collar);

                // Drop-Shoulder Sleeves
                const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.056, 0.16, 20), mat);
                sleeveL.position.set(-shoulderSpread - 0.03, 1.44, 0);
                sleeveL.rotation.z = -0.32;
                garmentGroup.add(sleeveL);

                const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.056, 0.16, 20), mat);
                sleeveR.position.set(shoulderSpread + 0.03, 1.44, 0);
                sleeveR.rotation.z = 0.32;
                garmentGroup.add(sleeveR);

                // Long Sleeve Extensions
                const longExtL = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.042, 0.26, 20), mat);
                longExtL.name = 'sleeve-long-mesh-l';
                longExtL.position.set(-shoulderSpread - 0.07, 1.23, 0.03);
                longExtL.rotation.z = -0.12;
                longExtL.visible = (currentSleeveMode === 'long');
                garmentGroup.add(longExtL);

                const longExtR = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.042, 0.26, 20), mat);
                longExtR.name = 'sleeve-long-mesh-r';
                longExtR.position.set(shoulderSpread + 0.07, 1.23, 0.03);
                longExtR.rotation.z = 0.12;
                longExtR.visible = (currentSleeveMode === 'long');
                garmentGroup.add(longExtR);

                studsGroups.torso = createChromeStuds([
                    [-0.08, 1.54, 0.15], [0.08, 1.54, 0.15],
                    [-0.14, 1.52, 0.12], [0.14, 1.52, 0.12]
                ], garmentGroup);
            }
            // 2. HYPER-OBJECT HOODIE
            else if (item.type === 'hoodie') {
                const hoodieBody = new THREE.Mesh(new THREE.CylinderGeometry(0.23 * chestWidthMult, 0.20 * chestWidthMult, 0.56, 32), mat);
                hoodieBody.position.set(0, 1.34, 0);
                hoodieBody.scale.set(1.22, 1.0, 0.88);
                garmentGroup.add(hoodieBody);

                // Draped Hood Cowl behind neck
                const cowl = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.048, 16, 32), mat);
                cowl.position.set(0, 1.62, -0.06);
                cowl.rotation.x = Math.PI / 3;
                garmentGroup.add(cowl);

                // Kangaroo Front Pouch Pocket
                const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.25 * chestWidthMult, 0.14, 0.06), mat);
                pouch.position.set(0, 1.20, 0.165);
                garmentGroup.add(pouch);

                // Relaxed Full Sleeves
                const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.054, 0.46, 20), mat);
                armL.position.set(-shoulderSpread - 0.06, 1.30, 0.02);
                armL.rotation.z = -0.18;
                garmentGroup.add(armL);

                const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.054, 0.46, 20), mat);
                armR.position.set(shoulderSpread + 0.06, 1.30, 0.02);
                armR.rotation.z = 0.18;
                garmentGroup.add(armR);

                // White Drawstrings with Metallic Chrome Aglets
                const stringMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const stringL = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.12, 8), stringMat);
                stringL.position.set(-0.04, 1.50, 0.16);
                garmentGroup.add(stringL);

                const stringR = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.12, 8), stringMat);
                stringR.position.set(0.04, 1.50, 0.16);
                garmentGroup.add(stringR);

                studsGroups.torso = createChromeStuds([
                    [-0.10, 1.22, 0.20], [0.10, 1.22, 0.20],
                    [0, 1.48, 0.17]
                ], garmentGroup);
            }
            // 3. ACID-WASH BIKER VEST
            else if (item.type === 'vest') {
                const vestBody = new THREE.Mesh(new THREE.CylinderGeometry(0.215 * chestWidthMult, 0.185 * chestWidthMult, 0.48, 32), mat);
                vestBody.position.set(0, 1.35, 0);
                vestBody.scale.set(1.18, 1.0, 0.82);
                garmentGroup.add(vestBody);

                // Wide Moto Lapels
                const lapelL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.24, 0.02), mat);
                lapelL.position.set(-0.08 * chestWidthMult, 1.46, 0.16);
                lapelL.rotation.z = -0.3;
                garmentGroup.add(lapelL);

                const lapelR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.24, 0.02), mat);
                lapelR.position.set(0.08 * chestWidthMult, 1.46, 0.16);
                lapelR.rotation.z = 0.3;
                garmentGroup.add(lapelR);

                // Heavy Chrome Diagonal Moto Zipper
                const zipMat = new THREE.MeshStandardMaterial({ color: 0xd8e0e8, metalness: 0.95, roughness: 0.15 });
                const zipTrack = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.36, 0.01), zipMat);
                zipTrack.position.set(0.03, 1.32, 0.165);
                zipTrack.rotation.z = -0.16;
                garmentGroup.add(zipTrack);

                // Waist Belt
                const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.22 * chestWidthMult, 0.22 * chestWidthMult, 0.04, 32), zipMat);
                belt.position.set(0, 1.13, 0);
                belt.scale.set(1.18, 1.0, 0.82);
                garmentGroup.add(belt);

                studsGroups.torso = createChromeStuds([
                    [-0.08, 1.54, 0.17], [0.08, 1.54, 0.17],
                    [-0.10, 1.40, 0.17], [0.10, 1.40, 0.17]
                ], garmentGroup);
            }
            // 4. OVERSIZED DENIM JACKET
            else if (item.type === 'jacket') {
                const jacketBody = new THREE.Mesh(new THREE.CylinderGeometry(0.22 * chestWidthMult, 0.195 * chestWidthMult, 0.50, 32), mat);
                jacketBody.position.set(0, 1.34, 0);
                jacketBody.scale.set(1.2, 1.0, 0.85);
                garmentGroup.add(jacketBody);

                // Turn-Down Collar
                const collarMat = new THREE.MeshStandardMaterial({ color: 0x1f3b60, roughness: 0.6 });
                const collar = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.024, 12, 32), collarMat);
                collar.position.set(0, 1.58, 0);
                collar.rotation.x = Math.PI / 2;
                garmentGroup.add(collar);

                // Dual Chest Flap Pockets
                const pocketL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.02), mat);
                pocketL.position.set(-0.10 * chestWidthMult, 1.42, 0.165);
                garmentGroup.add(pocketL);

                const pocketR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.02), mat);
                pocketR.position.set(0.10 * chestWidthMult, 1.42, 0.165);
                garmentGroup.add(pocketR);

                // Structured Sleeves
                const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.052, 0.46, 20), mat);
                armL.position.set(-shoulderSpread - 0.06, 1.30, 0.02);
                armL.rotation.z = -0.16;
                garmentGroup.add(armL);

                const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.052, 0.46, 20), mat);
                armR.position.set(shoulderSpread + 0.06, 1.30, 0.02);
                armR.rotation.z = 0.16;
                garmentGroup.add(armR);

                studsGroups.torso = createChromeStuds([
                    [-0.10, 1.45, 0.175], [0.10, 1.45, 0.175],
                    [0, 1.35, 0.175], [0, 1.25, 0.175]
                ], garmentGroup);
            }
            // 5. TECHWEAR ZIP SWEATER
            else if (item.type === 'sweater') {
                const sweaterBody = new THREE.Mesh(new THREE.CylinderGeometry(0.215 * chestWidthMult, 0.19 * chestWidthMult, 0.52, 32), mat);
                sweaterBody.position.set(0, 1.35, 0);
                sweaterBody.scale.set(1.18, 1.0, 0.84);
                garmentGroup.add(sweaterBody);

                // Mock Neck Stand Collar
                const neckStand = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.08, 24), mat);
                neckStand.position.set(0, 1.62, 0);
                garmentGroup.add(neckStand);

                // Waterproof Taped Center Quarter-Zip
                const zipMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
                const zipMesh = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.22, 0.01), zipMat);
                zipMesh.position.set(0, 1.50, 0.165);
                garmentGroup.add(zipMesh);

                // Sleeves
                const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.048, 0.46, 20), mat);
                armL.position.set(-shoulderSpread - 0.05, 1.30, 0.02);
                armL.rotation.z = -0.16;
                garmentGroup.add(armL);

                const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.048, 0.46, 20), mat);
                armR.position.set(shoulderSpread + 0.06, 1.30, 0.02);
                armR.rotation.z = 0.16;
                garmentGroup.add(armR);

                studsGroups.torso = createChromeStuds([
                    [-0.08, 1.56, 0.16], [0.08, 1.56, 0.16]
                ], garmentGroup);
            }
        }

        // =========================================================
        // C. LEGS REPLICATION
        // =========================================================
        else if (region === 'legs') {
            const pantL = new THREE.Mesh(new THREE.CylinderGeometry(0.092, 0.072, 0.90, 24), mat);
            pantL.position.set(-0.11, 0.52, 0);
            garmentGroup.add(pantL);

            const pantR = new THREE.Mesh(new THREE.CylinderGeometry(0.092, 0.072, 0.90, 24), mat);
            pantR.position.set(0.11, 0.52, 0);
            garmentGroup.add(pantR);

            // 1. CARGO TROUSERS: 3D Box Gusset Pockets
            if (item.type === 'cargo') {
                const pocketBoxL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.15, 0.10), mat);
                pocketBoxL.position.set(-0.20, 0.56, 0.02);
                garmentGroup.add(pocketBoxL);

                const pocketBoxR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.15, 0.10), mat);
                pocketBoxR.position.set(0.20, 0.56, 0.02);
                garmentGroup.add(pocketBoxR);

                studsGroups.legs = createChromeStuds([[-0.22, 0.62, 0.04], [0.22, 0.62, 0.04]], garmentGroup);
            }
            // 2. SELVEDGE JEANS: Contrast Seams & Distress Accents
            else if (item.type === 'jeans') {
                const stitchMat = new THREE.MeshBasicMaterial({ color: 0xd4a040 });
                const waistStitch = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.005, 8, 32), stitchMat);
                waistStitch.position.set(0, 0.98, 0);
                waistStitch.rotation.x = Math.PI / 2;
                garmentGroup.add(waistStitch);

                studsGroups.legs = createChromeStuds([[-0.16, 0.95, 0.08], [0.16, 0.95, 0.08]], garmentGroup);
            }
            // 3. CYBERPUNK SHORTS: Layered Outer Shorts + Compression Tights
            else if (item.type === 'shorts') {
                pantL.scale.set(1.2, 0.45, 1.2);
                pantL.position.y = 0.76;
                pantR.scale.set(1.2, 0.45, 1.2);
                pantR.position.y = 0.76;

                const tightMat = new THREE.MeshStandardMaterial({ color: 0x111118, roughness: 0.3 });
                const tightL = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.055, 0.52, 20), tightMat);
                tightL.position.set(-0.11, 0.38, 0);
                garmentGroup.add(tightL);

                const tightR = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.055, 0.52, 20), tightMat);
                tightR.position.set(0.11, 0.38, 0);
                garmentGroup.add(tightR);

                studsGroups.legs = createChromeStuds([[-0.19, 0.74, 0.08], [0.19, 0.74, 0.08]], garmentGroup);
            }
            // 4. FLARE TRACK PANTS: High-Contrast Racing Stripes
            else if (item.type === 'track') {
                pantL.scale.set(1.15, 1.0, 1.15);
                pantR.scale.set(1.15, 1.0, 1.15);

                const stripeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
                const stripeL = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.88, 0.04), stripeMat);
                stripeL.position.set(-0.21, 0.52, 0);
                garmentGroup.add(stripeL);

                const stripeR = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.88, 0.04), stripeMat);
                stripeR.position.set(0.21, 0.52, 0);
                garmentGroup.add(stripeR);

                studsGroups.legs = createChromeStuds([[-0.14, 0.94, 0.07], [0.14, 0.94, 0.07]], garmentGroup);
            }
            // 5. UTILITY JOGGERS
            else if (item.type === 'joggers') {
                studsGroups.legs = createChromeStuds([[-0.15, 0.85, 0.06], [0.15, 0.85, 0.06]], garmentGroup);
            }
        }

        // =========================================================
        // D. FOOTWEAR REPLICATION
        // =========================================================
        else if (region === 'feet') {
            // 1. QUANTUM CHUNKY SNEAKERS
            if (item.type === 'sneakers') {
                const soleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
                const soleL = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.06, 0.24), soleMat);
                soleL.position.set(-0.11, 0.03, 0.03);
                garmentGroup.add(soleL);

                const upperL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.08, 0.20), mat);
                upperL.position.set(-0.11, 0.08, 0.03);
                garmentGroup.add(upperL);

                const soleR = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.06, 0.24), soleMat);
                soleR.position.set(0.11, 0.03, 0.03);
                garmentGroup.add(soleR);

                const upperR = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.08, 0.20), mat);
                upperR.position.set(0.11, 0.08, 0.03);
                garmentGroup.add(upperR);

                studsGroups.feet = createChromeStuds([[-0.11, 0.08, 0.12], [0.11, 0.08, 0.12]], garmentGroup);
            }
            // 2. COMBAT BOOTS
            else if (item.type === 'combat') {
                const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.20, 0.21), mat);
                bootL.position.set(-0.11, 0.10, 0.03);
                garmentGroup.add(bootL);

                const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.20, 0.21), mat);
                bootR.position.set(0.11, 0.10, 0.03);
                garmentGroup.add(bootR);

                studsGroups.feet = createChromeStuds([
                    [-0.11, 0.14, 0.12], [0.11, 0.14, 0.12],
                    [-0.11, 0.18, 0.11], [0.11, 0.18, 0.11]
                ], garmentGroup);
            }
            // 3. CANVAS KICKS
            else if (item.type === 'canvas') {
                const kickL = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.12, 0.21), mat);
                kickL.position.set(-0.11, 0.06, 0.03);
                garmentGroup.add(kickL);

                const kickR = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.12, 0.21), mat);
                kickR.position.set(0.11, 0.06, 0.03);
                garmentGroup.add(kickR);

                studsGroups.feet = createChromeStuds([[-0.11, 0.06, 0.12], [0.11, 0.06, 0.12]], garmentGroup);
            }
            // 4. CHELSEA BOOTS
            else if (item.type === 'chelsea') {
                const chelseaL = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.15, 0.22), mat);
                chelseaL.position.set(-0.11, 0.07, 0.03);
                garmentGroup.add(chelseaL);

                const chelseaR = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.15, 0.22), mat);
                chelseaR.position.set(0.11, 0.07, 0.03);
                garmentGroup.add(chelseaR);

                studsGroups.feet = createChromeStuds([[-0.11, 0.07, 0.12], [0.11, 0.07, 0.12]], garmentGroup);
            }
            // 5. CYBER SLIDES
            else if (item.type === 'slides') {
                const slideL = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.045, 0.22), mat);
                slideL.position.set(-0.11, 0.02, 0.03);
                garmentGroup.add(slideL);

                const strapL = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.05, 0.08), mat);
                strapL.position.set(-0.11, 0.055, 0.04);
                garmentGroup.add(strapL);

                const slideR = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.045, 0.22), mat);
                slideR.position.set(0.11, 0.02, 0.03);
                garmentGroup.add(slideR);

                const strapR = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.05, 0.08), mat);
                strapR.position.set(0.11, 0.055, 0.04);
                garmentGroup.add(strapR);

                studsGroups.feet = createChromeStuds([[-0.11, 0.07, 0.06], [0.11, 0.07, 0.06]], garmentGroup);
            }
        }

        garmentsRoot.add(garmentGroup);
        active3DGarments[region] = garmentGroup;
    }

    function rebuildAllActiveGarments() {
        Object.keys(selectedGarments).forEach(region => {
            if (selectedGarments[region]) {
                build3DGarmentMesh(region, selectedGarments[region]);
            }
        });
    }

    // -------------------------------------------------------------
    // 8. 3D RAYCASTING & CLICK-TO-DRESS ZONES
    // -------------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredMesh = null;

    function onMouseMove(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveMeshes, false);

        if (intersects.length > 0) {
            const hit = intersects[0].object;
            const region = hit.userData.region;

            if (hoveredMesh !== hit) {
                if (hoveredMesh && hoveredMesh.material && hoveredMesh.material.emissive) {
                    hoveredMesh.material.emissive.setHex(0x000000);
                }
                hoveredMesh = hit;
                if (hit.material && hit.material.emissive) {
                    hit.material.emissive.setHex(0x1a0f30);
                }
            }

            if (regionLabel && region) {
                regionLabel.textContent = `ZONE: ${region.toUpperCase()} • CLICK TO DRESS`;
                regionLabel.style.opacity = '1';
                renderer.domElement.style.cursor = 'pointer';
            }
        } else {
            if (hoveredMesh) {
                if (hoveredMesh && hoveredMesh.material && hoveredMesh.material.emissive) {
                    hoveredMesh.material.emissive.setHex(0x000000);
                }
                hoveredMesh = null;
            }
            if (regionLabel) regionLabel.style.opacity = '0';
            renderer.domElement.style.cursor = 'grab';
        }
    }

    function onCanvasClick(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveMeshes, false);

        if (intersects.length > 0) {
            const region = intersects[0].object.userData.region;
            if (region) selectRegionZone(region);
        }
    }

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onCanvasClick);

    // -------------------------------------------------------------
    // 9. UI WIRING & TRY-ON CONTROLS
    // -------------------------------------------------------------
    function selectRegionZone(regionName) {
        activeRegion = regionName;

        if (initialMessage) initialMessage.classList.remove('active');
        if (customizationView) customizationView.classList.remove('active');
        if (apparelListView) apparelListView.classList.add('active');

        if (apparelListTitle) apparelListTitle.textContent = `${regionName.toUpperCase()} OPTIONS (DISTINCT 3D STYLES)`;

        if (apparelGrid) {
            apparelGrid.innerHTML = '';
            apparelData[regionName].forEach(item => {
                const card = document.createElement('div');
                card.className = 'apparel-item';
                if (selectedGarments[regionName] && selectedGarments[regionName].id === item.id) {
                    card.classList.add('selected');
                }
                card.innerHTML = `
                    <div class="apparel-icon-box">${item.icon}</div>
                    <p style="font-weight: 700; font-size: 0.9rem; color: #fff;">${item.name}</p>
                    <span style="font-size: 0.75rem; color: var(--accent-cyan);">Try On in 3D ⚡</span>
                `;
                card.addEventListener('click', () => triggerTryOn(item, regionName));
                apparelGrid.appendChild(card);
            });
        }
    }

    function triggerTryOn(item, region) {
        selectedGarments[region] = item;
        build3DGarmentMesh(region, item);

        if (apparelListView) apparelListView.classList.remove('active');
        if (customizationView) customizationView.classList.add('active');

        if (selectedItemName) selectedItemName.textContent = item.name;

        // Reset Inputs for this garment
        if (customTextInput) customTextInput.value = '';
        if (toggleStudsInput) toggleStudsInput.checked = false;
        if (tieDyeColorInput) {
            tieDyeColorInput.value = item.defaultColor;
            if (colorHexLabel) colorHexLabel.textContent = item.defaultColor.toUpperCase();
        }
    }

    if (backToListBtn) {
        backToListBtn.addEventListener('click', () => {
            if (customizationView) customizationView.classList.remove('active');
            if (apparelListView) apparelListView.classList.add('active');
        });
    }

    if (removeGarmentBtn) {
        removeGarmentBtn.addEventListener('click', () => {
            if (!activeRegion) return;
            if (active3DGarments[activeRegion]) {
                garmentsRoot.remove(active3DGarments[activeRegion]);
                active3DGarments[activeRegion] = null;
                garmentMaterials[activeRegion] = null;
                studsGroups[activeRegion] = null;
            }
            selectedGarments[activeRegion] = null;
            if (customizationView) customizationView.classList.remove('active');
            if (apparelListView) apparelListView.classList.add('active');
        });
    }

    // Custom Typography Decal Overlay
    if (customTextInput) {
        customTextInput.addEventListener('input', (e) => {
            if (!activeRegion || !selectedGarments[activeRegion]) return;
            const currentItem = selectedGarments[activeRegion];
            if (currentItem.type === 'tee' && active3DGarments.torso) {
                const decalMesh = active3DGarments.torso.getObjectByName('tee-graphic-decal');
                if (decalMesh) {
                    decalMesh.material.map = createGraphicTeeTexture(e.target.value);
                    decalMesh.material.needsUpdate = true;
                }
            }
        });
    }

    // Chrome Metallic Studs
    if (toggleStudsInput) {
        toggleStudsInput.addEventListener('change', (e) => {
            if (!activeRegion || !studsGroups[activeRegion]) return;
            studsGroups[activeRegion].visible = e.target.checked;
        });
    }

    // Real-Time Color Dye
    if (tieDyeColorInput) {
        tieDyeColorInput.addEventListener('input', (e) => {
            const hex = e.target.value.toUpperCase();
            if (colorHexLabel) colorHexLabel.textContent = hex;
            if (!activeRegion || !garmentMaterials[activeRegion]) return;
            garmentMaterials[activeRegion].color.set(e.target.value);
        });
    }

    // Show Your Creativity Tint
    if (openCreativityBtn) {
        openCreativityBtn.addEventListener('click', () => {
            if (!activeRegion || !garmentMaterials[activeRegion]) return;
            const colors = ['#ff007f', '#00f0ff', '#ffc700', '#7928ca', '#ff5e00', '#00ff66', '#ffffff'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            garmentMaterials[activeRegion].color.set(randomColor);
            if (tieDyeColorInput) tieDyeColorInput.value = randomColor;
            if (colorHexLabel) colorHexLabel.textContent = randomColor.toUpperCase();
        });
    }

    // -------------------------------------------------------------
    // 10. SMART GENDER MORPHING & BASE AVATAR CUSTOMIZATION
    // -------------------------------------------------------------
    if (genderSelect) {
        genderSelect.addEventListener('change', (e) => {
            currentGender = e.target.value;
            if (genderBadge) {
                genderBadge.textContent = currentGender.charAt(0).toUpperCase() + currentGender.slice(1);
            }

            // FEMALE MORPHING
            if (currentGender === 'female') {
                // Soft runway curves, defined waist taper, flared hips
                chestMesh.scale.set(1.12, 1.0, 0.74);
                waistMesh.scale.set(0.96, 1.0, 0.68);
                hipsMesh.scale.set(1.18, 1.0, 0.76);
                shoulderL.position.x = -0.24;
                shoulderR.position.x = 0.24;
                armLeftUpper.position.x = -0.27;
                armRightUpper.position.x = 0.27;
                elbowL.position.x = -0.305;
                elbowR.position.x = 0.305;
                forearmLeft.position.x = -0.312;
                forearmRight.position.x = 0.312;
                handLeftMesh.position.x = -0.316;
                handRightMesh.position.x = 0.316;
                jawMesh.scale.set(0.92, 1.0, 0.90);

                // Smart Hair Switch to Feminine Style
                const femStyle = 'side-part';
                build3DHair(femStyle);
                if (hairStyleSelect) {
                    hairStyleSelect.value = femStyle;
                    if (hairBadge) hairBadge.textContent = '3D Editorial Side-Part';
                }
            }
            // MALE MORPHING
            else if (currentGender === 'male') {
                // Broad athletic shoulders, sculpted pectorals, athletic V-taper, chiseled square jaw
                chestMesh.scale.set(1.36, 1.0, 0.90);
                waistMesh.scale.set(1.12, 1.0, 0.78);
                hipsMesh.scale.set(1.04, 1.0, 0.72);
                shoulderL.position.x = -0.30;
                shoulderR.position.x = 0.30;
                armLeftUpper.position.x = -0.33;
                armRightUpper.position.x = 0.33;
                elbowL.position.x = -0.365;
                elbowR.position.x = 0.365;
                forearmLeft.position.x = -0.372;
                forearmRight.position.x = 0.372;
                handLeftMesh.position.x = -0.376;
                handRightMesh.position.x = 0.376;
                jawMesh.scale.set(1.14, 1.05, 1.10);

                // Smart Hair Switch to Masculine Style
                const mascStyle = 'short-crop';
                build3DHair(mascStyle);
                if (hairStyleSelect) {
                    hairStyleSelect.value = mascStyle;
                    if (hairBadge) hairBadge.textContent = '3D Modern Textured Crop';
                }
            }
            // NON-BINARY MORPHING
            else {
                chestMesh.scale.set(1.20, 1.0, 0.80);
                waistMesh.scale.set(1.02, 1.0, 0.72);
                hipsMesh.scale.set(1.12, 1.0, 0.74);
                shoulderL.position.x = -0.26;
                shoulderR.position.x = 0.26;
                armLeftUpper.position.x = -0.29;
                armRightUpper.position.x = 0.29;
                elbowL.position.x = -0.325;
                elbowR.position.x = 0.325;
                forearmLeft.position.x = -0.332;
                forearmRight.position.x = 0.332;
                handLeftMesh.position.x = -0.336;
                handRightMesh.position.x = 0.336;
                jawMesh.scale.set(1.02, 1.02, 0.98);

                const nbStyle = 'curly-puff';
                build3DHair(nbStyle);
                if (hairStyleSelect) {
                    hairStyleSelect.value = nbStyle;
                    if (hairBadge) hairBadge.textContent = '3D Textured Afro High Puff';
                }
            }

            // Rebuild active garments to match the new gender body frame!
            rebuildAllActiveGarments();
        });
    }

    // Ethnicity Preset
    if (ethnicitySelect) {
        ethnicitySelect.addEventListener('change', (e) => {
            const config = ethnicityPresets[e.target.value] || ethnicityPresets['default'];
            if (ethnicityBadge) ethnicityBadge.textContent = config.name;

            currentSkinTone = config.tone;
            skinMaterial.color.set(currentSkinTone);

            currentHairColor = config.hairColor;
            hairMaterial.color.set(currentHairColor);
            if (hairColorInput) hairColorInput.value = currentHairColor;

            eyeIrisMaterial.color.set(config.eyeColor);
        });
    }

    // 3D Hair Style Manual Switcher
    if (hairStyleSelect) {
        hairStyleSelect.addEventListener('change', (e) => {
            const styleKey = e.target.value;
            build3DHair(styleKey);
            if (hairBadge) {
                const optText = hairStyleSelect.options[hairStyleSelect.selectedIndex].text;
                hairBadge.textContent = optText.split('(')[0].trim();
            }
        });
    }

    // Hair Color Picker
    if (hairColorInput) {
        hairColorInput.addEventListener('input', (e) => {
            currentHairColor = e.target.value;
            hairMaterial.color.set(currentHairColor);
            if (hairColorName) hairColorName.textContent = 'Custom Shade';
        });
    }

    // Sleeve Length Control
    if (sleeveSelect) {
        sleeveSelect.addEventListener('change', (e) => {
            currentSleeveMode = e.target.value;
            if (sleeveBadge) {
                sleeveBadge.textContent = currentSleeveMode === 'short' ? 'Short Sleeves' : 'Long Sleeves';
            }

            if (active3DGarments.torso) {
                const lMesh = active3DGarments.torso.getObjectByName('sleeve-long-mesh-l');
                const rMesh = active3DGarments.torso.getObjectByName('sleeve-long-mesh-r');
                if (lMesh) lMesh.visible = (currentSleeveMode === 'long');
                if (rMesh) rMesh.visible = (currentSleeveMode === 'long');
            }
        });
    }

    // Skin Tone Swatches
    skinPicker.forEach(swatch => {
        swatch.addEventListener('click', () => {
            skinPicker.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            const tone = swatch.getAttribute('data-tone');
            currentSkinTone = tone;
            skinMaterial.color.set(tone);
        });
    });

    // Body Proportions
    if (bodyTypeSelect) {
        bodyTypeSelect.addEventListener('change', (e) => {
            currentBodyType = e.target.value;
            if (currentBodyType === 'slim') {
                chestMesh.scale.x *= 0.90;
                waistMesh.scale.x *= 0.88;
                thighLeft.scale.x = 0.85;
                thighRight.scale.x = 0.85;
            } else if (currentBodyType === 'plus') {
                chestMesh.scale.x *= 1.14;
                waistMesh.scale.x *= 1.16;
                hipsMesh.scale.x *= 1.15;
                thighLeft.scale.x = 1.18;
                thighRight.scale.x = 1.18;
            } else {
                chestMesh.scale.x = (currentGender === 'male') ? 1.36 : 1.12;
                waistMesh.scale.x = (currentGender === 'male') ? 1.12 : 0.96;
                thighLeft.scale.x = 1.0;
                thighRight.scale.x = 1.0;
            }
            rebuildAllActiveGarments();
        });
    }

    // Height Scale
    if (heightSlider) {
        heightSlider.addEventListener('input', (e) => {
            currentHeightScale = parseFloat(e.target.value);
            mannequinRoot.scale.y = currentHeightScale;
        });
    }

    // Turntable Controls
    if (autoRotateBtn) {
        autoRotateBtn.addEventListener('click', () => {
            if (controls) {
                controls.autoRotate = !controls.autoRotate;
                autoRotateBtn.classList.toggle('active', controls.autoRotate);
                if (autoRotateText) {
                    autoRotateText.textContent = controls.autoRotate ? 'Spinning...' : 'Auto-Spin';
                }
            }
        });
    }

    if (resetCamBtn) {
        resetCamBtn.addEventListener('click', () => {
            if (controls) {
                controls.reset();
                camera.position.set(0, 1.25, 3.8);
                controls.target.set(0, 1.1, 0);
            }
        });
    }

    // -------------------------------------------------------------
    // 11. ANIMATION LOOP & RESIZE OBSERVER
    // -------------------------------------------------------------
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Subtle organic breathing animation
        chestMesh.scale.z = (0.74 * (currentGender === 'male' ? 1.2 : 1.0)) + (Math.sin(elapsedTime * 1.8) * 0.015);

        if (controls) controls.update();
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});
