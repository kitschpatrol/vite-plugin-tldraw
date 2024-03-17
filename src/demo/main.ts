import tldrFileFrame from './assets/test-sketch-three-frames.tldr?frame=frame-3&tldr'
import tldrFile from './assets/test-sketch.tldr'
import tldrFileWithParams4 from './assets/test-sketch.tldr?format=png&scale=4&tldr'
import tldrFileWithParams from './assets/test-sketch.tldr?format=png&transparent=true&tldr'
import tldrFileWithParams2 from './assets/test-sketch.tldr?format=svg&dark=true&tldr'
import tldrFileWithParams3 from './assets/test-sketch.tldr?format=svg&padding=200&tldr'

document.querySelector<HTMLDivElement>('body')!.innerHTML = `
  <h1>vite-plugin-tldraw</h1>
  <hr />
  <h2>Basic</h2>
  <p>Tldr Path: ${tldrFile}</p>
  <img src="${tldrFile}" />
  <hr />
  <h2>Frame 3 Only</h2>
  <p>Tldr Path: ${tldrFileFrame}</p>
  <img src="${tldrFileFrame}" />
  <hr />
  <h2>Transparent png</h2>
  <p>Tldr Path: ${tldrFileWithParams}</p>
  <img src="${tldrFileWithParams}"/>
  <hr />
  <h2>Dark</h2>
  <p>Tldr Path: ${tldrFileWithParams2}</p>
  <img src="${tldrFileWithParams2}"/>
  <hr />
  <h2>Extra padding</h2>
  <p>Tldr Path: ${tldrFileWithParams3}</p>
  <img src="${tldrFileWithParams3}"/>
  <hr />
  <h2>Scaled png</h2>
  <p>Tldr Path: ${tldrFileWithParams4}</p>
  <img src="${tldrFileWithParams4}"/>
`
