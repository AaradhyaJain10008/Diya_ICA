// app.js for frayD Interactive 3D Character Showcase

document.addEventListener('DOMContentLoaded', () => {
    // 1. References
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
    const skinPaths = document.querySelectorAll('.fig-skin');
    const bodyTypeSelect = document.getElementById('body-type');
    const heightSlider = document.getElementById('height-slider');
    const figureContainer = document.getElementById('figure-container');
    const humanSvg = document.getElementById('human-svg');

    // 2. GENDER SELECTION (MALE, FEMALE, NON-BINARY - DISTINCT FACE & BODY)
    if (genderSelect && figureContainer) {
        genderSelect.addEventListener('change', (e) => {
            const gender = e.target.value;
            figureContainer.classList.remove('gender-female', 'gender-male', 'gender-non-binary');
            figureContainer.classList.add(`gender-${gender}`);

            if (genderBadge) {
                genderBadge.textContent = gender.charAt(0).toUpperCase() + gender.slice(1);
            }
        });
    }

    // 3. SLEEVE LENGTH CONTROL (SHORT VS LONG SLEEVES)
    if (sleeveSelect && figureContainer) {
        sleeveSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            figureContainer.classList.remove('sleeves-short', 'sleeves-long');
            figureContainer.classList.add(`sleeves-${val}`);
            if (sleeveBadge) {
                sleeveBadge.textContent = val === 'short' ? 'Short Sleeves' : 'Long Sleeves';
            }
        });
    }

    // 4. ETHNICITY PRESETS
    const ethnicityPresets = {
        'default': { name: 'Global Standard', tone: '#f3c299', eyeColor: '#4a2e1b', hairColor: '#4a2e1b' },
        'south-asian': { name: 'South Asian', tone: '#e0ac69', eyeColor: '#2b170c', hairColor: '#1c0e07' },
        'east-asian': { name: 'East Asian', tone: '#ffdbac', eyeColor: '#21130b', hairColor: '#140a05' },
        'african': { name: 'Afro-Descendant', tone: '#4a2810', eyeColor: '#190d05', hairColor: '#0d0603' },
        'caucasian': { name: 'European', tone: '#ffebd4', eyeColor: '#2b5c8f', hairColor: '#7a5230' }
    };

    if (ethnicitySelect) {
        ethnicitySelect.addEventListener('change', (e) => {
            const presetKey = e.target.value;
            const config = ethnicityPresets[presetKey] || ethnicityPresets['default'];

            if (ethnicityBadge) ethnicityBadge.textContent = config.name;

            skinPaths.forEach(path => path.style.fill = config.tone);
            const grad2 = document.getElementById('skinGrad2');
            if (grad2) grad2.setAttribute('stop-color', config.tone);

            if (hairColorInput) hairColorInput.value = config.hairColor;
            updateHairColor(config.hairColor);

            const pupils = document.querySelectorAll('#pupil-left, #pupil-right');
            pupils.forEach(p => p.style.fill = config.eyeColor);
        });
    }

    // 5. 3D HAIR STYLE SWITCHER (LONG HAIR STRANDS BEHIND FACE)
    if (hairStyleSelect) {
        hairStyleSelect.addEventListener('change', (e) => {
            const styleKey = e.target.value;
            
            // Toggle front hair styles
            document.querySelectorAll('.fig-hair-style').forEach(h => h.classList.remove('active'));
            const targetHair = document.getElementById(`hair-${styleKey}`);
            if (targetHair) targetHair.classList.add('active');

            // Handle back hair strands (Long hair drops behind face/neck)
            const hairBackLong = document.getElementById('hair-back-long');
            if (hairBackLong) {
                if (styleKey === 'long-waves') {
                    hairBackLong.style.display = 'block';
                } else {
                    hairBackLong.style.display = 'none';
                }
            }

            if (hairBadge) {
                const selectedOption = hairStyleSelect.options[hairStyleSelect.selectedIndex];
                hairBadge.textContent = selectedOption.text.split('(')[0].trim();
            }
        });
    }

    function updateHairColor(color) {
        const hairElements = document.querySelectorAll('.fig-hair');
        hairElements.forEach(h => h.style.fill = color);
        
        const hairGrad1 = document.getElementById('hairGrad1');
        if (hairGrad1) hairGrad1.setAttribute('stop-color', color);

        const eyebrows = document.querySelectorAll('#eyebrow-left, #eyebrow-right');
        eyebrows.forEach(eb => eb.style.stroke = color);
    }

    if (hairColorInput) {
        hairColorInput.addEventListener('input', (e) => {
            updateHairColor(e.target.value);
            if (hairColorName) hairColorName.textContent = 'Custom Tone';
        });
    }

    // 6. SKIN TONE SWATCHES
    if (skinPicker) {
        skinPicker.forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                skinPicker.forEach(s => s.classList.remove('active'));
                const target = e.target;
                target.classList.add('active');
                const tone = target.getAttribute('data-tone');
                skinPaths.forEach(path => path.style.fill = tone);
            });
        });
    }

    // 7. BODY TYPE & HEIGHT
    if (bodyTypeSelect && figureContainer) {
        bodyTypeSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            figureContainer.classList.remove('body-slim', 'body-athletic', 'body-plus');
            figureContainer.classList.add(`body-${val}`);
        });
    }

    if (heightSlider && humanSvg) {
        heightSlider.addEventListener('input', (e) => {
            humanSvg.style.transform = `scaleY(${e.target.value})`;
        });
    }

    // 8. DISTINCT APPAREL TRY-ON LOGIC (EACH ITEM HAS UNIQUE VISUAL SHAPE)
    const figParts = document.querySelectorAll('.fig-part');
    const label = document.getElementById('region-label');
    const initialMessage = document.getElementById('initial-message');
    const apparelListView = document.getElementById('apparel-list-view');
    const customizationView = document.getElementById('customization-view');
    const apparelListTitle = document.getElementById('apparel-list-title');
    const apparelGrid = document.getElementById('apparel-grid');
    const removeGarmentBtn = document.getElementById('remove-garment-btn');

    // Mapping items to specific garment SVG element IDs
    const apparelData = {
        head: [
            { id: 'h1', name: 'Cyber Snapback Cap', icon: '🧢', targetSvg: 'garment-h1-snapback' },
            { id: 'h2', name: 'Acid Beanie', icon: '🎩', targetSvg: 'garment-h2-beanie' },
            { id: 'h3', name: 'Tactical Bucket Hat', icon: '🪖', targetSvg: 'garment-h3-bucket' },
            { id: 'h4', name: 'Vintage Beret', icon: '🎓', targetSvg: 'garment-h4-beret' },
            { id: 'h5', name: 'Streetwear Balaclava', icon: '🥷', targetSvg: 'garment-h5-balaclava' }
        ],
        torso: [
            { id: 't1', name: 'Deconstructed Graphic Tee', icon: '👕', targetSvg: 'garment-t1-tee' },
            { id: 't2', name: 'Hyper-Object Hoodie', icon: '🧥', targetSvg: 'garment-t2-hoodie' },
            { id: 't3', name: 'Acid-Wash Biker Vest', icon: '🎽', targetSvg: 'garment-t3-vest' },
            { id: 't4', name: 'Oversized Denim Jacket', icon: '👔', targetSvg: 'garment-t4-jacket' },
            { id: 't5', name: 'Techwear Zip Sweater', icon: '🥼', targetSvg: 'garment-t5-sweater' }
        ],
        legs: [
            { id: 'l1', name: 'Modular Cargo Trousers', icon: '👖', targetSvg: 'garment-l1-cargo' },
            { id: 'l2', name: 'Distressed Selvedge Jeans', icon: '👖', targetSvg: 'garment-l2-jeans' },
            { id: 'l3', name: 'Cyberpunk Shorts', icon: '🩳', targetSvg: 'garment-l3-shorts' },
            { id: 'l4', name: 'Flare Track Pants', icon: '👖', targetSvg: 'garment-l4-track' },
            { id: 'l5', name: 'Utility Joggers', icon: '👖', targetSvg: 'garment-l5-joggers' }
        ],
        feet: [
            { id: 'f1', name: 'Quantum Chunky Sneakers', icon: '👟', targetSvg: 'garment-f1-sneakers' },
            { id: 'f2', name: 'High-Contrast Combat Boots', icon: '🥾', targetSvg: 'garment-f2-boots' },
            { id: 'f3', name: 'High-Top Canvas Kicks', icon: '👟', targetSvg: 'garment-f3-canvas' },
            { id: 'f4', name: 'Leather Chelsea Boots', icon: '👞', targetSvg: 'garment-f4-chelsea' },
            { id: 'f5', name: 'Futuristic Cyber Slides', icon: '🩴', targetSvg: 'garment-f5-slides' }
        ]
    };

    let activeRegion = null;
    let selectedGarments = { head: null, torso: null, legs: null, feet: null };

    figParts.forEach(part => {
        part.addEventListener('mouseenter', () => {
            const regionName = part.getAttribute('data-region');
            if (label) {
                label.textContent = `ZONE: ${regionName.toUpperCase()}`;
                label.style.opacity = '1';
            }
        });

        part.addEventListener('mouseleave', () => {
            if (label) label.style.opacity = '0';
        });

        part.addEventListener('click', () => {
            const regionName = part.getAttribute('data-region');
            activeRegion = regionName;

            if (initialMessage) initialMessage.classList.remove('active');
            if (customizationView) customizationView.classList.remove('active');
            if (apparelListView) apparelListView.classList.add('active');

            if (apparelListTitle) apparelListTitle.textContent = `${regionName.toUpperCase()} OPTIONS (DISTINCT STYLES)`;

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
                        <span style="font-size: 0.75rem; color: var(--accent-cyan);">Try On ⚡</span>
                    `;
                    card.addEventListener('click', () => triggerTryOn(item, regionName));
                    apparelGrid.appendChild(card);
                });
            }
        });
    });

    function triggerTryOn(item, region) {
        selectedGarments[region] = item;

        // Container container element for this region
        const tryonContainer = document.getElementById(`${region}-tryon-container`);
        if (tryonContainer) {
            tryonContainer.classList.add('active');
            
            // Hide all garment items in this container
            const allGarmentsInRegion = tryonContainer.querySelectorAll('.garment-item');
            allGarmentsInRegion.forEach(g => g.classList.remove('active'));

            // Activate specific selected SVG garment shape
            const targetGarmentSvg = document.getElementById(item.targetSvg);
            if (targetGarmentSvg) {
                targetGarmentSvg.classList.add('active');
            }
        }

        if (apparelListView) apparelListView.classList.remove('active');
        if (customizationView) customizationView.classList.add('active');

        const itemNameElem = document.getElementById('selected-item-name');
        if (itemNameElem) itemNameElem.textContent = item.name;

        // Reset inputs
        const customText = document.getElementById('custom-text');
        const toggleStuds = document.getElementById('toggle-studs');
        const tieDyeColor = document.getElementById('tie-dye-color');

        if (customText) customText.value = '';
        if (toggleStuds) toggleStuds.checked = false;
        if (tieDyeColor) tieDyeColor.value = region === 'head' ? '#00f0ff' : (region === 'torso' ? '#ff007f' : '#7928ca');
    }

    if (removeGarmentBtn) {
        removeGarmentBtn.addEventListener('click', () => {
            if (!activeRegion) return;
            const tryonContainer = document.getElementById(`${activeRegion}-tryon-container`);
            if (tryonContainer) {
                tryonContainer.classList.remove('active');
                const allGarments = tryonContainer.querySelectorAll('.garment-item');
                allGarments.forEach(g => g.classList.remove('active'));
            }
            selectedGarments[activeRegion] = null;
            if (customizationView) customizationView.classList.remove('active');
            if (apparelListView) apparelListView.classList.add('active');
        });
    }

    // 9. CUSTOMIZATION TOOLKIT INPUT BINDINGS
    const backToListBtn = document.getElementById('back-to-list');
    const customTextInput = document.getElementById('custom-text');
    const toggleStudsInput = document.getElementById('toggle-studs');
    const tieDyeColorInput = document.getElementById('tie-dye-color');
    const openCreativityBtn = document.getElementById('open-creativity-btn');

    if (backToListBtn) {
        backToListBtn.addEventListener('click', () => {
            if (customizationView) customizationView.classList.remove('active');
            if (apparelListView) apparelListView.classList.add('active');
        });
    }

    if (customTextInput) {
        customTextInput.addEventListener('input', (e) => {
            if (!activeRegion) return;
            const tryonText = document.querySelector(`#${activeRegion}-tryon-container .tryon-text`);
            if (tryonText) tryonText.textContent = e.target.value;
        });
    }

    if (toggleStudsInput) {
        toggleStudsInput.addEventListener('change', (e) => {
            if (!activeRegion) return;
            const studsGroup = document.querySelector(`#${activeRegion}-tryon-container .tryon-studs-group`);
            if (studsGroup) studsGroup.setAttribute('opacity', e.target.checked ? '1' : '0');
        });
    }

    if (tieDyeColorInput) {
        tieDyeColorInput.addEventListener('input', (e) => {
            if (!activeRegion || !selectedGarments[activeRegion]) return;
            const currentItem = selectedGarments[activeRegion];
            const garmentSvg = document.getElementById(currentItem.targetSvg);
            if (garmentSvg) {
                const paths = garmentSvg.querySelectorAll('.tryon-garment');
                paths.forEach(p => p.setAttribute('fill', e.target.value));
            }
        });
    }

    if (openCreativityBtn) {
        openCreativityBtn.addEventListener('click', () => {
            if (!activeRegion || !selectedGarments[activeRegion]) return;
            const colors = ['#ff007f', '#00f0ff', '#ffc700', '#7928ca', '#ff5e00', '#00ff66'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const currentItem = selectedGarments[activeRegion];
            const garmentSvg = document.getElementById(currentItem.targetSvg);
            if (garmentSvg) {
                const paths = garmentSvg.querySelectorAll('.tryon-garment');
                paths.forEach(p => p.setAttribute('fill', randomColor));
            }
            alert(`🎨 Applied creative tint (${randomColor}) to ${currentItem.name}!`);
        });
    }
});
