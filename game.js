let scene, camera, renderer, spacecraft, controls, raycaster, mouse;
let planets = [];
//Ola
const planetasSistemaSolar = [
    {
        id: 0,
        nome: "Sol",
        tamanho: 1391016,  // Diâmetro em quilômetros
        massa: 1.989e30,  // Massa em kg
        gravidade: 274,  // Gravidade em m/s²
        luas: 0,  // O Sol não tem luas
        posicao: [-6, -6], // O Sol é o centro do sistema solar
        img:"assets/2k_sun.jpg"
    },
    {
        id: 1,
        nome: "Mercúrio",
        tamanho: 4879,  // Diâmetro em quilômetros
        massa: 3.285e23,  // Massa em kg
        gravidade: 3.7,  // Gravidade em m/s²
        luas: 0,  // Número de luas
        posicao: [0.39, 0.15],
        img:"assets/2k_mercury.jpg"  // Posição no plano cartesiano (UA)
    },
    {
        id: 2,
        nome: "Vênus",
        tamanho: 12104,
        massa: 4.867e24,
        gravidade: 8.87,
        luas: 0,
        posicao: [0.72, -0.45],
        img:"assets/2k_venus_surface.jpg"
    },
    {
        id: 3,
        nome: "Terra",
        tamanho: 12742,
        massa: 5.972e24,
        gravidade: 9.81,
        luas: 1,  // Lua
        posicao: [1.0, 0.0],
        img:"assets/2k_earth_daymap.jpg"
    },
    {
        id: 4,
        nome: "Marte",
        tamanho: 6779,
        massa: 6.39e23,
        gravidade: 3.71,
        luas: 2,  // Fobos e Deimos
        posicao: [1.52, 0.6],
        img:"assets/2k_mars.jpg"
    },
    {
        id: 5,
        nome: "Júpiter",
        tamanho: 139820,
        massa: 1.898e27,
        gravidade: 24.79,
        luas: 79,  // Incluindo Ganimedes, Io, Europa, Calisto
        posicao: [5.2, -1.3],
        img:"assets/2k_jupiter.jpg"
    },
    {
        id: 6,
        nome: "Saturno",
        tamanho: 116460,
        massa: 5.683e26,
        gravidade: 10.44,
        luas: 83,  // Incluindo Titã, Encélado
        posicao: [9.58, 1.2],
        img:"assets/2k_saturn.jpg"
    },
    {
        id: 7,
        nome: "Urano",
        tamanho: 50724,
        massa: 8.681e25,
        gravidade: 8.69,
        luas: 27,  // Incluindo Miranda, Ariel, Umbriel
        posicao: [19.22, -4.5],
        img:"assets/2k_uranus.jpg"
    },
    {
        id: 8,
        nome: "Netuno",
        tamanho: 49244,
        massa: 1.024e26,
        gravidade: 11.15,
        luas: 14,  // Incluindo Tritão
        posicao: [30.05, 5.0],
        img:"assets/2k_neptune.jpg"
    },
    {
        id: 9,
        nome: "Plutão",  // Planeta anão
        tamanho: 2376,
        massa: 1.309e22,
        gravidade: 0.62,
        luas: 5,  // Incluindo Caronte
        posicao: [39.48, -2.1]
    }
];

console.log(planetasSistemaSolar);


init();
animate();

