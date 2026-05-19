// =============================================
// DEĞİŞKEN TANIMLAMALARI
// =============================================
let scene, camera, renderer, listener;
let player, mzEnemy, mzModel;
let walls = [];
let books = [];
let gameState = 'start';
let lives = 3;
let currentBookQuestions = 0;
let currentBookLevel = '';
let booksCollected = 0;

let totalBooks = 3;
let completedBooks = 0;

let mzBaseSpeed = 0.08;
let mzCurrentSpeed = 0.08;
let mzSpeedIncrease = 0.02;

// KLAVYE TUŞLARI
const keys = {
    'w': false,
    'a': false,
    's': false,
    'd': false
};

const moveSpeed = 0.15;
const mouseSensitivity = 0.002;
const clock = new THREE.Clock();

let yaw = 0;
let pitch = 0;

const sounds = {};
let audioInitialized = false;

// HTML5 Audio
const audio = {
    ambient: new Audio("assets/ambient.mp3"),
    footstep: new Audio("assets/footstep.mp3"),
    book: new Audio("assets/book.mp3"),
    correct: new Audio("assets/correct.mp3"),
    wrong: new Audio("assets/wrong.mp3"),
    jumpscare: new Audio("assets/jumpscare.mp3")
};

audio.ambient.loop = true;
audio.ambient.volume = 0.3;
audio.footstep.loop = true;
audio.footstep.volume = 0.5;
audio.book.volume = 0.7;
audio.correct.volume = 0.7;
audio.wrong.volume = 0.8;
audio.jumpscare.volume = 1.0;

let isMoving = false;
let selectedQuestions = {
    'A2': [],
    'B1+': [],
    'C2': []
};

// Soru veritabanı
const questionDatabase = {
    'A2': [
        {
            question: "Choose the correct form: I ___ to school every day.",
            options: ["go", "goes", "going", "went"],
            correct: 0
        },
        {
            question: "What is the plural of 'child'?",
            options: ["childs", "childrens", "children", "childes"],
            correct: 2
        },
        {
            question: "She ___ a book right now.",
            options: ["read", "reads", "is reading", "reading"],
            correct: 2
        },
        {
            question: "My brother ___ basketball every weekend.",
            options: ["play", "plays", "playing", "played"],
            correct: 1
        },
        {
            question: "They ___ to the park yesterday.",
            options: ["go", "goes", "went", "going"],
            correct: 2
        },
        {
            question: "What is the opposite of 'hot'?",
            options: ["warm", "cold", "cool", "wet"],
            correct: 1
        },
        {
            question: "I ___ hungry right now.",
            options: ["am", "is", "are", "be"],
            correct: 0
        },
        {
            question: "She ___ her homework yesterday.",
            options: ["do", "does", "did", "doing"],
            correct: 2
        },
        {
            question: "We ___ English at school.",
            options: ["learn", "learns", "learning", "learned"],
            correct: 0
        },
        {
            question: "What time ___ you usually wake up?",
            options: ["do", "does", "did", "doing"],
            correct: 0
        }
    ],
    'B1+': [
        {
            question: "If I ___ rich, I would buy a big house.",
            options: ["am", "was", "were", "be"],
            correct: 2
        },
        {
            question: "The movie ___ by millions of people.",
            options: ["watched", "was watched", "were watched", "is watch"],
            correct: 1
        },
        {
            question: "I wish I ___ speak French fluently.",
            options: ["can", "could", "will", "would"],
            correct: 1
        },
        {
            question: "She has been working here ___ five years.",
            options: ["since", "for", "during", "while"],
            correct: 1
        },
        {
            question: "By the time you arrive, I ___ finished dinner.",
            options: ["will", "will have", "would", "had"],
            correct: 1
        },
        {
            question: "The book ___ I bought yesterday is very interesting.",
            options: ["what", "which", "who", "where"],
            correct: 1
        },
        {
            question: "He denied ___ the money.",
            options: ["steal", "to steal", "stealing", "stole"],
            correct: 2
        },
        {
            question: "I would rather ___ at home tonight.",
            options: ["stay", "to stay", "staying", "stayed"],
            correct: 0
        },
        {
            question: "The problem is too difficult ___ me to solve.",
            options: ["to", "for", "of", "with"],
            correct: 1
        },
        {
            question: "She suggested ___ to the cinema.",
            options: ["go", "to go", "going", "went"],
            correct: 2
        }
    ],
    'C2': [
        {
            question: "Had I known about the meeting, I ___ attended.",
            options: ["would have", "will have", "had", "have"],
            correct: 0
        },
        {
            question: "The proposal was ___ rejected by the committee.",
            options: ["categorically", "categorical", "category", "categories"],
            correct: 0
        },
        {
            question: "Not only ___ late, but he also forgot the documents.",
            options: ["he was", "was he", "he were", "were he"],
            correct: 1
        },
        {
            question: "Scarcely ___ the door when the phone rang.",
            options: ["I opened", "had I opened", "did I open", "I had opened"],
            correct: 1
        },
        {
            question: "Despite her reputation for candor, her response was so carefully worded that it seemed designed to ______ any direct admission of responsibility.",
            options: ["concede", "evade", "corroborate", "precipitate"],
            correct: 1
        },
        {
            question: "It is imperative that he ___ the report by tomorrow.",
            options: ["submits", "submit", "submitted", "will submit"],
            correct: 1
        },
        {
            question: "Were it not for his assistance, we ___ the project on time.",
            options: ["wouldn't complete", "won't complete", "wouldn't have completed", "didn't complete"],
            correct: 2
        },
        {
            question: "The phenomenon is ___ in nature and requires further investigation.",
            options: ["ubiquitous", "ubiquity", "ubiquitously", "ubiquitousness"],
            correct: 0
        },
        {
            question: "He speaks with such ___ that everyone believes him.",
            options: ["conviction", "convict", "convince", "convincing"],
            correct: 0
        },
        {
            question: "Notwithstanding the difficulties, the team ___ to complete the mission.",
            options: ["manage", "manages", "managed", "managing"],
            correct: 2
        }
    ]
};

