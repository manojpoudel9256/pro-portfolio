"""Rebuild model metadata from the self-contained GLB files beside this script.

Uses only Python's standard library. Counts the default scene and reads vertex
positions (not just accessor bounding boxes) to compute transformed dimensions.
"""

import hashlib
import json
from pathlib import Path
import struct

ROOT = Path(__file__).resolve().parent
MODELS = {
    "delivery-truck": {
        "title": {"en": "Delivery Truck", "ja": "配送トラック"},
        "description": {
            "en": "A box-body delivery truck with closed rear doors, detailed wheels, and textured bodywork for logistics scenes.",
            "ja": "閉じた荷室のリアドア、細部まで作り込んだ車輪、質感のある車体を備えた、物流シーン向けの配送トラック。",
        },
    },
    "industrial-robot-arm": {
        "title": {"en": "Industrial Robot Arm", "ja": "産業用ロボットアーム"},
        "description": {
            "en": "A posed industrial robot arm with distinct joints and material finishes for factory and automation scenes.",
            "ja": "関節や素材の質感を作り分けた産業用ロボットアーム。工場や自動化設備のシーンを想定したモデル。",
        },
    },
    "cardboard-box": {
        "title": {"en": "Cardboard Box", "ja": "段ボール箱"},
        "description": {
            "en": "A textured cardboard box for packaging, warehouse, and material-handling scenes.",
            "ja": "梱包、倉庫、搬送シーンに使える、テクスチャ付きの段ボール箱。",
        },
    },
    "roller-conveyor": {
        "title": {"en": "Roller Conveyor", "ja": "ローラーコンベヤー"},
        "description": {
            "en": "A roller conveyor with a supporting frame for warehouse layouts and material-flow visualizations.",
            "ja": "支持フレームを備えたローラーコンベヤー。倉庫レイアウトや搬送フローの可視化を想定したモデル。",
        },
    },
    "roll-cage": {
        "title": {"en": "Roll Cage", "ja": "ロールボックスパレット"},
        "description": {
            "en": "A wheeled metal roll cage with a mesh frame for stock handling and warehouse scenes.",
            "ja": "網状の金属フレームと車輪を備えたロールボックスパレット。在庫管理や倉庫シーン向けのモデル。",
        },
    },
}
COMPONENTS = {5120: ("b", 1), 5121: ("B", 1), 5122: ("h", 2),
              5123: ("H", 2), 5125: ("I", 4), 5126: ("f", 4)}
WIDTHS = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4,
          "MAT2": 4, "MAT3": 9, "MAT4": 16}
IDENTITY = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]


def multiply(a, b):
    return [[sum(a[r][k] * b[k][c] for k in range(4))
             for c in range(4)] for r in range(4)]


def local_matrix(node):
    if "matrix" in node:
        return [[node["matrix"][c * 4 + r] for c in range(4)] for r in range(4)]
    x, y, z, w = node.get("rotation", [0, 0, 0, 1])
    sx, sy, sz = node.get("scale", [1, 1, 1])
    tx, ty, tz = node.get("translation", [0, 0, 0])
    return [
        [(1 - 2*y*y - 2*z*z)*sx, (2*x*y - 2*z*w)*sy, (2*x*z + 2*y*w)*sz, tx],
        [(2*x*y + 2*z*w)*sx, (1 - 2*x*x - 2*z*z)*sy, (2*y*z - 2*x*w)*sz, ty],
        [(2*x*z - 2*y*w)*sx, (2*y*z + 2*x*w)*sy, (1 - 2*x*x - 2*y*y)*sz, tz],
        [0, 0, 0, 1],
    ]


def read_glb(path):
    data = path.read_bytes()
    magic, version, length = struct.unpack_from("<4sII", data)
    assert magic == b"glTF" and version == 2 and length == len(data)
    chunks, offset = {}, 12
    while offset < len(data):
        size, kind = struct.unpack_from("<II", data, offset)
        chunks[kind] = data[offset + 8:offset + 8 + size]
        offset += 8 + size
    return data, json.loads(chunks[0x4E4F534A]), chunks.get(0x004E4942, b"")


def read_accessor(document, binary, index):
    accessor = document["accessors"][index]
    fmt, size = COMPONENTS[accessor["componentType"]]
    width = WIDTHS[accessor["type"]]
    count = accessor["count"]
    result = [(0,) * width] * count
    if "bufferView" in accessor:
        view = document["bufferViews"][accessor["bufferView"]]
        assert view.get("buffer", 0) == 0
        start = view.get("byteOffset", 0) + accessor.get("byteOffset", 0)
        stride = view.get("byteStride", size * width)
        result = [struct.unpack_from("<" + fmt * width, binary, start + i * stride)
                  for i in range(count)]
    if "sparse" in accessor:
        sparse = accessor["sparse"]
        indices, values = sparse["indices"], sparse["values"]
        ifmt, isize = COMPONENTS[indices["componentType"]]
        iv = document["bufferViews"][indices["bufferView"]]
        vv = document["bufferViews"][values["bufferView"]]
        istart = iv.get("byteOffset", 0) + indices.get("byteOffset", 0)
        vstart = vv.get("byteOffset", 0) + values.get("byteOffset", 0)
        for i in range(sparse["count"]):
            target = struct.unpack_from("<" + ifmt, binary, istart + i * isize)[0]
            result[target] = struct.unpack_from("<" + fmt * width, binary,
                                                vstart + i * size * width)
    return result


