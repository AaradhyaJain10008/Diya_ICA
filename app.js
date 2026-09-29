// app.js - frayD Interactive 3D WebGL Runway Showcase Engine
// Powered by Three.js with PBR Materials, Realistic Anatomy, and Modular 3D Garments

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
    const openCreativityBtn = document.getElementById('open-creativity-btn');

    let activeRegion = null;
    let selectedGarments = { head: null, torso: null, legs: null, feet: null };
    let currentGender = 'female';
    let currentSkinTone = '#f3c299';
    let currentHairColor = '#3a2212';
    let currentSleeveMode = 'short';
    let currentBodyType = 'athletic';

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
            { id: 't1', name: 'Deconstructed Graphic Tee', icon: '👕', defaultColor: '#ff007f', type: 'tee' },
            { id: 't2', name: 'Hyper-Object Hoodie', icon: '🧥', defaultColor: '#7928ca', type: 'hoodie' },
            { id: 't3', name: 'Acid-Wash Biker Vest', icon: '🎽', defaultColor: '#1f1f2a', type: 'vest' },
            { id: 't4', name: 'Oversized Denim Jacket', icon: '👔', defaultColor: '#2c4d75', type: 'jacket' },
            { id: 't5', name: 'Techwear Zip Sweater', icon: '🥼', defaultColor: '#00f0ff', type: 'sweater' }
        ],
        legs: [
            { id: 'l1', name: 'Modular Cargo Trousers', icon: '👖', defaultColor: '#7928ca', type: 'cargo' },
            { id: 'l2', name: 'Distressed Selvedge Jeans', icon: '👖', defaultColor: '#2b4c7e', type: 'jeans' },
            { id: 'l3', name: 'Cyberpunk Shorts', icon: '🩳', defaultColor: '#ff007f', type: 'shorts' },
            { id: 'l4', name: 'Flare Track Pants', icon: '👖', defaultColor: '#1b1b24', type: 'track' },
            { id: 'l5', name: 'Utility Joggers', icon: '👖', defaultColor: '#3a3a48', type: 'joggers' }
        ],
        feet: [
            { id: 'f1', name: 'Quantum Chunky Sneakers', icon: '👟', defaultColor: '#ff007f', type: 'sneakers' },
            { id: 'f2', name: 'High-Contrast Combat Boots', icon: '🥾', defaultColor: '#22222b', type: 'combat' },
            { id: 'f3', name: 'High-Top Canvas Kicks', icon: '👟', defaultColor: '#00f0ff', type: 'canvas' },
            { id: 'f4', name: 'Leather Chelsea Boots', icon: '👞', defaultColor: '#4a2e1b', type: 'chelsea' },
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
    scene.fog = new THREE.FogExp2(0x0a0612, 0.09);

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
        controls.minDistance = 1.8;
        controls.maxDistance = 5.5;
        controls.maxPolarAngle = Math.PI / 2 + 0.05; // Do not go below floor
        controls.autoRotate = false;
        controls.autoRotateSpeed = 1.2;
    }

    // -------------------------------------------------------------
    // 4. STUDIO LIGHTING & STAGE ENVIRONMENT
    // -------------------------------------------------------------
    const studioLightsGroup = new THREE.Group();
    scene.add(studioLightsGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    studioLightsGroup.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff2e0, 1.4);
    keyLight.position.set(2.5, 4.5, 3.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0005;
    studioLightsGroup.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7928ca, 0.9);
    fillLight.position.set(-3.0, 2.5, 2.0);
    studioLightsGroup.add(fillLight);

    const rimLight1 = new THREE.SpotLight(0x00f0ff, 2.2, 10, Math.PI / 4, 0.5);
    rimLight1.position.set(-2.2, 3.2, -2.8);
    rimLight1.target.position.set(0, 1.2, 0);
    studioLightsGroup.add(rimLight1);
    studioLightsGroup.add(rimLight1.target);

    const rimLight2 = new THREE.SpotLight(0xff007f, 2.2, 10, Math.PI / 4, 0.5);
    rimLight2.position.set(2.2, 3.2, -2.8);
    rimLight2.target.position.set(0, 1.2, 0);
    studioLightsGroup.add(rimLight2);
    studioLightsGroup.add(rimLight2.target);

    // Runway Platform / Studio Floor
    const floorGeo = new THREE.CylinderGeometry(1.65, 1.75, 0.08, 64);
    const floorMat = new THREE.MeshStandardMaterial({
        color: 0x140d24,
        roughness: 0.25,
        metalness: 0.65
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.04;
    floor.receiveShadow = true;
    scene.add(floor);

    // Runway Outer Glow Ring
    const ringGeo = new THREE.RingGeometry(1.72, 1.76, 64);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.002;
    scene.add(ring);

    // Lighting Modes
    function setLightingMode(mode) {
        if (mode === 'atelier') {
            ambientLight.color.setHex(0xffecd6);
            ambientLight.intensity = 0.8;
            keyLight.color.setHex(0xfff5e6);
            keyLight.intensity = 1.5;
            fillLight.color.setHex(0xc299ff);
            fillLight.intensity = 0.7;
            rimLight1.color.setHex(0xffc700);
            rimLight2.color.setHex(0xff99bb);
            ringMat.color.setHex(0xffc700);
        } else if (mode === 'cyber') {
            ambientLight.color.setHex(0x140d24);
            ambientLight.intensity = 0.5;
            keyLight.color.setHex(0x00f0ff);
            keyLight.intensity = 1.3;
            fillLight.color.setHex(0x7928ca);
            fillLight.intensity = 1.2;
            rimLight1.color.setHex(0x00f0ff);
            rimLight2.color.setHex(0xff007f);
            ringMat.color.setHex(0x00f0ff);
        } else if (mode === 'editorial') {
            ambientLight.color.setHex(0xffffff);
            ambientLight.intensity = 0.9;
            keyLight.color.setHex(0xffffff);
            keyLight.intensity = 1.6;
            fillLight.color.setHex(0xcccccc);
            fillLight.intensity = 0.6;
            rimLight1.color.setHex(0xffffff);
            rimLight2.color.setHex(0xffffff);
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
    // 5. PBR MATERIALS & ANATOMICAL MANNEQUIN SCULPTING
    // -------------------------------------------------------------
    const mannequinRoot = new THREE.Group();
    scene.add(mannequinRoot);

    // Realistic PBR Skin Material
    const skinMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(currentSkinTone),
        roughness: 0.38,
        metalness: 0.05,
        clearcoat: 0.22,
        clearcoatRoughness: 0.32,
        reflectivity: 0.4
    });

    // Undergarment base material (sleek minimalist bodysuit)
    const baseUnderwearMat = new THREE.MeshStandardMaterial({
        color: 0x181324,
        roughness: 0.6,
        metalness: 0.2
    });

    // Hair Material
    const hairMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(currentHairColor),
        roughness: 0.55,
        metalness: 0.15
    });

    // Sub-groups for anatomical parts
    const headGroup = new THREE.Group();
    headGroup.userData = { region: 'head', name: 'Head & Face' };
    const torsoGroup = new THREE.Group();
    torsoGroup.userData = { region: 'torso', name: 'Torso & Arms' };
    const legsGroup = new THREE.Group();
    legsGroup.userData = { region: 'legs', name: 'Legs & Waist' };
    const feetGroup = new THREE.Group();
    feetGroup.userData = { region: 'feet', name: 'Feet & Shoes' };

    mannequinRoot.add(headGroup);
    mannequinRoot.add(torsoGroup);
    mannequinRoot.add(legsGroup);
    mannequinRoot.add(feetGroup);

    // Interactive clickable meshes list for Raycaster
    const interactiveMeshes = [];

    // Helper: Register anatomical mesh
    function createBodyPartMesh(geo, mat, parent, regionTag) {
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { region: regionTag };
        parent.add(mesh);
        interactiveMeshes.push(mesh);
        return mesh;
    }

    // --- A. HEAD & NECK ---
    // Sculpted Head & Chin
    const headCranium = createBodyPartMesh(new THREE.SphereGeometry(0.12, 32, 28), skinMaterial, headGroup, 'head');
    headCranium.position.set(0, 1.84, 0);
    headCranium.scale.set(1.0, 1.25, 1.08);

    // Jaw & Chin Taper
    const jawGeo = new THREE.ConeGeometry(0.105, 0.18, 24);
    const headJaw = createBodyPartMesh(jawGeo, skinMaterial, headGroup, 'head');
    headJaw.position.set(0, 1.74, 0.02);
    headJaw.rotation.x = Math.PI;
    headJaw.scale.set(1.0, 1.0, 0.85);

    // Elegant Neck
    const neckGeo = new THREE.CylinderGeometry(0.055, 0.068, 0.15, 24);
    const neckMesh = createBodyPartMesh(neckGeo, skinMaterial, headGroup, 'head');
    neckMesh.position.set(0, 1.66, -0.01);

    // Chiseled Nose Bridge
    const noseGeo = new THREE.ConeGeometry(0.016, 0.05, 12);
    const noseMesh = new THREE.Mesh(noseGeo, skinMaterial);
    noseMesh.position.set(0, 1.82, 0.13);
    noseMesh.rotation.x = -Math.PI / 10;
    headGroup.add(noseMesh);

    // --- B. TORSO & SHOULDERS ---
    // Clavicle & Chest
    const chestGeo = new THREE.CylinderGeometry(0.19, 0.165, 0.28, 32);
    const chestMesh = createBodyPartMesh(chestGeo, skinMaterial, torsoGroup, 'torso');
    chestMesh.position.set(0, 1.45, 0);
    chestMesh.scale.set(1.15, 1.0, 0.75);

    // Waist Taper
    const waistGeo = new THREE.CylinderGeometry(0.15, 0.16, 0.22, 32);
    const waistMesh = createBodyPartMesh(waistGeo, skinMaterial, torsoGroup, 'torso');
    waistMesh.position.set(0, 1.22, 0);
    waistMesh.scale.set(1.0, 1.0, 0.72);

    // Pelvis / Hips
    const hipsGeo = new THREE.CylinderGeometry(0.165, 0.185, 0.20, 32);
    const hipsMesh = createBodyPartMesh(hipsGeo, baseUnderwearMat, torsoGroup, 'torso');
    hipsMesh.position.set(0, 1.04, 0);
    hipsMesh.scale.set(1.12, 1.0, 0.75);

    // Shoulders
    const shoulderL = createBodyPartMesh(new THREE.SphereGeometry(0.065, 20, 16), skinMaterial, torsoGroup, 'torso');
    shoulderL.position.set(-0.25, 1.54, 0);
    const shoulderR = createBodyPartMesh(new THREE.SphereGeometry(0.065, 20, 16), skinMaterial, torsoGroup, 'torso');
    shoulderR.position.set(0.25, 1.54, 0);

    // Upper Arms (Biceps)
    const upperArmGeo = new THREE.CylinderGeometry(0.045, 0.04, 0.28, 20);
    const armLeftUpper = createBodyPartMesh(upperArmGeo, skinMaterial, torsoGroup, 'torso');
    armLeftUpper.position.set(-0.28, 1.36, 0);
    armLeftUpper.rotation.z = -0.12;

    const armRightUpper = createBodyPartMesh(upperArmGeo, skinMaterial, torsoGroup, 'torso');
    armRightUpper.position.set(0.28, 1.36, 0);
    armRightUpper.rotation.z = 0.12;

    // Forearms
    const forearmGeo = new THREE.CylinderGeometry(0.038, 0.032, 0.28, 20);
    const forearmLeft = createBodyPartMesh(forearmGeo, skinMaterial, torsoGroup, 'torso');
    forearmLeft.position.set(-0.31, 1.10, 0.04);
    forearmLeft.rotation.z = -0.06;
    forearmLeft.rotation.x = 0.15;

    const forearmRight = createBodyPartMesh(forearmGeo, skinMaterial, torsoGroup, 'torso');
    forearmRight.position.set(0.31, 1.10, 0.04);
    forearmRight.rotation.z = 0.06;
    forearmRight.rotation.x = 0.15;

    // Stylized Hands
    const handGeo = new THREE.BoxGeometry(0.04, 0.10, 0.022);
    const handLeft = createBodyPartMesh(handGeo, skinMaterial, torsoGroup, 'torso');
    handLeft.position.set(-0.32, 0.92, 0.07);
    const handRight = createBodyPartMesh(handGeo, skinMaterial, torsoGroup, 'torso');
    handRight.position.set(0.32, 0.92, 0.07);

    // --- C. LEGS ---
    // Thighs
    const thighGeo = new THREE.CylinderGeometry(0.082, 0.062, 0.44, 24);
    const thighLeft = createBodyPartMesh(thighGeo, skinMaterial, legsGroup, 'legs');
    thighLeft.position.set(-0.11, 0.74, 0);
    thighLeft.rotation.z = -0.02;

    const thighRight = createBodyPartMesh(thighGeo, skinMaterial, legsGroup, 'legs');
    thighRight.position.set(0.11, 0.74, 0);
    thighRight.rotation.z = 0.02;

    // Knees
    const kneeL = createBodyPartMesh(new THREE.SphereGeometry(0.055, 18, 14), skinMaterial, legsGroup, 'legs');
    kneeL.position.set(-0.11, 0.50, 0.01);
    const kneeR = createBodyPartMesh(new THREE.SphereGeometry(0.055, 18, 14), skinMaterial, legsGroup, 'legs');
    kneeR.position.set(0.11, 0.50, 0.01);

    // Calves & Shins
    const calfGeo = new THREE.CylinderGeometry(0.058, 0.042, 0.44, 24);
    const calfLeft = createBodyPartMesh(calfGeo, skinMaterial, legsGroup, 'legs');
    calfLeft.position.set(-0.11, 0.27, 0);
    const calfRight = createBodyPartMesh(calfGeo, skinMaterial, legsGroup, 'legs');
    calfRight.position.set(0.11, 0.27, 0);

    // --- D. FEET ---
    const footGeo = new THREE.BoxGeometry(0.07, 0.05, 0.17);
    const footLeft = createBodyPartMesh(footGeo, skinMaterial, feetGroup, 'feet');
    footLeft.position.set(-0.11, 0.03, 0.03);
    const footRight = createBodyPartMesh(footGeo, skinMaterial, feetGroup, 'feet');
    footRight.position.set(0.11, 0.03, 0.03);

    // -------------------------------------------------------------
    // 6. PROCEDURAL 3D HAIR GEOMETRIES
    // -------------------------------------------------------------
    const hairContainer = new THREE.Group();
    headGroup.add(hairContainer);

    let activeHairMesh = null;

    function build3DHair(styleKey) {
        if (activeHairMesh) {
            hairContainer.remove(activeHairMesh);
            activeHairMesh = null;
        }

        const hairGroup = new THREE.Group();

        if (styleKey === 'side-part') {
            // Asymmetrical sweeping editorial wave
            const crown = new THREE.Mesh(new THREE.SphereGeometry(0.135, 24, 20), hairMaterial);
            crown.position.set(0, 1.88, -0.01);
            crown.scale.set(1.04, 1.1, 1.08);
            hairGroup.add(crown);

            const sweep = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.035, 14, 24, Math.PI), hairMaterial);
            sweep.position.set(0.04, 1.91, 0.05);
            sweep.rotation.z = -Math.PI / 4;
            hairGroup.add(sweep);
        } else if (styleKey === 'long-waves') {
            // Crown
            const crown = new THREE.Mesh(new THREE.SphereGeometry(0.138, 24, 20), hairMaterial);
            crown.position.set(0, 1.88, -0.01);
            hairGroup.add(crown);

            // Flowing shoulder drapes (Left & Right)
            const strandLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.02, 0.48, 16), hairMaterial);
            strandLeft.position.set(-0.13, 1.62, 0.03);
            strandLeft.rotation.z = -0.15;
            hairGroup.add(strandLeft);

            const strandRight = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.02, 0.48, 16), hairMaterial);
            strandRight.position.set(0.13, 1.62, 0.03);
            strandRight.rotation.z = 0.15;
            hairGroup.add(strandRight);

            // Back Cascade
            const backCascade = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.52, 16), hairMaterial);
            backCascade.position.set(0, 1.62, -0.11);
            hairGroup.add(backCascade);
        } else if (styleKey === 'curly-puff') {
            // High textured afro puff
            const puffCrown = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 20), hairMaterial);
            puffCrown.position.set(0, 1.94, -0.02);
            hairGroup.add(puffCrown);

            for (let i = 0; i < 6; i++) {
                const miniPuff = new THREE.Mesh(new THREE.SphereGeometry(0.065, 14, 14), hairMaterial);
                const angle = (i / 6) * Math.PI * 2;
                miniPuff.position.set(Math.cos(angle) * 0.11, 1.96 + Math.sin(angle) * 0.04, Math.sin(angle) * 0.11);
                hairGroup.add(miniPuff);
            }
        } else if (styleKey === 'short-crop') {
            const crop = new THREE.Mesh(new THREE.SphereGeometry(0.132, 24, 20), hairMaterial);
            crop.position.set(0, 1.88, 0);
            crop.scale.set(1.03, 1.15, 1.05);
            hairGroup.add(crop);
        } else if (styleKey === 'buzz-cut') {
            const buzz = new THREE.Mesh(new THREE.SphereGeometry(0.125, 24, 20), hairMaterial);
            buzz.position.set(0, 1.86, 0);
            buzz.scale.set(1.01, 1.18, 1.03);
            hairGroup.add(buzz);
        } // 'bald' adds nothing

        hairContainer.add(hairGroup);
        activeHairMesh = hairGroup;
    }

    build3DHair('side-part');

    // -------------------------------------------------------------
    // 7. MODULAR 3D GARMENT MESHES & PROCEDURAL STYLING
    // -------------------------------------------------------------
    const garmentsRoot = new THREE.Group();
    mannequinRoot.add(garmentsRoot);

    const active3DGarments = { head: null, torso: null, legs: null, feet: null };
    const garmentMaterials = { head: null, torso: null, legs: null, feet: null };
    const studsGroups = { head: null, torso: null, legs: null, feet: null };

    // Canvas Texture generator for Custom Text on Garments
    function createDecalTexture(text, textColor = '#ffffff', bgColor = null) {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        if (bgColor) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        if (text && text.trim().length > 0) {
            ctx.font = 'bold 76px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = textColor;
            ctx.letterSpacing = '6px';
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 12;
            ctx.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    // Helper: Build 3D metallic studs along surface
    function createChromeStuds(coordsArray, parent) {
        const studsGroup = new THREE.Group();
        const studGeo = new THREE.SphereGeometry(0.012, 12, 10);
        const chromeMat = new THREE.MeshStandardMaterial({
            color: 0xe0e8f0,
            metalness: 0.95,
            roughness: 0.12
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

    // Builder Functions for each 3D Garment
    function build3DGarmentMesh(region, item) {
        // Clean existing garment in this region
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

        // ------------------ HEADWEAR ------------------
        if (region === 'head') {
            if (item.type === 'snapback') {
                const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.132, 0.09, 24), mat);
                crown.position.set(0, 1.93, 0.01);
                garmentGroup.add(crown);

                const brim = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.012, 0.14), mat);
                brim.position.set(0, 1.90, 0.14);
                garmentGroup.add(brim);

                studsGroups.head = createChromeStuds([[-0.06, 1.93, 0.13], [0.06, 1.93, 0.13]], garmentGroup);
            } else if (item.type === 'beanie') {
                const dome = new THREE.Mesh(new THREE.SphereGeometry(0.135, 24, 20), mat);
                dome.position.set(0, 1.92, 0);
                dome.scale.set(1.02, 1.25, 1.05);
                garmentGroup.add(dome);

                const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.132, 0.024, 16, 32), mat);
                cuff.position.set(0, 1.88, 0);
                cuff.rotation.x = Math.PI / 2;
                garmentGroup.add(cuff);

                studsGroups.head = createChromeStuds([[-0.05, 1.88, 0.14], [0.05, 1.88, 0.14]], garmentGroup);
            } else if (item.type === 'bucket') {
                const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.132, 0.10, 24), mat);
                crown.position.set(0, 1.94, 0);
                garmentGroup.add(crown);

                const brim = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.06, 32, 1, true), mat);
                brim.position.set(0, 1.88, 0);
                brim.rotation.x = Math.PI;
                garmentGroup.add(brim);

                studsGroups.head = createChromeStuds([[0, 1.94, 0.125], [-0.08, 1.94, 0.11], [0.08, 1.94, 0.11]], garmentGroup);
            } else if (item.type === 'beret') {
                const puff = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.135, 0.05, 32), mat);
                puff.position.set(0.04, 1.94, 0.01);
                puff.rotation.z = -0.25;
                garmentGroup.add(puff);

                studsGroups.head = createChromeStuds([[0.05, 1.95, 0.12]], garmentGroup);
            } else if (item.type === 'balaclava') {
                const hood = new THREE.Mesh(new THREE.SphereGeometry(0.132, 24, 24), mat);
                hood.position.set(0, 1.85, 0);
                hood.scale.set(1.02, 1.35, 1.05);
                garmentGroup.add(hood);

                const neckCover = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.22, 24), mat);
                neckCover.position.set(0, 1.62, 0);
                garmentGroup.add(neckCover);

                studsGroups.head = createChromeStuds([[-0.06, 1.65, 0.09], [0.06, 1.65, 0.09]], garmentGroup);
            }
        }

        // ------------------ TORSO ------------------
        else if (region === 'torso') {
            if (item.type === 'tee') {
                // T-Shirt Body
                const teeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.18, 0.52, 32), mat);
                teeBody.position.set(0, 1.35, 0);
                teeBody.scale.set(1.18, 1.0, 0.82);
                garmentGroup.add(teeBody);

                // Ribbed Crew Collar
                const collar = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.014, 14, 32), mat);
                collar.position.set(0, 1.58, 0);
                collar.rotation.x = Math.PI / 2;
                garmentGroup.add(collar);

                // Short Sleeves
                const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.058, 0.16, 20), mat);
                sleeveL.position.set(-0.27, 1.44, 0);
                sleeveL.rotation.z = -0.35;
                garmentGroup.add(sleeveL);

                const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.058, 0.16, 20), mat);
                sleeveR.position.set(0.27, 1.44, 0);
                sleeveR.rotation.z = 0.35;
                garmentGroup.add(sleeveR);

                // Long Sleeve Extensions (hidden if short sleeve mode)
                const longExtL = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.042, 0.26, 20), mat);
                longExtL.name = 'sleeve-long-mesh-l';
                longExtL.position.set(-0.31, 1.23, 0.03);
                longExtL.rotation.z = -0.12;
                longExtL.visible = (currentSleeveMode === 'long');
                garmentGroup.add(longExtL);

                const longExtR = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.042, 0.26, 20), mat);
                longExtR.name = 'sleeve-long-mesh-r';
                longExtR.position.set(0.31, 1.23, 0.03);
                longExtR.rotation.z = 0.12;
                longExtR.visible = (currentSleeveMode === 'long');
                garmentGroup.add(longExtR);

                studsGroups.torso = createChromeStuds([
                    [-0.08, 1.46, 0.14], [0.08, 1.46, 0.14],
                    [-0.04, 1.38, 0.14], [0.04, 1.38, 0.14]
                ], garmentGroup);
            } else if (item.type === 'hoodie') {
                // Bulky Hoodie Body
                const hoodieBody = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.19, 0.56, 32), mat);
                hoodieBody.position.set(0, 1.34, 0);
                hoodieBody.scale.set(1.22, 1.0, 0.88);
                garmentGroup.add(hoodieBody);

                // Hood Cowl behind neck
                const cowl = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.045, 16, 32), mat);
                cowl.position.set(0, 1.62, -0.06);
                cowl.rotation.x = Math.PI / 3;
                garmentGroup.add(cowl);

                // Kangaroo Front Pouch
                const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.14, 0.06), mat);
                pouch.position.set(0, 1.20, 0.15);
                garmentGroup.add(pouch);

                // Full Sleeves
                const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.052, 0.46, 20), mat);
                armL.position.set(-0.30, 1.30, 0.02);
                armL.rotation.z = -0.18;
                garmentGroup.add(armL);

                const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.052, 0.46, 20), mat);
                armR.position.set(0.30, 1.30, 0.02);
                armR.rotation.z = 0.18;
                garmentGroup.add(armR);

                studsGroups.torso = createChromeStuds([
                    [-0.10, 1.22, 0.18], [0.10, 1.22, 0.18],
                    [0, 1.48, 0.15]
                ], garmentGroup);
            } else if (item.type === 'vest') {
                // Sleeveless Open Biker Vest
                const vestBody = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.18, 0.48, 32), mat);
                vestBody.position.set(0, 1.35, 0);
                vestBody.scale.set(1.18, 1.0, 0.82);
                garmentGroup.add(vestBody);

                // V-Lapels
                const lapelL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.02), mat);
                lapelL.position.set(-0.08, 1.46, 0.14);
                lapelL.rotation.z = -0.3;
                garmentGroup.add(lapelL);

                const lapelR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.02), mat);
                lapelR.position.set(0.08, 1.46, 0.14);
                lapelR.rotation.z = 0.3;
                garmentGroup.add(lapelR);

                studsGroups.torso = createChromeStuds([
                    [-0.07, 1.52, 0.15], [0.07, 1.52, 0.15],
                    [-0.09, 1.40, 0.15], [0.09, 1.40, 0.15]
                ], garmentGroup);
            } else if (item.type === 'jacket') {
                // Denim Structured Jacket
                const jacketBody = new THREE.Mesh(new THREE.CylinderGeometry(0.215, 0.19, 0.50, 32), mat);
                jacketBody.position.set(0, 1.34, 0);
                jacketBody.scale.set(1.2, 1.0, 0.85);
                garmentGroup.add(jacketBody);

                // Flapped Chest Pockets
                const pocketL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.02), mat);
                pocketL.position.set(-0.10, 1.42, 0.15);
                garmentGroup.add(pocketL);

                const pocketR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.02), mat);
                pocketR.position.set(0.10, 1.42, 0.15);
                garmentGroup.add(pocketR);

                // Sleeves
                const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.05, 0.46, 20), mat);
                armL.position.set(-0.29, 1.30, 0.02);
                armL.rotation.z = -0.16;
                garmentGroup.add(armL);

                const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.05, 0.46, 20), mat);
                armR.position.set(0.29, 1.30, 0.02);
                armR.rotation.z = 0.16;
                garmentGroup.add(armR);

                studsGroups.torso = createChromeStuds([
                    [0, 1.50, 0.15], [0, 1.40, 0.15], [0, 1.30, 0.15], [0, 1.20, 0.15]
                ], garmentGroup);
            } else if (item.type === 'sweater') {
                // High Zip Funnel Sweater
                const sweaterBody = new THREE.Mesh(new THREE.CylinderGeometry(0.208, 0.182, 0.50, 32), mat);
                sweaterBody.position.set(0, 1.34, 0);
                sweaterBody.scale.set(1.18, 1.0, 0.82);
                garmentGroup.add(sweaterBody);

                // Funnel Neck
                const funnelNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.085, 0.12, 24), mat);
                funnelNeck.position.set(0, 1.62, 0);
                garmentGroup.add(funnelNeck);

                const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.048, 0.46, 20), mat);
                armL.position.set(-0.29, 1.30, 0.02);
                armL.rotation.z = -0.16;
                garmentGroup.add(armL);

                const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.048, 0.46, 20), mat);
                armR.position.set(0.29, 1.30, 0.02);
                armR.rotation.z = 0.16;
                garmentGroup.add(armR);

                studsGroups.torso = createChromeStuds([[0, 1.64, 0.085], [0, 1.56, 0.14]], garmentGroup);
            }
        }

        // ------------------ LEGS ------------------
        else if (region === 'legs') {
            if (item.type === 'cargo' || item.type === 'jeans' || item.type === 'track' || item.type === 'joggers') {
                const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.092, 0.062, 0.88, 24), mat);
                legL.position.set(-0.11, 0.52, 0);
                garmentGroup.add(legL);

                const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.092, 0.062, 0.88, 24), mat);
                legR.position.set(0.11, 0.52, 0);
                garmentGroup.add(legR);

                const pelvisWaist = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.19, 0.22, 32), mat);
                pelvisWaist.position.set(0, 1.02, 0);
                pelvisWaist.scale.set(1.15, 1.0, 0.78);
                garmentGroup.add(pelvisWaist);

                if (item.type === 'cargo') {
                    // 3D Outer Cargo Pockets
                    const pocketL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.10), mat);
                    pocketL.position.set(-0.20, 0.65, 0);
                    garmentGroup.add(pocketL);

                    const pocketR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.10), mat);
                    pocketR.position.set(0.20, 0.65, 0);
                    garmentGroup.add(pocketR);

                    studsGroups.legs = createChromeStuds([[-0.20, 0.70, 0.04], [0.20, 0.70, 0.04]], garmentGroup);
                } else if (item.type === 'track') {
                    // White racing side stripe
                    const stripeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
                    const stripeL = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.86, 0.02), stripeMat);
                    stripeL.position.set(-0.20, 0.52, 0);
                    garmentGroup.add(stripeL);

                    const stripeR = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.86, 0.02), stripeMat);
                    stripeR.position.set(0.20, 0.52, 0);
                    garmentGroup.add(stripeR);
                } else if (item.type === 'joggers') {
                    // Elastic ribbed ankle cuffs
                    const cuffL = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.05, 0.06, 20), mat);
                    cuffL.position.set(-0.11, 0.10, 0);
                    garmentGroup.add(cuffL);

                    const cuffR = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.05, 0.06, 20), mat);
                    cuffR.position.set(0.11, 0.10, 0);
                    garmentGroup.add(cuffR);
                }
            } else if (item.type === 'shorts') {
                const shortL = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.088, 0.35, 24), mat);
                shortL.position.set(-0.11, 0.82, 0);
                garmentGroup.add(shortL);

                const shortR = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.088, 0.35, 24), mat);
                shortR.position.set(0.11, 0.82, 0);
                garmentGroup.add(shortR);

                const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.19, 0.22, 32), mat);
                waist.position.set(0, 1.02, 0);
                waist.scale.set(1.15, 1.0, 0.78);
                garmentGroup.add(waist);

                studsGroups.legs = createChromeStuds([[-0.18, 0.95, 0.08], [0.18, 0.95, 0.08]], garmentGroup);
            }
        }

        // ------------------ FOOTWEAR ------------------
        else if (region === 'feet') {
            if (item.type === 'sneakers') {
                // Quantum Chunky Sneakers (Sculpted Sole + Upper)
                const soleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
                const soleL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.05, 0.22), soleMat);
                soleL.position.set(-0.11, 0.025, 0.04);
                garmentGroup.add(soleL);

                const upperL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.07, 0.19), mat);
                upperL.position.set(-0.11, 0.065, 0.03);
                garmentGroup.add(upperL);

                const soleR = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.05, 0.22), soleMat);
                soleR.position.set(0.11, 0.025, 0.04);
                garmentGroup.add(soleR);

                const upperR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.07, 0.19), mat);
                upperR.position.set(0.11, 0.065, 0.03);
                garmentGroup.add(upperR);

                studsGroups.feet = createChromeStuds([[-0.11, 0.08, 0.12], [0.11, 0.08, 0.12]], garmentGroup);
            } else if (item.type === 'combat') {
                // High-Shaft Rugged Boots
                const bootShaftL = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.22, 20), mat);
                bootShaftL.position.set(-0.11, 0.14, 0);
                garmentGroup.add(bootShaftL);

                const bootFootL = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.07, 0.21), mat);
                bootFootL.position.set(-0.11, 0.04, 0.04);
                garmentGroup.add(bootFootL);

                const bootShaftR = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.22, 20), mat);
                bootShaftR.position.set(0.11, 0.14, 0);
                garmentGroup.add(bootShaftR);

                const bootFootR = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.07, 0.21), mat);
                bootFootR.position.set(0.11, 0.04, 0.04);
                garmentGroup.add(bootFootR);

                studsGroups.feet = createChromeStuds([[-0.11, 0.20, 0.06], [0.11, 0.20, 0.06]], garmentGroup);
            } else if (item.type === 'canvas') {
                const kickL = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.09, 0.20), mat);
                kickL.position.set(-0.11, 0.055, 0.03);
                garmentGroup.add(kickL);

                const kickR = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.09, 0.20), mat);
                kickR.position.set(0.11, 0.055, 0.03);
                garmentGroup.add(kickR);

                studsGroups.feet = createChromeStuds([[-0.11, 0.08, 0.11], [0.11, 0.08, 0.11]], garmentGroup);
            } else if (item.type === 'chelsea') {
                const chelseaL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.11, 0.20), mat);
                chelseaL.position.set(-0.11, 0.065, 0.03);
                garmentGroup.add(chelseaL);

                const chelseaR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.11, 0.20), mat);
                chelseaR.position.set(0.11, 0.065, 0.03);
                garmentGroup.add(chelseaR);
            } else if (item.type === 'slides') {
                const soleMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
                const slideSoleL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.03, 0.22), soleMat);
                slideSoleL.position.set(-0.11, 0.015, 0.04);
                garmentGroup.add(slideSoleL);

                const strapL = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.04, 0.09), mat);
                strapL.position.set(-0.11, 0.045, 0.04);
                garmentGroup.add(strapL);

                const slideSoleR = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.03, 0.22), soleMat);
                slideSoleR.position.set(0.11, 0.015, 0.04);
                garmentGroup.add(slideSoleR);

                const strapR = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.04, 0.09), mat);
                strapR.position.set(0.11, 0.045, 0.04);
                garmentGroup.add(strapR);
            }
        }

        garmentsRoot.add(garmentGroup);
        active3DGarments[region] = garmentGroup;
    }

    // -------------------------------------------------------------
    // 8. RAYCASTING & 3D INTERACTIVE ZONE SELECTION
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
                if (hoveredMesh) hoveredMesh.material.emissive?.setHex(0x000000);
                hoveredMesh = hit;
                if (hit.material.emissive) hit.material.emissive.setHex(0x1a0f30);
            }

            if (regionLabel && region) {
                regionLabel.textContent = `ZONE: ${region.toUpperCase()} • CLICK TO DRESS`;
                regionLabel.style.opacity = '1';
                renderer.domElement.style.cursor = 'pointer';
            }
        } else {
            if (hoveredMesh) {
                if (hoveredMesh.material.emissive) hoveredMesh.material.emissive.setHex(0x000000);
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
        if (tieDyeColorInput) tieDyeColorInput.value = item.defaultColor;
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

    // Custom Text Decal
    if (customTextInput) {
        customTextInput.addEventListener('input', (e) => {
            if (!activeRegion || !garmentMaterials[activeRegion]) return;
            const text = e.target.value;
            if (text.trim().length > 0) {
                const decal = createDecalTexture(text);
                garmentMaterials[activeRegion].map = decal;
                garmentMaterials[activeRegion].needsUpdate = true;
            } else {
                garmentMaterials[activeRegion].map = null;
                garmentMaterials[activeRegion].needsUpdate = true;
            }
        });
    }

    // Metallic Studs Toggle
    if (toggleStudsInput) {
        toggleStudsInput.addEventListener('change', (e) => {
            if (!activeRegion || !studsGroups[activeRegion]) return;
            studsGroups[activeRegion].visible = e.target.checked;
        });
    }

    // Real-Time Color Dye
    if (tieDyeColorInput) {
        tieDyeColorInput.addEventListener('input', (e) => {
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
        });
    }

    // -------------------------------------------------------------
    // 10. BASE AVATAR CUSTOMIZATION BINDINGS
    // -------------------------------------------------------------
    // Gender / Silhouette Morphing
    if (genderSelect) {
        genderSelect.addEventListener('change', (e) => {
            currentGender = e.target.value;
            if (genderBadge) {
                genderBadge.textContent = currentGender.charAt(0).toUpperCase() + currentGender.slice(1);
            }

            if (currentGender === 'female') {
                chestMesh.scale.set(1.15, 1.0, 0.75);
                waistMesh.scale.set(0.92, 1.0, 0.70);
                hipsMesh.scale.set(1.22, 1.0, 0.78);
                shoulderL.position.x = -0.24;
                shoulderR.position.x = 0.24;
            } else if (currentGender === 'male') {
                chestMesh.scale.set(1.30, 1.0, 0.85);
                waistMesh.scale.set(1.08, 1.0, 0.78);
                hipsMesh.scale.set(1.08, 1.0, 0.74);
                shoulderL.position.x = -0.28;
                shoulderR.position.x = 0.28;
            } else {
                chestMesh.scale.set(1.20, 1.0, 0.80);
                waistMesh.scale.set(1.0, 1.0, 0.74);
                hipsMesh.scale.set(1.14, 1.0, 0.76);
                shoulderL.position.x = -0.26;
                shoulderR.position.x = 0.26;
            }
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
        });
    }

    // 3D Hair Style
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

            // Update 3D tee sleeve visibility if equipped
            if (active3DGarments.torso) {
                const extL = active3DGarments.torso.getObjectByName('sleeve-long-mesh-l');
                const extR = active3DGarments.torso.getObjectByName('sleeve-long-mesh-r');
                if (extL) extL.visible = (currentSleeveMode === 'long');
                if (extR) extR.visible = (currentSleeveMode === 'long');
            }
        });
    }

    // Skin Tone Swatches
    if (skinPicker) {
        skinPicker.forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                skinPicker.forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
                currentSkinTone = swatch.getAttribute('data-tone');
                skinMaterial.color.set(currentSkinTone);
            });
        });
    }

    // Body Proportions
    if (bodyTypeSelect) {
        bodyTypeSelect.addEventListener('change', (e) => {
            currentBodyType = e.target.value;
            if (currentBodyType === 'slim') {
                mannequinRoot.scale.set(0.92, 1.0, 0.92);
            } else if (currentBodyType === 'athletic') {
                mannequinRoot.scale.set(1.0, 1.0, 1.0);
            } else if (currentBodyType === 'plus') {
                mannequinRoot.scale.set(1.15, 1.0, 1.15);
            }
        });
    }

    // Height Scale
    if (heightSlider) {
        heightSlider.addEventListener('input', (e) => {
            const h = parseFloat(e.target.value);
            mannequinRoot.scale.y = h;
        });
    }

    // -------------------------------------------------------------
    // 11. TURNTABLE & CAMERA CONTROLS
    // -------------------------------------------------------------
    if (autoRotateBtn && controls) {
        autoRotateBtn.addEventListener('click', () => {
            controls.autoRotate = !controls.autoRotate;
            autoRotateBtn.classList.toggle('active', controls.autoRotate);
            if (autoRotateText) {
                autoRotateText.textContent = controls.autoRotate ? 'Spinning...' : 'Auto-Spin';
            }
        });
    }

    if (resetCamBtn && controls) {
        resetCamBtn.addEventListener('click', () => {
            controls.reset();
            camera.position.set(0, 1.25, 3.8);
            controls.target.set(0, 1.1, 0);
        });
    }

    // Responsive Canvas Resize
    window.addEventListener('resize', () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // -------------------------------------------------------------
    // 12. ANIMATION LOOP
    // -------------------------------------------------------------
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();

        if (controls) controls.update();

        // Subtle runway light animation
        const time = clock.getElapsedTime();
        ring.rotation.z = time * 0.15;

        renderer.render(scene, camera);
    }

    animate();
});
