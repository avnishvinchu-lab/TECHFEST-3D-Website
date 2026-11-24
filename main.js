import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// Scene, camera and renderer
const canvas = document.querySelector('#world');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x080914, 0.025);
const camera = new THREE.PerspectiveCamera(42, innerWidth/innerHeight, .1, 120);
camera.position.set(0, 0, 13);
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene,camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight), .9, .55, .12));

// Lights
scene.add(new THREE.AmbientLight(0x9b9bff, 1.1));
const key = new THREE.PointLight(0x8c5bff, 80, 35); key.position.set(4,5,7); scene.add(key);
const cyan = new THREE.PointLight(0x45dfff, 60, 28); cyan.position.set(-5,-2,4); scene.add(cyan);
const rim = new THREE.PointLight(0xbca1ff, 45, 25); rim.position.set(0,4,-5); scene.add(rim);

// Procedural alien-tech planet with a wireframe shell and orbit rings
const planetGroup = new THREE.Group(); planetGroup.position.set(3.2,.05,0); scene.add(planetGroup);
const sphereGeo = new THREE.IcosahedronGeometry(2.15, 5);
const sphereMat = new THREE.MeshPhysicalMaterial({color:0x51408f, metalness:.45, roughness:.28, emissive:0x171038, emissiveIntensity:.65, clearcoat:.8, clearcoatRoughness:.2});
const planet = new THREE.Mesh(sphereGeo,sphereMat); planetGroup.add(planet);
const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(2.18,2), new THREE.MeshBasicMaterial({color:0x79dfff,wireframe:true,transparent:true,opacity:.18}));
planetGroup.add(wire);
const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(2.27,48,48),new THREE.MeshBasicMaterial({color:0x7654ff,side:THREE.BackSide,transparent:true,opacity:.12}));planetGroup.add(atmosphere);
function ring(radius,tube,color,tilt){const m=new THREE.Mesh(new THREE.TorusGeometry(radius,tube,12,180),new THREE.MeshStandardMaterial({color,metalness:.7,roughness:.25,emissive:color,emissiveIntensity:.5}));m.rotation.set(tilt.x,tilt.y,tilt.z);planetGroup.add(m);return m}
const rings=[ring(3.15,.018,0x63dcff,{x:1.18,y:.2,z:.3}),ring(3.65,.012,0xa66cff,{x:.55,y:.5,z:-.35}),ring(2.8,.009,0xc7ff63,{x:1.45,y:-.25,z:.65})];

// Mini spacecraft: assembled from primitive meshes (no external model required)
const ship = new THREE.Group(); ship.position.set(5.5,-2.4,.3); ship.scale.setScalar(.48); scene.add(ship);
const silver = new THREE.MeshStandardMaterial({color:0xc8c9e9,metalness:.85,roughness:.24});
const dark = new THREE.MeshStandardMaterial({color:0x20243d,metalness:.8,roughness:.3});
const glowMat = new THREE.MeshBasicMaterial({color:0x62e5ff});
const hull = new THREE.Mesh(new THREE.ConeGeometry(.48,2.25,6),silver); hull.rotation.z=-Math.PI/2; ship.add(hull);
const cockpit = new THREE.Mesh(new THREE.SphereGeometry(.25,24,16),new THREE.MeshPhysicalMaterial({color:0x3ed9ff,metalness:.35,roughness:.08,emissive:0x116c99,emissiveIntensity:1.4}));cockpit.position.set(.15,0,.25);ship.add(cockpit);
for(const side of [-1,1]){const wing=new THREE.Mesh(new THREE.BoxGeometry(.9,.08,.65),dark);wing.position.set(-.2,side*.48,0);wing.rotation.z=side*.15;ship.add(wing);const thruster=new THREE.Mesh(new THREE.CylinderGeometry(.09,.13,.42,12),glowMat);thruster.rotation.z=Math.PI/2;thruster.position.set(-1.05,side*.34,0);ship.add(thruster)}
const engineGlow=new THREE.PointLight(0x51dfff,5,4);engineGlow.position.set(-1.3,0,0);ship.add(engineGlow);

// Floating robot drone built from geometry primitives
const drone=new THREE.Group();drone.position.set(-2.2,-2.2,1);scene.add(drone);
const botMat=new THREE.MeshStandardMaterial({color:0xb6a2ff,metalness:.8,roughness:.22});
const botDark=new THREE.MeshStandardMaterial({color:0x20253d,metalness:.75,roughness:.25});
const botHead=new THREE.Mesh(new THREE.BoxGeometry(.85,.75,.65),botMat);drone.add(botHead);
const visor=new THREE.Mesh(new THREE.BoxGeometry(.63,.14,.68),new THREE.MeshBasicMaterial({color:0x48dcff}));visor.position.set(0,.03,.34);drone.add(visor);
const antenna=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.38,8),glowMat);antenna.position.set(0,.55,0);drone.add(antenna);
const antennaTip=new THREE.Mesh(new THREE.SphereGeometry(.08,12,12),new THREE.MeshBasicMaterial({color:0xc7ff63}));antennaTip.position.set(0,.77,0);drone.add(antennaTip);
const botBody=new THREE.Mesh(new THREE.BoxGeometry(.56,.4,.45),botDark);botBody.position.y=-.55;drone.add(botBody);
for(const x of [-.42,.42]){const ear=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.18,12),silver);ear.rotation.z=Math.PI/2;ear.position.set(x,0,0);drone.add(ear)}

