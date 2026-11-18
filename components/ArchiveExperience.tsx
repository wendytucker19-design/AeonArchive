'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Menu, Minus, Plus, RotateCcw, Search, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { categories, collection, type Artifact, type ArtifactKind } from '@/data/collection';
import SceneBoundary from './SceneBoundary';
import useWebGLSupport from './useWebGLSupport';

const WorldJourney = dynamic(() => import('./WorldJourney'), {
  ssr: false,
  loading: () => <div className="atlas-loading">Preparing the atlas…</div>,
});
const ArtifactStudy = dynamic(() => import('./ArtifactScene').then((module) => module.ArtifactStudy), {
  ssr: false,
  loading: () => <div className="scene-loading">Preparing the object study…</div>,
});

const selectedIds: ArtifactKind[] = ['bottle', 'chronometer', 'astrolabe', 'horse', 'mantel-clock', 'porcelain', 'telescope', 'music-box', 'pocket-watch', 'armillary', 'camera', 'automaton'];

function Brand() {
  return <a className="brand" href="#top" aria-label="AEON Archive home">
    <span className="brand-symbol" aria-hidden="true">A<i /></span>
    <span className="brand-name">AEON ARCHIVE</span>
  </a>;
}

export default function ArchiveExperience() {
  const webgl = useWebGLSupport();
  const [selected, setSelected] = useState<Artifact | null>(null);
  const [initialStudy, setInitialStudy] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All objects');
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [allObjects, setAllObjects] = useState(false);
  const hero = useRef<HTMLElement>(null);
  const gallery = useRef<HTMLElement>(null);

  const openArtifact = useCallback((artifact: Artifact, study = false) => {
    setInitialStudy(study);
    setSelected(artifact);
  }, []);

  const showCollection = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setAllObjects(true);
    setActiveCategory('All objects');
    setQuery('');
    gallery.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  useEffect(() => {
    const openFromAtlas = (event: Event) => {
      const id = (event as CustomEvent<{ id: string }>).detail?.id;
      const artifact = collection.find((item) => item.id === id);
      if (artifact) openArtifact(artifact);
    };
    window.addEventListener('aeon:open-artifact', openFromAtlas);
    return () => window.removeEventListener('aeon:open-artifact', openFromAtlas);
  }, [openArtifact]);

  useEffect(() => {
    if (!hero.current) return;
    const element = hero.current;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = media.matches ? 0 : Math.min(1, Math.max(0, -element.getBoundingClientRect().top / element.offsetHeight));
      element.style.setProperty('--hero-shift', `${progress * 95}px`);
      element.style.setProperty('--hero-scale', String(1.015 + progress * 0.055));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    media.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      media.removeEventListener('change', schedule);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);

  const visible = useMemo(() => {
    const items = selectedIds.map((id) => collection.find((item) => item.id === id)!).filter(Boolean);
    return items.filter((artifact) => (
      (activeCategory === 'All objects' || artifact.category === activeCategory) &&
      `${artifact.name} ${artifact.shortName} ${artifact.era} ${artifact.origin}`.toLowerCase().includes(query.trim().toLowerCase())
    ));
  }, [allObjects, activeCategory, query]);

  return <>
    <a className="skip-link" href="#collection">Skip to the collection</a>
    <header className="site-header">
      <Brand />
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} id="main-navigation" aria-label="Main navigation">
        <a href="#collection" onClick={() => setMenuOpen(false)}>Collection</a>
        <a href="#world" onClick={() => setMenuOpen(false)}>The atlas</a>
        <a href="#about" onClick={() => setMenuOpen(false)}>Our story</a>
      </nav>
      <a className="header-enter" href="#collection">Enter the archive <ArrowRight size={22} strokeWidth={1} /></a>
      <button className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={23} /> : <Menu size={23} />}
      </button>
    </header>

    <main id="top">
      <section className="museum-hero" ref={hero} aria-labelledby="hero-title">
        <div className="hero-art" aria-hidden="true">
          <Image src="/exhibition/museum-hero.webp" alt="" fill priority sizes="100vw" quality={90} />
        </div>
        <div className="hero-softness" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">Objects with a second life</p>
          <h1 id="hero-title">A world<br />worth<br /><em>keeping.</em></h1>
          <p className="hero-description">Extraordinary objects. Stories that endure.</p>
          <a className="primary-button" href="#collection">Explore the collection <ArrowRight size={24} strokeWidth={1} /></a>
        </div>
        <div className="hero-footer">
          <a className="hero-scroll" href="#collection"><ArrowDown size={15} /> A closer look awaits</a>
          <button className="hero-study" onClick={() => openArtifact(collection[0], webgl === true)}>The celestial study <span>{webgl === true ? 'Explore in 3D' : 'Examine the object'} <ArrowUpRight size={15} /></span></button>
        </div>
      </section>

      <section className="collection-section page-shell" id="collection" ref={gallery} aria-labelledby="collection-title">
        <div className="section-rule">
          <h2 className="eyebrow" id="collection-title">{allObjects ? 'The complete collection' : 'The selected collection'}</h2>
          <a className="text-link" href="#collection" onClick={showCollection}>Search the collection <ArrowRight size={24} strokeWidth={1} /></a>
        </div>
        {allObjects && <div className="collection-tools">
          <div className="filters" role="group" aria-label="Filter collection">
            {categories.map((category) => <button key={category} aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category === 'All objects' ? 'All objects' : category}</button>)}
          </div>
          <label className="collection-search"><Search size={16} /><span className="sr-only">Search the collection</span><input type="search" placeholder="Find an object" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        </div>}
        <div className={allObjects ? "artifact-grid is-browsing" : "artifact-grid"} aria-live="polite">
          {visible.map((artifact) => <article className="artifact-card" key={artifact.id}>
            <button className="artifact-open" onClick={() => openArtifact(artifact)} aria-label={`Explore ${artifact.displayName || artifact.name}`}>
              <div className={`artifact-image ${artifact.id}`}>
                <Image src={artifact.displayImage || artifact.image} alt={artifact.displayImage ? `Artistic exhibition visualisation of ${artifact.shortName.toLowerCase()}` : artifact.imageAlt} fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" />
                <span className="artifact-open-icon"><ArrowUpRight size={22} strokeWidth={1} /></span>
              </div>
              <div className="artifact-card-info"><h3>{artifact.displayName || artifact.name}</h3><span>{artifact.category} <i>·</i> {artifact.era.split(' · ')[0]}</span></div>
            </button>
          </article>)}
          {visible.length === 0 && <div className="empty-state"><h3>A different kind of discovery.</h3><p>Try another name, place, or category.</p><button className="text-link" onClick={() => { setQuery(''); setActiveCategory('All objects'); }}>Reset the collection <RotateCcw size={15} /></button></div>}
        </div>
        <div className="collection-foot"><p>Exhibition visualisations accompany the original object photographs. Open an object to explore both.</p><span>{visible.length} / {collection.length} objects</span></div>
      </section>

      <section className="craft-section page-shell" aria-labelledby="craft-title">
        <div className="craft-heading"><span className="eyebrow">An invitation to look closer</span><h2 id="craft-title">Some things deserve<br />a little more <em>time.</em></h2></div>
        <div className="craft-description"><p>The curve of a hand-blown vessel. A mechanism made to measure the heavens. An engraving almost too small to see.</p><p>We bring extraordinary objects into the light, making room for the details that reward a curious eye.</p><button className="text-link" onClick={() => openArtifact(collection[0], webgl === true)}>Step inside the celestial study <ArrowUpRight size={20} strokeWidth={1} /></button></div>
      </section>

      <div id="about"><SceneBoundary><WorldJourney onOpen={openArtifact} /></SceneBoundary></div>

      <section className="closing-section page-shell" id="credits" aria-labelledby="closing-title">
        <div><span className="eyebrow">The record behind the object</span><h2 id="closing-title">Wonder, with<br /><em>an open record.</em></h2></div>
        <div className="closing-copy"><p>Every object has a story. Its image has one, too.</p><p>Our collection pairs original reference photographs with artistic exhibition visualisations and interactive studies. Source links and image credits are available in every object record.</p><a className="text-link" href="/images/ASSET-CREDITS.md" target="_blank" rel="noreferrer">Explore the image credits <ArrowUpRight size={20} strokeWidth={1} /></a></div>
      </section>
    </main>

    <footer className="site-footer page-shell"><Brand /><span>A world worth keeping.</span><a href="#top">Back to the entrance <ArrowUpRight size={17} /></a><small>AEON ARCHIVE © {new Date().getFullYear()}</small></footer>
    {selected && <ArtifactDialog key={selected.id} artifact={selected} initialStudy={initialStudy} onClose={() => setSelected(null)} onOpen={openArtifact} />}
  </>;
}