function selectRandomQuestions() {
    selectedQuestions = {
        'A2': [],
        'B1+': [],
        'C2': []
    };

    Object.keys(questionDatabase).forEach(level => {
        const pool = [...questionDatabase[level]];
        const selected = [];
        
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * pool.length);
            selected.push(pool[randomIndex]);
            pool.splice(randomIndex, 1);
        }
        
        selectedQuestions[level] = selected;
    });
}

function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0a, 10, 60);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(10, 1.6, 10);

    listener = new THREE.AudioListener();
    camera.add(listener);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('gameContainer').appendChild(renderer.domElement);

    loadSounds();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;
    scene.add(directionalLight);

    const playerLight = new THREE.PointLight(0xffffff, 0.7, 50);
    playerLight.position.set(0, 2, 0);
    camera.add(playerLight);

    const spotLight = new THREE.SpotLight(0xff3333, 0.3);
    spotLight.position.set(0, 20, 0);
    spotLight.castShadow = true;
    spotLight.angle = Math.PI / 3;
    spotLight.penumbra = 0.5;
    spotLight.decay = 2;
    spotLight.distance = 100;
    scene.add(spotLight);

    const pointLight1 = new THREE.PointLight(0xff3333, 0.2, 40);
    pointLight1.position.set(30, 3, 30);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff3333, 0.2, 40);
    pointLight2.position.set(-30, 3, -30);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xff3333, 0.2, 40);
    pointLight3.position.set(30, 3, -30);
    scene.add(pointLight3);

    const pointLight4 = new THREE.PointLight(0xff3333, 0.2, 40);
    pointLight4.position.set(-30, 3, 30);
    scene.add(pointLight4);

    selectRandomQuestions();
    createWorld();
    createMZ();
    createBooks();

    player = {
        position: camera.position,
        radius: 0.5,
        height: 1.6
    };

    setupEventListeners();
    setupAudioUnlock();
    animate();
}

function loadSound(name, path, loop, volume) {
    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();

    audioLoader.load(path, function(buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(loop);
        sound.setVolume(volume);
    }, undefined, function(error) {
        console.warn(`Could not load sound: ${path}`, error);
    });

    sounds[name] = sound;
}

function loadSounds() {
    loadSound("ambient", "assets/ambient.mp3", true, 0.3);
    loadSound("footstep", "assets/footstep.mp3", true, 0.5);
    loadSound("book", "assets/book.mp3", false, 0.7);
    loadSound("correct", "assets/correct.mp3", false, 0.7);
    loadSound("wrong", "assets/wrong.mp3", false, 0.8);
    loadSound("jumpscare", "assets/jumpscare.mp3", false, 1.0);
}