// Star field and animated particle ribbons
const count=1800, positions=new Float32Array(count*3), colors=new Float32Array(count*3);
for(let i=0;i<count;i++){const radius=THREE.MathUtils.randFloat(8,45),theta=Math.random()*Math.PI*2,phi=Math.acos(THREE.MathUtils.randFloatSpread(2));positions[i*3]=radius*Math.sin(phi)*Math.cos(theta);positions[i*3+1]=radius*Math.cos(phi);positions[i*3+2]=radius*Math.sin(phi)*Math.sin(theta);const c=new THREE.Color().setHSL(.55+Math.random()*.2,.8,.55+Math.random()*.35);colors.set([c.r,c.g,c.b],i*3)}
const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));starGeo.setAttribute('color',new THREE.BufferAttribute(colors,3));
const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({size:.035,vertexColors:true,transparent:true,opacity:.9, sizeAttenuation:true}));scene.add(stars);
function particleRibbon(radius, color, phase){const arr=[];for(let i=0;i<600;i++){const t=i/599*Math.PI*2;arr.push(Math.cos(t)*radius,Math.sin(t*2+phase)*.45,Math.sin(t)*radius)}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));const line=new THREE.Line(g,new THREE.LineBasicMaterial({color,transparent:true,opacity:.48}));line.position.set(3.2,0,-.3);scene.add(line);return line}
const ribbons=[particleRibbon(3.8,0x59d9ff,0),particleRibbon(4.2,0xa66cff,1.2)];

// Mouse parallax
let pointerX=0,pointerY=0,scroll=0;
addEventListener('pointermove',e=>{pointerX=(e.clientX/innerWidth-.5)*2;pointerY=(e.clientY/innerHeight-.5)*2},{passive:true});
const sections=[...document.querySelectorAll('main section')];
function updateScroll(){scroll=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight);document.querySelector('.progress i').style.width=(scroll*100)+'%'}
addEventListener('scroll',updateScroll,{passive:true});updateScroll();
const clock=new THREE.Clock();
function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();
  planet.rotation.y=t*.12;planet.rotation.x=Math.sin(t*.18)*.08;wire.rotation.y=-t*.08;
  rings[0].rotation.z+=.0015;rings[1].rotation.z-=.001;rings[2].rotation.z+=.0008;
  ship.position.y=-2.4+Math.sin(t*1.1)*.25;ship.rotation.y=Math.sin(t*.5)*.3;ship.rotation.z=Math.sin(t*.7)*.08;
  drone.position.y=-2.2+Math.sin(t*1.5)*.18;drone.rotation.y=Math.sin(t*.8)*.35;
  stars.rotation.y=t*.006;stars.rotation.x=Math.sin(t*.05)*.025;
  ribbons.forEach((r,i)=>{r.rotation.y=t*(i?.08:-.06)});
  // Scroll transforms move camera through the scene and shift the hero's 3D objects.
  const targetZ=13-scroll*5.5;camera.position.z+=(targetZ-camera.position.z)*.035;
  camera.position.y+=(scroll*2.0-camera.position.y)*.025;
  camera.position.x+=(pointerX*.48-scroll*1.4-camera.position.x)*.025;
  camera.lookAt(1.1-scroll*1.3,0,0);
  planetGroup.position.y=Math.sin(t*.4)*.12-scroll*.7;
  composer.render();
}
animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight)});

// Event card tilt
document.querySelectorAll('[data-tilt]').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(800px) rotateY(${x*7}deg) rotateX(${-y*6}deg) translateY(-4px)`});card.addEventListener('pointerleave',()=>card.style.transform='')});
// Mobile menu
const menu=document.querySelector('.menu'),nav=document.querySelector('.topbar nav');menu.addEventListener('click',()=>nav.classList.toggle('open'));nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
// Demo countdown: replace targetDate with your actual festival date before launch.
const targetDate=new Date(Date.now()+24*86400000+12*3600000+48*60000+9*1000);
function tick(){const ms=Math.max(0,targetDate-Date.now());document.querySelector('#days').textContent=String(Math.floor(ms/86400000)).padStart(3,'0');document.querySelector('#hours').textContent=String(Math.floor(ms/3600000)%24).padStart(2,'0');document.querySelector('#minutes').textContent=String(Math.floor(ms/60000)%60).padStart(2,'0');document.querySelector('#seconds').textContent=String(Math.floor(ms/1000)%60).padStart(2,'0')}
tick();setInterval(tick,1000);
