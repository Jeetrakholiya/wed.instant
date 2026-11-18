import * as THREE from 'three';

/** Scroll-driven paper scroll with a wound parchment mesh and turning brass-capped rollers. */
export function mountGujaratiScroll3d(wrap: HTMLElement) {
  const canvas = document.createElement('canvas');
  canvas.className = 'gujarati-scroll-renderer';
  canvas.setAttribute('aria-hidden', 'true');
  wrap.prepend(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2400);
  camera.position.z = 1400;
  scene.add(new THREE.AmbientLight(0xffefd4, 1.75));
  const goldLight = new THREE.DirectionalLight(0xffe1a1, 2.5);
  goldLight.position.set(-220, 420, 650);
  scene.add(goldLight);
  const softFill = new THREE.DirectionalLight(0x9eacc0, 0.7);
  softFill.position.set(360, -180, 400);
  scene.add(softFill);

  const paperTexture = new THREE.TextureLoader().load('/assets/paper.webp', () => draw());
  paperTexture.colorSpace = THREE.SRGBColorSpace;
  paperTexture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 120), new THREE.MeshStandardMaterial({
    map: paperTexture, bumpMap: paperTexture, bumpScale: 1.1, roughness: 0.96, metalness: 0.015, side: THREE.DoubleSide
  }));
  scene.add(paper);
  // The parchment is lined in burgundy silk. Its reverse faces the guest on the coil.
  paper.material.side = THREE.FrontSide;
  const backingMaterial = new THREE.MeshStandardMaterial({ color:0x78162d, bumpMap:paperTexture, bumpScale:.65, roughness:.72, side:THREE.BackSide });
  const backing = new THREE.Mesh(paper.geometry, backingMaterial);
  scene.add(backing);

  // Revolve the photographed silhouette. UVs project the original engraving
  // onto the front half and mirror it around the unseen back of each spindle.
  const rodMaterial = new THREE.MeshBasicMaterial({transparent:true, alphaTest:.08, toneMapped:false, side:THREE.DoubleSide});
  const topRoll = new THREE.Mesh(new THREE.BufferGeometry(),rodMaterial);
  const lowerRoll = new THREE.Mesh(topRoll.geometry,rodMaterial);
  scene.add(topRoll,lowerRoll);
  let disposed=false;
  const ornamentTexture=new THREE.TextureLoader().load('/assets/gujarati-scroll-roller.png', (texture:any)=>{
    if(disposed)return;
    const img=texture.image, c=document.createElement('canvas');
    c.width=img.width;c.height=img.height;
    const ctx=c.getContext('2d')!;ctx.drawImage(img,0,0);
    const pixels=ctx.getImageData(0,0,c.width,c.height).data;
    const pos:number[]=[], uv:number[]=[], faces:number[]=[];
    const slices=256, rings=56;
    for(let i=0;i<=slices;i++){
      const u=i/slices,x=Math.min(c.width-1,Math.round(u*(c.width-1)));
      let hi=0,lo=c.height-1;
      while(hi<lo && pixels[(hi*c.width+x)*4+3]<96)hi++;
      while(lo>hi && pixels[(lo*c.width+x)*4+3]<96)lo--;
      if(hi===lo)hi=lo=c.height/2;
      const r=(lo-hi)/(2*c.width), axis=(c.height/2-(hi+lo)/2)/c.width;
      for(let j=0;j<=rings;j++){
        const angle=j*2*Math.PI/rings, sy=Math.sin(angle);
        pos.push(u-.5,axis+r*sy,r*Math.cos(angle));
        uv.push(u,1-((hi+lo)/2-(lo-hi)*sy/2)/c.height);
        if(i<slices && j<rings){const k=i*(rings+1)+j;faces.push(k,k+rings+1,k+1,k+1,k+rings+1,k+rings+2);}
      }
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(faces);
    topRoll.geometry.dispose();topRoll.geometry=lowerRoll.geometry=g;
    texture.colorSpace=THREE.SRGBColorSpace;rodMaterial.map=texture;rodMaterial.needsUpdate=true;draw();
  });
  let width = 0, height = 0, sheetWidth = 0, sheetHeight = 0, topY = 0, progress = 0;
  let coreRadius = 14;
  const paperThickness = 0.52;
  const resize = () => {
    const box = wrap.getBoundingClientRect();
    if (!box.width || !box.height) return;
    width = box.width + 72;
    height = box.height;
    sheetWidth = wrap.querySelector<HTMLElement>('.gujarati-scroll-paper')!.offsetWidth;
    const span=sheetWidth/.71;coreRadius=span*.032;
    topRoll.scale.setScalar(span);lowerRoll.scale.setScalar(span);
    sheetHeight = wrap.querySelector<HTMLElement>('.gujarati-scroll-paper')?.offsetHeight || 540;
    topY = height / 2 - 34;
    camera.left = -width / 2; camera.right = width / 2;
    camera.top = height / 2; camera.bottom = -height / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    paper.geometry.dispose();
    paper.geometry = new THREE.PlaneGeometry(sheetWidth, sheetHeight, 1, 120);
    backing.geometry = paper.geometry;
    draw();
  };

  const draw = () => {
    if (!width || !height) return;
    const geometry = paper.geometry as any;
    const positions = geometry.attributes.position as any;
    const uvs = geometry.attributes.uv as any;
    const visible = progress * sheetHeight;
    const woundLength = sheetHeight - visible;
    const outerRadius = Math.sqrt(coreRadius * coreRadius + paperThickness * woundLength / Math.PI);
    // Live ink sits on the exposed face only. Both roller silhouettes occlude it.
    wrap.style.setProperty('--roll-top-cover', visible > coreRadius*2.4 ? (coreRadius*.85+2)+'px' : '0px');
    wrap.style.setProperty('--roll-bottom-cover', Math.min(sheetHeight, woundLength+outerRadius+2)+'px');
    for (let row = 0; row <= 120; row++) {
      const index = row * 2;
      const distance = (1 - uvs.getY(index)) * sheetHeight;
      let y: number, z: number;
      if (distance <= visible) {
        y = topY - distance;
        z = 3 * Math.sin(Math.PI * progress) * Math.sin(Math.PI * distance / sheetHeight);
      } else {
        const fromLooseEdge = distance - visible;
        const radius = Math.sqrt(Math.max(coreRadius * coreRadius, outerRadius * outerRadius - paperThickness * fromLooseEdge / Math.PI));
        const turn = (outerRadius - radius) * 2 * Math.PI / paperThickness;
        const angle = turn;
        const centerY = topY - visible;
        y = centerY - radius * Math.sin(angle);
        z = outerRadius - radius * Math.cos(angle);
      }
      positions.setY(index, y); positions.setZ(index, z);
      positions.setY(index + 1, y); positions.setZ(index + 1, z);
    }
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
    paper.position.set(0, 0, 0);
    topRoll.position.set(0,topY+coreRadius*.25,coreRadius+1);
    topRoll.visible=visible>coreRadius*2.4;
    topRoll.rotation.x=(1-progress)*Math.PI*6;
    lowerRoll.position.set(0,topY-visible,outerRadius+.5);
    lowerRoll.rotation.x=-(outerRadius-coreRadius)*2*Math.PI/paperThickness;
    wrap.style.setProperty('--gu-rod-shadow',String(progress*.56));
    renderer.render(scene, camera);
  };

  const observer = new ResizeObserver(resize);
  observer.observe(wrap);
  resize();
  const cleanup = () => {
    observer.disconnect();
    paperTexture.dispose();
    ornamentTexture.dispose();
    disposed=true;
    scene.traverse((node: any) => {
      const mesh = node as any;
      if (mesh.isMesh) { mesh.geometry.dispose(); const materials: any[] = Array.isArray(mesh.material) ? mesh.material : [mesh.material]; materials.forEach((material: any) => material.dispose()); }
    });
    renderer.dispose();

    canvas.remove();
  };
  return { setProgress(value: number) { progress = Math.max(0, Math.min(1, value)); draw(); }, cleanup };
}