function setupAudioUnlock() {
    document.addEventListener("click", () => {
        if (!audioInitialized) {
            if (listener.context.state === "suspended") {
                listener.context.resume().then(() => {
                    console.log("Three.js audio context resumed");
                });
            }
            
            if (gameState === 'playing') {
                audio.ambient.play().catch(e => console.warn("Could not play ambient audio:", e));
            }
            
            audioInitialized = true;
        }
    }, { once: true });
}

function playSound(soundName) {
    if (sounds[soundName] && sounds[soundName].buffer) {
        if (sounds[soundName].isPlaying) {
            sounds[soundName].stop();
        }
        sounds[soundName].play();
    }
}

function stopSound(soundName) {
    if (sounds[soundName] && sounds[soundName].isPlaying) {
        sounds[soundName].stop();
    }
}

function playHTML5Audio(audioName) {
    if (audio[audioName]) {
        audio[audioName].currentTime = 0;
        audio[audioName].play().catch(e => console.warn(`Could not play ${audioName}:`, e));
    }
}

function stopHTML5Audio(audioName) {
    if (audio[audioName]) {
        audio[audioName].pause();
    }
}

function createWorld() {
    const floorGeometry = new THREE.PlaneGeometry(200, 200);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a,
        roughness: 0.8,
        metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const ceilingGeometry = new THREE.PlaneGeometry(200, 200);
    const ceilingMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2a2a2a,
        roughness: 1
    });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 4;
    scene.add(ceiling);

    const wallData = [
        { x: 0, z: -50, w: 100, h: 4, d: 1 },
        { x: 0, z: 50, w: 100, h: 4, d: 1 },
        { x: -50, z: 0, w: 1, h: 4, d: 100 },
        { x: 50, z: 0, w: 1, h: 4, d: 100 },
        
        { x: -20, z: -20, w: 1, h: 4, d: 20 },
        { x: 20, z: -10, w: 30, h: 4, d: 1 },
        { x: -10, z: 20, w: 20, h: 4, d: 1 },
        { x: 30, z: 10, w: 1, h: 4, d: 25 },
        { x: -30, z: -10, w: 15, h: 4, d: 1 },
        { x: 10, z: 30, w: 1, h: 4, d: 15 },
        { x: 0, z: -30, w: 20, h: 4, d: 1 },
        { x: -15, z: 10, w: 1, h: 4, d: 20 },
        
        { x: 25, z: -25, w: 1, h: 4, d: 15 },
        { x: -25, z: 25, w: 18, h: 4, d: 1 },
        { x: 15, z: -35, w: 12, h: 4, d: 1 },
        { x: -35, z: 15, w: 1, h: 4, d: 18 },
        { x: 35, z: -15, w: 10, h: 4, d: 1 },
        { x: 5, z: 40, w: 1, h: 4, d: 10 },
        { x: -40, z: -25, w: 1, h: 4, d: 12 },
        { x: 40, z: 25, w: 15, h: 4, d: 1 },
        
        { x: -5, z: -40, w: 15, h: 4, d: 1 },
        { x: 12, z: 15, w: 1, h: 4, d: 12 },
        { x: -18, z: -5, w: 10, h: 4, d: 1 },
        { x: 28, z: 35, w: 1, h: 4, d: 8 },
        { x: -32, z: 35, w: 12, h: 4, d: 1 },
        { x: 38, z: -35, w: 1, h: 4, d: 15 }
    ];

    wallData.forEach(data => {
        createWall(data.x, data.z, data.w, data.h, data.d);
    });
}

function createWall(x, z, width, height, depth) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x00ff00 ,
        roughness: 0.9,
        metalness: 0.1
    });
    const wall = new THREE.Mesh(geometry, material);
    wall.position.set(x, height / 2, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);

    walls.push({
        mesh: wall,
        x: x,
        z: z,
        width: width,
        depth: depth
    });
}

