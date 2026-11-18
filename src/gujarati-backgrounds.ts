export function mountGujaratiBackgrounds(main: HTMLElement) {
  const plane = document.createElement('div');
  plane.className = 'gu-background-plane';
  plane.setAttribute('aria-hidden', 'true');
  const sections = [...main.querySelectorAll<HTMLElement>(':scope > section')];
  const scenes = sections.map(section => {
    const style = getComputedStyle(section);
    const layer = document.createElement('div');
    layer.className = 'gu-background-material';
    layer.style.backgroundColor = style.backgroundColor;
    layer.style.backgroundImage = style.backgroundImage;
    layer.style.backgroundSize = style.backgroundSize;
    layer.style.backgroundPosition = style.backgroundPosition;
    layer.style.backgroundRepeat = style.backgroundRepeat;

    if (section.matches('.collage, .gujarati-family-card, .gujarati-reference-canvas')) {
      const style = getComputedStyle(section, '::before');
      const glaze = document.createElement('div');
      glaze.className = 'gu-background-glaze';
      glaze.style.background = style.background;
      glaze.style.opacity = style.opacity;
      layer.append(glaze);
    }

    const palace = section.querySelector<HTMLImageElement>(':scope > .baraat-backdrop');
    if (palace) {
      layer.classList.add('gu-background-palace');
      layer.style.backgroundImage = [
        'linear-gradient(180deg, #ffebcd38, transparent 42%, #2b111d70)',
        `url("${palace.src}")`,
      ].join(', ');
      layer.style.backgroundSize = '100% 100%, cover';
      layer.style.backgroundPosition = 'center, center 52%';
      layer.style.backgroundRepeat = 'no-repeat';
    }

    const portrait = section.querySelector<HTMLImageElement>('.hero-photo img');
    if (portrait) {
      layer.style.backgroundImage = `linear-gradient(180deg, #240f2420, #240f24b8), url("${portrait.src}")`;
      layer.style.backgroundSize = 'cover';
      layer.style.backgroundPosition = 'center 48%';
      section.classList.add('gu-shared-portrait');
    }
    return { artwork: layer, top: 0, ready: true };
  });

  const layers = [document.createElement('div'), document.createElement('div')];
  const assigned = [-1, -1];
  for (const layer of layers) {
    layer.className = 'gu-background-material';
    plane.append(layer);
  }
  main.prepend(plane);
  main.classList.add('gu-backgrounds-ready');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let layoutDirty = true;
  let frame = 0;
  let observer: ResizeObserver | undefined;
  const assign = (slot: number, scene: number) => {
    if (assigned[slot] === scene) return;
    const artwork = scenes[scene].artwork;
    layers[slot].style.cssText = artwork.style.cssText;
    layers[slot].replaceChildren(...[...artwork.children].map(child => child.cloneNode(true)));
    layers[slot].dataset.scene = sections[scene].classList[0];
    assigned[slot] = scene;
  };
  const dispose = () => {
    observer?.disconnect();
    removeEventListener('scroll', schedule);
    removeEventListener('resize', relayout);
    motion.removeEventListener('change', schedule);
  };
  const render = () => {
    frame = 0;
    if (!main.isConnected) { dispose(); return; }
    const viewport = window.innerHeight;
    const bounds = main.getBoundingClientRect();
    if (layoutDirty) {
      sections.forEach((section, index) => {
        scenes[index].top = section.getBoundingClientRect().top - bounds.top;
      });
      plane.style.left = `${bounds.left}px`;
      plane.style.width = `${bounds.width}px`;
      layoutDirty = false;
    }
    let current = 0;
    let incoming = 0;
    let blend = 0;
    for (let index = 1; index < scenes.length; index++) {
      const top = bounds.top + scenes[index].top;
      const progress = Math.max(0, Math.min(1, (viewport * .9 - top) / (viewport * .65)));
      if (progress === 0 || !scenes[index].ready) break;
      if (progress === 1) { current = index; incoming = index; continue; }
      incoming = index;
      blend = motion.matches ? (progress >= .5 ? 1 : 0) : progress * progress * (3 - 2 * progress);
      break;
    }
    assign(0, current);
    assign(1, incoming);
    layers[0].style.opacity = '1';
    layers[1].style.opacity = String(blend);
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };
  const relayout = () => {
    layoutDirty = true;
    schedule();
  };
  // Decode each material before allowing it to replace the visible scene.
  for (const scene of scenes) {
    const urls = [...scene.artwork.style.backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g)];
    scene.ready = urls.length === 0;
    Promise.all(urls.map(([, url]) => new Promise<void>(resolve => {
      const image = new Image();
      image.onload = () => resolve();
      image.onerror = () => resolve();
      image.src = url;
    }))).then(() => { scene.ready = true; schedule(); });
  }
  if ('ResizeObserver' in window) {
    observer = new ResizeObserver(relayout);
    observer.observe(main);
    sections.forEach(section => observer!.observe(section));
  }
  addEventListener('resize', relayout, { passive: true });
  addEventListener('scroll', schedule, { passive: true });
  motion.addEventListener('change', schedule);
  render();
}