function ArtifactDialog({ artifact, initialStudy, onClose, onOpen }: {
  artifact: Artifact;
  initialStudy: boolean;
  onClose: () => void;
  onOpen: (artifact: Artifact, study?: boolean) => void;
}) {
  const webgl = useWebGLSupport();
  const dialog = useRef<HTMLDialogElement>(null);
  const [view, setView] = useState<'exhibition' | 'source' | 'study'>(initialStudy ? 'study' : artifact.displayImage ? 'exhibition' : 'source');
  const [zoom, setZoom] = useState(1);
  const imageArea = useRef<HTMLButtonElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const index = collection.findIndex((item) => item.id === artifact.id);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  const changeView = (next: typeof view) => { setView(next); setZoom(1); };
  const moveObject = (offset: number) => onOpen(collection[(index + offset + collection.length) % collection.length]);
  const image = view === 'exhibition' && artifact.displayImage ? artifact.displayImage : artifact.image;

  return <dialog ref={dialog} className="artifact-dialog" aria-labelledby="dialog-title" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="dialog-shell">
      <button className="dialog-close" onClick={onClose} aria-label="Close object details" autoFocus><X size={22} strokeWidth={1.4} /></button>
      <div className="dialog-visual">
        <span className="dialog-object-index">AEON ARCHIVE / OBJECT {artifact.index}</span>
        {view === 'study' ? <SceneBoundary><ArtifactStudy key={resetKey} kind={artifact.id} autoRotate={autoRotate} /></SceneBoundary> : <button ref={imageArea} className={`dialog-photo ${zoom > 1 ? 'is-zoomed' : ''}`} aria-label={zoom > 1 ? 'Zoom out of object photograph' : 'Zoom into object photograph'} aria-pressed={zoom > 1} onClick={() => setZoom(zoom > 1 ? 1 : 2.2)} onPointerMove={(event) => {
          if (zoom <= 1) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty('--zoom-x', `${(event.clientX - bounds.left) / bounds.width * 100}%`);
          event.currentTarget.style.setProperty('--zoom-y', `${(event.clientY - bounds.top) / bounds.height * 100}%`);
        }} onPointerLeave={() => {
          imageArea.current?.style.setProperty('--zoom-x', '50%');
          imageArea.current?.style.setProperty('--zoom-y', '50%');
        }}><Image src={image} alt={view === 'exhibition' ? `Artistic exhibition visualisation of ${artifact.shortName}` : artifact.imageAlt} fill sizes="(max-width: 800px) 100vw, 58vw" style={{ transform: `scale(${zoom})` }} /></button>}
        <div className="visual-controls">
          <span>{view === 'study' ? 'Drag to rotate · Scroll to zoom' : view === 'exhibition' ? 'Artistic exhibition visualisation' : 'Original reference photograph'}</span>
          {view === 'study' ? <div><button onClick={() => setAutoRotate(!autoRotate)} aria-pressed={autoRotate}>{autoRotate ? 'Pause' : 'Rotate'}</button><button aria-label="Reset 3D view" onClick={() => setResetKey(resetKey + 1)}><RotateCcw size={16} /></button></div> : <div><button aria-label="Zoom out" disabled={zoom <= 1} onClick={() => setZoom(Math.max(1, zoom - 0.4))}><Minus size={17} /></button><span>{Math.round(zoom * 100)}%</span><button aria-label="Zoom in" disabled={zoom >= 3} onClick={() => setZoom(Math.min(3, zoom + 0.4))}><Plus size={17} /></button></div>}
        </div>
        <div className="view-tabs" role="group" aria-label="Object view">
          {artifact.displayImage && <button aria-pressed={view === 'exhibition'} onClick={() => changeView('exhibition')}>Exhibition</button>}
          {artifact.hasReference !== false && <button aria-pressed={view === 'source'} onClick={() => changeView('source')}>Source photograph</button>}
          {artifact.studyAvailable !== false && webgl === true && <button aria-pressed={view === 'study'} onClick={() => changeView('study')}>3D study</button>}
        </div>
      </div>
      <div className="dialog-information">
        <span className="eyebrow">{artifact.category}</span>
        <h2 id="dialog-title">{artifact.displayName || artifact.name}</h2>
        <p className="dialog-lede">{artifact.description}</p>
        <dl className="object-facts"><div><dt>Period</dt><dd>{artifact.era}</dd></div><div><dt>Material</dt><dd>{artifact.materials}</dd></div><div><dt>{artifact.hasReference === false ? 'Exhibition' : artifact.id === 'astrolabe' ? 'Museum reference' : 'Collection origin'}</dt><dd>{artifact.origin}</dd></div>{artifact.dimensions && <div><dt>Dimensions</dt><dd>{artifact.dimensions}</dd></div>}{artifact.condition && <div><dt>Condition</dt><dd>{artifact.condition}</dd></div>}</dl>
        <p className="dialog-detail">{artifact.detail}</p>
        {artifact.concept && <p className="interpretation-note">{artifact.hasReference === false ? 'AI-generated exhibition concept.' : 'The exhibition title and narrative are interpretive.'}</p>}
        {view === 'study' && <p className="interpretation-note">This interactive model is an artistic study of the object’s form.</p>}
        <details className="source-record"><summary>Image record &amp; attribution <Plus size={16} /></summary><div><p>{artifact.imageCredit}</p><p>License label supplied with the reference image: {artifact.license}.</p>{artifact.displayImage && <p>{artifact.hasReference === false ? 'The image and object design were created for this exhibition.' : 'The exhibition image is AI-generated. The Source photograph view shows the credited reference object.'}</p>}<a href={artifact.source} target="_blank" rel="noreferrer">Open source record <ArrowUpRight size={16} /></a></div></details>
        <div className="dialog-navigation"><button aria-label="Previous object" onClick={() => moveObject(-1)}><ArrowLeft size={19} /> Previous</button><span>{String(index + 1).padStart(2, '0')} / {String(collection.length).padStart(2, '0')}</span><button aria-label="Next object" onClick={() => moveObject(1)}>Next <ArrowRight size={19} /></button></div>
      </div>
    </div>
  </dialog>;
}