function createMZ() {
    const loader = new THREE.GLTFLoader();
    
    console.log("MZ model yüklenmeye çalışılıyor...");
    
    loader.load("assets/mz.glb", 
        function(gltf) {
            mzModel = gltf.scene;
            
            const mzGroup = new THREE.Group();
            mzGroup.add(mzModel);
            mzGroup.scale.set(1.5, 1.5, 1.5);
            mzGroup.rotation.set(0, 0, 0);
            mzGroup.position.x = -40;
            mzGroup.position.z = -40;

            scene.add(mzGroup);

            mzModel.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            const pointLight = new THREE.PointLight(0xff0000, 1, 10);
            pointLight.position.set(0, 1.5, 0);
            mzModel.add(pointLight);

            scene.add(mzGroup);

            mzEnemy = {
                mesh: mzGroup,
                position: mzGroup.position,
                radius: 0.8
            };
            
            console.log("✅ MZ model başarıyla yüklendi!");
        },
        function(xhr) {
            console.log(`Model yükleniyor: ${(xhr.loaded / xhr.total * 100)}%`);
        },
        function(error) {
            console.error("❌ MZ model yüklenirken HATA:", error);
            console.warn("Yedek MZ oluşturuluyor...");
            createFallbackMZ();
        }
    );
}

function createFallbackMZ() {
    const group = new THREE.Group();
    
    const bodyGeometry = new THREE.BoxGeometry(0.8, 1.6, 0.4);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.8;
    body.castShadow = true;
    group.add(body);
    
    const headGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const headMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xcc0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.4
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.9;
    head.castShadow = true;
    group.add(head);
    
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 120px Courier New';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MZ', 128, 128);
    
    const texture = new THREE.CanvasTexture(canvas);
    const textMaterial = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true
    });
    const textGeometry = new THREE.PlaneGeometry(0.5, 0.5);
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(0, 1.9, 0.31);
    group.add(textMesh);
    
    const pointLight = new THREE.PointLight(0xff0000, 1, 10);
    pointLight.position.set(0, 1.5, 0);
    group.add(pointLight);
    
    group.position.set(-40, 0, -40);
    
    scene.add(group);
    
    mzModel = group;
    mzEnemy = {
        mesh: group,
        position: group.position,
        radius: 0.8
    };
}

function createBooks() {
    const levels = ['A2', 'B1+', 'C2'];

    function getRandomPosition(min, max) {
        return Math.random() * (max - min) + min;
    }

    levels.forEach(level => {
        const group = new THREE.Group();

        const bookGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.3);
        const bookMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffaa00,
            emissive: 0xffaa00,
            emissiveIntensity: 0.3
        });
        const book = new THREE.Mesh(bookGeometry, bookMaterial);
        book.rotation.y = Math.PI / 4;
        book.position.y = 0.3;
        book.castShadow = true;
        group.add(book);

        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffff00';
        ctx.font = 'bold 40px Courier New';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(level, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.MeshBasicMaterial({ 
            map: texture,
            transparent: true
        });
        const labelGeometry = new THREE.PlaneGeometry(0.5, 0.5);
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set(0, 0.8, 0);
        group.add(label);

        const pointLight = new THREE.PointLight(0xffff00, 0.8, 5);
        pointLight.position.set(0, 0.5, 0);
        group.add(pointLight);

        let x, z;
        let validPosition = false;

        while (!validPosition) {
            x = getRandomPosition(-35, 35);
            z = getRandomPosition(-35, 35);

            validPosition = true;

            const playerStartX = 10;
            const playerStartZ = 10;

            const dxPlayer = x - playerStartX;
            const dzPlayer = z - playerStartZ;
            const distanceFromPlayer = Math.sqrt(dxPlayer * dxPlayer + dzPlayer * dzPlayer);

            if (distanceFromPlayer < 20) {
                validPosition = false;
                continue;
            }

            for (let other of books) {
                const dx = x - other.position.x;
                const dz = z - other.position.z;
                const distance = Math.sqrt(dx * dx + dz * dz);

                if (distance < 15) {
                    validPosition = false;
                    break;
                }
            }
        }

        group.position.set(x, 0, z);

        scene.add(group);

        books.push({
            mesh: group,
            position: group.position,
            level: level,
            collected: false
        });
    });
}

