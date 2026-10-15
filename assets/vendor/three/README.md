# Three.js r180

These files are self-hosted from the official `three@0.180.0` npm package under the included MIT license. They are loaded only when a visitor opens the Blender model inspector. No runtime CDN or package manager is required.

- Source package: https://registry.npmjs.org/three/-/three-0.180.0.tgz
- Package SHA-1: `b930cabfb524f6d36bf63e874b4d866888b50487`
- Official source: https://github.com/mrdoob/three.js/tree/r180
- Documentation: https://threejs.org/docs/

Included: minified WebGL module and core; `GLTFLoader`, `OrbitControls`, `RoomEnvironment`, and `BufferGeometryUtils`. Addon imports of bare `three` were changed to `../../build/three.module.min.js` so the modules work without a page-level import map. Import indentation in `RoomEnvironment` was normalized; no other upstream changes were made.

The GLB files in this portfolio do not require external Draco, Meshopt, or KTX2 decoders. Their original glTF PBR materials are used by the viewer, including the truck's clearcoat extension.
