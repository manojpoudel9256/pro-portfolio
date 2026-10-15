# Blender model assets

These five GLB files are unchanged copies of the portfolio owner's supplied
models. The filenames are normalized for web use; geometry, materials, textures,
and original file quality are preserved. Their combined transfer size is
11,457,700 bytes (10.93 MiB), so the viewer should load only the model a visitor
chooses to inspect.

| Model | File | Triangles | Exported vertices | File bytes |
| --- | --- | ---: | ---: | ---: |
| Delivery Truck | `delivery-truck.glb` | 7,876 | 10,860 | 7,715,084 |
| Industrial Robot Arm | `industrial-robot-arm.glb` | 3,306 | 3,820 | 151,696 |
| Cardboard Box | `cardboard-box.glb` | 12 | 24 | 1,647,220 |
| Roller Conveyor | `roller-conveyor.glb` | 2,414 | 3,998 | 148,952 |
| Roll Cage | `roll-cage.glb` | 3,140 | 3,833 | 1,794,748 |

## Metadata

`models.json` is keyed by model slug. Each entry contains localized titles and
descriptions, the public `src`, exact byte size, SHA-256 hash, default-scene
statistics, bounds, dimensions, and resource details.

- **Triangles** count the exported triangle topology in the default scene,
  including each mesh instance. A GLB stores triangulated geometry; the original
  Blender quad/ngon face count cannot be recovered from it. Label this statistic
  **Triangles**, or explain that the polygon count refers to exported triangles.
- **Exported vertices** sum the `POSITION` attribute count for each scene
  primitive. UV seams, sharp normals, and material splits can duplicate vertex
  positions, so this is not Blender's original edit-mode vertex count.
- **Meshes** count distinct glTF mesh definitions referenced by the scene.
  **Mesh instances** and **primitives** provide the corresponding scene counts.
  `geometryStats` also counts geometry once per mesh definition and records the
  total unique position-accessor entries.
- **Dimensions** are the axis-aligned bounds after applying node transforms,
  computed from actual exported positions. The axes are glTF X/Y/Z with Y up,
  and glTF's unit is meters. They describe the authored model scale, not an
  independently verified real product measurement.
- All five models are static. No animation tracks, skins, morph targets,
  external URLs, or external image/buffer dependencies are present.
- All images are embedded PNG files and were checked for decoding errors. The
  robot arm and conveyor use material colors without image textures.
- The truck uses optional `KHR_materials_clearcoat`, supported by Three.js's
  GLTFLoader. No model declares a required extension; no Draco/Meshopt/KTX2
  decoder is needed.

To rebuild metadata from the actual files using Python's standard library:

```powershell
python assets/models/blender/audit_metadata.py
```

The supplied model descriptions describe their intended scene context, not
claims that these individual assets have been deployed in a commercial project.