function setupEventListeners() {
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
            keys[key] = true;
        }
        
        if (key === 'e') {
            checkBookInteraction();
        }
    });

    document.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
        if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
            keys[key] = false;
        }
    });

    document.getElementById('startScreen').addEventListener('click', () => {
        if (gameState === 'start') {
            gameState = 'playing';
            document.getElementById('startScreen').classList.add('hidden');
            renderer.domElement.requestPointerLock();
            
            if (listener.context.state === "suspended") {
                listener.context.resume().then(() => {
                    if (sounds.ambient && sounds.ambient.buffer && !sounds.ambient.isPlaying) {
                        sounds.ambient.play();
                    }
                });
            } else {
                if (sounds.ambient && sounds.ambient.buffer && !sounds.ambient.isPlaying) {
                    sounds.ambient.play();
                }
            }
            
            audio.ambient.play().catch(e => console.warn("Could not play ambient audio:", e));
        }
    });

    document.getElementById('retryButton').addEventListener('click', () => {
        resetGame();
    });

    document.addEventListener('mousemove', (e) => {
        if (document.pointerLockElement === renderer.domElement && gameState === 'playing') {
            yaw -= e.movementX * mouseSensitivity;
            pitch -= e.movementY * mouseSensitivity;
            pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
        }
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function updatePlayer() {
    const direction = new THREE.Vector3();
    const right = new THREE.Vector3();

    direction.set(
        -Math.sin(yaw),
        0,
        -Math.cos(yaw)
    );

    right.set(
        Math.cos(yaw),
        0,
        -Math.sin(yaw)
    );

    let moveX = 0;
    let moveZ = 0;
    let moving = false;

    if (keys['w']) {
        moveX += direction.x * moveSpeed;
        moveZ += direction.z * moveSpeed;
        moving = true;
    }
    if (keys['s']) {
        moveX -= direction.x * moveSpeed;
        moveZ -= direction.z * moveSpeed;
        moving = true;
    }
    if (keys['a']) {
        moveX -= right.x * moveSpeed;
        moveZ -= right.z * moveSpeed;
        moving = true;
    }
    if (keys['d']) {
        moveX += right.x * moveSpeed;
        moveZ += right.z * moveSpeed;
        moving = true;
    }

    if (moving && !isMoving) {
        isMoving = true;
        if (sounds.footstep && sounds.footstep.buffer && !sounds.footstep.isPlaying) {
            sounds.footstep.play();
        }
        playHTML5Audio("footstep");
    } else if (!moving && isMoving) {
        isMoving = false;
        stopSound("footstep");
        stopHTML5Audio("footstep");
    }

    const newX = camera.position.x + moveX;
    const newZ = camera.position.z + moveZ;

    if (!checkWallCollision(newX, camera.position.z)) {
        camera.position.x = newX;
    }

    if (!checkWallCollision(camera.position.x, newZ)) {
        camera.position.z = newZ;
    }

    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;
}

function checkWallCollision(x, z) {
    for (let wall of walls) {
        const halfWidth = wall.width / 2;
        const halfDepth = wall.depth / 2;
        
        if (x > wall.x - halfWidth - player.radius &&
            x < wall.x + halfWidth + player.radius &&
            z > wall.z - halfDepth - player.radius &&
            z < wall.z + halfDepth + player.radius) {
            return true;
        }
    }
    return false;
}

function updateMZ() {
    if (!mzEnemy || !mzEnemy.mesh) return;
    
    const deltaTime = clock.getDelta();
    
    const dx = camera.position.x - mzEnemy.position.x;
    const dz = camera.position.z - mzEnemy.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance > 0) {
        const direction = new THREE.Vector3(dx / distance, 0, dz / distance);
        const moveAmount = direction.multiplyScalar(mzCurrentSpeed);
        
        const newX = mzEnemy.position.x + moveAmount.x;
        const newZ = mzEnemy.position.z + moveAmount.z;

        if (!checkMZWallCollision(newX, mzEnemy.position.z)) {
            mzEnemy.position.x = newX;
        }

        if (!checkMZWallCollision(mzEnemy.position.x, newZ)) {
            mzEnemy.position.z = newZ;
        }

        const targetPosition = new THREE.Vector3(camera.position.x, mzEnemy.position.y, camera.position.z);
        mzEnemy.mesh.lookAt(targetPosition);
    }

    const playerDist = Math.sqrt(
        Math.pow(camera.position.x - mzEnemy.position.x, 2) +
        Math.pow(camera.position.z - mzEnemy.position.z, 2)
    );

    if (playerDist < 2.5) {
        triggerJumpscare();
    }
}

function checkMZWallCollision(x, z) {
    for (let wall of walls) {
        const halfWidth = wall.width / 2;
        const halfDepth = wall.depth / 2;
        
        if (x > wall.x - halfWidth - mzEnemy.radius &&
            x < wall.x + halfWidth + mzEnemy.radius &&
            z > wall.z - halfDepth - mzEnemy.radius &&
            z < wall.z + halfDepth + mzEnemy.radius) {
            return true;
        }
    }
    return false;
}

function checkBookInteraction() {
    if (gameState !== 'playing') return;

    books.forEach(book => {
        if (!book.collected) {
            const distance = Math.sqrt(
                Math.pow(camera.position.x - book.position.x, 2) +
                Math.pow(camera.position.z - book.position.z, 2)
            );

            if (distance < 3) {
                book.collected = true;
                booksCollected++;
                scene.remove(book.mesh);
                currentBookQuestions = 0;
                currentBookLevel = book.level;
                
                playSound("book");
                playHTML5Audio("book");
                
                showQuestion(book.level);
            }
        }
    });
}

function updateBookPrompts() {
    let nearBook = false;

    books.forEach(book => {
        if (!book.collected) {
            const distance = Math.sqrt(
                Math.pow(camera.position.x - book.position.x, 2) +
                Math.pow(camera.position.z - book.position.z, 2)
            );

            if (distance < 3) {
                nearBook = true;
            }
        }
    });

    document.getElementById('interactPrompt').style.display = nearBook ? 'block' : 'none';
}

function showQuestion(level) {
    gameState = 'question';
    document.exitPointerLock();

    const modal = document.getElementById('questionModal');
    const questions = selectedQuestions[level];
    const question = questions[currentBookQuestions];

    document.getElementById('questionTitle').textContent = `${level} Level Question ${currentBookQuestions + 1}/3`;
    document.getElementById('questionText').textContent = question.question;
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        button.onclick = () => checkAnswer(index, question.correct, level);
        optionsDiv.appendChild(button);
    });

    modal.style.display = 'block';
}