function init() {

   


    // Scene
    scene = new THREE.Scene();
    const loader = new THREE.TextureLoader();
    loader.load("assets/8k_stars.jpg", function (texture) {
    const starGeometry = new THREE.SphereGeometry(5000, 64, 64); // Uma esfera gigante para envolver a cena
    const starMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide 
    });
    const starMesh = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(starMesh);
});

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Spacecraft (Player)
    spacecraft = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 3),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    spacecraft.position.set(0, 0, 0);
    scene.add(spacecraft);

    // Add planets to the scene
    // Add planets to the scene using real data
    const planetDistance = 200; // Não será necessário mais o planetDistance para a posição, mas pode ser útil para ajustar escalas.
    for (let i = 0; i < planetasSistemaSolar.length; i++) {
    const planetaInfo = planetasSistemaSolar[i]; // Pegando as informações do planeta

    const loader = new THREE.TextureLoader();
    const texture = loader.load(planetaInfo.img);
    texture.colorSpace = THREE.SRGBColorSpace;
    
    const planet = new THREE.Mesh(
        new THREE.SphereGeometry(planetaInfo.tamanho / 1000, 32, 32), // Ajustando o tamanho do planeta (escala dividida por 1000 para visualização)
        new THREE.MeshBasicMaterial({color: 0xFF8844,
            map: texture}) 
        // Cores aleatórias para os planetas
    );

    // Definir a posição usando as coordenadas (x, y)
    planet.position.set(
        planetaInfo.posicao[0] * planetDistance, // Multiplicando para ajustar a distância
        0,
        planetaInfo.posicao[1] * planetDistance // Se quiser, pode adicionar uma terceira coordenada para profundidade
    );

    // Definindo o nome do planeta
    planet.name = planetaInfo.nome;

    // Adicionar o planeta ao array de planetas e à cena
    planets.push(planet);
    scene.add(planet);
}


    // Raycaster for detecting clicks
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    function onClick(event) {
        // Atualizar a posição do mouse em relação à tela
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
        // Atualizar o raycaster com a posição do mouse
        raycaster.setFromCamera(mouse, camera);
    
        // Calcular interseções entre o raycaster e os objetos na cena
        const intersects = raycaster.intersectObjects(planets);
    
        // Verificar se algum planeta foi clicado
        if (intersects.length > 0) {
            const clickedPlanet = intersects[0].object;
            const distance = camera.position.distanceTo(clickedPlanet.position);

        // Condição para verificar se o planeta está a uma distância menor que 100
        if (distance <= 100) {
            console.log("Você clicou no planeta:", clickedPlanet.name);
            alert(`Você clicou no planeta ${clickedPlanet.name}!`);
        } else {
            console.log(`O planeta ${clickedPlanet.name} está muito distante (${Math.round(distance)} unidades)`);
        }
        }
    }
    
    // Adiciona o listener para o evento de clique
    window.addEventListener('click', onClick, false);


    // Movement controls
    controls = {
        forward: false,
        backward: false,
        left: false,
        right: false
    };

    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp': controls.forward = true; break;
            case 'ArrowDown': controls.backward = true; break;
            case 'ArrowLeft': controls.left = true; break;
            case 'ArrowRight': controls.right = true; break;
        }
    });

    window.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'ArrowUp': controls.forward = false; break;
            case 'ArrowDown': controls.backward = false; break;
            case 'ArrowLeft': controls.left = false; break;
            case 'ArrowRight': controls.right = false; break;
        }
    });

    // Click event listener to handle interaction with planets
    window.addEventListener('click', onMouseClick, false);

    // Window resize handling
    window.addEventListener('resize', onWindowResize, false);
}

function onMouseClick(event) {
    // Update mouse position for raycasting
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Set up the raycaster to point from the camera to the mouse position
    raycaster.setFromCamera(mouse, camera);

    // Check if any planets were clicked
    const intersects = raycaster.intersectObjects(planets);

    if (intersects.length > 0) {
        // Get the first intersected object (the clicked planet)
        const clickedPlanet = intersects[0].object;
        showInfoBox(clickedPlanet);
    }
}

function showInfoBox(planet) {
    const infoBox = document.getElementById('infoBox');
    infoBox.style.display = 'block';
    infoBox.innerHTML = `<h2>${planet.name}</h2>
                         <p>This is ${planet.name}. Explore more details here!</p>`;
    setTimeout(() => {
        infoBox.style.display = 'none';
    }, 5000);  // Hide info box after 5 seconds
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Spacecraft movement
    if (controls.forward) spacecraft.translateZ(-1);
    if (controls.backward) spacecraft.translateZ(1);
    if (controls.left) spacecraft.rotation.y += 0.05;
    if (controls.right) spacecraft.rotation.y -= 0.05;

    // Update camera position to follow the spacecraft
    camera.position.copy(spacecraft.position);
    camera.rotation.copy(spacecraft.rotation);

    // Find the nearest planet and update HUD
    let nearestPlanet = null;
    let minDistance = Infinity;
    planets.forEach(planet => {
        const distance = spacecraft.position.distanceTo(planet.position);
        if (distance < minDistance) {
            nearestPlanet = planet;
            minDistance = distance;
        }
    });

    document.getElementById('planetName').innerText = nearestPlanet ? nearestPlanet.name : 'None';
    document.getElementById('distance').innerText = nearestPlanet ? minDistance.toFixed(2) : 'N/A';

    renderer.render(scene, camera);
}