def primitive_counts(document, primitive):
    vertices = document["accessors"][primitive["attributes"]["POSITION"]]["count"]
    count = (document["accessors"][primitive["indices"]]["count"]
             if "indices" in primitive else vertices)
    mode = primitive.get("mode", 4)
    triangles = count // 3 if mode == 4 else max(0, count - 2) if mode in (5, 6) else 0
    return triangles, vertices


def analyze(slug, text):
    path = ROOT / (slug + ".glb")
    data, document, binary = read_glb(path)
    assert all("uri" not in b for b in document.get("buffers", [])), "External buffer"
    assert all("bufferView" in i for i in document.get("images", [])), "External image"
    assert not document.get("skins"), "Skinned bounds need animation evaluation"
    assert not any(p.get("targets") for m in document["meshes"] for p in m["primitives"])
    scenes = document.get("scenes", [])
    scene_index = document.get("scene", 0)
    mesh_instances, scene_nodes, scene_primitives = [], [], []
    bounds_min, bounds_max = [float("inf")] * 3, [float("-inf")] * 3
    position_cache = {}

    def visit(index, parent):
        node = document["nodes"][index]
        world = multiply(parent, local_matrix(node))
        scene_nodes.append(index)
        if "mesh" in node:
            mesh_instances.append(node["mesh"])
            for primitive in document["meshes"][node["mesh"]]["primitives"]:
                scene_primitives.append(primitive)
                ai = primitive["attributes"]["POSITION"]
                if ai not in position_cache:
                    position_cache[ai] = read_accessor(document, binary, ai)
                for p in position_cache[ai]:
                    point = [sum(world[r][c] * p[c] for c in range(3)) + world[r][3]
                             for r in range(3)]
                    for axis in range(3):
                        bounds_min[axis] = min(bounds_min[axis], point[axis])
                        bounds_max[axis] = max(bounds_max[axis], point[axis])
        for child in node.get("children", []):
            visit(child, world)

    for root_node in scenes[scene_index].get("nodes", []):
        visit(root_node, IDENTITY)
    unique_primitives = [p for mesh in set(mesh_instances)
                         for p in document["meshes"][mesh]["primitives"]]
    counts = [primitive_counts(document, p) for p in scene_primitives]
    unique_counts = [primitive_counts(document, p) for p in unique_primitives]
    image_info = []
    for image in document.get("images", []):
        view = document["bufferViews"][image["bufferView"]]
        begin = view.get("byteOffset", 0)
        image_bytes = binary[begin:begin + view["byteLength"]]
        info = {"mimeType": image["mimeType"], "bytes": len(image_bytes)}
        if image_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
            info["width"], info["height"] = struct.unpack_from(">II", image_bytes, 16)
        image_info.append(info)
    return {
        "id": slug, **text, "src": f"assets/models/blender/{slug}.glb",
        "fileSizeBytes": len(data), "format": "glTF 2.0 binary",
        "sha256": hashlib.sha256(data).hexdigest(),
        "stats": {
            "triangles": sum(c[0] for c in counts),
            "vertices": sum(c[1] for c in counts),
            "meshes": len(set(mesh_instances)), "meshInstances": len(mesh_instances),
            "primitives": len(scene_primitives),
            "materials": len(document.get("materials", [])),
            "textures": len(document.get("textures", [])),
            "images": len(document.get("images", [])), "nodes": len(scene_nodes),
            "animations": len(document.get("animations", [])),
        },
        "dimensions": {**{axis: round(bounds_max[i] - bounds_min[i], 6)
                           for i, axis in enumerate(("x", "y", "z"))}, "unit": "m"},
        "bounds": {"min": [round(v, 6) for v in bounds_min],
                   "max": [round(v, 6) for v in bounds_max]},
        "geometryStats": {
            "uniqueMeshTriangles": sum(c[0] for c in unique_counts),
            "uniqueMeshVertices": sum(c[1] for c in unique_counts),
            "uniquePositionAccessorVertices": sum(len(v) for v in position_cache.values()),
        },
        "defaultScene": scene_index,
        "embeddedResourcesOnly": True,
        "extensionsUsed": document.get("extensionsUsed", []),
        "extensionsRequired": document.get("extensionsRequired", []),
        "imageDetails": image_info,
    }


if __name__ == "__main__":
    metadata = {slug: analyze(slug, text) for slug, text in MODELS.items()}
    (ROOT / "models.json").write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n",
                                     encoding="utf-8")
    for slug, model in metadata.items():
        print(slug, json.dumps({"stats": model["stats"], "dimensions": model["dimensions"],
                                 "bounds": model["bounds"]}))