function checkAnswer(selected, correct, level) {
    const modal = document.getElementById('questionModal');
    modal.style.display = 'none';
    
    if (selected === correct) {
        playSound("correct");
        playHTML5Audio("correct");
        
        currentBookQuestions++;
        
        if (currentBookQuestions < 3) {
            setTimeout(() => showQuestion(level), 500);
        } else {
            completedBooks++;
            updateBookCounter();
            gameState = 'playing';
            renderer.domElement.requestPointerLock();
            if (completedBooks >= totalBooks) {
                showWinScreen();
                return;
            }
        }
    } else {
        lives--;
        document.getElementById('lives').textContent = `Lives: ${lives}`;
        
        mzCurrentSpeed += mzSpeedIncrease;
        console.log(`MZ speed increased to: ${mzCurrentSpeed.toFixed(2)}`);
        
        playSound("wrong");
        playHTML5Audio("wrong");
        
        triggerDamage();
        
        if (lives <= 0) {
            setTimeout(() => triggerJumpscare(), 1000);
        } else {
            currentBookQuestions++;
            
            if (currentBookQuestions < 3) {
                setTimeout(() => showQuestion(level), 1000);
            } else {
                completedBooks++;
                updateBookCounter();
                if (completedBooks >= totalBooks) {
                    showWinScreen();
                    return;
                }
                gameState = 'playing';
                setTimeout(() => {
                    renderer.domElement.requestPointerLock();
                }, 500);
            }
        }
    }
}

function updateBookCounter() {
    const remaining = totalBooks - completedBooks;
    document.getElementById('bookCounter').textContent = `Remaining Books: ${remaining}`;
}

function triggerDamage() {
    const flash = document.getElementById('damageFlash');
    flash.style.opacity = '0.7';
    setTimeout(() => {
        flash.style.opacity = '0';
    }, 200);

    const jumpscare = document.getElementById('jumpscare');
    jumpscare.style.display = 'flex';
    setTimeout(() => {
        jumpscare.style.display = 'none';
    }, 300);
}

function triggerJumpscare() {
    gameState = 'gameOver';
    document.exitPointerLock();
    
    stopSound("footstep");
    stopHTML5Audio("footstep");
    
    audio.jumpscare.currentTime = 0;
    audio.jumpscare.play();
    
    const jumpscareOverlay = document.getElementById('jumpscareOverlay');
    jumpscareOverlay.classList.add('active');
    
    setTimeout(() => {
        jumpscareOverlay.classList.remove('active');
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }, 2000);
}

function resetGame() {
    lives = 3;
    booksCollected = 0;
    currentBookQuestions = 0;
    currentBookLevel = '';
    completedBooks = 0;
    mzCurrentSpeed = mzBaseSpeed;
    gameState = 'playing';

    document.getElementById('lives').textContent = `Lives: ${lives}`;
    document.getElementById('bookCounter').textContent = `Remaining Books: 3`;
    document.getElementById('gameOverScreen').classList.add('hidden');

    camera.position.set(10, 1.6, 10);
    yaw = 0;
    pitch = 0;
    camera.rotation.set(0, 0, 0);

    if (mzEnemy && mzEnemy.position) {
        mzEnemy.position.set(-40, 0, -40);
    }

    books.forEach(book => {
        if (book.collected) {
            scene.add(book.mesh);
            book.collected = false;
        }
    });

    selectRandomQuestions();

    renderer.domElement.requestPointerLock();
    
    if (sounds.ambient && sounds.ambient.buffer && !sounds.ambient.isPlaying) {
        sounds.ambient.play();
    }
    
    if (audio.ambient.paused) {
        audio.ambient.play().catch(e => console.warn("Could not play ambient audio:", e));
    }
    
    console.log("Game reset - MZ speed reset to:", mzBaseSpeed);
}

function animate() {
    requestAnimationFrame(animate);

    if (gameState === 'playing') {
        updatePlayer();
        updateMZ();
        updateBookPrompts();

        books.forEach(book => {
            if (!book.collected) {
                book.mesh.rotation.y += 0.01;
            }
        });
    }

    renderer.render(scene, camera);
}

function showWinScreen() {
    gameState = 'win';
    document.exitPointerLock();

    stopSound("footstep");
    stopHTML5Audio("footstep");

    const winScreen = document.createElement("div");
    winScreen.style.position = "fixed";
    winScreen.style.top = "0";
    winScreen.style.left = "0";
    winScreen.style.width = "100%";
    winScreen.style.height = "100%";
    winScreen.style.background = "rgba(0,0,0,0.9)";
    winScreen.style.display = "flex";
    winScreen.style.flexDirection = "column";
    winScreen.style.justifyContent = "center";
    winScreen.style.alignItems = "center";
    winScreen.style.color = "white";
    winScreen.style.fontSize = "48px";
    winScreen.style.zIndex = "9999";
    winScreen.style.textAlign = "center";

    winScreen.innerHTML = `
        🎉 CONGRATS 🎉 <br><br>
        You Collected All Books! <br><br>
        <button id="restartGameBtn" style="
            padding: 15px 30px;
            font-size: 20px;
            cursor: pointer;
        ">Play Again</button>
    `;

    document.body.appendChild(winScreen);

    document.getElementById("restartGameBtn").onclick = () => {
        document.body.removeChild(winScreen);
        resetGame();
    };
}

// =============================================
// JOYSTICK KONTROLLERİ - TEK VE DOĞRU VERSİYON
// =============================================

class JoystickController {
    constructor(joystickId, handleId, type = 'movement') {
        this.handle = document.getElementById(handleId);
        this.container = document.getElementById(joystickId);
        this.type = type;
        this.active = false;
        this.direction = { x: 0, y: 0 };
        
        this.sensitivity = type === 'movement' ? 1.0 : 3.0; // Bakış hassasiyeti artırıldı
        this.deadzone = 0.15;
        
        if (!this.handle || !this.container) {
            console.log('Joystick elemanları bulunamadı');
            return;
        }
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.handle.addEventListener('mousedown', (e) => this.start(e));
        window.addEventListener('mousemove', (e) => this.move(e));
        window.addEventListener('mouseup', (e) => this.stop(e));
        
        this.handle.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.start(e);
        }, { passive: false });
        
        window.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.move(e);
        }, { passive: false });
        
        window.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stop(e);
        });
    }
    
    start(e) {
        e.preventDefault();
        this.active = true;
        this.handle.style.transition = 'none';
        this.handle.style.transform = 'scale(0.9)';
    }
    
    move(e) {
        if (!this.active || gameState !== 'playing') return;
        e.preventDefault();
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const rect = this.container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        let deltaX = clientX - centerX;
        let deltaY = clientY - centerY;
        
        const maxDistance = 35;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > maxDistance) {
            deltaX = (deltaX / distance) * maxDistance;
            deltaY = (deltaY / distance) * maxDistance;
        }
        
        this.handle.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.9)`;
        
        let normX = deltaX / maxDistance;
        let normY = deltaY / maxDistance;
        
        const magnitude = Math.sqrt(normX * normX + normY * normY);
        if (magnitude < this.deadzone) {
            normX = 0;
            normY = 0;
        }
        
        this.direction.x = normX;
        this.direction.y = normY;
        
        if (this.type === 'movement') {
            this.handleMovement();
        } else {
            this.handleLook();
        }
    }
    
    stop(e) {
        if (!this.active) return;
        e.preventDefault();
        
        this.active = false;
        this.handle.style.transition = 'transform 0.2s ease';
        this.handle.style.transform = 'translate(0px, 0px) scale(1)';
        this.direction.x = 0;
        this.direction.y = 0;
        
        if (this.type === 'movement') {
            keys.w = false;
            keys.a = false;
            keys.s = false;
            keys.d = false;
        }
    }
    
    handleMovement() {
        keys.w = false;
        keys.a = false;
        keys.s = false;
        keys.d = false;
        
        if (this.direction.y < -0.3) keys.w = true;
        if (this.direction.y > 0.3) keys.s = true;
        if (this.direction.x < -0.3) keys.a = true;
        if (this.direction.x > 0.3) keys.d = true;
    }
    
    handleLook() {
        if (!this.active) return;
        
        // Bakış hassasiyeti - artırıldı
        const lookSpeed = 0.002;
        
        // Yaw ve pitch'i güncelle
        yaw -= this.direction.x * lookSpeed * 50;
        pitch -= this.direction.y * lookSpeed * 50;
        
        // Pitch sınırlaması
        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
        
        // Kamerayı doğrudan güncelle
        camera.rotation.order = 'YXZ';
        camera.rotation.y = yaw;
        camera.rotation.x = pitch;
        
        // Görsel geribildirim
        if (Math.abs(this.direction.x) > 0.1 || Math.abs(this.direction.y) > 0.1) {
            this.handle.style.backgroundColor = '#ffff00';
        } else {
            this.handle.style.backgroundColor = 'rgba(255, 255, 0, 0.9)';
        }
    }
}

class InteractButtonController {
    constructor(buttonId) {
        this.button = document.getElementById(buttonId);
        if (!this.button) return;
        
        this.button.addEventListener('click', (e) => this.trigger(e));
        this.button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.trigger(e);
        });
    }
    
    trigger(e) {
        e.preventDefault();
        
        this.button.style.transform = 'translateX(-50%) scale(0.8)';
        setTimeout(() => {
            this.button.style.transform = 'translateX(-50%) scale(1)';
        }, 200);
        
        if (gameState === 'playing') {
            checkBookInteraction();
        }
    }
}

class PointerLockController {
    constructor(buttonId) {
        this.button = document.getElementById(buttonId);
        if (!this.button) return;
        
        this.button.addEventListener('click', () => this.toggleLock());
        this.button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.toggleLock();
        });
    }
    
    toggleLock() {
        if (document.pointerLockElement === renderer.domElement) {
            document.exitPointerLock();
            this.button.style.background = 'rgba(76, 175, 80, 0.9)';
        } else {
            renderer.domElement.requestPointerLock();
            this.button.style.background = 'rgba(255, 0, 0, 0.9)';
        }
    }
}

// Oyunu başlat
document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('startScreen');
    
    if (startScreen) {
        const startGame = () => {
            if (gameState === 'start') {
                gameState = 'playing';
                startScreen.classList.add('hidden');
                
                try {
                    renderer.domElement.requestPointerLock();
                } catch(e) {
                    console.log('Pointer lock hatası:', e);
                }
                
                if (listener && listener.context.state === "suspended") {
                    listener.context.resume();
                }
                if (sounds.ambient && sounds.ambient.buffer) {
                    sounds.ambient.play();
                }
            }
        };
        
        startScreen.addEventListener('click', startGame);
        startScreen.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startGame();
        });
    }
    
    setTimeout(() => {
        if (document.getElementById('moveHandle')) {
            new JoystickController('movementJoystick', 'moveHandle', 'movement');
            new JoystickController('lookJoystick', 'lookHandle', 'look');
            new InteractButtonController('interactButton');
            new PointerLockController('lockPointerButton');
            console.log('Joystick kontrolleri aktif!');
        }
    }, 1000);
});

// Oyunu başlat
init();